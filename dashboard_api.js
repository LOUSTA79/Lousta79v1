const express = require('express');
const app = express();
const fs = require('fs');

app.get('/api/metrics', (req, res) => {
  const revenue = JSON.parse(fs.readFileSync(process.env.HOME + '/.webhook_queue/revenue.json', 'utf8'));
  res.json(revenue);
});

app.listen(4242, () => console.log('Dashboard API on :4242'));
