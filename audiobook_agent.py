import os
import glob
from gtts import gTTS

AUDIO_DIR = os.path.expanduser("~/lousta/manufacturing/audiobooks")
BOOKS_DIR = os.path.expanduser("~/lousta/manufacturing/books")
os.makedirs(AUDIO_DIR, exist_ok=True)

def generate_audio(filepath):
    filename = os.path.basename(filepath)
    with open(filepath, 'r') as f:
        text = f.read()

    lang = 'en'
    tld = 'com.au' 
    
    print(f"🎙️ Narrating {filename}...")
    tts = gTTS(text=text[:5000], lang=lang, tld=tld, slow=False)
    output_file = filename.replace(".txt", ".mp3")
    tts.save(os.path.join(AUDIO_DIR, output_file))
    print(f"✅ Ready: {output_file}")

if __name__ == "__main__":
    # Look for the 5 most recent text files
    files = sorted(glob.glob(os.path.join(BOOKS_DIR, "*.txt")), key=os.path.getmtime, reverse=True)
    for i, target_file in enumerate(files[:5]):
        print(f"🔄 Processing Book {i+1}/5")
        generate_audio(target_file)
