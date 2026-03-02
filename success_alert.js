const fs = require('fs');
const { exec } = require('child_process');

// Path to your active 2026 Ledger
const ledgerPath = '/data/data/com.termux/files/home/.lousta_system_core/finance/ledger_2026.csv';

let lastSize = fs.statSync(ledgerPath).size;

function watchLedger() {
    const stats = fs.statSync(ledgerPath);
    if (stats.size > lastSize) {
        // Money was added to the Ledger
        const msg = "💰 STRIPE REVENUE DETECTED | Ledger 2026 Updated";
        exec(`termux-notification -c "${msg}" --title "🏛️ LOUCORP SUCCESS" --priority high --vibrate 500,200,500`);
        console.log('✨ [REVENUE]: ' + msg);
        lastSize = stats.size;
    }
}

setInterval(watchLedger, 5000);
console.log('🛡️ SIREN SOLDERED TO LEGACY LEDGER: ' + ledgerPath);
