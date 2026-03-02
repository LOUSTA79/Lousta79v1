import os
import subprocess
import requests

# LOUSTA CORP | MOBILE ALERTS v1.0
# ABN: 54 492 524 823

def send_android_notification(title, content):
    """Sends a native Android push notification via Termux"""
    try:
        subprocess.run([
            "termux-notification",
            "--title", title,
            "--content", content,
            "--id", "lousta_alert",
            "--priority", "high",
            "--led-color", "ff6600"
        ])
    except Exception as e:
        print(f"Notification Error: {e}")

def notify_sale(amount, country):
    """Specific alert for a successful sale"""
    title = "💰 LOUSTA CORP: NEW SALE"
    content = f"Payment Received: ${amount} AUD from {country}"
    send_android_notification(title, content)

def notify_production_milestone(book_title):
    """Alert when a new asset is shelf-ready"""
    title = "🚀 PRODUCTION COMPLETE"
    content = f"'{book_title}' is now live in 4 languages."
    send_android_notification(title, content)

if __name__ == "__main__":
    # Test Notification
    send_android_notification("LOUSTA OS", "Mobile Alert Agent is now ONLINE.")
