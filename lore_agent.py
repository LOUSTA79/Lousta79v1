import json
import os

LORE_FILE = "lore_vault.json"

def store_lore(name, description):
    lore = {}
    if os.path.exists(LORE_FILE):
        with open(LORE_FILE, "r") as f:
            lore = json.load(f)
    lore[name] = description
    with open(LORE_FILE, "w") as f:
        json.dump(lore, f)
    print(f"📖 Lore saved for {name}")

def get_lore(name):
    if os.path.exists(LORE_FILE):
        with open(LORE_FILE, "r") as f:
            lore = json.load(f)
            return lore.get(name, "No lore found.")
    return "Vault empty."
