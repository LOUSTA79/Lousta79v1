#!/bin/bash
# Run every 5 minutes
while true; do
  cp ~/.webhook_queue/revenue.json ~/LA-Nexus/ALourithm_Core/revenue_backup_$(date +%s).json
  pm2 save
  sleep 300
done
