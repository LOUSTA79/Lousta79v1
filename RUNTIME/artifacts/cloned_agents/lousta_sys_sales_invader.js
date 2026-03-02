const fs = require('fs');
const { execSync } = require('child_process');

console.log('🌍 [SALES-INVADER]: Deploying 131 Assets to Global Markets...');

const vaultPath = '/data/data/com.termux/files/home/LA-Nexus/LouBooks_Archive/General/TXT/';

function deploy() {
    const files = fs.readdirSync(vaultPath).filter(f => f.endsWith('.done'));
    
    files.forEach(file => {
        const language = file.includes('_es') ? 'Spanish' : file.includes('_ja') ? 'Japanese' : 'English';
        console.log(`🎯 PITCHING: ${file} | Market: ${language} Global`);
        
        // This triggers your python global_pitcher logic
        try {
            execSync(`python3 ~/.lousta_system_core/global_pitcher.py --file "${vaultPath}${file}" --market "${language}"`);
        } catch (e) {
            console.log(`⚠️ Pitch Delay for ${file}: Buffering for next cycle.`);
        }
    });
}

deploy();
