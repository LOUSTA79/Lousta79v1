import os
import json
import glob

# LOUSTA CORP | METADATA FLOOD v1.0
# ABN: 54 492 524 823

class DistributionFlood:
    def __init__(self):
        self.base = os.path.expanduser("~/lousta/manufacturing")
        self.out = os.path.expanduser("~/lousta/output/distribution_packets")
        os.makedirs(self.out, exist_ok=True)

    def generate_metadata(self):
        # Scan for all manufactured assets
        books = glob.glob(f"{self.base}/books/*.txt")
        
        for book in books:
            title = os.path.basename(book).replace(".txt", "").replace("_", " ").title()
            packet = {
                "brand": "Lousta Corp",
                "abn": "54 492 524 823",
                "title": f"Industrial Mastery: {title}",
                "description": f"A comprehensive guide to {title} for Industry 4.0 professionals.",
                "keywords": ["Manufacturing", "AI", "OEE", "Industrial Automation", "B2B Training"],
                "pricing": {"KDP_US": 39.99, "KDP_AU": 54.95, "Spotify_Premium": "Ad-Revenue-Enabled"},
                "language_variants": ["EN", "HI", "JA", "ES"]
            }
            
            # Save the metadata packet
            packet_name = os.path.basename(book).replace(".txt", "_metadata.json")
            with open(f"{self.out}/{packet_name}", "w") as f:
                json.dump(packet, f, indent=4)
        
        print(f"🚀 Metadata Flood Complete: {len(books)} Distribution Packets Manufactured.")

if __name__ == "__main__":
    flood = DistributionFlood()
    flood.generate_metadata()
