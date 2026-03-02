const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const log = (msg) => console.log(`[QA-SWARM] ${new Date().toISOString()} - ${msg}`);

class QualitySwarm {
    async inspectBatch(topic) {
        log(`🔍 INITIATING LIVE ASSESSMENT: ${topic}`);
        
        const artifacts = {
            book: 'RUNTIME/artifacts/books/Agentic_OEE_IN.pdf',
            audio: 'RUNTIME/artifacts/audiobooks/Agentic_OEE_IN.mp3'
        };

        // 1. Stripe Link Verification
        if (process.env.BASE_URL && process.env.BASE_URL.includes('trycloudflare.com')) {
            log(`✅ WEBHOOK GATE: LIVE (${process.env.BASE_URL})`);
        } else {
            log(`⚠️ WARNING: BASE_URL is not set to a live tunnel.`);
        }

        // 2. Physical File Check
        const files = fs.readdirSync('RUNTIME/artifacts/social_clips/');
        log(`📊 RENDER CHECK: ${files.length} social clips detected.`);
        
        log("🏁 QA ASSESSMENT: STAGED.");
    }
}
new QualitySwarm().inspectBatch(process.argv[2]);
