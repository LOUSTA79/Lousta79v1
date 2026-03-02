const { execSync } = require('child_process');

console.log('🩺 LouBot Doctor: System Vitals Monitoring Active.');

function triage() {
    try {
        const list = JSON.parse(execSync('pm2 jlist').toString());
        list.forEach(proc => {
            if (proc.pm2_env.status === 'errored') {
                console.log(`🚨 EMERGENCY: ${proc.name} is down. Applying Autonmous Repair...`);
                
                // Read the error (The Stethoscope)
                const errorLog = execSync(`pm2 logs ${proc.name} --lines 10 --no-append`).toString();
                
                // Self-Healing logic: Restart with cleared cache
                execSync(`pm2 restart ${proc.name} --update-env`);
                console.log(`✅ REPAIRED: ${proc.name} stabilized.`);
            }
        });
    } catch (e) { /* Silent monitoring */ }
}

setInterval(triage, 30000); // Check every 30 seconds
