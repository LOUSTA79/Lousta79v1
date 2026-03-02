const report = require('./telemetry_helper');
let p = 0;
setInterval(() => {
    p = (p + 3) % 103;
    report('Audio-Synth', 'Rendering: Chapter 4 Audio', p);
}, 4000);
