from fpdf import FPDF
import datetime
import os

# LOUSTA CORP | INVOICE ENGINE v1.0
# ABN: 54 492 524 823

def generate_invoice(client_name, license_type, amount_aud):
    pdf = FPDF()
    pdf.add_page()
    
    # 1. Header
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "TAX INVOICE", ln=True, align="C")
    
    # 2. Company Info
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 5, "LOUSTA CORPORATION", ln=True)
    pdf.cell(0, 5, "ABN: 54 492 524 823", ln=True)
    pdf.cell(0, 5, "Highton, Victoria, Australia", ln=True)
    pdf.ln(10)
    
    # 3. Client & Date Info
    pdf.cell(0, 5, f"Date: {datetime.date.today().strftime('%d %b %Y')}", ln=True)
    pdf.cell(0, 5, f"Bill To: {client_name}", ln=True)
    pdf.ln(10)
    
    # 4. Item Table
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(140, 10, "Description", border=1)
    pdf.cell(40, 10, "Amount (AUD)", border=1, ln=True)
    
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(140, 10, f"Industrial Intelligence License: {license_type}", border=1)
    pdf.cell(40, 10, f"${amount_aud:,.2f}", border=1, ln=True)
    
    # 5. Total
    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(140, 10, "TOTAL DUE", align="R")
    pdf.cell(40, 10, f"${amount_aud:,.2f}", ln=True)
    
    # 6. Payment Instructions
    pdf.ln(20)
    pdf.set_font("Helvetica", "I", 10)
    pdf.multi_cell(0, 5, "Payment via Stripe or Direct Bank Transfer. \nThank you for your business.")
    
    # Save to Output
    safe_name = client_name.replace(" ", "_")
    filename = f"Invoice_{safe_name}_{datetime.date.today().isoformat()}.pdf"
    path = os.path.expanduser(f"~/lousta/output/{filename}")
    pdf.output(path)
    return path

if __name__ == "__main__":
    # Test generation
    path = generate_invoice("Test Manufacturing Ltd", "Enterprise 50-Title Pack", 1500.00)
    print(f"✅ Tax Invoice manufactured at: {path}")
