const express = require("express");
const Stripe = require("stripe");

// Load environment from absolute path
const envPath = "/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/.env.live";
require("dotenv").config({ path: envPath, override: true, quiet: true });

const app = express();

// Health route (GET)
app.get("/health", (req, res) => res.status(200).send("ok"));
console.log("[HEALTH] ping");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe webhook (POST) — must use raw body for signature verification
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const sig = req.headers["stripe-signature"];
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !whsec) {
      console.log("❌ Missing sig or STRIPE_WEBHOOK_SECRET");
      return res.status(400).send("Missing signature or secret");
    }

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, whsec);
      console.log(`✅ Webhook verified: ${event.type}`);
      return res.json({ received: true });
    } catch (err) {
      console.error(`❌ Verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

const PORT = Number(process.env.STRIPE_BRIDGE_PORT || 3009);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 STRIPE BRIDGE ONLINE: http://0.0.0.0:${PORT}`);
  console.log(`➡️ Webhook endpoint: /webhook/stripe`);
});
