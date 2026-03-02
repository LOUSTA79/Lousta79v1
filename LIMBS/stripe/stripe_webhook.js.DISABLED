const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.raw({type: 'application/json'}));

const WEBHOOK_SECRET = 'whsec_eeRauZNR11ilHUgHCOnNp5DQgMKEaEke';
const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'stripe.log');
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function updateRevenue(amount, type) {
  let data = { totalRevenue: 0, totalProfit: 0, transactions: [] };
  if (fs.existsSync(REVENUE_FILE)) {
    data = JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8'));
  }
  data.totalRevenue += amount;
  data.totalProfit += amount * 0.5;
  data.transactions.push({ amount, type, timestamp: new Date().toISOString() });
  fs.writeFileSync(REVENUE_FILE, JSON.stringify(data, null, 2));
  log(`💰 +$${amount} (${type})`);
}

app.post('/webhook', (req, res) => {
  try {
    const event = JSON.parse(req.body);
    log(`🔔 ${event.type}: ${event.id}`);
    
    if (event.type === 'charge.succeeded') {
      updateRevenue(event.data.object.amount / 100, 'charge');
    } else if (event.type === 'payment_intent.succeeded') {
      updateRevenue(event.data.object.amount / 100, 'intent');
    } else if (event.type === 'invoice.payment_succeeded') {
      updateRevenue(event.data.object.total / 100, 'invoice');
    }
    
    res.json({ received: true });
  } catch (e) {
    log(`ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', webhook: 'active' });
});

app.get('/stats', (req, res) => {
  const data = fs.existsSync(REVENUE_FILE) ? 
    JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
    { totalRevenue: 0, totalProfit: 0, transactions: [] };
  res.json(data);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  log('🟢 STRIPE WEBHOOK ONLINE');
  log(`📍 http://0.0.0.0:${PORT}`);
});
