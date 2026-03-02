#!/bin/bash
for title in "$@"; do
    python ~/lousta/production_swarm.py "$title" & 
done
wait
echo "🔥 Parallel Batch Complete."
