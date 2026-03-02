"use strict";
require("dotenv").config({ path: "./.env", override: true, quiet: true });

const crypto = require("crypto");
const http = require("http");

const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
const port = Number(process.env.PORT || 3009);

if (!secret.startsWith("whsec_")) {
  console.error("Missing STRIPE_WEBHOOK_SECRET (must start with whsec_)");
  process.exit(1);
}

const payloadObj = {
  id: "evt_local_test_" + Date.now(),
  object: "event",
  api_version: "2024-06-20",
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  pending_webhooks: 1,
  type: "checkout.session.completed",
  data: { object: { id: "cs_local_test_" + Date.now() } },
};

// IMPORTANT: bytes we sign == bytes we send
const payloadStr = JSON.stringify(payloadObj);
const payloadBuf = Buffer.from(payloadStr, "utf8");

const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = `${timestamp}.${payloadBuf.toString("utf8")}`;
const signature = crypto.createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex");
const sigHeader = `t=${timestamp},v1=${signature}`;

const req = http.request(
  {
    hostname: "127.0.0.1",
    port,
    path: "/webhook/stripe",
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": payloadBuf.length,
      "Stripe-Signature": sigHeader,
      "Connection": "close",
    },
  },
  (res) => {
    let body = "";
    res.on("data", (c) => (body += c));
    res.on("end", () => {
      console.log("HTTP", res.statusCode);
      console.log(body || "(no body)");
      process.exit(res.statusCode === 200 ? 0 : 2);
    });
  }
);

req.on("error", (e) => {
  console.error("Request error:", e.message);
  process.exit(3);
});

req.write(payloadBuf);
req.end();
