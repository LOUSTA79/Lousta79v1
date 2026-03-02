import os
import glob

# LOUSTA CORP | Launch Promotion Config
PROMO_CODE = "LOUSTA2026"
OFFER = "20% OFF FIRST MONTH"
URL = "lasaispecialists.com"

def generate_viral_shorts_logic(book_path):
    book_name = os.path.basename(book_path).replace(".txt", "").replace("_", " ")
    print(f"🎬 Creating Promo Short for: {book_name}")
    
    # Logic: Generates 3 viral hooks + a Promotional Call to Action (CTA)
    content = f"""
    --- VIRAL SHORT METADATA: {book_name} ---
    HOOK 1: "The industry doesn't want you to know this OEE secret..."
    HOOK 2: "Stop losing $1M in production downtime."
    HOOK 3: "How Lousta Corp is rewriting the rules of {book_name}."
    
    [ON-SCREEN OVERLAY]: {OFFER}
    [ON-SCREEN OVERLAY]: CODE: {PROMO_CODE}
    [LINK IN BIO]: {URL}
    
    #Hashtags: #Manufacturing #AI2026 #LoustaCorp #SovereignTech
    """
    
    output_path = book_path.replace("books", "syndication").replace(".txt", "_SHORT_PROMO.txt")
    with open(output_path, 'w') as f:
        f.write(content)
    print(f"✅ Promo Short Staged: {output_path}")

if __name__ == "__main__":
    books = glob.glob(os.path.expanduser('~/lousta/manufacturing/books/*.txt'))
    for book in books:
        generate_viral_shorts_logic(book)
