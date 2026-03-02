# LOUSTA CORP | REVENUE STRATEGY v1.0
# ABN: 54 492 524 823

pricing_model = {
    "AU": {"price": 49.99, "currency": "AUD", "tier": "Premium"},
    "US": {"price": 39.99, "currency": "USD", "tier": "Premium"},
    "IN": {"price": 499.00, "currency": "INR", "tier": "Volume"},
    "JP": {"price": 5500.0, "currency": "JPY", "tier": "Premium"}
}

def apply_pricing():
    for market, data in pricing_model.items():
        print(f"💰 Market {market}: Setting {data['tier']} Price at {data['price']} {data['currency']}")

if __name__ == "__main__":
    apply_pricing()
