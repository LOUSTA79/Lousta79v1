from fpdf import FPDF
from datetime import datetime
import glob
import os

# LOUSTA CORP | ABN 54 492 524 823
# IP Asset Valuation & Invoice Agent

class Invoice(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'LOUSTA CORPORATION | TAX INVOICE', 0, 1, 'C')
        self.set_font('Arial', '', 10)
        self.cell(0, 10, 'ABN: 54 492 524 823', 0, 1, 'C')
        self.ln(10)

def generate_ip_invoice():
    books = glob.glob(os.path.expanduser('~/lousta/manufacturing/books/*.txt'))
    count = len(books)
    date_str = datetime.now().strftime("%Y-%m-%d")
    
    pdf = Invoice()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)
    
    pdf.cell(0, 10, f"Date: {date_str}", 0, 1)
    pdf.cell(0, 10, f"Invoice #: LC-{datetime.now().strftime('%Y%H%M')}", 0, 1)
    pdf.ln(10)
    
    pdf.cell(100, 10, 'Description', 1)
    pdf.cell(40, 10, 'Quantity', 1)
    pdf.cell(40, 10, 'R&D Cost (AUD)', 1)
    pdf.ln()
    
    pdf.cell(100, 10, 'AI-Generated Intellectual Property (Books)', 1)
    pdf.cell(40, 10, str(count), 1)
    pdf.cell(40, 10, f"${count * 0.85:.2f}", 1)
    pdf.ln(20)
    
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, f"Total R&D Asset Value: ${count * 0.85:.2f} AUD", 0, 1)
    
    output_path = f"/data/data/com.termux/files/home/lousta/output/Invoice_{date_str}.pdf"
    pdf.output(output_path)
    print(f"✅ Tax Invoice Generated: {output_path}")

if __name__ == "__main__":
    generate_ip_invoice()
