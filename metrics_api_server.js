const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🛡️ THE BIG RED BUTTON ENDPOINT
app.post('/api/system/kill-switch', (req, res) => {
  const { token } = req.body;
  
  if (token === 'LOUSTA_SECURE_KEY') {
    console.log("🛑 KILL-SWITCH ACTIVATED: Terminating all Empire processes...");
    
    // Kills Python and Node (except this monitoring process)
    exec('pkill -f "python3|node" --exclude-pid ' + process.pid, (err) => {
      res.json({ status: "EMPIRE_OFFLINE", timestamp: new Date() });
    });
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
});

app.get('/api/metrics', (req, res) => {
    // This pulls from your revenue.json and logs
    const revenueData = JSON.parse(fs.readFileSync('./.webhook_queue/revenue.json', 'utf8') || '{}');
    res.json(revenueData);
});

app.listen(5000, () => console.log('🚀 Metrics API with Kill-Switch on port 5000'));
