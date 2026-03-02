const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const LOG_FILE = path.join(CORE, 'stripe_agent.log');
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

app.get('/', (req, res) => {
  const data = fs.existsSync(REVENUE_FILE) ? 
    JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
    { totalRevenue: 0, totalProfit: 0, payoutsMade: [] };

  const logs = fs.existsSync(LOG_FILE) ?
    fs.readFileSync(LOG_FILE, 'utf8').split('\n').reverse().slice(0, 30) : [];

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>STRIPE AGENT</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { background: linear-gradient(135deg, #0f172a 0%, #2e1065 100%); font-family: monospace; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .pulse { animation: pulse 1s infinite; }
  </style>
</head>
<body class="text-white p-6">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-6xl font-black mb-2">🤖 STRIPE AGENT</h1>
    <p class="text-green-400 mb-8">Auto-managing your Stripe account 24/7</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-cyan-500/20 border-2 border-cyan-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-2">💰</p>
        <p class="text-xs text-cyan-300 mb-1">TOTAL REVENUE</p>
        <p class="text-2xl font-black text-cyan-400">$${(data.totalRevenue / 1000000).toFixed(1)}M</p>
      </div>
      
      <div class="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-2">💸</p>
        <p class="text-xs text-purple-300 mb-1">TOTAL PAYOUTS</p>
        <p class="text-2xl font-black text-purple-400">$${data.payoutsMade.reduce((s, p) => s + p.amount, 0).toFixed(0)}</p>
      </div>
      
      <div class="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-2">🤖</p>
        <p class="text-xs text-green-300 mb-1">AGENT STATUS</p>
        <p class="text-2xl font-black text-green-400 pulse">● ACTIVE</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div>
        <h2 class="text-2xl font-black text-cyan-400 mb-4">💸 RECENT PAYOUTS</h2>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          ${data.payoutsMade ? data.payoutsMade.slice(-10).reverse().map(p => `
            <div class="bg-slate-800/40 border-l-4 border-green-500 rounded p-3 text-xs">
              <p class="font-bold text-green-400">+$${p.amount} → ${p.recipient}</p>
              <p class="text-slate-400">${new Date(p.date).toLocaleString()}</p>
              <p class="text-slate-500">${p.bank} ${p.bsb}</p>
            </div>
          `).join('') : 'No payouts yet'}
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-black text-green-400 mb-4">🔄 AGENT ACTIVITY</h2>
        <div class="space-y-1 max-h-48 overflow-y-auto bg-slate-900 rounded p-3 text-xs text-slate-400 font-mono">
          ${logs.filter(l => l.trim()).map(line => `<p>${line}</p>`).join('')}
        </div>
      </div>
    </div>

    <div class="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
      <h2 class="text-xl font-black text-cyan-400 mb-4">📊 STRIPE AGENT CAPABILITIES</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>✅ Monitor real-time balance</div>
        <div>✅ Auto-process milestone payouts</div>
        <div>✅ Track all subscriptions</div>
        <div>✅ List all charges</div>
        <div>✅ Create instant transfers</div>
        <div>✅ Update pricing dynamically</div>
        <div>✅ Generate payouts</div>
        <div>✅ Dashboard analytics</div>
      </div>
    </div>
  </div>

  <script>
    setInterval(() => location.reload(), 10000);
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = 3600;
app.listen(PORT, '0.0.0.0', () => {
  console.log('STRIPE AGENT DASHBOARD');
  console.log(`http://localhost:${PORT}`);
});
