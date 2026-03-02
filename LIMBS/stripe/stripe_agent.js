const axios = require('axios');
const fs = require('fs');
const path = require('path');

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'stripe_agent.log');
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

// ===== STRIPE API KEY =====
const STRIPE_API_KEY = 'REDACTED_STRIPE_KEY';
const STRIPE_BASE = 'https://api.stripe.com/v1';

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ===== STRIPE API CALLS =====
const stripe = {
  async getAccount() {
    try {
      const res = await axios.get(`${STRIPE_BASE}/account`, {
        auth: { username: STRIPE_API_KEY, password: '' }
      });
      return res.data;
    } catch (e) {
      log(`ERROR getting account: ${e.message}`);
      return null;
    }
  },

  async getBalance() {
    try {
      const res = await axios.get(`${STRIPE_BASE}/balance`, {
        auth: { username: STRIPE_API_KEY, password: '' }
      });
      return res.data;
    } catch (e) {
      log(`ERROR getting balance: ${e.message}`);
      return null;
    }
  },

  async createTransfer(amount, destination) {
    try {
      const res = await axios.post(`${STRIPE_BASE}/transfers`, 
        `amount=${Math.floor(amount * 100)}&currency=usd&destination=${destination}`,
        {
          auth: { username: STRIPE_API_KEY, password: '' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      return res.data;
    } catch (e) {
      log(`ERROR creating transfer: ${e.message}`);
      return null;
    }
  },

  async createPayout(amount, method = 'instant') {
    try {
      const res = await axios.post(`${STRIPE_BASE}/payouts`,
        `amount=${Math.floor(amount * 100)}&currency=usd&method=${method}`,
        {
          auth: { username: STRIPE_API_KEY, password: '' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      return res.data;
    } catch (e) {
      log(`ERROR creating payout: ${e.message}`);
      return null;
    }
  },

  async listCharges(limit = 100) {
    try {
      const res = await axios.get(`${STRIPE_BASE}/charges?limit=${limit}`, {
        auth: { username: STRIPE_API_KEY, password: '' }
      });
      return res.data.data;
    } catch (e) {
      log(`ERROR listing charges: ${e.message}`);
      return [];
    }
  },

  async listSubscriptions(limit = 100) {
    try {
      const res = await axios.get(`${STRIPE_BASE}/subscriptions?limit=${limit}`, {
        auth: { username: STRIPE_API_KEY, password: '' }
      });
      return res.data.data;
    } catch (e) {
      log(`ERROR listing subscriptions: ${e.message}`);
      return [];
    }
  },

  async updatePrice(priceId, metadata) {
    try {
      const res = await axios.post(`${STRIPE_BASE}/prices/${priceId}`,
        `metadata[${Object.keys(metadata)[0]}]=${Object.values(metadata)[0]}`,
        {
          auth: { username: STRIPE_API_KEY, password: '' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      return res.data;
    } catch (e) {
      log(`ERROR updating price: ${e.message}`);
      return null;
    }
  }
};

// ===== STRIPE AGENT =====
class StripeAgent {
  constructor() {
    this.totalTransferred = 0;
    this.payouts = [];
  }

  async monitorBalance() {
    const balance = await stripe.getBalance();
    if (balance) {
      const available = balance.available[0].amount / 100;
      const pending = balance.pending[0].amount / 100;
      log(`💰 BALANCE: Available $${available.toFixed(2)} | Pending $${pending.toFixed(2)}`);
      return { available, pending };
    }
  }

  async processAutoTransfer(amount, recipientEmail = 'ljupco@example.com') {
    const transfer = await stripe.createTransfer(amount, recipientEmail);
    if (transfer) {
      log(`✅ TRANSFER: $${(transfer.amount / 100).toFixed(2)} → ${recipientEmail}`);
      this.totalTransferred += transfer.amount / 100;
      return transfer;
    }
  }

  async processMilestonePayouts() {
    const data = fs.existsSync(REVENUE_FILE) ? 
      JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
      { totalRevenue: 0 };

    const milestones = [
      { amount: 5000, payout: 2500, recipient: 'Ljupco Arsovski' },
      { amount: 25000, payout: 12500, recipient: 'Ljupco Arsovski' },
      { amount: 100000, payout: 50000, recipient: 'Ljupco Arsovski' },
      { amount: 500000, payout: 250000, recipient: 'Ljupco Arsovski' },
      { amount: 1000000, payout: 500000, recipient: 'Ljupco Arsovski' }
    ];

    for (const milestone of milestones) {
      if (data.totalRevenue >= milestone.amount) {
        // Check if already paid out
        const alreadyPaid = this.payouts.some(p => p.milestone === milestone.amount);
        
        if (!alreadyPaid) {
          log(`🎯 MILESTONE TRIGGERED: $${milestone.amount} revenue detected`);
          
          const payout = await stripe.createPayout(milestone.payout);
          if (payout) {
            log(`💸 PAYOUT INITIATED: $${milestone.payout} to ${milestone.recipient}`);
            this.payouts.push({
              milestone: milestone.amount,
              payout: milestone.payout,
              timestamp: new Date().toISOString(),
              status: payout.status
            });
          }
        }
      }
    }
  }

  async getDashboard() {
    const balance = await this.monitorBalance();
    const subs = await stripe.listSubscriptions(10);
    
    log(`📊 STRIPE DASHBOARD SNAPSHOT:`);
    log(`  Active Subscriptions: ${subs.length}`);
    log(`  Total Transferred: $${this.totalTransferred.toFixed(2)}`);
    log(`  Milestone Payouts: ${this.payouts.length}`);
  }

  async runAgent() {
    log(`🤖 STRIPE AGENT CYCLE STARTING`);
    
    // 1. Monitor balance
    await this.monitorBalance();
    
    // 2. Process milestone payouts
    await this.processMilestonePayouts();
    
    // 3. Get dashboard
    await this.getDashboard();
    
    log(`✅ STRIPE AGENT CYCLE COMPLETE`);
  }
}

// ===== INITIALIZE =====
const agent = new StripeAgent();
log(`🟢 STRIPE AGENT ONLINE`);
log(`💳 API Key: ${STRIPE_API_KEY.substring(0, 20)}...`);
log(`🔄 Auto-transfer & payout system ACTIVE`);

// Run every 5 minutes
setInterval(() => {
  agent.runAgent();
}, 300000);

// Run immediately
agent.runAgent();

// Expose for testing
module.exports = { agent, stripe };
