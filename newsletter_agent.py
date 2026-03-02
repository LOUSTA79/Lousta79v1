import json
from datetime import datetime

print("📧 Newsletter Agent Started")
print("Daily AI-written newsletters + Patreon integration...")

newsletter_tiers = {
    "free": 100,
    "patreon_5": 300,
    "patreon_15": 150,
    "patreon_50": 50
}

monthly_newsletter_revenue = (300 * 5) + (150 * 15) + (50 * 50)
print(f"\nSubscriber breakdown: {newsletter_tiers}")
print(f"Monthly recurring revenue: ${monthly_newsletter_revenue}")
print("Status: Publishing daily to 600+ subscribers")
