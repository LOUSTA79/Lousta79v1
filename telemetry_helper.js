const fs = require('fs');
const path = '/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/live_telemetry.json';

module.exports = (agentName, task, progress, status = 'ACTIVE') => {
    try {
        let data = JSON.parse(fs.readFileSync(path, 'utf8') || '{}');
        data[agentName] = { 
            task, 
            progress: progress + '%', 
            status,
            timestamp: new Date().toLocaleTimeString() 
        };
        fs.writeFileSync(path, JSON.stringify(data, null, 2));
    } catch (e) {}
};
