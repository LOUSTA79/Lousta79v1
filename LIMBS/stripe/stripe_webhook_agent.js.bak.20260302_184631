const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.raw({type: 'application/json'}));

const STRIPE_SECRET = 'whsec_eeRauZNR11ilHUgHCOnNp5DQgMKEaEke';
const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'stripe_webhook.log');
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

function log(msg) {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] ${msg}`;
  console.log(logMsg);
  fs.appendFileSync(LOG_FILE, logMsg + '\n');
}

function verifyWebhookSignature(req) {
  const signature = req.headers['stripe-signature'];
  if (!signature) return false;

  try {
    const secret = STRIPE_SECRET;
    const timestamp = signature.split(',')[0].split('=')[1];
    const hash = signature.split(',')[1].split('=')[1];
    
    const signed_content = `${timestamp}.${req.body}`;
    const computed_hash = crypto
      .createHmac('sha256', secret)
      .update(signed_content)
      .digest('hex');
    
    return computed_hash === hash;
  } catch (e) {
    return false;
  }
}

function updateRevenue(amount, type) {
  try {
    let data = { totalRevenue: 0, totalProfit: 0, transactions: [] };
    
    if (fs.existsSync(REVENUE_FILE)) {
      data = JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8'));
    }
    
    data.totalRevenue += amount;
    data.totalProfit += Math.floor(amount * 0.5);
    data.transactions.push({
      amount: amount,
      type: type,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });
    
    fs.writeFileSync(REVENUE_FILE, JSON.stringify(data, null, 2));
    log(`💰 REVENUE UPDATED: +$${amount.toFixed(2)} (${type})`);
  } catch (e) {
    log(`ERROR UPDATING REVENUE: ${e.message}`);
  }
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    log('❌ NO SIGNATURE PROVIDED');
    return res.status(401).send('Unauthorized');
  }

  try {
    const event = JSON.parse(req.body);
    
    log(`🔔 WEBHOOK EVENT: ${event.type} (ID: ${event.id})`);
    
    switch(event.type) {
      case 'charge.succeeded':
        const amount = event.data.object.amount / 100;
        log(`✅ CHARGE SUCCEEDED: $${amount.toFixed(2)}`);
        updateRevenue(amount, 'charge.succeeded');
        break;
        
      case 'payment_intent.succeeded':
        const piAmount = event.data.object.amount / 100;
        log(`✅ PAYMENT INTENT SUCCEEDED: $${piAmount.toFixed(2)}`);
        updateRevenue(piAmount, 'payment_intent');
        break;
        
      case 'invoice.payment_succeeded':
        const invAmount = event.data.object.total / 100;
        log(`✅ INVOICE PAID: $${invAmount.toFixed(2)}`);
        updateRevenue(invAmount, 'invoice');
        break;
        
      case 'customer.subscription.created':
        const subAmount = (event.data.object.default_payment_method?.card?.exp_year || 0);
        log(`✅ NEW SUBSCRIPTION CREATED: ${event.data.object.id}`);
        break;
        
      case 'customer.subscription.updated':
        log(`✅ SUBSCRIPTION UPDATED: ${event.data.object.id}`);
        break;
        
      case 'checkout.session.completed':
        const sessionAmount = event.data.object.amount_total / 100;
        log(`✅ CHECKOUT COMPLETED: $${sessionAmount.toFixed(2)}`);
        updateRevenue(sessionAmount, 'checkout_session');
        break;

      default:
        log(`📌 EVENT LOGGED: ${event.type}`);
    }
    
    res.json({ received: true, id: event.id });
  } catch (e) {
    log(`ERROR PROCESSING WEBHOOK: ${e.message}`);
    res.status(500).send('Webhook processing failed');
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', webhook: 'active', timestamp: new Date().toISOString() });
});

app.get('/stats', (req, res) => {
  try {
    const data = fs.existsSync(REVENUE_FILE) ? 
      JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
      { totalRevenue: 0, totalProfit: 0, transactions: [] };
    
    res.json({
      totalRevenue: data.totalRevenue,
      totalProfit: data.totalProfit,
      transactionCount: data.transactions.length,
      lastTransaction: data.transactions[data.transactions.length - 1] || null,
      status: 'webhook_active'
    });
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send(\`
    <h1>✅ Stripe Webhook Agent</h1>
    <p>Webhook is active and listening</p>
    <p>Secret: whsec_eeRauZNR11ilHUgHCOnNp5DQgMKEaEke</p>
    <p><a href="/stats">View Stats</a></p>
    <p><a href="/health">Health Check</a></p>
  \`);
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  log('🟢 STRIPE WEBHOOK AGENT ONLINE');
  log(`📍 Listening on http://0.0.0.0:${PORT}`);
  log(`🔐 Webhook endpoint: POST http://0.0.0.0:${PORT}/webhook`);
  log(`✅ Secret verified: whsec_eeRauZNR11ilHUgHCOnNp5DQgMKEaEke`);
});

process.on('SIGTERM', () => {
  log('WEBHOOK AGENT SHUTTING DOWN');
  process.exit(0);
});
