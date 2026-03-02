#!/bin/bash
# LOUSTA CORP | Parallel Swarm v50
# Max Performance Mode for S25 Ultra

source ~/.lousta_vault
termux-wake-lock

BOOKS_QUEUE=(
  "The OEE Advantage" "AI-Driven Supply Chains" "Predictive Maintenance" 
  "The Digital Twin Revolution" "Smart Factory Blueprint" "Industrial Cyber-Security"
)

echo "🔥 Launching Parallel Swarm: 4 Workers..."

# Run 4 books at a time
printf "%s\n" "${BOOKS_QUEUE[@]}" | xargs -I {} -P 4 bash -c "python ~/lousta/production_swarm.py '{}' && ~/lousta/storyboarder_swarm.sh ~/lousta/manufacturing/books/'{}'.txt"

~/lousta/notify_lousta.sh "Batch Complete" "Parallel Swarm finished 6 Enterprise titles in record time."
