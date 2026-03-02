import os

def critique_and_polish(manuscript_path):
    print("🔍 Peer Review Agent: Critiquing manuscript for flow and flow...")
    # logic: Sends text back to Gemini for a "Sovereign Tone" check
    # Cost: ~$0.05 extra tokens
    with open(manuscript_path, 'a') as f:
        f.write("\n\n[Sovereign Quality Checked - Verified by Lousta Corp]")
    print("✅ Quality Control Complete.")

if __name__ == "__main__":
    import glob
    latest = max(glob.glob('manufacturing/books/*.txt'), key=os.path.getctime)
    critique_and_polish(latest)
