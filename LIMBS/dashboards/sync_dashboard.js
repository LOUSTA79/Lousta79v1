const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const HOME = process.env.HOME || '/data/data/com.termux/files/home';
const CORE = path.join(HOME, 'LA-Nexus/ALourithm_Core');
const PHONE = '/sdcard/LOUSTA_CONTENT';

app.get('/', (req, res) => {
  const getSyncStats = () => {
    let readBooks = 0, audiobooks = 0, videos = 0;
    let totalSize = 0;
    
    try {
      if (fs.existsSync(path.join(PHONE, 'READ_BOOKS'))) {
        const files = fs.readdirSync(path.join(PHONE, 'READ_BOOKS'));
        readBooks = files.length;
        files.forEach(f => {
          const stats = fs.statSync(path.join(PHONE, 'READ_BOOKS', f));
          totalSize += stats.size;
        });
      }
      
      if (fs.existsSync(path.join(PHONE, 'LISTEN_AUDIO'))) {
        const files = fs.readdirSync(path.join(PHONE, 'LISTEN_AUDIO'));
        audiobooks = files.length;
        files.forEach(f => {
          const stats = fs.statSync(path.join(PHONE, 'LISTEN_AUDIO', f));
          totalSize += stats.size;
        });
      }
      
      if (fs.existsSync(path.join(PHONE, 'WATCH_VIDEO'))) {
        videos = fs.readdirSync(path.join(PHONE, 'WATCH_VIDEO')).length;
      }
    } catch (e) {}
    
    return { readBooks, audiobooks, videos, totalSize: (totalSize / 1024 / 1024).toFixed(2) };
  };

  const stats = getSyncStats();
  const syncLog = fs.existsSync(path.join(CORE, 'sync.log')) ?
    fs.readFileSync(path.join(CORE, 'sync.log'), 'utf8').split('\n').reverse().slice(0, 20) : [];

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LOUSTA LIVE SYNC</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    body { background: linear-gradient(135deg, #0f172a 0%, #2e1065 100%); font-family: monospace; }
    .live-indicator { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; animation: pulse 1s infinite; display: inline-block; margin-right: 8px; }
  </style>
</head>
<body class="text-white p-6">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-6xl font-black mb-2">⚡ LIVE SYNC</h1>
    <div class="flex items-center gap-2 mb-8">
      <span class="live-indicator"></span>
      <span class="text-green-400">CONTINUOUS PHONE SYNC ACTIVE</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-cyan-500/20 border-2 border-cyan-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">📚</p>
        <p class="text-xs text-cyan-300 mb-2">BOOKS SYNCED</p>
        <p class="text-3xl font-black text-cyan-400">${stats.readBooks}</p>
      </div>
      
      <div class="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">🎧</p>
        <p class="text-xs text-purple-300 mb-2">AUDIOBOOKS SYNCED</p>
        <p class="text-3xl font-black text-purple-400">${stats.audiobooks}</p>
      </div>
      
      <div class="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">🎬</p>
        <p class="text-xs text-green-300 mb-2">VIDEOS SYNCED</p>
        <p class="text-3xl font-black text-green-400">${stats.videos}</p>
      </div>
      
      <div class="bg-pink-500/20 border-2 border-pink-500 rounded-lg p-6 text-center">
        <p class="text-3xl mb-3">💾</p>
        <p class="text-xs text-pink-300 mb-2">TOTAL SIZE</p>
        <p class="text-3xl font-black text-pink-400">${stats.totalSize}MB</p>
      </div>
    </div>

    <div class="bg-slate-800/40 border border-slate-700 rounded-lg p-6">
      <p class="text-lg font-black text-cyan-400 mb-4">📋 SYNC LOG (Latest 20)</p>
      <div class="space-y-1 max-h-96 overflow-y-auto text-xs font-mono">
        ${syncLog.map(line => `<p class="text-slate-400">${line}</p>`).join('')}
      </div>
    </div>

    <div class="mt-8 p-6 bg-green-500/20 border-2 border-green-500 rounded-lg">
      <p class="text-lg font-bold text-green-300 mb-2">✅ PHONE LOCATION:</p>
      <p class="text-sm text-green-300">/sdcard/LOUSTA_CONTENT/</p>
      <ul class="text-xs text-green-300 mt-3 space-y-1">
        <li>📚 READ_BOOKS - Your books go here</li>
        <li>🎧 LISTEN_AUDIO - Your audiobooks auto-play</li>
        <li>🎬 WATCH_VIDEO - Your videos appear here</li>
        <li>📝 METADATA - File details stored here</li>
      </ul>
    </div>
  </div>

  <script>
    setInterval(() => location.reload(), 10000); // Refresh every 10 seconds
  </script>
</body>
</html>`);
});

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
  console.log('LOUSTA LIVE SYNC DASHBOARD');
  console.log('http://localhost:5001');
});
