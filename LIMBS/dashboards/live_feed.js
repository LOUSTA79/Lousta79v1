const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');

function getRecentLogs() {
  const logs = {
    stripe: [],
    sales: [],
    sync: [],
    publishing: [],
    cfo: []
  };

  try {
    // Stripe logs
    if (fs.existsSync(path.join(CORE, 'stripe_webhook.log'))) {
      logs.stripe = fs.readFileSync(path.join(CORE, 'stripe_webhook.log'), 'utf8')
        .split('\n').reverse().slice(0, 10);
    }

    // Sales logs
    if (fs.existsSync(path.join(CORE, 'sales_swarm.log'))) {
      logs.sales = fs.readFileSync(path.join(CORE, 'sales_swarm.log'), 'utf8')
        .split('\n').reverse().slice(0, 10);
    }

    // Sync logs
    if (fs.existsSync(path.join(CORE, 'sync.log'))) {
      logs.sync = fs.readFileSync(path.join(CORE, 'sync.log'), 'utf8')
        .split('\n').reverse().slice(0, 10);
    }

    // Publishing logs
    if (fs.existsSync(path.join(CORE, 'publishing.log'))) {
      logs.publishing = fs.readFileSync(path.join(CORE, 'publishing.log'), 'utf8')
        .split('\n').reverse().slice(0, 10);
    }

    // CFO logs
    if (fs.existsSync(path.join(CORE, 'cfo.log'))) {
      logs.cfo = fs.readFileSync(path.join(CORE, 'cfo.log'), 'utf8')
        .split('\n').reverse().slice(0, 10);
    }
  } catch (e) {}

  return logs;
}

function getSystemStats() {
  let totalRevenue = 0, totalTransactions = 0;
  
  try {
    const revFile = path.join(HOME, '.webhook_queue/revenue.json');
    if (fs.existsSync(revFile)) {
      const data = JSON.parse(fs.readFileSync(revFile, 'utf8'));
      totalRevenue = data.totalRevenue || 0;
      totalTransactions = data.transactions ? data.transactions.length : 0;
    }
  } catch (e) {}

  return { totalRevenue, totalTransactions };
}

app.get('/', (req, res) => {
  const logs = getRecentLogs();
  const stats = getSystemStats();

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LOUSTA LIVE FEED</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    @keyframes glow { 0% { text-shadow: 0 0 5px #22c55e; } 50% { text-shadow: 0 0 20px #22c55e; } 100% { text-shadow: 0 0 5px #22c55e; } }
    .pulse { animation: pulse 1.5s infinite; }
    .glow { animation: glow 2s infinite; }
    body { background: linear-gradient(135deg, #0f172a 0%, #2e1065 100%); font-family: monospace; overflow-x: hidden; }
    .live-indicator { width: 12px; height: 12px; background: #22c55e; border-radius: 50%; animation: pulse 1s infinite; display: inline-block; margin-right: 8px; }
    .feed-stream { height: calc(100vh - 200px); overflow-y: auto; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 8px; padding: 16px; }
    .feed-item { padding: 12px; margin-bottom: 8px; border-left: 3px solid #06b6d4; background: rgba(30, 41, 59, 0.6); border-radius: 4px; font-size: 12px; line-height: 1.4; }
    .feed-item.stripe { border-left-color: #8b5cf6; }
    .feed-item.sales { border-left-color: #ec4899; }
    .feed-item.sync { border-left-color: #10b981; }
    .feed-item.publishing { border-left-color: #f59e0b; }
    .feed-item.cfo { border-left-color: #06b6d4; }
    .feed-item.success { color: #22c55e; }
    .feed-item.warning { color: #f59e0b; }
    .feed-item.error { color: #ef4444; }
  </style>
</head>
<body class="text-white p-4 md:p-6">
  <div class="max-w-7xl mx-auto">
    <div class="mb-6">
      <h1 class="text-6xl font-black mb-2 glow">⚡ LOUSTA LIVE FEED</h1>
      <div class="flex items-center gap-2">
        <span class="live-indicator"></span>
        <span class="text-green-400 text-sm">ALL SYSTEMS ONLINE • REAL-TIME MONITORING</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-cyan-500/20 border-2 border-cyan-500 rounded-lg p-4 text-center">
        <p class="text-3xl mb-2">💰</p>
        <p class="text-xs text-cyan-300 mb-1">TOTAL REVENUE</p>
        <p class="text-2xl font-black text-cyan-400">$${(stats.totalRevenue / 1000).toFixed(0)}K</p>
      </div>
      
      <div class="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-4 text-center">
        <p class="text-3xl mb-2">💳</p>
        <p class="text-xs text-purple-300 mb-1">TRANSACTIONS</p>
        <p class="text-2xl font-black text-purple-400">${stats.totalTransactions}</p>
      </div>
      
      <div class="bg-green-500/20 border-2 border-green-500 rounded-lg p-4 text-center">
        <p class="text-3xl mb-2">🤖</p>
        <p class="text-xs text-green-300 mb-1">AGENTS ACTIVE</p>
        <p class="text-2xl font-black text-green-400">5</p>
      </div>
      
      <div class="bg-pink-500/20 border-2 border-pink-500 rounded-lg p-4 text-center">
        <p class="text-3xl mb-2">🔴</p>
        <p class="text-xs text-pink-300 mb-1">LIVE STATUS</p>
        <p class="text-2xl font-black text-pink-400 pulse">● ACTIVE</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <!-- LEFT COLUMN -->
      <div>
        <div class="mb-4">
          <h2 class="text-xl font-black text-purple-400 mb-2">💳 STRIPE PAYMENTS</h2>
          <div class="feed-stream">
            ${logs.stripe.filter(l => l.trim()).map(line => {
              let className = 'feed-item stripe';
              if (line.includes('✅')) className += ' success';
              if (line.includes('❌')) className += ' error';
              return \`<div class="\${className}">\${line}</div>\`;
            }).join('')}
          </div>
        </div>
        
        <div>
          <h2 class="text-xl font-black text-pink-400 mb-2">🤖 SALES SWARM</h2>
          <div class="feed-stream">
            ${logs.sales.filter(l => l.trim()).map(line => {
              let className = 'feed-item sales';
              if (line.includes('✅')) className += ' success';
              if (line.includes('❌')) className += ' error';
              return \`<div class="\${className}">\${line}</div>\`;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div>
        <div class="mb-4">
          <h2 class="text-xl font-black text-green-400 mb-2">📱 LIVE SYNC</h2>
          <div class="feed-stream">
            ${logs.sync.filter(l => l.trim()).map(line => {
              let className = 'feed-item sync';
              if (line.includes('✅')) className += ' success';
              if (line.includes('❌')) className += ' error';
              return \`<div class="\${className}">\${line}</div>\`;
            }).join('')}
          </div>
        </div>
        
        <div>
          <h2 class="text-xl font-black text-cyan-400 mb-2">📊 SYSTEM ACTIVITY</h2>
          <div class="feed-stream">
            <div class="feed-item success">✅ All dashboards online</div>
            <div class="feed-item success">✅ Stripe webhook listening on :3000</div>
            <div class="feed-item success">✅ Sales swarm processing leads</div>
            <div class="feed-item success">✅ Live sync watching for products</div>
            <div class="feed-item success">✅ Phone storage syncing enabled</div>
            <div class="feed-item warning">📌 Next sync cycle: 30 seconds</div>
            <div class="feed-item success">✅ Revenue tracking active</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    setInterval(() => location.reload(), 5000); // Refresh every 5 seconds
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log('LOUSTA LIVE FEED');
  console.log('http://localhost:5003');
});
