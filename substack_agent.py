import glob
import os
from datetime import datetime

def generate_newsletter():
    today = datetime.now().strftime("%Y-%m-%d")
    print(f"📧 Drafting Substack Newsletter for {today}...")
    
    books = glob.glob('manufacturing/books/*.txt')
    latest_titles = [os.path.basename(b).replace('_', ' ').replace('.txt', '') for b in books[-5:]]
    
    newsletter_content = f"--- LOUSTA DAILY BRIEF: {today} ---\n\n"
    newsletter_content += "Today we've added 5 new titles to the Sovereign Library:\n"
    for title in latest_titles:
        newsletter_content += f"- {title}\n"
    
    newsletter_content += "\nExplore the future of reality at lasaispecialists.com"
    
    with open(f"output/newsletter_{today}.txt", "w") as f:
        f.write(newsletter_content)
    print(f"✅ Newsletter Drafted: output/newsletter_{today}.txt")

if __name__ == "__main__":
    generate_newsletter()
