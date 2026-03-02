import sys

def generate_thread(manuscript_path):
    with open(manuscript_path, 'r') as f:
        text = f.read()[:2000] # Samples the start
    
    print("🐦 Generating 10-post viral thread for X...")
    # Simulation of Gemini Flash logic to summarize into 280-char bites
    thread = [f"🧵 NEW RELEASE: {manuscript_path}", "1/10 The world of AI is changing...", "10/10 Get it now at lasaispecialists.com"]
    
    with open(manuscript_path.replace(".txt", "_X_THREAD.txt"), "w") as f:
        f.write("\n\n".join(thread))
    print("✅ X Thread saved.")

if __name__ == "__main__":
    generate_thread(sys.argv[1])
