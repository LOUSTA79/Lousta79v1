import smtplib
from email.message import EmailMessage
import os

# LOUSTA CORP | MEMBER WELCOME v1.0
# ABN: 54 492 524 823

GMAIL_USER = "lousta79@gmail.com"
GMAIL_PASS = os.getenv("GMAIL_APP_PASSWORD") # Requires a Google App Password

def send_welcome_package(customer_email, customer_name):
    print(f"📧 Sending Welcome Package to {customer_name}...")
    
    msg = EmailMessage()
    msg['Subject'] = f"Welcome to Lousta Specialists, {customer_name}!"
    msg['From'] = GMAIL_USER
    msg['To'] = customer_email
    
    msg.set_content(f"""
    Hi {customer_name},

    Welcome to the inner circle of Lousta Corporation. 
    Your subscription to the Sovereign Library is now active.

    Attached is your exclusive 'Industrial Intelligence Report' for 2026.
    Log in at lasaispecialists.com to access the full Audiobooks and Ebooks.

    Regards,
    Lou | Lousta Corporation (ABN: 54 492 524 823)
    """)

    # Attach the latest Industrial Intelligence PDF
    pdf_path = os.path.expanduser("~/lousta/output/Industrial_Intelligence_Report.pdf")
    if os.path.exists(pdf_path):
        with open(pdf_path, 'rb') as f:
            msg.add_attachment(f.read(), maintype='application', subtype='pdf', filename="Industrial_Intelligence.pdf")

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(GMAIL_USER, GMAIL_PASS)
        smtp.send_message(msg)
    print("✅ Welcome Email Sent.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        send_welcome_package(sys.argv[1], sys.argv[2])
