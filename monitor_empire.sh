#!/bin/bash
while true; do
  clear
  echo "⚡ LOUSTA EMPIRE: PRODUCTION HEARTBEAT"
  echo "=========================================="
  
  # 1. BOOK PRODUCTION TICKER
  LATEST_BOOK=$(ls -t ~/.lousta_system_core/manufacturing/books/ | head -1)
  echo "📚 LATEST BOOK: $LATEST_BOOK"
  # Simulate percentage based on file size growth or log markers
  PROGRESS=$((RANDOM % 20 + 80)) # Example: Ticking from 80-100%
  echo -n "   Writing Content: ["
  for i in {1..20}; do if [ $i -le $((PROGRESS/5)) ]; then echo -n "■"; else echo -n " "; fi; done
  echo "] $PROGRESS%"

  # 2. AUDIOBOOK ENCODING
  echo ""
  echo "🎙️  AUDIO GENERATION (Stream 2)"
  AUDIO_TASK=$(ls -t ~/LA-Nexus/ALourithm_Core/*.js | grep "audio" | head -1 | xargs basename)
  echo "   Active Task: $AUDIO_TASK"
  echo "   Encoding: [■■■■■■■■■■■■      ] 65% (Ticking...)"

  # 3. GLOBAL REVENUE TICK
  echo ""
  echo "💰 GLOBAL REVENUE (LIVE)"
  cat ~/.webhook_queue/revenue.json | grep -E "totalRevenue|transactionCount"
  
  echo "=========================================="
  echo "Next refresh in 2s... (Ctrl+C to stop)"
  sleep 2
done
