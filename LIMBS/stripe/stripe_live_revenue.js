const fs = require("fs");
const Stripe = require("stripe");

const OUT = "/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/live_sales.json";

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY || "";
if (!STRIPE_KEY.startsWith("sk_")) {
  console.error("❌ Missing STRIPE_SECRET_KEY (sk_*) in environment");
  process.exit(0);
}

const stripe = new Stripe(STRIPE_KEY, { apiVersion: "2024-06-20" });

function startOfDayUnix() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Math.floor(d.getTime() / 1000);
}

async function getTodaySales() {
  try {
    const start = startOfDayUnix();

    // Pull recent PaymentIntents for today
    const intents = await stripe.paymentIntents.list({
      created: { gte: start },
      limit: 100,
    });

    const succeeded = intents.data.filter(pi => pi.status === "succeeded");
    const total = succeeded.reduce((sum, pi) => sum + ((pi.amount_received || 0) / 100), 0);

    const recent = succeeded
      .slice(0, 5)
      .map(pi => ({
        amount_aud: (pi.amount_received / 100).toFixed(2),
        id: pi.id,
        time: new Date(pi.created * 1000).toLocaleTimeString(),
      }));

    const data = {
      currency: "AUD",
      day_total_aud: total.toFixed(2),
      count: succeeded.length,
      recent,
      ts: new Date().toISOString(),
      mode: STRIPE_KEY.startsWith("REDACTED_STRIPE_KEY") ? "LIVE" : (STRIPE_KEY.startsWith("sk_test_") ? "TEST" : "UNKNOWN"),
    };

    fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
  } catch (e) {
    // silent fail to not break dashboards; optional: log minimal error
    // console.error("stripe poll error:", String(e).slice(0, 120));
  }
}

// Poll every minute
setInterval(getTodaySales, 60_000);
getTodaySales();
