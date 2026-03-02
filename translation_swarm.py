import os
from deep_translator import GoogleTranslator

# LOUSTA CORP | GLOBAL REACH v1.0
SOURCE_DIR = os.path.expanduser("~/lousta/manufacturing/books")
TRANS_DIR = os.path.expanduser("~/lousta/manufacturing/translations")
os.makedirs(TRANS_DIR, exist_ok=True)

def translate_book(filename):
    path = os.path.join(SOURCE_DIR, filename)
    with open(path, 'r') as f:
        text = f.read()

    languages = {'es': 'Spanish', 'ja': 'Japanese', 'hi': 'Hindi'}
    
    for lang_code, lang_name in languages.items():
        print(f"🌍 Translating to {lang_name}...")
        # Deep Translator handles large chunks well
        translated = GoogleTranslator(source='auto', target=lang_code).translate(text[:4500]) 
        
        output_file = filename.replace(".txt", f"_{lang_code}.txt")
        with open(os.path.join(TRANS_DIR, output_file), 'w') as f:
            f.write(translated)
        print(f"✅ Success: {output_file} saved.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        translate_book(sys.argv[1])
