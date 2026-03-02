const { execSync } = require('child_process');
const fs = require('fs');

console.log('🛡️ LouBot Off-Grid Insurance: Securing ABN 54 492 524 823...');

function backup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `lousta_vault_backup_${timestamp}.tar.gz`;
        const targetDir = '/data/data/com.termux/files/home/LA-Nexus/Backups';

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        // Compressing the Ledger, the .env, and the Brain logic
        execSync(`tar -czf ${targetDir}/${backupName} ~/LA-Nexus/ALourithm_Core/ledger_2026.csv ~/LA-Nexus/ALourithm_Core/.env ~/LA-Nexus/ALourithm_Core/*.js`);
        
        console.log(`✅ BACKUP SECURED: ${backupName}`);
    } catch (err) {
        console.log('⚠️ Insurance Fault: ' + err.message);
    }
}

setInterval(backup, 86400000); // 24-hour cycle
backup();
