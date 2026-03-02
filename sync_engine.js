const { exec } = require('child_process');
const fs = require('fs');

const exportToPhone = (filePath, type) => {
    const destinationMap = {
        'book': '/sdcard/LOUSTA_CONTENT/READ_BOOKS/',
        'audio': '/sdcard/LOUSTA_CONTENT/LISTEN_AUDIO/',
        'video': '/sdcard/LOUSTA_CONTENT/WATCH_VIDEO/'
    };
    
    const dest = destinationMap[type];
    if (!dest) return;

    // Execute the move to shared storage
    exec(`cp "${filePath}" "${dest}"`, (err) => {
        if (err) console.error(`❌ Sync Error: ${err}`);
        else console.log(`🚀 SYNCED: ${filePath} moved to ${type} folder.`);
    });
};

module.exports = { exportToPhone };
