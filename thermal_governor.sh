#!/bin/bash
while true; do
  TEMP=$(cat /sys/class/thermal/thermal_zone0/temp 2>/dev/null || echo 35000)
  if [ $TEMP -gt 45000 ]; then
    echo "⚠️ ACE-O: Thermal threshold met. Throttling non-essential metadata flood..."
    sleep 60
  fi
  sleep 300
done
