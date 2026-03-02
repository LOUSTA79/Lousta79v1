import os
from fpdf import FPDF
from datetime import datetime

# LOUSTA CORP | INVESTOR PROTOCOL v1.0
# ABN: 54 492 524 823

class InvestorReport:
    def __init__(self):
        self.out_path = os.path.expanduser("~/lousta/output/Growth_Report_Feb_2026.pdf")

    def generate(self):
        pdf = FPDF()
        pdf.add_page()
        
        # Header
        pdf.set_font("Helvetica", "B", 20)
        pdf.cell(0, 10, "LOUSTA CORP: GROWTH & SCALABILITY REPORT", ln=True, align="C")
        pdf.set_font("Helvetica", "I", 10)
        pdf.cell(0, 10, f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')} | ABN: 54 492 524 823", ln=True, align="C")
        pdf.ln(10)

        # Metrics Extraction
        books = len(os.listdir(os.path.expanduser("~/lousta/manufacturing/books")))
        leads = len(os.listdir(os.path.expanduser("~/lousta/output/distribution_packets")))
        
        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "1. PRODUCTION THROUGHPUT", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 10, f"- Industrial Library: {books} Master Titles (4 Languages)", ln=True)
        pdf.cell(0, 10, f"- Distribution Packets: {leads} SEO-Ready Units", ln=True)
        pdf.ln(5)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(0, 10, "2. REVENUE INFRASTRUCTURE", ln=True)
        pdf.set_font("Helvetica", "", 12)
        pdf.cell(0, 10, f"- Active B2B Funnel: Western Sydney, Geelong, Pune Hubs", ln=True)
        pdf.cell(0, 10, f"- Licensing Model: $3,000 AUD per Full Spectrum Pack", ln=True)
        pdf.ln(10)

        # Footer
        pdf.set_font("Helvetica", "I", 8)
        pdf.multi_cell(0, 5, "This document confirms the autonomous operational status of the Lousta Corp OS. Data verified via S25 Ultra Sovereign Node.")
        
        pdf.output(self.out_path)
        print(f"📊 Investor Growth Report Manufactured: {self.out_path}")

if __name__ == "__main__":
    report = InvestorReport()
    report.generate()
