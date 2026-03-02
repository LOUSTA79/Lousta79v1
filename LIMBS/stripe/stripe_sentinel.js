"use strict";

const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });

const Stripe = require("stripe");
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const whsec = process.env.STRIPE_WEBHOOK_SECRET || "";
const slackUrl = process.env.SLACK_WEBHOOK_URL || "";

const PORT = Number(process.env.PORT || 3009);
const HOME = process.env.HOME || ".";
const QUEUE_FILE = path.join(HOME, ".lousta_system_core", "queue", "stripe_events.jsonl");

// PM2 log paths (Termux)
const PM2_DIR = path.join(HOME, ".pm2", "logs");
const BRIDGE_ERR_LOG = path.join(PM2_DIR, "09-STRIPE-BRIDGE-error.log");
const BRIDGE_OUT_LOG = path.join(PM2_DIR, "09-STRIPE-BRIDGE-out.log");

// ---- Tunables
const LOOP_MS = 30_000;
const RECONCILE_WINDOW_MIN = 30;    // reconcile last N minutes
const ANOMALY_ZSCORE = 3.0;         // simple baseline anomaly flag
const SECRET_FINGERPRINT_FILE = path.join(HOME, ".lousta_system_core", "sentinel", "whsec_fingerprint.txt");
const STATE_FILE = path.join(HOME, ".lousta_system_core", "sentinel", "state.json");

function nowIso() { return new Date().toISOString(); }
function log(msg) { console.log(`[SENTINEL ${nowIso()}] ${msg}`); }

function ensureDirs() {
  const d = path.dirname(SECRET_FINGERPRINT_FILE);
  fs.mkdirSync(d, { recursive: true });
}

function sha256(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf8")); }
  catch { return { lastErrPos: 0, lastOutPos: 0, lastQueueSize: 0, baseline: { perMinAvg: null, perMinVar: null } }; }
}

function writeState(st) {
  ensureDirs();
  fs.writeFileSync(STATE_FILE, JSON.stringify(st, null, 2));
}

function slackPost(text) {
  if (!slackUrl.startsWith("https://hooks.slack.com/")) return;
  const body = JSON.stringify({ text });
  const u = new URL(slackUrl);
  const req = https.request({
    hostname: u.hostname,
    path: u.pathname + u.search,
    method: "POST",
    headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
  }, (res) => res.on("data", () => {}));
  req.on("error", () => {});
  req.write(body);
  req.end();
}

function alert(title, details) {
  const msg = `*${title}*\n${details}`.slice(0, 3500);
  log(`ALERT: ${title}`);
  slackPost(msg);
}

function secretMismatchCheck() {
  if (!whsec.startsWith("whsec_")) {
    alert("❌ STRIPE_WEBHOOK_SECRET invalid", `Value missing or not whsec_*. Current len=${whsec.length}`);
    return;
  }
  ensureDirs();
  const fp = sha256(whsec);
  let prev = "";
  try { prev = fs.readFileSync(SECRET_FINGERPRINT_FILE, "utf8").trim(); } catch {}
  if (!prev) {
    fs.writeFileSync(SECRET_FINGERPRINT_FILE, fp);
    log(`✓ Secret fingerprint initialized (last4 ${whsec.slice(-4)})`);
    return;
  }
  if (prev !== fp) {
    alert("🚨 Webhook secret changed", `Stored fingerprint != current. Current last4=${whsec.slice(-4)}. If you rotated whsec intentionally, update fingerprint by deleting:\n${SECRET_FINGERPRINT_FILE}`);
  } else {
    log("✓ Secret fingerprint stable");
  }
}

function tailNewBytes(file, fromPos) {
  try {
    const fd = fs.openSync(file, "r");
    const stat = fs.fstatSync(fd);
    if (fromPos > stat.size) fromPos = 0; // log rotated
    const len = stat.size - fromPos;
    const buf = Buffer.alloc(len);
    fs.readSync(fd, buf, 0, len, fromPos);
    fs.closeSync(fd);
    return { text: buf.toString("utf8"), newPos: stat.size };
  } catch {
    return { text: "", newPos: fromPos };
  }
}

function signatureDiffDetection(st) {
  const err = tailNewBytes(BRIDGE_ERR_LOG, st.lastErrPos || 0);
  st.lastErrPos = err.newPos;

  // Look for Stripe signature verification failures, raw body / header missing, etc.
  const lines = err.text.split("\n").filter(Boolean);
  const hits = lines.filter(l =>
    l.includes("Signature verification failed") ||
    l.includes("Missing stripe-signature") ||
    l.includes("Missing payload") ||
    l.includes("No signatures found matching")
  );

  if (hits.length) {
    const sample = hits.slice(-6).join("\n");
    alert("⚠️ Stripe signature / payload issues detected", `Recent errors:\n\`\`\`\n${sample}\n\`\`\`\nLikely causes:\n• wrong whsec\n• body not raw on /webhook/stripe\n• forwarded tool mutating payload`);
  }

  // Extra: detect a “bad signature” from your local sender too
  const out = tailNewBytes(BRIDGE_OUT_LOG, st.lastOutPos || 0);
  st.lastOutPos = out.newPos;
}

function countQueueEventsSince(minutes) {
  if (!fs.existsSync(QUEUE_FILE)) return { count: 0, lastSize: 0 };
  const stat = fs.statSync(QUEUE_FILE);
  // naive count by scanning lines (fast enough for small/med). If it grows huge, we can index.
  const data = fs.readFileSync(QUEUE_FILE, "utf8");
  const cutoff = Date.now() - minutes * 60_000;
  let count = 0;
  for (const line of data.split("\n")) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const t = Date.parse(obj.received_at || "");
      if (!Number.isNaN(t) && t >= cutoff) count++;
    } catch {}
  }
  return { count, lastSize: stat.size };
}

function updateBaseline(st, perMin) {
  // incremental baseline for per-minute rate (simple Welford-ish approximation with EMA)
  const b = st.baseline || (st.baseline = { perMinAvg: null, perMinVar: null });

  const alpha = 0.10; // smoothing
  if (b.perMinAvg == null) {
    b.perMinAvg = perMin;
    b.perMinVar = 0.0;
    return;
  }
  const diff = perMin - b.perMinAvg;
  b.perMinAvg = b.perMinAvg + alpha * diff;
  // variance EMA
  b.perMinVar = (1 - alpha) * (b.perMinVar + alpha * diff * diff);
}

function revenueAnomalyDetector(st) {
  // use queue event rate as proxy signal + (optional) Stripe payments summary
  const { count } = countQueueEventsSince(1);
  const perMin = count;

  updateBaseline(st, perMin);

  const avg = st.baseline.perMinAvg ?? perMin;
  const varr = st.baseline.perMinVar ?? 0;
  const sd = Math.sqrt(Math.max(varr, 1e-6));
  const z = sd > 0 ? (perMin - avg) / sd : 0;

  // spike or sudden drop (heuristic)
  if (Math.abs(z) >= ANOMALY_ZSCORE && (perMin >= 3 || avg >= 3)) {
    alert("📈 Event-rate anomaly", `Queue events/min=${perMin} baseline≈${avg.toFixed(2)} z=${z.toFixed(2)}\nCheck traffic + checkout flow.`);
  }
}

async function stripeReconcileChecker() {
  if (!stripeKey.startsWith("sk_")) {
    alert("❌ STRIPE_SECRET_KEY invalid", `Missing or not sk_*. Current len=${stripeKey.length}`);
    return;
  }
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-06-20" });

  const since = Math.floor((Date.now() - RECONCILE_WINDOW_MIN * 60_000) / 1000);

  // Get recent webhook events from Stripe and compare count to local queue.
  // (Stripe’s “Events” endpoint is not the same as “webhook deliveries”, but it’s still a useful signal.)
  const stripeEvents = await stripe.events.list({ created: { gte: since }, limit: 100 });
  const stripeCount = stripeEvents.data.length;

  const local = countQueueEventsSince(RECONCILE_WINDOW_MIN);
  const localCount = local.count;

  // If Stripe has lots of events but local has none: your webhook plumbing is broken.
  if (stripeCount >= 5 && localCount === 0) {
    alert("🚨 Reconciliation mismatch", `Stripe events last ${RECONCILE_WINDOW_MIN}m: ${stripeCount}\nLocal queued events: ${localCount}\nLikely: Stripe not reaching your /webhook/stripe, wrong endpoint URL, or signature rejection.`);
  } else {
    log(`✓ Reconcile OK (stripeEvents=${stripeCount}, localQueued=${localCount}, window=${RECONCILE_WINDOW_MIN}m)`);
  }
}

async function mainLoop() {
  ensureDirs();
  const st = readState();

  try { secretMismatchCheck(); } catch (e) { log(`secretMismatchCheck error: ${e.message}`); }
  try { signatureDiffDetection(st); } catch (e) { log(`signatureDiffDetection error: ${e.message}`); }
  try { revenueAnomalyDetector(st); } catch (e) { log(`revenueAnomalyDetector error: ${e.message}`); }
  try { await stripeReconcileChecker(); } catch (e) {
    alert("⚠️ Stripe API reconciliation check failed", `Error: ${e.message}\n(If this persists, verify STRIPE_SECRET_KEY permissions and network.)`);
  }

  writeState(st);
}

log(`Stripe Sentinel ONLINE (port=${PORT})`);
setInterval(() => { mainLoop().catch(() => {}); }, LOOP_MS);
mainLoop().catch(() => {});
