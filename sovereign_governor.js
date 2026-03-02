const fs = require('fs');
const { execSync } = require('child_process');

const TELEMETRY_PATH = '/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/live_telemetry.json';

function auditFlow() {
    try {
        const telemetry = JSON.parse(fs.readFileSync(TELEMETRY_PATH, 'utf8'));
        const agents = Object.keys(telemetry);

        // Count Backlogs
        const videoBacklog = agents.filter(n => n.includes('Video') && parseInt(telemetry[n].progress) < 90).length;
        const audioBacklog = agents.filter(n => n.includes('Audio') && parseInt(telemetry[n].progress) < 90).length;

        console.log(`⚖️  GOVERNOR: Video Backlog: ${videoBacklog} | Audio Backlog: ${audioBacklog}`);

        // BALANCING LOGIC:
        // If Video is slammed (>10 agents working), tell Script Writers to "Idle"
        if (videoBacklog > 10) {
            console.log('⚠️  High Pressure in Cinema Swarm. Throttling Script-Writers...');
            execSync('pm2 scale Script-Writer-1 0'); // Temporary pause
        } else {
            console.log('🟢 Pressure Optimal. Resuming Full Production.');
            execSync('pm2 scale Script-Writer-1 1');
        }

    } catch (e) { console.log('⏳ Governor waiting for telemetry...'); }
}

setInterval(auditFlow, 10000); // Audit every 10 seconds
auditFlow();
