#!/bin/bash
echo "╔════════════════════════════════════════════╗"
echo "║  🚀 AUTONOMOUS EMPIRE LAUNCH (PM2)        ║"
echo "╚════════════════════════════════════════════╝"

cd ~/LA-Nexus/ALourithm_Core
./CORE_BRAIN/hub/hub.sh on

# 1. PAYMENT HUB
pm2 start ./CORE_BRAIN/hub/hub.sh --name "payment_hub" -- run payment_hub

# 2. AUTONOMOUS GENERATORS
pm2 start ./CORE_BRAIN/hub/hub.sh --name "book_gen" -- run book_gen
pm2 start ./CORE_BRAIN/hub/hub.sh --name "email_auto" -- run email_automation
pm2 start ./CORE_BRAIN/hub/hub.sh --name "affiliate" -- run affiliate_engine
pm2 start ./CORE_BRAIN/hub/hub.sh --name "membership" -- run membership_engine

# 3. DASHBOARDS
pm2 start ./CORE_BRAIN/hub/hub.sh --name "live_feed" -- run live_feed
pm2 start ./CORE_BRAIN/hub/hub.sh --name "books_sales" -- run books_sales_dashboard
pm2 start ./CORE_BRAIN/hub/hub.sh --name "revenue_mon" -- run revenue_monitor

pm2 save
echo "✅ All agents deployed to PM2 background processes."
pm2 list
