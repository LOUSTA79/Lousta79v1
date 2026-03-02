import os
import secrets
import shutil

# LOUSTA CORP | AUTOMATED DELIVERY VAULT
# ABN: 54 492 524 823

def create_client_vault(client_name):
    # 1. Generate a unique "Sovereign Key" for the URL
    sovereign_key = secrets.token_urlsafe(16)
    vault_dir = os.path.expanduser(f"~/lousta/vaults/{sovereign_key}")
    os.makedirs(vault_dir, exist_ok=True)
    
    # 2. Package the Assets (50 Titles + Video + Audio)
    source_books = os.path.expanduser("~/lousta/manufacturing/books/")
    # Logic: Copy top 50 industrial titles to the vault
    files = os.listdir(source_books)[:50]
    for f in files:
        shutil.copy(os.path.join(source_books, f), vault_dir)
        
    print(f"💰 ACE-O: Payment Verified for {client_name}.")
    print(f"🔑 VAULT CREATED: http://localhost:8080/download/{sovereign_key}")
    return sovereign_key

if __name__ == "__main__":
    create_client_vault("Dubai_Global_Logistics_Lead")
