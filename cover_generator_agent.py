import os
import glob

# LOUSTA CORP | COVER SWARM v1.0
# ABN: 54 492 524 823

def generate_industrial_covers():
    book_files = glob.glob(os.path.expanduser("~/lousta/manufacturing/books/*.txt"))
    
    for path in book_files:
        title = os.path.basename(path).replace(".txt", "").replace("_", " ")
        print(f"🎨 Designing Cover: {title}")
        
        # PROMPT LOGIC: High-contrast, Industrial, Professional
        prompt = f"""
        Professional book cover for '{title}'. 
        Style: Modern Industrial, clean typography, high-contrast. 
        Theme: Supply chain, AI, automation, logistics. 
        Colors: Deep Navy, Industrial Orange, and Steel Gray. 
        No faces. Focus on abstract machinery or digital networks. 
        Format: 6x9 aspect ratio, high resolution.
        """
        
        # This uses your internal image_generation tool
        # In this script context, it outputs the command to trigger the tool
        print(f"TRIGGER_IMAGE_GEN: {prompt}")

if __name__ == "__main__":
    generate_industrial_covers()
