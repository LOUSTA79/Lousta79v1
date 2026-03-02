const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.raw({type: 'application/json'}));

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'payments.log');
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function updateRevenue(amount, processor, type) {
  let data = { totalRevenue: 0, totalProfit: 0, transactions: [], processors: {} };
  if (fs.existsSync(REVENUE_FILE)) {
    data = JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8'));
  }
  
  if (!data.processors) data.processors = {};
  if (!data.processors[processor]) {
    data.processors[processor] = { revenue: 0, transactions: 0 };
  }
  
  data.totalRevenue += amount;
  data.totalProfit += amount * 0.5;
  data.processors[processor].revenue += amount;
  data.processors[processor].transactions += 1;
  
  data.transactions.push({
    amount,
    processor,
    type,
    timestamp: new Date().toISOString()
  });
  
  fs.writeFileSync(REVENUE_FILE, JSON.stringify(data, null, 2));
  log(`💰 ${processor.toUpperCase()}: +$${amount} (${type})`);
}

// ===== STRIPE WEBHOOK =====
app.post('/stripe', (req, res) => {
  try {
    const event = JSON.parse(req.body);
    if (event.type === 'charge.succeeded') {
      updateRevenue(event.data.object.amount / 100, 'stripe', 'charge');
    }
    res.json({ received: true });
  } catch (e) {
    log(`STRIPE ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== PAYPAL WEBHOOK =====
app.post('/paypal', (req, res) => {
  try {
    const event = req.body;
    if (event.event_type === 'PAYMENT.SALE.COMPLETED') {
      const amount = parseFloat(event.resource.amount.total);
      updateRevenue(amount, 'paypal', 'sale');
    } else if (event.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.COMPLETED') {
      const amount = parseFloat(event.resource.amount_paid.value);
      updateRevenue(amount, 'paypal', 'subscription');
    }
    res.json({ id: event.id });
  } catch (e) {
    log(`PAYPAL ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== GUMROAD WEBHOOK =====
app.post('/gumroad', (req, res) => {
  try {
    const event = req.body;
    if (event.type === 'sale') {
      const amount = parseFloat(event.data.price);
      updateRevenue(amount, 'gumroad', 'sale');
    } else if (event.type === 'subscription_updated') {
      const amount = parseFloat(event.data.amount);
      updateRevenue(amount, 'gumroad', 'subscription');
    }
    res.json({ success: true });
  } catch (e) {
    log(`GUMROAD ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== PATREON WEBHOOK =====
app.post('/patreon', (req, res) => {
  try {
    const event = req.body;
    if (event.data.type === 'pledge') {
      const amount = parseFloat(event.data.attributes.amount_cents) / 100;
      updateRevenue(amount, 'patreon', 'pledge');
    }
    res.json({ processed: true });
  } catch (e) {
    log(`PATREON ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== DIRECT SALES WEBHOOK =====
app.post('/direct-sale', (req, res) => {
  try {
    const { amount, productId, customerId } = req.body;
    updateRevenue(parseFloat(amount), 'direct', `product_${productId}`);
    res.json({ transactionId: `TXN${Date.now()}` });
  } catch (e) {
    log(`DIRECT SALE ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== AFFILIATE COMMISSION =====
app.post('/affiliate', (req, res) => {
  try {
    const { amount, affiliateId } = req.body;
    updateRevenue(parseFloat(amount), 'affiliate', `partner_${affiliateId}`);
    res.json({ commissionId: `COMM${Date.now()}` });
  } catch (e) {
    log(`AFFILIATE ERROR: ${e.message}`);
    res.status(500).json({ error: 'failed' });
  }
});

// ===== STATS =====
app.get('/stats', (req, res) => {
  const data = fs.existsSync(REVENUE_FILE) ? 
    JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
    { totalRevenue: 0, totalProfit: 0, transactions: [], processors: {} };
  res.json(data);
});

// ===== PROCESSOR BREAKDOWN =====
app.get('/breakdown', (req, res) => {
  const data = fs.existsSync(REVENUE_FILE) ? 
    JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
    { totalRevenue: 0, processors: {} };
  
  const breakdown = Object.entries(data.processors || {}).map(([processor, stats]) => ({
    processor,
    revenue: stats.revenue,
    percentage: ((stats.revenue / data.totalRevenue) * 100).toFixed(1),
    transactions: stats.transactions
  }));
  
  res.json({ breakdown, total: data.totalRevenue });
});

const PORT = 3500;
app.listen(PORT, '0.0.0.0', () => {
  log('🟢 MULTI-PROCESSOR PAYMENT HUB ONLINE');
  log(`📍 Stripe: POST http://0.0.0.0:${PORT}/stripe`);
  log(`📍 PayPal: POST http://0.0.0.0:${PORT}/paypal`);
  log(`📍 Gumroad: POST http://0.0.0.0:${PORT}/gumroad`);
  log(`📍 Patreon: POST http://0.0.0.0:${PORT}/patreon`);
  log(`📍 Direct: POST http://0.0.0.0:${PORT}/direct-sale`);
  log(`📍 Affiliate: POST http://0.0.0.0:${PORT}/affiliate`);
});
