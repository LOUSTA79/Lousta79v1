import stripe
import os
import sys

# Load your live key
stripe.api_key = 'REDACTED_STRIPE_KEY_YOUR_FULL_KEY_HERE'

def trigger_payout(amount_aud):
    amount_cents = int(amount_aud * 100)
    try:
        # 1. Check available balance first
        balance = stripe.Balance.retrieve()
        available = balance.available[0].amount
        
        if available < amount_cents:
            print(f"❌ Insufficient Funds: Available ${available/100} AUD. Need ${amount_aud} AUD.")
            return

        # 2. Initiate the Payout to your default Macquarie Bank account
        payout = stripe.Payout.create(
            amount=amount_cents,
            currency='aud',
            statement_descriptor='LA-NEXUS PROFIT',
        )
        print(f"✅ SUCCESS: ${amount_aud} Payout initiated! ID: {payout.id}")
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

if __name__ == "__main__":
    trigger_payout(5000)
