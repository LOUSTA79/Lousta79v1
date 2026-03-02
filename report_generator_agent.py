from fpdf import FPDF
import datetime
import os

# LOUSTA CORP | REPORT GENERATOR v1.0
# ABN: 54 492 524 823

class IndustrialReport(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 12)
        self.set_text_color(0, 102, 204)
        self.cell(0, 10, "LOUSTA CORPORATION | INDUSTRIAL INTELLIGENCE", ln=True, align="L")
        self.set_draw_color(0, 102, 204)
        self.line(10, 20, 200, 20)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"ABN: 54 492 524 823 | Confidential | Page {self.page_no()}", align="C")

def generate_monthly_report():
    pdf = IndustrialReport()
    pdf.add_page()
    
    # Title Section
    pdf.set_font("helvetica", "B", 24)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(0, 20, "Batch 02: Logistics Intelligence", ln=True)
    
    # Date & Meta
    pdf.set_font("helvetica", "", 10)
    date_str = datetime.datetime.now().strftime("%B %Y")
    pdf.cell(0, 10, f"Issued: {date_str} | Priority: High", ln=True)
    pdf.ln(10)
    
    # Executive Summary
    pdf.set_font("helvetica", "B", 14)
    pdf.cell(0, 10, "Executive Summary", ln=True)
    pdf.set_font("helvetica", "", 11)
    summary = (
        "This intelligence report marks the completion of the Batch 02 Supply Chain cycle. "
        "We have successfully deployed AI-driven protocols for Autonomous Freight and Port "
        "Efficiency. These assets are now live and narrated in three primary languages: "
        "English, Spanish, and Japanese."
    )
    pdf.multi_cell(0, 7, summary)
    pdf.ln(5)

    # Asset Table
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(0, 10, "New Assets Added to Library:", ln=True)
    pdf.set_font("helvetica", "", 10)
    assets = [
        "- Autonomous Freight Protocols (EN/ES/JA)",
        "- Last-Mile AI Optimization (EN/ES/JA)",
        "- Global Port Efficiency Systems (EN/ES/JA)",
        "- The OEE Advantage: Technical Appendix v1"
    ]
    for asset in assets:
        pdf.cell(0, 7, asset, ln=True)

    output_path = os.path.expanduser("~/lousta/output/Industrial_Intelligence_Report.pdf")
    pdf.output(output_path)
    print(f"✅ Intelligence Report Generated: {output_path}")

if __name__ == "__main__":
    generate_monthly_report()
