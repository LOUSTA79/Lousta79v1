import os
import glob
import datetime
from invoice_agent import generate_invoice

# LOUSTA CORP | LOUBOT EXECUTIVE ASSISTANT v1.0
# ABN: 54 492 524 823

class Loubot:
    def __init__(self):
        self.root = os.path.expanduser("~/lousta")
        self.stats = {}

    def get_system_health(self):
        """Scans all departments for health and volume"""
        self.stats['books'] = len(glob.glob(f"{self.root}/manufacturing/books/*.txt"))
        self.stats['audio'] = len(glob.glob(f"{self.root}/manufacturing/audiobooks/*.mp3"))
        self.stats['translations'] = len(glob.glob(f"{self.root}/manufacturing/translations/*.txt"))
        self.stats['invoices'] = len(glob.glob(f"{self.root}/output/Invoice_*.pdf"))
        
        print(f"🤖 Loubot: Status Report for {datetime.date.today().strftime('%B %Y')}")
        print(f"--------------------------------------------------")
        print(f"📦 ASSET VAULT: {self.stats['books']} Titles ({self.stats['translations']} Translated)")
        print(f"🔊 AUDIO VAULT: {self.stats['audio']} Master Recordings")
        print(f"📄 B2B ACTIVITY: {self.stats['invoices']} Invoices Generated")
        print(f"--------------------------------------------------")

    def generate_monthly_summary(self):
        """Compiles a Monthly Executive Summary PDF"""
        summary_title = f"Monthly_Executive_Summary_{datetime.date.today().strftime('%m_%Y')}"
        # We reuse the invoice engine logic to create a summary PDF
        path = generate_invoice("Lousta Corp Internal", f"Monthly Performance ({self.stats['books']} Assets)", 0.00)
        os.rename(path, path.replace("Invoice", "Executive_Summary"))
        print(f"✅ Loubot: Monthly Executive Summary manufactured.")

if __name__ == "__main__":
    bot = Loubot()
    bot.get_system_health()
    # If today is the 1st of the month, generate summary
    if datetime.date.today().day == 19: # Set to 19 for your current test day
        bot.generate_monthly_summary()
