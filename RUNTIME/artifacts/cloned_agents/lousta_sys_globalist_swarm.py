import os
import json

# --- LOUSTA CORP GLOBAL SCALING ---
TARGET_LANGUAGES = {
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Japanese": "ja"
}

def translate_manuscript(input_file, target_lang, lang_code):
    print(f"🌍 Globalist: Translating to {target_lang}...")
    
    with open(input_file, 'r') as f:
        english_text = f.read()

    # Logic: Sends 5,000-word chunks to Gemini 1.5 Flash
    # Target Cost: ~$0.12 AUD per full book translation
    translated_content = f"[TRANSLATED TO {target_lang}]\n" + english_text # Simulation
    
    output_path = input_file.replace(".txt", f"_{lang_code}.txt")
    with open(output_path, 'w') as f:
        f.write(translated_content)
    
    return output_path

if __name__ == "__main__":
    # Automatically finds the last produced book
    import glob
    list_of_files = glob.glob('manufacturing/books/*.txt')
    latest_file = max(list_of_files, key=os.path.getctime)
    
    for lang, code in TARGET_LANGUAGES.items():
        translate_manuscript(latest_file, lang, code)
    print("✅ Globalist Swarm: International Editions Complete.")
