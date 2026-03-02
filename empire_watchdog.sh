#!/bin/bash
# LOUSTA CORP | Autonomous Empire Watchdog
# ABN: 54 492 524 823

INBOX="$HOME/lousta/IDEAS_INBOX"
LOGS="$HOME/lousta/logs/watchdog.log"

echo "🛰️ Empire Watchdog is active. Waiting for ideas in $INBOX..."

while true; do
  # Check if there are any .txt files in the inbox
  if ls $INBOX/*.txt >/dev/null 2>&1; then
    for idea_file in $INBOX/*.txt; do
      TITLE=$(cat "$idea_file")
      echo "[$(date)] 🚀 Triggering Empire Build for: $TITLE" >> $LOGS
      
      # 1. Start the Production Swarm
      python ~/lousta/production_swarm.py "$TITLE"
      
      # 2. Inject Links & Run Ledger
      ~/lousta/link_injector.sh
      python ~/lousta/ledger_sync.py
      ~/lousta/epub_formatter.sh "$latest_book"
      python ~/lousta/substack_agent.py
      ~/lousta/notify_lousta.sh "Asset Ready" "Kindle and Newsletter Staged."
      
      # 3. Clean up the inbox
      mv "$idea_file" "$INBOX/processed/"
      echo "✅ $TITLE Complete. Back to sleep."
    done
  fi
  sleep 10 # Check every 10 seconds to save battery
done
python ~/lousta/web_generator_agent.py
