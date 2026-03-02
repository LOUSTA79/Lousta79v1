const fs = require('fs');
const log = (msg) => console.log(`[PROFIT-GATE] ${msg}`);

class ProfitGate {
    constructor() {
        this.salesPath = 'RUNTIME/db/books_sales_db.json';
        this.currentTier = 'LEAN'; // Default
    }

    evaluateTier() {
        const data = JSON.parse(fs.readFileSync(this.salesPath) || '{"total_revenue_aud": 0}');
        const rev = data.total_revenue_aud || 0;

        if (rev >= 10000) this.currentTier = 'SOVEREIGN';
        else if (rev >= 2500) this.currentTier = 'AUTOMATED';
        else this.currentTier = 'LEAN';

        log(`Current Operations Tier: ${this.currentTier} (Total Rev: $${rev.toFixed(2)})`);
        return this.currentTier;
    }
}
new ProfitGate().evaluateTier();
