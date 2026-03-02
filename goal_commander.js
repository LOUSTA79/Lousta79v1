const fs = require('fs');
const { execSync } = require('child_process');

console.log('🏁 LouBot Goal-Commander: DYNAMIC QUOTA LOGIC ACTIVE.');

function driveProduction() {
    try {
        // FIXED: Using Absolute Termux Path
        const budgetPath = '/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/budget_targets.json';
        const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
        
        const now = new Date();
        const monthKey = String(now.getMonth() + 1).padStart(2, '0');
        const monthTarget = budget["2026"][monthKey].target;

        // Note: Revenue should be parsed from your real ledger_2026.csv
        const currentRevenue = 0; 
        const variance = monthTarget - currentRevenue;

        console.log(`--- 📊 MONTHLY QUOTA: ${budget["2026"][monthKey].label} ---`);
        console.log(`🎯 Target: $${monthTarget} AUD`);

        if (variance > 0) {
            const pressure = (variance / monthTarget * 10).toFixed(0);
            console.log(`⚡ QUOTA GAP: $${variance} AUD. Increasing Pressure level: ${pressure}`);
            // Restarting the Press with pressure context
            execSync(`pm2 restart Production-Press`);
        } else {
            console.log('🟢 QUOTA MET: Stabilizing for Quality-Guard verification.');
        }

    } catch (err) {
        console.log('⚠️ Budget Logic Error: ' + err.message);
    }
}

setInterval(driveProduction, 86400000); 
driveProduction();
