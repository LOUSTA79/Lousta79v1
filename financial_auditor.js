const fs = require('fs');
const { execSync } = require('child_process');

console.log('💰 LouBot Financial-Auditor: LINKED TO CLOUD-BRAIN WEBHOOK.');

function syncRealTransactions() {
    try {
        // This monitors your existing Stripe Webhook output
        const webhookLog = '/data/data/com.termux/files/home/lousta_cloud_brain/stripe-webhook/transactions.log';
        
        if (fs.existsSync(webhookLog)) {
            const data = fs.readFileSync(webhookLog, 'utf8');
            // Hard-Save any new 'Real Money' events to our Sovereign Ledger
            fs.appendFileSync('/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/ledger_2026.csv', data);
            // Clear the buffer after syncing
            fs.writeFileSync(webhookLog, '');
            console.log('✅ TRANSACTIONS SYNCED: Real money secured in Ledger.');
        }
    } catch (err) {
        console.log('⚠️ Sync Fault: ' + err.message);
    }
}

setInterval(syncRealTransactions, 300000); // Sync every 5 minutes
syncRealTransactions();
