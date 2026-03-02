import stripe
import os
import glob

# LOUSTA CORP | STRIPE SYNC v1.0
# ABN: 54 492 524 823

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def sync_library_to_stripe():
    print("💳 Stripe Sync: Registering Industrial Assets...")
    
    # Path to your English masterpieces
    book_source = os.path.expanduser('~/lousta/manufacturing/books/*.txt')
    books = [os.path.basename(b).replace('.txt', '') for b in glob.glob(book_source)]

    for book in books:
        display_name = book.replace('_', ' ')
        
        try:
            # 1. Create the Product
            product = stripe.Product.create(
                name=display_name,
                description=f"Industrial Intelligence Asset: {display_name}. Includes Multi-language Ebook and Audiobook.",
                statement_descriptor="LOUSTA SPECIALISTS",
                metadata={"abn": "54492524823", "internal_id": book}
            )

            # 2. Create the Price (Membership Tier)
            stripe.Price.create(
                unit_amount=2999, # $29.99 AUD
                currency="aud",
                recurring={"interval": "month"},
                product=product.id,
            )
            print(f"✅ Synced: {display_name}")
            
        except Exception as e:
            print(f"⚠️ Error syncing {display_name}: {e}")

if __name__ == "__main__":
    sync_library_to_stripe()
