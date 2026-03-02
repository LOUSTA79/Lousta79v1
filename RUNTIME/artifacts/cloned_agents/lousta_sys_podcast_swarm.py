import os
import glob

def generate_podcast_script(manuscript_path):
    print(f"🎙️ Swarm Agent: Converting {manuscript_path} to Audio Script...")
    
    with open(manuscript_path, 'r') as f:
        content = f.read()

    # Logic: Formats for a 5-minute punchy "Business & Tech" episode
    script = f"""
    [INTRO MUSIC: RECOVERY BEAT]
    HOST: Welcome back to the Sovereign Brief. I'm your host, and today we're talking about 'The Phoenix Protocol'.
    
    [SEGMENT 1: THE CRASH]
    HOST: Every empire faces a reboot. We just went through one. But the logic didn't break. 
    The Vault stayed shut. The ABN (54 492 524 823) stayed active.
    
    [SEGMENT 2: THE RESTORATION]
    HOST: Here's how we used the S25 Ultra to manufacturing a recovery plan in under 10 minutes...
    
    [OUTRO]
    HOST: Read the full protocol at lasaispecialists.com. Stay sovereign.
    """
    
    output_path = manuscript_path.replace(".txt", "_PODCAST.txt").replace("books", "syndication")
    with open(output_path, 'w') as f:
        f.write(script)
    print(f"✅ Podcast Script Staged: {output_path}")

if __name__ == "__main__":
    latest_book = max(glob.glob('manufacturing/books/*.txt'), key=os.path.getctime)
    generate_podcast_script(latest_book)
