#!/bin/bash
while true; do
  BATT=$(termux-battery-status | jq -r '.percentage')
  if [ "$BATT" -le 20 ]; then
    echo "⚠️ Battery at $BATT%. Suspending swarm to protect S25 Ultra..."
    # Logic to pause python scripts
  fi
  sleep 300 # Check every 5 minutes
done
