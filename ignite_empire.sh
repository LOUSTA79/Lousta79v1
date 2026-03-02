#!/bin/bash
# LOUSTA CORP | Empire Ignition & Auth Fix
source ~/.lousta_vault

# Fix Git to use the Token (PAT)
git remote set-url origin https://LOUSTA79:$GITHUB_TOKEN@github.com/LOUSTA79/lousta.git

# Restart services
nohup python ~/lousta/web_core_v40.py > /dev/null 2>&1 &
./thermal_guard.sh &
./empire_watchdog.sh &

echo "🔥 Phoenix Protocol Ignored. Factory is 100% Autonomous."
