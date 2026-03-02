import os
import glob
import csv

# LOUSTA CORP | METADATA PACKAGER v1.0
# ABN: 54 492 524 823

BOOKS_DIR = os.path.expanduser("~/lousta/manufacturing/books")
OUTPUT_DIR = os.path.expanduser("~/lousta/output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_metadata():
    book_files = glob.glob(f"{BOOKS_DIR}/*.txt")
    
    # Headers for Google Play Partner Center (2026 Format)
    google_headers = ["Title", "Subtitle", "Description", "Identifier (ISBN/GGKEY)", "Language", "Price (AUD)", "Author", "Genre"]
    
    # Headers for Amazon KDP Reference
    amazon_headers = ["Title", "Subtitle", "Description", "Keywords", "Categories", "Primary Marketplace"]

    google_data = []
    amazon_data = []

    for path in book_files:
        filename = os.path.basename(path).replace(".txt", "")
        title = filename.replace("_", " ")
        
        # Pull description (first 300 chars of the book)
        with open(path, 'r') as f:
            desc = f.read(300).replace("\n", " ") + "..."

        google_data.append([title, "Industrial Intelligence Series", desc, "", "English", "29.99", "Lousta Corp", "BUSINESS & ECONOMICS / Industrial Management"])
        amazon_data.append([title, "The Sovereign Industrialist Collection", desc, "OEE, Industrial AI, Logistics, Supply Chain", "Non-fiction > Business", "Amazon.com.au"])

    # Write Google CSV
    with open(f"{OUTPUT_DIR}/Google_Play_Bulk.csv", 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(google_headers)
        writer.writerows(google_data)

    # Write Amazon CSV
    with open(f"{OUTPUT_DIR}/Amazon_KDP_Reference.csv", 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(amazon_headers)
        writer.writerows(amazon_data)

    print(f"✅ Metadata Bundles ready in {OUTPUT_DIR}")

if __name__ == "__main__":
    generate_metadata()
