const SovereignCell = require('./cell_template');

const cells = [
    new SovereignCell('LouCorp', 300),
    new SovereignCell('Core_0', 500),
    new SovereignCell('Arbitrage_Scout', 200),
    new SovereignCell('B2B_Expansion', 600),
    new SovereignCell('IP_Protector', 0)
];

async function stagedIgnite() {
    console.log('🏗️ LouBot: Initiating STAGED POWER-UP...');
    for (const cell of cells) {
        cell.ignite();
        console.log(`⏳ Waiting 10s for ${cell.name} to stabilize...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
    console.log('✅ MEGAPLEX FULLY ONLINE.');
}

stagedIgnite();
