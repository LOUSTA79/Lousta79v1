#!/bin/bash

# --- 1. MANUFACTURE (The <$1.00 Build) ---
python production_swarm.py
LATEST_BOOK=$(ls -t manufacturing/books/*.txt | head -1)

if [ -f "$LATEST_BOOK" ]; then
    # --- 2. NARRATE (Free Audio via Edge-TTS) ---
    echo "🎙️ Starting Audio Production..."
    ~/bin/empire-audiobook "$LATEST_BOOK"
    
    # --- 3. SECURE (GitHub & Google Cloud) ---
    echo "☁️ Uploading to Lousta Empire Vault..."
    
    # Sync manuscripts to GitHub (LOUSTA79)
    git add manufacturing/books/*.txt
    git commit -m "Auto-publish: $(basename "$LATEST_BOOK")"
    git push origin main
    
    # Sync heavy media to Google Cloud Storage
    # Assumes your bucket is 'lousta-books-vault'
    gsutil -m cp -r manufacturing/audio/* gs://lousta-books-vault/audio/
    gsutil -m cp -r manufacturing/video/* gs://lousta-books-vault/video/

    echo "✅ Success: Asset secured in GitHub and GCS."
else
    echo "❌ Error: Manufacturing step failed."
fi
