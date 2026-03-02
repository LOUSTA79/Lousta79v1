import os
import glob

# LOUSTA CORP | UE5 Movie Engine v1.0
# Mapping Storyboards to 3D Assets

FAB_BASE_URL = "https://www.fab.com/search?q="

def link_assets(storyboard_path):
    print(f"🎬 Linking 3D Assets for: {storyboard_path}")
    
    # Common Industrial/Science Themes for Lousta Corp
    themes = {
        "Food Production": "Industrial+Food+Factory+Modular",
        "Giza": "Ancient+Egypt+Pyramid+Interior",
        "AI/Cyber": "Futuristic+Server+Room+Cyberpunk",
        "Reality": "Quantum+Laboratory+Environment"
    }

    links = []
    with open(storyboard_path, 'r') as f:
        content = f.read()
        for theme, query in themes.items():
            if theme in content:
                links.append(f"🔗 Recommended Assets for {theme}: {FAB_BASE_URL}{query}")

    output_path = storyboard_path.replace(".md", "_ASSETS.txt")
    with open(output_path, 'w') as f:
        f.write("\n".join(links))
    print(f"✅ Asset Links Generated: {output_path}")

if __name__ == "__main__":
    storyboards = glob.glob(os.path.expanduser('~/lousta/manufacturing/movies/*.md'))
    for sb in storyboards:
        link_assets(sb)
