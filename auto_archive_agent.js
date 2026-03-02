const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📦 LouBot Archive-Agent: Clearing the Factory Floor...');

const STORAGE_LIMIT_DAYS = 30;
const ARCHIVE_DIR = '/data/data/com.termux/files/home/LA-Nexus/LouBooks_Archive';
const COLD_STORAGE = '/data/data/com.termux/files/home/LA-Nexus/Cold_Storage';

if (!fs.existsSync(COLD_STORAGE)) fs.mkdirSync(COLD_STORAGE);

function cleanFloor() {
    const now = Date.now();
    const files = fs.readdirSync(ARCHIVE_DIR);
    
    files.forEach(file => {
        const filePath = path.join(ARCHIVE_DIR, file);
        const stats = fs.statSync(filePath);
        const ageInDays = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);

        if (ageInDays > STORAGE_LIMIT_DAYS) {
            console.log(`❄️ COLD STORAGE: Archiving ${file}...`);
            execSync(`zip -rj ${COLD_STORAGE}/${file}.zip ${filePath} && rm ${filePath}`);
        }
    });
}

setInterval(cleanFloor, 86400000); // Daily cleanup
cleanFloor();
