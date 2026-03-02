const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ARCHIVE_DIR = '/data/data/com.termux/files/home/LA-Nexus/LouBooks_Archive';

console.log('📦 LouBot Warehouse-Swarm: Organizing the Empire...');

function organizeWarehouse() {
    try {
        const files = fs.readdirSync(ARCHIVE_DIR);
        
        files.forEach(file => {
            const fullPath = path.join(ARCHIVE_DIR, file);
            if (fs.lstatSync(fullPath).isDirectory()) return;

            let category = 'General';
            if (file.toLowerCase().includes('sport')) category = 'Sports';
            if (file.toLowerCase().includes('tax') || file.toLowerCase().includes('holiday')) category = 'Seasonal';
            
            const ext = path.extname(file).toUpperCase().replace('.', '');
            const targetDir = path.join(ARCHIVE_DIR, category, ext);

            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            fs.renameSync(fullPath, path.join(targetDir, file));
            console.log(`🚚 MOVED: ${file} -> ${category}/${ext}`);
        });
    } catch (err) {
        console.log('⚠️ Warehouse Jam: ' + err.message);
    }
}

setInterval(organizeWarehouse, 300000); // Organizes every 5 minutes
organizeWarehouse();
