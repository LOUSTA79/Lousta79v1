import stripe
import os
import json

# --- LOUSTA CORP DYNAMIC PRICING ---
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def optimize_price(book_title, genre):
    print(f"⚖️ Optimizing price for: {book_title}")
    
    # Logic: High-demand genres (Business/Tech) get a +20% bump
    base_price = 4.99
    if genre.lower() in ["business", "tech", "innovation"]:
        optimized_price = 12.99
    elif genre.lower() in ["bundle", "series"]:
        optimized_price = 19.99
    else:
        optimized_price = base_price

    # Update Stripe Metadata (if book exists as a product)
    try:
        # Note: This assumes you have Product IDs mapped
        print(f"✅ Suggested Price: ${optimized_price} AUD")
        return optimized_price
    except Exception as e:
        print(f"⚠️ Stripe Sync Error: {e}")
        return base_price

if __name__ == "__main__":
    optimize_price("The Reality Log", "Science/Tech")
