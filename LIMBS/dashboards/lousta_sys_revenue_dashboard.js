const fs = require('fs');
const log = (msg) => console.log(`[REVENUE-WATCH] ${msg}`);

class RevenueDashboard {
    constructor() {
        this.salesPath = 'RUNTIME/db/books_sales_db.json';
        this.exchangeRate = 0.0156; // Updated March 2026 Live Rate (1 INR = 0.0156 AUD)
        this.reinvestRate = 0.70;
    }

    generateReport() {
        if (!fs.existsSync(this.salesPath)) {
            return log("❌ No sales data file found at RUNTIME/db/books_sales_db.json");
        }

        let rawData = fs.readFileSync(this.salesPath, 'utf8');
        let data = JSON.parse(rawData || '{}');

        // INDUSTRIAL FIX: Ensure we are targeting an array (even if nested in a 'sales' key)
        let salesArray = Array.isArray(data) ? data : (data.sales || []);

        if (salesArray.length === 0) {
            console.log("\n--- LOUSTA EMPIRE: INDIAN SECTOR ---");
            console.log("STATUS: System Online. Awaiting first INR transaction...");
            console.log("------------------------------------\n");
            return;
        }

        let totalINR = salesArray.reduce((sum, s) => sum + (s.currency === 'INR' ? s.amount : 0), 0);
        let totalAUD = totalINR * this.exchangeRate;
        let reinvestment = totalAUD * this.reinvestRate;
        let takeHome = totalAUD - reinvestment;

        console.log("===================================================");
        console.log(" 🌏 LOUSTA EMPIRE: INDIAN SECTOR REVENUE REPORT ");
        console.log("===================================================");
        console.log(`💰 Gross Revenue: ₹${totalINR.toLocaleString()} INR`);
        console.log(`🇦🇺 AUD Equivalent: $${totalAUD.toFixed(2)} AUD`);
        console.log("---------------------------------------------------");
        console.log(`🔄 Swarm Reinvestment (70%): $${reinvestment.toFixed(2)}`);
        console.log(`🏦 Macquarie Payout (30%): $${takeHome.toFixed(2)}`);
        console.log("===================================================");
    }
}

new RevenueDashboard().generateReport();
