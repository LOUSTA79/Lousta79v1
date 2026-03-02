const log = (msg) => console.log(`[TREASURY-WATCH] ${new Date().toISOString()} - ${msg}`);
const fs = require('fs');

class TreasuryWatcher {
    constructor() {
        this.payoutThreshold = 500; // $500 AUD Take-Home Milestone
        this.reinvestRate = 0.70;
        this.salesPath = 'RUNTIME/db/books_sales_db.json';
    }

    checkMilestone() {
        if (!fs.existsSync(this.salesPath)) return;
        
        const data = JSON.parse(fs.readFileSync(this.salesPath));
        const salesArray = Array.isArray(data) ? data : (data.sales || []);
        
        // Convert all international sales (INR, EUR) to AUD and calculate 30%
        const totalAUD = salesArray.reduce((sum, s) => sum + (s.currency === 'INR' ? s.amount * 0.0156 : s.amount), 0);
        const takeHome = totalAUD * (1 - this.reinvestRate);

        if (takeHome >= this.payoutThreshold) {
            this.triggerAlert(takeHome);
        } else {
            log(`Current Take-Home: $${takeHome.toFixed(2)} AUD. Target: $${this.payoutThreshold}.`);
        }
    }

    triggerAlert(amount) {
        const msg = `🎊 LOUSTA EMPIRE MILESTONE: $${amount.toFixed(2)} AUD is ready for Macquarie Payout! 🏦`;
        console.log(`\n***************************************************\n${msg}\n***************************************************\n`);
        // Telegram Hook Integration
        // execSync(`curl -s -X POST https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage -d chat_id=${process.env.TELEGRAM_CHAT_ID} -d text="${msg}"`);
    }
}

new TreasuryWatcher().checkMilestone();
