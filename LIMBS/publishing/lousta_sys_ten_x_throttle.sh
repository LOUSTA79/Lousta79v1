#!/data/data/com.termux/files/usr/bin/bash
echo "🔥 [TEN-X THROTTLE] Initiating 10 Parallel Global Master Runs..."

# Pull 10 trending topics from the Market-Pulse Agent
TOPICS=$(python3 -c "import json; f=open('CORE_BRAIN/memory/market_pulse.json'); data=json.load(f); print('\n'.join(data['trending_topics'][:10]))")

for TOPIC in $TOPICS; do
    echo "🏗️ Starting Batch for: $TOPIC"
    ./LIMBS/publishing/lousta_sys_global_master.sh "$TOPIC" &
    sleep 300 # 5-minute stagger to keep S25 Ultra thermals optimal
done

wait
echo "✅ 10-BATCH RUN COMPLETE. 250+ Assets Pushed to Global Outlets."
