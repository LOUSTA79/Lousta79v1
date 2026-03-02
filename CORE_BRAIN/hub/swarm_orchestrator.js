const report = require('./telemetry_helper');
const targets = ['Amazon US', 'Audible UK', 'Gumroad AU', 'Kobo Global'];
let i = 0;
setInterval(() => {
    i = (i + 1) % targets.length;
    report('Sales-Swarm', 'Scouting: ' + targets[i], 'ACTIVE');
}, 5000);
