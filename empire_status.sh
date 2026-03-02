#!/bin/bash
while true; do
  clear
  echo "👑 LOUSTA EMPIRE: FULL-SYSTEM OPERATIONAL STATUS"
  echo "=========================================================="
  
  # 1. THE BRAIN (Orchestrator)
  echo "🧠 ORCHESTRATOR:"
  ps aux | grep "orchestrator.js" | grep -v grep | awk '{print "   [LIVE] PID:", $2, "CPU:", $3"%"}'
  
  # 2. THE FACTORY (Book & Audio Production)
  echo -e "\n🏭 MANUFACTURING:"
  BOOKS=$(ls ~/.lousta_system_core/manufacturing/books/ | wc -l)
  AUDIO=$(ls ~/.lousta_system_core/manufacturing/audio/ 2>/dev/null | wc -l)
  echo "   Books Minted: $BOOKS | Audiobooks: $AUDIO"
  
  # 3. THE SWARM (15 Languages)
  echo -e "\n🌐 GLOBAL SWARM (15 Markets):"
  ACTIVE_LANGS=$(ps aux | grep "global_pitcher.py" | grep -v grep | wc -l)
  echo "   Active Language CEOs: $ACTIVE_LANGS / 15"
  
  # 4. THE VAULT (Live Revenue)
  echo -e "\n💰 FINANCIALS:"
  REVENUE=$(cat ~/.webhook_queue/revenue.json | grep "totalRevenue" | awk -F: '{print $2}' | tr -d ' ,')
  SALES=$(cat ~/.webhook_queue/revenue.json | grep "transactionCount" | awk -F: '{print $2}' | tr -d ' ,')
  echo "   Total Revenue: \$$REVENUE | Total Sales: $SALES"
  
  echo "=========================================================="
  echo "Ticking every 2s... [Press Ctrl+C to exit]"
  sleep 2
done
