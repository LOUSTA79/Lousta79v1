const { execSync } = require('child_process');
const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function bootSwarm() {
    console.log('🏗️ LouBot: INITIATING OVERCLOCKED SWARM IGNITION...');

    // WAVE 1: THE CORE (Stripe & Brain)
    execSync('pm2 start ~/LA-Nexus/ALourithm_Core/super_gateway.js --name "Stripe-Gateway"');
    execSync('pm2 start ~/LA-Nexus/ALourithm_Core/synapse_brain.js --name "Empire-Brain"');

    await delay(5000);

    // WAVE 2: THE CREATIVE SWARM (3 Instances of each for triple throughput)
    console.log('⚙️ WAVE 2: Spawning Parallel Creative Cells...');
    
    // Spawn 3 Script-Writers
    for(let i=1; i<=3; i++) {
        execSync(`pm2 start ~/LA-Nexus/ALourithm_Core/script_writer.js --name "Script-Writer-${i}"`);
    }

    // Spawn 3 Audio-Synths
    for(let i=1; i<=3; i++) {
        execSync(`pm2 start ~/LA-Nexus/ALourithm_Core/audio_generator.js --name "Audio-Synth-${i}"`);
    }

    // WAVE 3: THE HEAVY HITTERS
    execSync('pm2 start ~/LA-Nexus/ALourithm_Core/megaplex_launcher.js --name "Lousta-Megaplex"');

    console.log('✅ SWARM FULLY OPERATIONAL. ABN 54 492 524 823 PRODUCTION TRIPLED.');
}

bootSwarm();
