#!/bin/bash
# LOUSTA CORP | GLOBAL BATCH ORCHESTRATOR v1.0
# ABN: 54 492 524 823

TITLE=$1

if [ -z "$TITLE" ]; then
    echo "❌ Error: Please provide a book title. Usage: ./launch_global_batch.sh 'Title Name'"
    exit 1
fi

echo "🚀 [1/3] MANUFACTURING: $TITLE..."
python ~/lousta/production_swarm.py "$TITLE"

# Extract filename (assuming heartbeat v5.1 naming convention)
FILENAME="${TITLE// /_}.txt"
FILENAME="${FILENAME//:/}"

echo "🌍 [2/3] TRANSLATING: $FILENAME..."
python ~/lousta/translation_swarm.py "$FILENAME"

echo "🌐 [3/3] UPDATING STOREFRONT..."
echo "🎙️ [4/4] GENERATING GLOBAL AUDIOBOOKS..." 
python ~/lousta/audiobook_agent.py "$FILENAME" 
python ~/lousta/audiobook_agent.py "${FILENAME//.txt/_es.txt}" 
python ~/lousta/audiobook_agent.py "${FILENAME//.txt/_ja.txt}"
echo "🎨 [5/5] DESIGNING HI-RES COVERS..." 
python ~/lousta/cover_generator_agent.py
echo "🎨 [5/5] DESIGNING HI-RES COVERS..." 
python ~/lousta/cover_generator_agent.py
python ~/lousta/web_generator_agent.py

echo "✅ BATCH COMPLETE: $TITLE is now live in 3 languages!"
~/lousta/notify_lousta.sh "Global Launch Success" "$TITLE is live at lasaispecialists.com"
