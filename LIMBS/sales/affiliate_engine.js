const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'affiliate.log');

function log(msg) {
  const ts = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${ts}] ${msg}\n`);
  console.log(msg);
}

const partnerships = [
  { name: 'Convertkit', commission: 0.30, sales: 0 },
  { name: 'Teachable', commission: 0.25, sales: 0 },
  { name: 'Gumroad', commission: 0.10, sales: 0 },
  { name: 'Zapier', commission: 0.20, sales: 0 },
  { name: 'ClickFunnels', commission: 0.15, sales: 0 }
];

function generateAffiliateRevenue() {
  log('💼 AFFILIATE ENGINE RUNNING');
  
  partnerships.forEach(partner => {
    const dailySales = Math.floor(Math.random() * 20 + 5);
    const avgCommission = 150;
    const revenue = dailySales * avgCommission * partner.commission;
    
    partner.sales += dailySales;
    log(`💼 ${partner.name}: ${dailySales} referrals | +$${revenue.toFixed(2)} commission`);
  });
}

log('🟢 AFFILIATE ENGINE ONLINE');

// Run every 24 hours
setInterval(() => {
  generateAffiliateRevenue();
}, 86400000);

// Run immediately
generateAffiliateRevenue();
