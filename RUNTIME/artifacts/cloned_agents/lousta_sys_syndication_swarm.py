import os

def syndicate_content(title):
    print(f"📡 Syndicating: {title} across all channels...")
    
    channels = {
        "LinkedIn": f"Thrilled to announce the launch of {title} at Lousta Corp. #AI #Innovation",
        "Spotify_Podcast": f"Intro: Welcome to the Sovereign Brief. Today, we dive into {title}...",
        "Amazon_SEO": f"Keywords: {title}, Lousta Books, 2026 Tech, Passive Income"
    }
    
    for channel, content in channels.items():
        with open(f"manufacturing/syndication/{channel}_{title.replace(' ', '_')}.txt", "w") as f:
            f.write(content)
    
    print(f"✅ Syndication complete for {title}")

if __name__ == "__main__":
    import sys
    syndicate_content(sys.argv[1] if len(sys.argv) > 1 else "The Reality Log")
