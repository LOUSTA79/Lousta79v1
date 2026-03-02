import os
import datetime

# LOUSTA CORP | PRODUCTION SWARM v5.1 (Heartbeat Edition)
BOOKS_DIR = os.path.expanduser("~/lousta/manufacturing/books")
LOG_FILE = os.path.expanduser("~/lousta/logs/production.log")

os.makedirs(BOOKS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

def manufacture_book(title):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    filename = title.replace(" ", "_").replace(":", "") + ".txt"
    filepath = os.path.join(BOOKS_DIR, filename)
    
    # Simulate content generation for the heartbeat test
    content = f"Title: {title}\nGenerated on: {timestamp}\nABN: 54 492 524 823\n\nContent body..."
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    # --- THE HEARTBEAT ---
    print(f"💓 [HEARTBEAT] {timestamp} | SUCCESS: '{title}' saved to {filepath}")
    
    with open(LOG_FILE, 'a') as log:
        log.write(f"{timestamp} - CREATED: {filename}\n")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        manufacture_book(sys.argv[1])
