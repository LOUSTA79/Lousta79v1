const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const ARCHIVE = path.join(HOME, 'LA-Nexus/LouBooks_Archive');

function loadRealProducts() {
  try {
    const inventoryPath = path.join(CORE, 'inventory.json');
    if (fs.existsSync(inventoryPath)) {
      return JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading inventory:', e.message);
  }
  return [];
}

function getRealStats(products) {
  return {
    totalProducts: products.length,
    totalRevenue: products.reduce((sum, p) => sum + p.revenue, 0),
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    avgRating: (products.reduce((sum, p) => sum + parseFloat(p.rating), 0) / products.length).toFixed(1),
    bookCount: products.filter(p => p.type === 'book').length,
    courseCount: products.filter(p => p.type === 'course').length,
    audiobookCount: products.filter(p => p.type === 'audiobook').length,
  };
}

app.use(express.static(ARCHIVE));

app.get('/', (req, res) => {
  const products = loadRealProducts();
  const stats = getRealStats(products);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LOUSTA COMPLETE VAULT</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .pulse { animation: pulse 1.5s infinite; }
    body { background: linear-gradient(135deg, #0f172a 0%, #2e1065 100%); font-family: monospace; }
    .live-indicator { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; animation: pulse 1s infinite; display: inline-block; margin-right: 6px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; z-index: 50; padding: 16px; }
    .modal-window { background: linear-gradient(135deg, #1e293b 0%, #1a1f2e 100%); border: 2px solid #06b6d4; border-radius: 12px; max-width: 95vw; max-height: 95vh; overflow-y: auto; box-shadow: 0 0 50px rgba(6, 182, 212, 0.4); padding: 32px; }
    .close-btn { position: absolute; top: 20px; right: 20px; width: 44px; height: 44px; background: #ef4444; border: none; border-radius: 50%; color: white; cursor: pointer; font-size: 28px; font-weight: bold; }
    .product-card { cursor: pointer; transition: all 0.3s; }
    .product-card:hover { transform: translateY(-6px); filter: brightness(1.3); border-color: #06b6d4; }
    .search-box { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; padding: 12px 16px; border-radius: 8px; color: white; }
    .filter-btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.2s; border: 1px solid #334155; }
    .filter-btn.active { background: #06b6d4; border-color: #06b6d4; color: #1e293b; }
  </style>
</head>
<body class="text-white p-4 md:p-6">
  <div id="app" class="max-w-7xl mx-auto"></div>
  <div id="modal" class="modal-overlay" style="display: none;"></div>

  <script>
    const allProducts = ${JSON.stringify(products)};
    const stats = ${JSON.stringify(stats)};
    let filteredProducts = allProducts;
    let currentFilter = 'all';

    function filterProducts(type) {
      currentFilter = type;
      if (type === 'all') {
        filteredProducts = allProducts;
      } else {
        filteredProducts = allProducts.filter(p => p.type === type);
      }
      render();
    }

    function searchProducts(query) {
      if (query.trim() === '') {
        filteredProducts = allProducts;
      } else {
        filteredProducts = allProducts.filter(p => 
          p.title.toLowerCase().includes(query.toLowerCase())
        );
      }
      render();
    }

    function showProductModal(productId) {
      const product = allProducts.find(p => p.id === productId);
      
      let detailsHTML = '';
      if (product.type === 'audiobook') {
        detailsHTML = \`
          <div class="bg-purple-500/20 border border-purple-500 rounded p-6 mb-6">
            <p class="text-sm font-bold text-purple-300 mb-4">🎧 AUDIO PLAYER</p>
            <audio controls style="width: 100%; background: #1e293b; border-radius: 8px; padding: 8px;">
              <source src="/General/MP3/\${product.filename}" type="audio/mpeg">
              Your browser does not support audio playback.
            </audio>
            <p class="text-xs text-purple-300 mt-3">Duration: \${product.duration}</p>
          </div>
        \`;
      } else if (product.type === 'book') {
        detailsHTML = \`
          <div class="bg-blue-500/20 border border-blue-500 rounded p-6 mb-6">
            <p class="text-sm font-bold text-blue-300 mb-2">📖 BOOK DETAILS</p>
            <p class="text-xs text-blue-300">Pages: \${product.pages}</p>
          </div>
        \`;
      } else if (product.type === 'course') {
        detailsHTML = \`
          <div class="bg-green-500/20 border border-green-500 rounded p-6 mb-6">
            <p class="text-sm font-bold text-green-300 mb-2">🎓 COURSE DETAILS</p>
            <p class="text-xs text-green-300">Modules: \${product.modules} | Students: \${product.students.toLocaleString()}</p>
          </div>
        \`;
      }

      const html = \`
        <div class="modal-window relative">
          <button onclick="closeModal()" class="close-btn">×</button>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div class="w-full h-64 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <p class="text-6xl">\${product.type === 'audiobook' ? '🎧' : product.type === 'book' ? '📚' : '🎓'}</p>
              </div>
            </div>
            <div class="md:col-span-2">
              <h2 class="text-3xl font-black text-cyan-400 mb-2">\${product.title}</h2>
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="bg-slate-800/40 rounded p-4">
                  <p class="text-xs text-slate-400 mb-1">REVENUE</p>
                  <p class="text-2xl font-black text-cyan-400">$\${(product.revenue / 1000).toFixed(1)}K</p>
                </div>
                <div class="bg-slate-800/40 rounded p-4">
                  <p class="text-xs text-slate-400 mb-1">SALES</p>
                  <p class="text-2xl font-black text-cyan-400">\${product.sales}</p>
                </div>
                <div class="bg-slate-800/40 rounded p-4">
                  <p class="text-xs text-slate-400 mb-1">RATING</p>
                  <p class="text-2xl font-black text-yellow-400">⭐ \${product.rating}</p>
                </div>
                <div class="bg-slate-800/40 rounded p-4">
                  <p class="text-xs text-slate-400 mb-1">REVIEWS</p>
                  <p class="text-2xl font-black text-cyan-400">\${product.reviews}</p>
                </div>
              </div>

              \${detailsHTML}

              <div class="bg-slate-800/30 rounded p-4">
                <p class="text-sm font-bold text-slate-300 mb-3">📋 INFO</p>
                <div class="space-y-1 text-xs text-slate-400">
                  <p>Type: <span class="text-cyan-400 font-bold">\${product.type.toUpperCase()}</span></p>
                  <p>Published: <span class="text-cyan-400 font-bold">\${product.publishedDate}</span></p>
                  <p>Status: <span class="text-green-400 font-bold">✓ LIVE</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
      
      const modal = document.getElementById('modal');
      modal.innerHTML = html;
      modal.style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('modal').style.display = 'none';
    }

    function render() {
      const app = document.getElementById('app');
      app.innerHTML = \`
        <div class="mb-8">
          <h1 class="text-6xl font-black mb-2">⚡ LOUSTA COMPLETE VAULT</h1>
          <div class="flex items-center gap-2 mb-4">
            <span class="live-indicator"></span>
            <span class="text-green-400 text-sm">\${stats.totalProducts} PRODUCTS | $\${(stats.totalRevenue / 1000000).toFixed(1)}M REVENUE</span>
          </div>

          <div class="flex gap-2 flex-wrap mb-6">
            <input type="text" placeholder="Search products..." class="search-box flex-1" onkeyup="searchProducts(this.value)" />
          </div>

          <div class="flex gap-2 flex-wrap mb-6">
            <button onclick="filterProducts('all')" class="filter-btn \${currentFilter === 'all' ? 'active' : ''}">All (\${stats.totalProducts})</button>
            <button onclick="filterProducts('book')" class="filter-btn \${currentFilter === 'book' ? 'active' : ''}">Books (\${stats.bookCount})</button>
            <button onclick="filterProducts('course')" class="filter-btn \${currentFilter === 'course' ? 'active' : ''}">Courses (\${stats.courseCount})</button>
            <button onclick="filterProducts('audiobook')" class="filter-btn \${currentFilter === 'audiobook' ? 'active' : ''}">Audiobooks (\${stats.audiobookCount})</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-cyan-500/20 border-2 border-cyan-500 rounded-lg p-6 text-center">
            <p class="text-3xl mb-3">💎</p>
            <p class="text-xs text-cyan-300 mb-2">TOTAL</p>
            <p class="text-3xl font-black text-cyan-400">\${filteredProducts.length}</p>
          </div>
          <div class="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center">
            <p class="text-3xl mb-3">💰</p>
            <p class="text-xs text-purple-300 mb-2">REVENUE</p>
            <p class="text-3xl font-black text-purple-400">$\${(filteredProducts.reduce((s, p) => s + p.revenue, 0) / 1000000).toFixed(1)}M</p>
          </div>
          <div class="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
            <p class="text-3xl mb-3">📊</p>
            <p class="text-xs text-green-300 mb-2">SALES</p>
            <p class="text-3xl font-black text-green-400">\${filteredProducts.reduce((s, p) => s + p.sales, 0).toLocaleString()}</p>
          </div>
          <div class="bg-pink-500/20 border-2 border-pink-500 rounded-lg p-6 text-center">
            <p class="text-3xl mb-3">⭐</p>
            <p class="text-xs text-pink-300 mb-2">AVG RATING</p>
            <p class="text-3xl font-black text-pink-400">\${(filteredProducts.reduce((s, p) => s + parseFloat(p.rating), 0) / filteredProducts.length).toFixed(1)}</p>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-black text-cyan-400 mb-4">📦 PRODUCTS (\${filteredProducts.length})</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            \${filteredProducts.map(p => \`
              <div onclick="showProductModal(\${p.id})" class="product-card bg-slate-800/40 border border-slate-700 rounded-lg p-4 hover:border-cyan-500">
                <div class="mb-3 text-3xl text-center">
                  \${p.type === 'audiobook' ? '🎧' : p.type === 'book' ? '📚' : '🎓'}
                </div>
                <p class="text-sm font-black text-cyan-400 mb-2 line-clamp-2 h-10">\${p.title}</p>
                <div class="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div class="bg-slate-700/50 rounded p-1">
                    <p class="text-slate-400">$\${(p.revenue/1000).toFixed(1)}K</p>
                  </div>
                  <div class="bg-slate-700/50 rounded p-1">
                    <p class="text-slate-400">\${p.sales} sales</p>
                  </div>
                </div>
                <p class="text-xs text-yellow-400 text-center">⭐ \${p.rating}</p>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    window.filterProducts = filterProducts;
    window.searchProducts = searchProducts;
    window.showProductModal = showProductModal;
    window.closeModal = closeModal;

    render();
  </script>
</body>
</html>`;
  res.send(html);
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ⚡ LOUSTA COMPLETE VAULT ONLINE      ║');
  console.log('║  📊 http://localhost:5000             ║');
  console.log('║  🟢 400+ PRODUCTS WITH AUDIO PLAYER   ║');
  console.log('╚════════════════════════════════════════╝');
});
