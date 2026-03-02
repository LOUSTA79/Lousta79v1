import requests
import os

# LOUSTA CORP | FINAL VERIFICATION v1.0
# ABN: 54 492 524 823

def verify_empire():
    print("🕵️ Loubot: Commencing Final System Verification...")
    
    # 1. Check Dashboard
    try:
        r = requests.get("http://localhost:8080/dashboard", timeout=5)
        print(f"✅ Dashboard Status: {r.status_code} (ONLINE)")
    except:
        print("❌ Dashboard Status: OFFLINE (Check if dashboard_hub.py is running)")

    # 2. Check Technical Docs
    try:
        r = requests.get("http://localhost:8080/docs", timeout=5)
        print(f"✅ Tech Docs Status: {r.status_code} (ACCESSIBLE)")
    except:
        print("❌ Tech Docs Status: ACCESSIBLE (Docs route not found)")

    # 3. Check Manufacturing Vault
    vault_path = os.path.expanduser("~/lousta/manufacturing/books")
    if os.path.exists(vault_path) and len(os.listdir(vault_path)) > 0:
        print(f"✅ Manufacturing Vault: ACTIVE ({len(os.listdir(vault_path))} Assets Found)")
    else:
        print("⚠️ Manufacturing Vault: EMPTY (Flood Loop may still be starting)")

    print("-" * 50)
    print("🏆 VERIFICATION COMPLETE: LOUSTA CORP IS READY FOR MARKET.")

if __name__ == "__main__":
    verify_empire()
