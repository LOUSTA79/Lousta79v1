import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_giza_bundle():
    print("🏺 Packaging the Giza Trilogy Bundle...")
    
    try:
        # 1. Create the Bundle Product
        bundle = stripe.Product.create(
            name="The Giza Trilogy: Complete Collection",
            description="All 3 volumes: The Anomaly, The Awakening, and The Labyrinth.",
            metadata={"series": "Giza", "abn": "54492524823"}
        )

        # 2. Set the Bundle Price ($14.99 AUD)
        price = stripe.Price.create(
            product=bundle.id,
            unit_amount=1499,
            currency="aud"
        )
        
        print(f"✅ Bundle Live! Product ID: {bundle.id}")
        return bundle.id
        
    except Exception as e:
        print(f"❌ Bundle Error: {e}")

if __name__ == "__main__":
    create_giza_bundle()
