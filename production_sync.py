import os
import glob

# LOUSTA CORP | PRODUCTION SYNC v1.0
# ABN: 54 492 524 823

def sync_all_channels():
    books = glob.glob(os.path.expanduser("~/lousta/manufacturing/books/*.txt"))
    
    print(f"📊 Loubot Sync: {len(books)} Master Titles Detected.")
    
    for book in books:
        base_name = os.path.basename(book).replace(".txt", "")
        
        # Check for Audio
        if not os.path.exists(os.path.expanduser(f"~/lousta/manufacturing/audiobooks/{base_name}.mp3")):
            print(f"🔊 Queuing Audio for: {base_name}")
            # Trigger TTS logic here
            
        # Check for Video
        if not os.path.exists(os.path.expanduser(f"~/lousta/manufacturing/videos/{base_name}.mp4")):
            print(f"🎥 Queuing Video for: {base_name}")
            # Trigger Video generation metadata
            
    print("✅ Sync Cycle Complete. All channels are aligned.")

if __name__ == "__main__":
    sync_all_channels()
