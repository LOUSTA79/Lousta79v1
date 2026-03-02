const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const SALES_DB = path.join(CORE, 'books_sales_db.json');

function loadSalesDB() {
  if (fs.existsSync(SALES_DB)) {
    return JSON.parse(fs.readFileSync(SALES_DB, 'utf8'));
  }
  return { sales: [], totalRevenue: 0, totalSold: 0 };
}

function getBookStats(sales) {
  const stats = {};
  const bookTitles = [
    "The AI Money Machine", "100 Ways to Automate", "Passive Income Blueprint",
    "Revenue Streams Handbook", "Content Creation Mastery", "The Autonomous Entrepreneur",
    "Email Marketing Secrets", "Sales Funnel Secrets"
  ];
  
  bookTitles.forEach(title => {
    const bookSales = sales.filter(s => s.bookTitle === title);
    const locations = {};
    bookSales.forEach(sale => {
      locations[sale.location] = (locations[sale.location] || 0) + 1;
    });
    
    stats[title] = {
      sold: bookSales.length,
      revenue: bookSales.reduce((sum, s) => sum + s.price, 0),
      locations: locations,
      recentSales: bookSales.slice(-5).reverse(),
      topLocation: Object.entries(locations).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'
    };
  });
  
  return stats;
}

app.get('/', (req, res) => {
  const db = loadSalesDB();
  const stats = getBookStats(db.sales);
  const recentSales = db.sales.slice(-20).reverse();

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BOOK SALES DASHBOARD</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    body { background: linear-gradient(135deg, #0f172a 0%, #2e1065 100%); font-family: monospace; }
    .live-indicator { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: pulse 1s infinite; display: inline-block; margin-right: 8px; }
  </style>
</head>
<body class="text-white p-4 md:p-6">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-6xl font-black mb-2">📚 BOOK SALES DASHBOARD</h1>
    <div class="flex items-center gap-2 mb-8">
      <span class="live-indicator"></span>
      <span class="text-green-400 text-sm">REAL-TIME SALES TRACKING</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-cyan-500/20 border-2 border-cyan-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">📚</p>
        <p class="text-xs text-cyan-300 mb-2">TOTAL SOLD</p>
        <p class="text-3xl font-black text-cyan-400">${db.totalSold}</p>
      </div>
      
      <div class="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">💰</p>
        <p class="text-xs text-purple-300 mb-2">TOTAL REVENUE</p>
        <p class="text-3xl font-black text-purple-400">$${(db.totalRevenue).toFixed(2)}</p>
      </div>
      
      <div class="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">📊</p>
        <p class="text-xs text-green-300 mb-2">AVG PRICE</p>
        <p class="text-3xl font-black text-green-400">$${(db.totalRevenue / Math.max(db.totalSold, 1)).toFixed(2)}</p>
      </div>
      
      <div class="bg-pink-500/20 border-2 border-pink-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">🌍</p>
        <p class="text-xs text-pink-300 mb-2">COUNTRIES</p>
        <p class="text-3xl font-black text-pink-400">${[...new Set(db.sales.map(s => s.location))].length}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- BOOKS PERFORMANCE -->
      <div>
        <h2 class="text-2xl font-black text-cyan-400 mb-4">📚 BOOKS PERFORMANCE</h2>
        <div class="space-y-3">
          ${Object.entries(stats).map(([title, data]) => \`
            <div class="bg-slate-800/40 border border-slate-700 rounded p-4">
              <div class="flex items-center justify-between mb-2">
                <p class="font-bold text-cyan-400">\${title}</p>
                <p class="text-lg font-black text-green-400">+$\${data.revenue.toFixed(2)}</p>
              </div>
              <div class="flex items-center justify-between text-xs mb-2">
                <span class="text-slate-400">\${data.sold} sold</span>
                <span class="text-slate-400">Top: \${data.topLocation}</span>
              </div>
              <div class="w-full bg-slate-700 rounded h-2">
                <div class="bg-cyan-500 h-2 rounded" style="width: \${Math.min(data.sold / 2, 100)}%"></div>
              </div>
            </div>
          \`).join('')}
        </div>
      </div>

      <!-- SALES BY LOCATION -->
      <div>
        <h2 class="text-2xl font-black text-green-400 mb-4">🌍 SALES BY LOCATION</h2>
        <div class="space-y-3">
          ${[...new Set(db.sales.map(s => s.location))].map(location => {
            const count = db.sales.filter(s => s.location === location).length;
            const revenue = db.sales.filter(s => s.location === location).reduce((sum, s) => sum + s.price, 0);
            return \`
              <div class="bg-slate-800/40 border border-slate-700 rounded p-4">
                <div class="flex items-center justify-between mb-2">
                  <p class="font-bold text-green-400">\${location}</p>
                  <p class="text-lg font-black text-cyan-400">\${count} sales</p>
                </div>
                <p class="text-xs text-slate-400">Revenue: \$\${revenue.toFixed(2)}</p>
              </div>
            \`;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- RECENT RECEIPTS -->
    <div>
      <h2 class="text-2xl font-black text-pink-400 mb-4">📋 RECENT SALES RECEIPTS</h2>
      <div class="space-y-2 max-h-96 overflow-y-auto">
        ${recentSales.map(sale => \`
          <div class="bg-slate-800/40 border-l-4 border-pink-500 rounded p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-slate-400 mb-1">RECEIPT</p>
                <p class="font-bold text-cyan-400 text-xs">\${sale.id}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400 mb-1">PRODUCT</p>
                <p class="font-bold text-cyan-400">\${sale.bookTitle}</p>
              </div>
              <div class="md:text-right">
                <p class="text-xs text-slate-400 mb-1">AMOUNT</p>
                <p class="font-black text-green-400 text-lg">$\${sale.price.toFixed(2)}</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-xs text-slate-400">
              <p>📍 \${sale.location}</p>
              <p>🛍️ \${sale.platform}</p>
              <p>📱 \${sale.device}</p>
              <p>💳 \${sale.paymentMethod}</p>
            </div>
            <div class="mt-2 text-xs text-slate-500">
              <p>⏰ \${new Date(sale.timestamp).toLocaleString()}</p>
              <p>✅ Status: COMPLETED</p>
            </div>
          </div>
        \`).join('')}
      </div>
    </div>
  </div>

  <script>
    setInterval(() => location.reload(), 5000);
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = 5003;
app.listen(PORT, '0.0.0.0', () => {
  console.log('BOOK SALES DASHBOARD');
  console.log('http://localhost:5003');
});
