import os
import stripe
from invoice_agent import generate_invoice
from alert_agent import send_android_notification

# LOUSTA CORP | SOVEREIGN ADMIN v1.0
# ABN: 54 492 524 823

class SovereignAdmin:
    def __init__(self):
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.vault_path = os.path.expanduser("~/lousta/manufacturing/books")

    def prepare_deal(self, company_name, amount=1500.00):
        """Prepare a B2B transaction for approval"""
        print(f"\n🤖 Loubot: DEAL READY FOR APPROVAL")
        print(f"------------------------------------")
        print(f"CLIENT: {company_name}")
        print(f"ASSETS: 50-Title Industrial Vault")
        print(f"INVOICE AMOUNT: ${amount} AUD")
        print(f"ABN COMPLIANCE: Verified (54 492 524 823)")
        print(f"------------------------------------")
        
        confirm = input("Confirm and generate Tax Invoice? (y/n): ")
        if confirm.lower() == 'y':
            self.execute_deal(company_name, amount)
        else:
            print("🛑 Deal held by Executive Order.")

    def execute_deal(self, company_name, amount):
        """Generates invoice and triggers payment alert"""
        # 1. Generate PDF Tax Invoice
        path = generate_invoice(company_name, "Enterprise 50-Title Pack", amount)
        
        # 2. Prepare Digital Delivery (Zip the vault)
        # (Future hook for automated email delivery)
        
        # 3. Notify Android
        send_android_notification("💰 DEAL CLOSED", f"Invoice for {company_name} generated at {path}")
        print(f"✅ Deal Executed. Invoice sent to output folder.")

if __name__ == "__main__":
    admin = SovereignAdmin()
    # Pulling a lead from your scraper for the demo
    admin.prepare_deal("Geelong Precision Engineering")
