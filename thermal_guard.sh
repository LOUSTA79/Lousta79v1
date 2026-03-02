#!/bin/bash
# LOUSTA CORP | S25 Ultra Hardware Protection

while true; do
  TEMP=$(termux-battery-status | jq '.temperature')
  if (( $(echo "$TEMP > 42" | bc -l) )); then
    echo "⚠️ Thermal Warning: $TEMP°C. Throttling Swarm..."
    sleep 60
  else
    sleep 10
  fi
done
