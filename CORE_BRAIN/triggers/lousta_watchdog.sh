#!/data/data/com.termux/files/usr/bin/bash
if ! pm2 jlist | grep -q "online"; then
  echo "⚠️ Swarm offline! Restarting Lousta Empire..."
  pm2 resurrect
  ~/LA-Nexus/ALourithm_Core/CORE_BRAIN/hub/hub.sh on
  ~/LA-Nexus/ALourithm_Core/CORE_BRAIN/triggers/launch_autonomous.sh
fi
