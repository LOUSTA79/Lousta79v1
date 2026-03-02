const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🤖 LouBot Node-CEO: Starting Continuous Production...');

const packetDir = path.join(process.env.HOME, '.lousta_system_core/output/distribution_packets');

function runShift() {
    try {
        const assets = fs.readdirSync(packetDir).filter(f => f.endsWith('.json'));
        const leadsRaw = fs.readFileSync('leads_database.csv', 'utf-8');
        const leads = leadsRaw.split('\n').slice(1).filter(l => l.length > 0);

        if (assets.length === 0 || leads.length === 0) {
            console.log('⚠️ Intake Empty. Waiting for new materials...');
            return;
        }

        console.log(`📊 Production Stats: ${leads.length} leads remaining | ${assets.length} assets available.`);

        // Process the first lead in the queue
        const targetLead = leads[0];
        const targetAsset = assets[Math.floor(Math.random() * assets.length)];

        console.log(`🚀 [SHIFT START] Targeting: ${targetLead.split(',')[0]} | Asset: ${targetAsset}`);

        const pythonCommand = `python lou_gen_v1.py --lead "${targetLead}" --asset "${targetAsset}"`;
        
        // Use sync execution to ensure one book finishes before the next starts
        const output = execSync(pythonCommand).toString();
        console.log('✅ UNIT COMPLETE.');
        
        // Simulate 'Moving lead to processed' by removing it from the local queue
        const updatedLeads = leads.slice(1).join('\n');
        fs.writeFileSync('leads_database.csv', 'Name,Email,Company,Region,Source\n' + updatedLeads);

        console.log('⏱️ Cooling down... Next unit in 30 seconds.');
        setTimeout(runShift, 30000); // 30-second interval to protect S25 Ultra thermals

    } catch (err) {
        console.error('⚠️ Line Jam: ' + err.message);
        setTimeout(runShift, 60000); // Wait a minute before retry if error occurs
    }
}

runShift();
