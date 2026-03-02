import os
from fpdf import FPDF

# LOUSTA CORP | WHITE PAPER ENGINE v1.0
# ABN: 54 492 524 823

class WhitePaperAgent:
    def __init__(self):
        self.output_dir = os.path.expanduser("~/lousta/output/whitepapers")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_whitepaper(self, title, core_tech):
        pdf = FPDF()
        pdf.add_page()
        
        # 1. Corporate Header
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(37, 99, 235) # Lousta Blue
        pdf.cell(0, 20, "LOUSTA CORP", ln=True, align="L")
        
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(100, 116, 139) # Gray
        pdf.cell(0, 10, "INDUSTRIAL INTELLIGENCE BRIEFING 2026", ln=True)
        pdf.ln(20)
        
        # 2. Title
        pdf.set_font("Helvetica", "B", 18)
        pdf.set_text_color(31, 41, 55) # Dark
        pdf.multi_cell(0, 10, f"Technical Strategy: {title}")
        pdf.ln(10)
        
        # 3. Content Body
        pdf.set_font("Helvetica", "", 11)
        pdf.set_text_color(0, 0, 0)
        content = (
            f"This executive briefing outlines the deployment of {core_tech} "
            "within the Industry 4.0 framework. Under ABN 54 492 524 823, Lousta Corp "
            "provides the requisite IP for cross-border industrial scaling."
        )
        pdf.multi_cell(0, 7, content)
        pdf.ln(10)
        
        # 4. Authority Footer
        pdf.set_font("Helvetica", "I", 8)
        pdf.cell(0, 10, "Confidential | (c) 2026 Lousta Corporation | Highton, VIC", align="C")
        
        filename = f"WhitePaper_{title.replace(' ', '_')}.pdf"
        path = os.path.join(self.output_dir, filename)
        pdf.output(path)
        print(f"📄 White Paper manufactured: {path}")

if __name__ == "__main__":
    agent = WhitePaperAgent()
    agent.generate_whitepaper("Agentic Process Control", "AI-Driven OEE Optimization")
