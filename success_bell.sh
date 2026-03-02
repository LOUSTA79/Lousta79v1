#!/bin/bash
# LOUSTA SUCCESS BELL - Notifies phone on production completion
LAST_ID=$(sqlite3 RUNTIME/db/lousta.db "SELECT id FROM topics WHERE status='completed' ORDER BY processed_at DESC LIMIT 1;")
while true; do
  NEW_ID=$(sqlite3 RUNTIME/db/lousta.db "SELECT id FROM topics WHERE status='completed' ORDER BY processed_at DESC LIMIT 1;")
  if [ "$NEW_ID" != "$LAST_ID" ] && [ ! -z "$NEW_ID" ]; then
    TOPIC=$(sqlite3 RUNTIME/db/lousta.db "SELECT topic_text FROM topics WHERE id='$NEW_ID';")
    termux-notification -t "🏭 Lousta Production Success" -c "Batch Complete: $TOPIC" --id 79
    LAST_ID=$NEW_ID
  fi
  sleep 45
done
