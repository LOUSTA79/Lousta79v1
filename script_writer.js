const report = require('./telemetry_helper');
let p = 0;

function work() {
    const systemState = report('Script-Writer', 'Monitoring Flow...', p);
    
    // Check if Audio-Synth is backed up
    const audioQueue = (systemState['Audio-Synth'] && systemState['Audio-Synth'].queue) || 0;
    
    if (audioQueue > 5) {
        report('Script-Writer', '⏸️ PAUSED: Waiting for Audio-Synth to clear queue', p, 0);
        return;
    }

    p = (p + 5) % 105;
    report('Script-Writer', '✍️ Drafting: Active Niche', p, 1); // We add 1 to the next person's queue
}

setInterval(work, 300000);
