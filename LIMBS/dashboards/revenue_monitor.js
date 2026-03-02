const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const REVENUE_FILE = path.join(HOME, '.webhook_queue/revenue.json');

app.get('/', (req, res) => {
  const data = fs.existsSync(REVENUE_FILE) ? 
    JSON.parse(fs.readFileSync(REVENUE_FILE, 'utf8')) : 
    { totalRevenue: 0, totalProfit: 0 };

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>REVENUE MONITOR</title>
  <style>
    body { background: #000; color: #0f0; font-family: monospace; padding: 20px; }
    .ticker { font-size: 48px; font-weight: bold; text-shadow: 0 0 10px #0f0; margin: 20px 0; }
    .stats { font-size: 24px; line-height: 2; }
    .transaction { border-left: 3px solid #0f0; padding: 10px; margin: 5px 0; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    .pulse { animation: pulse 1s infinite; }
  </style>
</head>
<body>
  <h1>⚡ LOUSTA REVENUE MONITOR</h1>
  <div class="ticker">$${data.totalRevenue.toFixed(2)}</div>
  <div class="stats">
    💰 Revenue: <span class="pulse">$${data.totalRevenue.toFixed(2)}</span><br>
    📈 Profit: <span class="pulse">$${data.totalProfit.toFixed(2)}</span><br>
    🔄 Transactions: ${data.transactions ? data.transactions.length : 0}<br>
    💳 Payouts: ${data.payoutsMade ? data.payoutsMade.length : 0}
  </div>
  
  <h2>Recent Transactions</h2>
  ${data.transactions ? data.transactions.slice(-10).reverse().map(t => `
    <div class="transaction">
      <strong>+$${t.amount.toFixed(2)}</strong> (${t.type}) - ${new Date(t.timestamp).toLocaleString()}
    </div>
  `).join('') : 'No transactions'}

  <script>
    setInterval(() => location.reload(), 2000);
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = 5555;
app.listen(PORT, '0.0.0.0', () => {
  console.log('🟢 REVENUE MONITOR LIVE');
  console.log(`📊 http://localhost:${PORT}`);
});
