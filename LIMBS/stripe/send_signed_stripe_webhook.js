"use strict";

const http = require("http");
const crypto = require("crypto");

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
if (!secret.startsWith("whsec_")) {
  console.error("Missing STRIPE_WEBHOOK_SECRET (whsec_...) in env");
  process.exit(1);
}

const payload = JSON.stringify({
  id: "evt_local_test_" + Date.now(),
  object: "event",
  api_version: "2024-06-20",
  created: Math.floor(Date.now()/1000),
  type: "checkout.session.completed",
  livemode: false,
  data: { object: { id: "cs_test_local_" + Date.now() } }
});

const t = Math.floor(Date.now() / 1000);
const signedPayload = `${t}.${payload}`;
const sig = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
const header = `t=${t},v1=${sig}`;

const req = http.request(
  {
    hostname: "127.0.0.1",
    port: 3009,
    path: "/webhook/stripe",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Stripe-Signature": header,
      "Content-Length": Buffer.byteLength(payload),
    },
  },
  (res) => {
    let buf = "";
    res.on("data", (c) => (buf += c));
    res.on("end", () => {
      console.log("status:", res.statusCode);
      console.log("body:", buf);
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  }
);

req.on("error", (e) => {
  console.error("request error:", e.message);
  process.exit(1);
});

req.write(payload);
req.end();
