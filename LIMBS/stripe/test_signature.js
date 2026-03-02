const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Manually load .env.live to ensure it works in Termux
const envPath = path.join(__dirname, '../../.env.live');
if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env.live not found at " + envPath);
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const secretMatch = envContent.match(/^STRIPE_WEBHOOK_SECRET=(.*)$/m);
const secret = secretMatch ? secretMatch[1].trim() : null;

if (!secret || secret.length < 10) {
    console.error("❌ Error: STRIPE_WEBHOOK_SECRET is missing or too short in .env.live");
    process.exit(1);
}

const payload = JSON.stringify({
    id: "evt_test_123",
    object: "event",
    type: "checkout.session.completed"
});

const timestamp = Math.floor(Date.now() / 1000);
const signedPayload = `${timestamp}.${payload}`;
const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

console.log("\n✅ Signature Generated Successfully!");
console.log("------------------------------------");
console.log(`Stripe-Signature: t=${timestamp},v1=${signature}`);
console.log("------------------------------------\n");
