#!/bin/bash
# LOUSTA CORP | Weekly Archive & Cleanup
# ABN: 54 492 524 823

echo "🧹 Starting Sunday Cleanup..."

# 1. Sync all processed books to GitHub for permanent IP storage
cd ~/lousta/manufacturing/books
git add .
git commit -m "Weekly Archive: $(date +%Y-%m-%d)"
git push origin main

# 2. Clear staging folders (keep the latest 5)
cd ~/lousta/READY_TO_POST
ls -t | tail -n +6 | xargs rm -rf --

# 3. Rotate Logs
mv ~/lousta/logs/watchdog.log ~/lousta/logs/archive/watchdog_$(date +%Y%W).log
touch ~/lousta/logs/watchdog.log

~/lousta/notify_lousta.sh "System Optimized" "Sunday cleanup complete. Storage 100% efficient."
