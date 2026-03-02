#!/bin/bash
# LOUSTA SUCCESS BELL: Physical alert for real sales
tail -f ~/LA-Nexus/ALourithm_Core/ledger_2026.csv | while read line; do
  if [[ $line == *"SALE"* ]]; then
    # Plays system beep and triggers phone notification
    echo -ne '\007' 
    termux-notification --title "💰 LOUSTA EMPIRE: SALE!" --content "Real Transaction Verified & Saved" --priority high
  fi
done
