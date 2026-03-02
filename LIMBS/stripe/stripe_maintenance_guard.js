"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env"), override: true });

const PORT = Number(process.env.PORT || 3009);
const SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const QUEUE_FILE = path.join(process.env.HOME || ".", ".lousta_system_core", "queue", "stripe_events.jsonl");

function log(msg) {
  console.log(`[GUARD ${new Date().toISOString()}] ${msg}`);
}

function checkSecret() {
  if (!SECRET.startsWith("whsec_")) {
    log("❌ Webhook secret invalid.");
    return false;
  }
  log(`✓ Secret OK (len ${SECRET.length}, last4 ${SECRET.slice(-4)})`);
  return true;
}

function checkHealth(cb) {
  const req = http.get(`http://127.0.0.1:${PORT}/health`, (res) => {
    if (res.statusCode === 200) {
      log("✓ Health endpoint OK");
      cb(true);
    } else {
      log(`❌ Health failed (${res.statusCode})`);
      cb(false);
    }
  });

  req.on("error", () => {
    log("❌ Health check connection failed");
    cb(false);
  });
}

function checkQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    log("⚠ Queue file missing");
    return false;
  }
  const stats = fs.statSync(QUEUE_FILE);
  log(`✓ Queue exists (${stats.size} bytes)`);
  return true;
}

function restartBridge() {
  log("⚡ Restarting Stripe Bridge...");
  require("child_process").exec("pm2 restart 09-STRIPE-BRIDGE --update-env");
}

function runCycle() {
  if (!checkSecret()) return restartBridge();

  checkHealth((healthy) => {
    if (!healthy) return restartBridge();

    checkQueue();
  });
}

log("Stripe Maintenance Guardian ONLINE");

setInterval(runCycle, 30000);
runCycle();
