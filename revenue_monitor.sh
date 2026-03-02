#!/bin/bash
while true; do
  clear
  echo "═══════════════════════════════════════"
  echo "  LOUSTA REVENUE MONITOR"
  echo "  $(date '+%Y-%m-%d %H:%M:%S')"
  echo "═══════════════════════════════════════"
  
  if [ -f revenue.json ]; then
    echo ""
    echo "Revenue Data:"
    cat revenue.json | jq '.'
  else
    echo "No revenue.json yet"
  fi
  
  echo ""
  echo "System Status:"
  pm2 list 2>/dev/null | grep -E "online|stopped" | head -10
  
  echo ""
  echo "(Refreshing every 10 seconds - Ctrl+C to exit)"
  sleep 10
done
