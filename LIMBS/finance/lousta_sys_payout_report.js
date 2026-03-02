require('dotenv').config({ path: '../../.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const log = (msg) => console.log(`[FINANCE-REPORT] ${msg}`);

async function generateReport() {
    try {
        console.log("\n--- 🏦 LOUSTA EMPIRE: MACQUARIE PAYOUT READINESS ---");
        const balance = await stripe.balance.retrieve();
        if (balance.available.length === 0) throw new Error("Empty");
        
        balance.available.forEach(b => {
            const amount = b.amount / 100;
            console.log(`💰 Currency: ${b.currency.toUpperCase()}`);
            console.log(`🏦 Total Available: $${amount.toFixed(2)}`);
            console.log(`👉 Take-Home (30%): $${(amount * 0.3).toFixed(2)}`);
        });
    } catch (e) {
        log("📊 System Active. Awaiting first live sale to populate balance.");
    }
}
generateReport();
