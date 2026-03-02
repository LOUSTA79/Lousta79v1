#!/data/data/com.termux/files/usr/bin/bash
echo "📊 LOUSTA EMPIRE: LIVE REVENUE VELOCITY (WINDOW 3)"
echo "---------------------------------------------------"
tail -f RUNTIME/logs/tunnel.log | grep --line-buffered "GET /webhook/stripe" | awk '{print "💰 CHECKOUT INITIATED: " strftime("%H:%M:%S") " | Source: " $1}'
