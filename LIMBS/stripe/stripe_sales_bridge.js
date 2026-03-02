const express = require('express');
const Stripe = require('stripe');
require("dotenv").config({ path: require("path").join(__dirname, ".env"), override: true, quiet: true });

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CRITICAL: Raw body BEFORE json() parsing
app.post('/webhook/stripe', 
  express.raw({type: 'application/json'}),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    
    console.log(`[WEBHOOK] sig: ${sig ? 'present' : 'MISSING'}`);
    
    if (!sig || !whsec) {
      return res.status(400).send('Missing signature or secret');
    }
    
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, whsec);
      console.log(`✅ Webhook verified | Event: ${event.type}`);
      
      if (event.type === 'charge.succeeded') {
        console.log(`💰 Charge succeeded: ${event.data.object.id}`);
      }
      
      res.json({received: true});
    } catch (err) {
      console.error(`❌ Signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

// JSON parsing for other routes
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({status: 'online', bridge: '09-STRIPE-BRIDGE'});
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 STRIPE BRIDGE ONLINE: http://0.0.0.0:${PORT}`);
  console.log(`➡️ Webhook endpoint: /webhook/stripe`);
});
