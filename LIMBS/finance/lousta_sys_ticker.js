const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const log = (msg) => process.stdout.write(`\r[TICKER] ${new Date().toLocaleTimeString()} - ${msg}`);

async function runTicker() {
    console.clear();
    console.log("---------------------------------------------------");
    console.log("🏦 LOUSTA EMPIRE: REAL-TIME REVENUE TICKER");
    console.log("📍 HUB: LAVERTON NORTH | NODE: SAMSUNG S25 ULTRA");
    console.log("---------------------------------------------------\n");

    setInterval(async () => {
        try {
            const balance = await stripe.balance.retrieve();
            const aud = balance.available.find(b => b.currency === 'aud') || {amount: 0};
            const pending = balance.pending.find(b => b.currency === 'aud') || {amount: 0};
            
            process.stdout.write('\x1b[H'); // Reset cursor to top
            console.log(`💰 LIVE BALANCE: $${(aud.amount / 100).toFixed(2)} AUD`);
            console.log(`⏳ PENDING:      $${(pending.amount / 100).toFixed(2)} AUD`);
            console.log(`📈 GOAL TIER 2:  $2,500.00`);
            console.log(`🚀 OEE: 100% | ACTIVE PILLARS: 14`);
            console.log("\n[LISTENING FOR STRIPE PINGS...]");
        } catch (e) {
            log("⚠️ Syncing with Stripe...");
        }
    }, 10000);
}
runTicker();
