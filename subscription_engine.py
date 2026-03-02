import stripe
import os

# --- LOUSTA CORP RECURRING REVENUE ENGINE ---
# Owner: Ljupco Arsovski | ABN: 54 492 524 823
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_unlimited_plan():
    print("🚀 Initializing 'Lousta Books Unlimited' Subscription...")
    
    try:
        # 1. Create the Product
        product = stripe.Product.create(
            name="Lousta Books Unlimited",
            description="All-access pass to the Sovereign Library (12+ new books monthly)",
            metadata={"abn": "54492524823", "owner": "Ljupco Arsovski"}
        )

        # 2. Create the Monthly Price ($29.99 AUD)
        price = stripe.Price.create(
            product=product.id,
            unit_amount=2999, # $29.99 in cents
            currency="aud",
            recurring={"interval": "month"},
        )
        
        print(f"✅ Subscription Plan Active!")
        print(f"📦 Product ID: {product.id}")
        print(f"💰 Monthly Price: $29.99 AUD")
        return product.id, price.id
        
    except Exception as e:
        print(f"❌ Stripe Engine Error: {e}")
        return None, None

if __name__ == "__main__":
    create_unlimited_plan()
