#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

topic="${1:-}"
[[ -n "$topic" ]] || { echo "0"; exit 0; }

t="$(printf "%s" "$topic" | tr '[:upper:]' '[:lower:]')"
score=50

# commercial-ish boosts
for w in "how to" "guide" "workflow" "blueprint" "checklist" "framework" "playbook" "system" "automation" "agents"; do
  [[ "$t" == *"$w"* ]] && score=$((score+6))
done

# strong but safe niches
for w in "termux" "android" "stripe" "shopify" "kdp" "audiobook" "vertical clips" "mcp" "rag"; do
  [[ "$t" == *"$w"* ]] && score=$((score+4))
done

# reduce newsy / drama
for w in "ceo" "analysts" "tells" "says" "flaw" "malicious" "hijack" "kill" "obnoxious" "lawsuit"; do
  [[ "$t" == *"$w"* ]] && score=$((score-12))
done

# too long = less book-title friendly
len=${#topic}
(( len > 90 )) && score=$((score-10))
(( len > 120 )) && score=$((score-20))

# clamp 0..100
(( score < 0 )) && score=0
(( score > 100 )) && score=100

echo "$score"
