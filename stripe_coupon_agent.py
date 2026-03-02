import stripe
import os

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def create_launch_coupon():
    print("🎟️ Creating Stripe Promotion: LOUSTA2026...")
    try:
        coupon = stripe.Coupon.create(
            percent_off=20,
            duration="repeating",
            duration_in_months=3,
            id="LOUSTA2026",
            name="Founder Member Launch"
        )
        print(f"✅ Coupon Created: {coupon.id}")
    except Exception as e:
        print(f"⚠️ Note: {e}")

if __name__ == "__main__":
    create_launch_coupon()
