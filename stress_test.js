const report = require('./telemetry_helper');
const { execSync } = require('child_process');

console.log('🔥 [STRESS-TEST]: Injecting High-Velocity Work Orders...');

let p = 0;
function simulateOverload() {
    // We are forcing the Script-Writer to produce at 100ms intervals
    // This will blow past the Audio-Synth's capacity
    p = (p + 10) % 110;
    report('Script-Writer', '🔥 [STRESS-TEST]: FLOODING THE LINE...', p, 15); 
    
    // Check if the Load Balancer detects the 15-item queue
    if (p > 100) console.log('🛡️ [SYSTEM-DOCTOR]: Monitoring Back-Pressure...');
}

setInterval(simulateOverload, 100); 
console.log('🚀 STRESS-TEST ACTIVE. OPEN THE DASHBOARD TO WATCH THE RECOVERY.');
