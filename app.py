import os
import stripe
from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# Stripe configuration
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_PUBLISHABLE_KEY = os.environ.get('STRIPE_PUBLISHABLE_KEY')

# Log configuration status
print("=" * 50)
print("🚀 LOUSTA BOOKS - STARTING UP")
print("=" * 50)
if stripe.api_key:
    key_type = "LIVE" if stripe.api_key.startswith('REDACTED_STRIPE_KEY') else "TEST"
    print(f"✅ Stripe {key_type} keys configured")
else:
    print("⚠️  WARNING: Stripe keys not configured!")
print("=" * 50)

@app.route('/')
def dashboard():
    """Mobile-optimized dashboard"""
    return render_template('dashboard.html', stripe_key=STRIPE_PUBLISHABLE_KEY)

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'stripe_configured': bool(stripe.api_key and STRIPE_PUBLISHABLE_KEY),
        'mode': 'live' if (stripe.api_key and stripe.api_key.startswith('REDACTED_STRIPE_KEY')) else 'test'
    })

@app.route('/api/revenue')
def get_revenue():
    """Get revenue data"""
    try:
        days = int(request.args.get('days', 30))
        start_date = datetime.now() - timedelta(days=days)
        
        charges = stripe.Charge.list(
            limit=100,
            created={'gte': int(start_date.timestamp())}
        )
        
        total_revenue = sum(charge.amount for charge in charges.data if charge.paid) / 100
        successful_charges = sum(1 for charge in charges.data if charge.paid)
        
        # Calculate daily revenue
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_revenue = sum(
            charge.amount for charge in charges.data 
            if charge.paid and datetime.fromtimestamp(charge.created) >= today_start
        ) / 100
        
        return jsonify({
            'total_revenue': total_revenue,
            'today_revenue': today_revenue,
            'total_transactions': successful_charges,
            'period_days': days,
            'currency': 'USD'
        })
        
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 500
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/products')
def get_products():
    """Get all active products"""
    try:
        products = stripe.Product.list(limit=100, active=True)
        
        product_list = []
        for product in products.data:
            prices = stripe.Price.list(product=product.id, active=True)
            
            product_list.append({
                'id': product.id,
                'name': product.name,
                'description': product.description or '',
                'images': product.images,
                'prices': [{
                    'id': price.id,
                    'amount': price.unit_amount / 100 if price.unit_amount else 0,
                    'currency': price.currency.upper(),
                    'type': price.type
                } for price in prices.data]
            })
        
        return jsonify({'products': product_list})
        
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/create-payment-intent', methods=['POST'])
def create_payment_intent():
    """Create a payment intent"""
    try:
        data = request.get_json()
        
        intent = stripe.PaymentIntent.create(
            amount=int(data['amount'] * 100),
            currency='usd',
            metadata={
                'product_id': data.get('product_id', ''),
                'customer_email': data.get('email', '')
            }
        )
        
        return jsonify({
            'client_secret': intent.client_secret
        })
        
    except stripe.error.StripeError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            event = stripe.Event.construct_from(
                request.get_json(), stripe.api_key
            )
        
        if event.type == 'payment_intent.succeeded':
            payment_intent = event.data.object
            print(f"✅ Payment succeeded: {payment_intent.id}")
            
        elif event.type == 'payment_intent.payment_failed':
            payment_intent = event.data.object
            print(f"❌ Payment failed: {payment_intent.id}")
            
        return jsonify({'status': 'success'})
        
    except Exception as e:
        print(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🌐 Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
