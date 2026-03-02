const fs = require('fs');
const { execSync } = require('child_process');
const report = require('./telemetry_helper');

function checkLine() {
    console.log('⛓️  [SEQUENTIAL-CHAIN]: Auditing Line Flow...');
    
    const vault = '/data/data/com.termux/files/home/LA-Nexus/LouBooks_Archive/General/';
    const currentBook = fs.readdirSync(vault + 'TXT/').filter(f => f.endsWith('.done'))[0];

    if (currentBook) {
        const baseName = currentBook.replace('.txt.done', '');
        
        // 1. Check for Audio (The second link in the chain)
        if (!fs.existsSync(`${vault}MP3/${baseName}.mp3`)) {
            console.log(`🎙️  [STEP 2]: Starting Audio for ${baseName}...`);
            report('Audio-Vocalist-1', `Narrating: ${baseName}`, 10, 'ACTIVE');
            // Logic: Trigger Audio Script here
        } 
        // 2. Check for Video (The final link in the chain)
        else if (!fs.existsSync(`${vault}VIDEO/${baseName}.mp4`)) {
            console.log(`🎬 [STEP 3]: Starting Video for ${baseName}...`);
            report('Video-Agent-1', `Rendering Video: ${baseName}`, 5, 'ACTIVE');
            // Logic: Trigger Video Script here
        }
        else {
            console.log(`✅ [COMPLETE]: Full Bundle Finished for ${baseName}`);
            // Move to next book logic
        }
    }
}

setInterval(checkLine, 10000); // Check every 10 seconds
