from pathlib import Path

class AffiliateSwarm:
    def __init__(self):
        self.pack_path = Path.home() / ".lousta_system_core" / "output" / "affiliate_packs"
        self.pack_path.mkdir(parents=True, exist_ok=True)

    def generate_recruitment_kit(self, affiliate_id: str):
        kit_content = f"""LOUSTA CORP PARTNER PROGRAM
Affiliate ID: {affiliate_id}
Product: Industrial Mastery Vault
Commission: 20% per Sale
Your Unique Link: http://localhost:8080/partner/{affiliate_id}
"""
        (self.pack_path / f"kit_{affiliate_id}.txt").write_text(kit_content)
        print(f"🐝 Affiliate Kit {affiliate_id} manufactured.")

if __name__ == "__main__":
    swarm = AffiliateSwarm()
    for i in range(1, 11):
        swarm.generate_recruitment_kit(f"ENG_{i:03}")
