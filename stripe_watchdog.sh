#!/data/data/com.termux/files/usr/bin/bash
set -e

while true; do
  if ! pm2 jlist | grep -q '"name":"09-STRIPE-BRIDGE".*"status":"online"'; then
    echo "[WATCHDOG] Bridge down. Restarting..."
    pm2 restart 09-STRIPE-BRIDGE || true
  fi
  sleep 30
done
