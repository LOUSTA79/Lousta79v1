const fs = require('fs');
const report = require('./telemetry_helper');

function processUpsell(lastSale) {
    console.log('✨ [REVENUE-BOOST]: Processing One-Click Upsell for ' + lastSale.customer);
    
    // Logic: Offer the NEXT book in the 134-set at a 20% "Friday-Special" discount
    const discountedPrice = (197 * 0.8).toFixed(2);
    
    const pitch = {
        niche: lastSale.niche,
        offer: "Industrial AI Volume 2",
        price: discountedPrice + " AUD",
        status: "PITCHED"
    };

    fs.appendFileSync('~/LA-Nexus/ALourithm_Core/sales_ledger.log', JSON.stringify(pitch) + '\n');
    report('Upsell-Agent', 'Discount Pitch: $' + discountedPrice, 100);
}

// Watch for Stripe successes in real-time
setInterval(() => {
    try {
        const sales = JSON.parse(fs.readFileSync('/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/live_sales.json', 'utf8'));
        if (sales.new_hit) processUpsell(sales.recent[0]);
    } catch (e) {}
}, 5000);
