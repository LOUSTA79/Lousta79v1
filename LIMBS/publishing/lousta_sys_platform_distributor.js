const { execSync } = require('child_process');
const fs = require('fs');

const harvest = () => {
    const paths = ['/sdcard/Download', '/sdcard/Documents', '/sdcard/Documents/LoustaBooks'];
    let files = [];
    paths.forEach(p => {
        try {
            const out = execSync(`find ${p} -maxdepth 2 -iname "*.pdf"`).toString().trim();
            if (out) files = files.concat(out.split('\n'));
        } catch(e) {}
    });
    console.log(`🎯 Harvested ${files.length} assets.`);
    return files;
};
harvest();
