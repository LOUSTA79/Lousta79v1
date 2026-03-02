const fs = require('fs');
const { execSync } = require('child_process');

console.log('🛡️ LouBot Super-Gateway: IMMORTAL MODE ACTIVE.');

function checkConnectivity() {
    try {
        execSync('ping -c 1 8.8.8.8');
        return true;
    } catch (e) {
        return false;
    }
}

function processVault() {
    console.log('📡 Pulse Check: Verifying Stripe Link...');
    
    if (!checkConnectivity()) {
        console.log('📶 Offline: Buffering local assets. Waiting for signal...');
        return;
    }

    try {
        // Absolute path to your real Stripe logic
        const stripeScript = '/data/data/com.termux/files/home/.lousta_system_core/stripe_sync_agent.py';
        
        console.log('💳 VAULT: Synchronizing Real Transactions...');
        execSync(`python3 ${stripeScript} --mode "hard-live"`);
        
    } catch (err) {
        console.log('⚠️ Gateway Friction: ' + err.message);
        // Do not process.exit(1) - we want to keep the loop alive even if the API fails
    }
}

// High-frequency heart-rate (Check every 60 seconds)
setInterval(processVault, 60000);
processVault();
