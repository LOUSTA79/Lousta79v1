#!/data/data/com.termux/files/usr/bin/bash
# LOUSTA EMPIRE - MASTER LAUNCH SEQUENCE v2026.1
echo "🚀 INITIALIZING SOVEREIGN EMPIRE..."

# 1. Start Watchdog (The Guard)
nohup ~/LA-Nexus/ALourithm_Core/CORE_BRAIN/triggers/lousta_watchdog.sh > RUNTIME/logs/watchdog.log 2>&1 &
echo "✅ Watchdog Armed."

# 2. Boot the Senior Architect (OpenClaw)
proot-distro login ubuntu -- openclaw gateway --install-daemon &
echo "✅ Architect Online."

# 3. Fire up the Sales Bridge & Dashboard
pm2 start LIMBS/stripe/stripe_sales_bridge.js --name "Stripe_Bridge"
pm2 start LIMBS/dashboards/dashboard.js --name "Vault_UI"
echo "✅ Sales & UI Online."

# 4. Trigger the Harvester & Swarm
node LIMBS/publishing/lousta_sys_platform_distributor.js &
echo "✅ Harvester/Distributor active."

echo "🔥 SYSTEM AT MAX THROTTLE. Check localhost:5000 for Live OEE."
pm2 list
