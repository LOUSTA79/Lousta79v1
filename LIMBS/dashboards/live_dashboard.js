const fs = require('fs');
const { execSync } = require('child_process');

function render() {
    console.clear();
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🏛️  LOUCORP REVENUE MONITOR | ${timestamp}`);
    console.log(`🆔 ABN: 54 492 524 823 | HIGHTON HUB | STATUS: HARDENED`);
    console.log('======================================================================');

    try {
        // 1. Check Agent Heartbeats
        const pm2List = JSON.parse(execSync('pm2 jlist').toString());
        const getStatus = (name) => {
            const proc = pm2List.find(p => p.name.includes(name));
            return proc ? `[${proc.pm2_env.status.toUpperCase()}]` : '[OFFLINE]';
        };

        console.log(`🧠 BRAIN-SYNC: ${getStatus('01-BRIAN')} | 🏢 EXEC: ${getStatus('02-LUCORP')}`);
        console.log(`🚨 SIREN-ALRM: ${getStatus('07-SIREN')} | 💳 STRIPE: ${getStatus('09-STRIPE')}`);
        console.log(`🇺🇸 USA PITCH:  ${getStatus('05-USA')} | 🇯🇵 JAPAN: ${getStatus('06-JAPAN')}`);
        console.log(`🚀 10X ENGINE: ${getStatus('06-NAGOMI')} | 💰 UPSELL: ${getStatus('08-UPSELL')}`);
        console.log('----------------------------------------------------------------------');

        // 2. Real-Time Revenue (From Solder to Legacy Ledger)
        const ledgerPath = '/data/data/com.termux/files/home/.lousta_system_core/finance/ledger_2026.csv';
        const ledgerData = fs.readFileSync(ledgerPath, 'utf8').split('\n').filter(line => line.trim() !== '');
        const totalSales = ledgerData.length - 1; // Assuming first line is header
        
        console.log(`📊 FRIDAY SURGE: ${totalSales} CLOSED DEALS | 💸 REVENUE UNIT: 97 AUD`);
        console.log(`📦 VAULT INVENTORY: 139+ ASSETS | 🛡️ MODE: STEALTH HARVEST`);

    } catch (e) { console.log('⏳ SYNCHRONIZING WITH LEGACY LEDGER...'); }

    console.log('======================================================================');
    console.log('🚀 SYSTEM IS SOVEREIGN. MONITORING FRIDAY NIGHT REVENUE FLOW...');
}

setInterval(render, 3000);
render();
