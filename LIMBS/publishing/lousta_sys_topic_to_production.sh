#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

CAT="${CAT:-ai}"
LIMIT="${LIMIT:-10}"
OUT="${OUT:-RUNTIME/topics_queue.txt}"
MIN_SCORE="${MIN_SCORE:-62}"
TIMEOUT="${TIMEOUT:-900}"

mkdir -p RUNTIME/logs

echo "🧠 Generating topics (cat=$CAT limit=$LIMIT)..."
python3 -u LIMBS/publishing/lousta_sys_topic_agent.py --cat="$CAT" --limit="$LIMIT" --out="$OUT" \
  2>&1 | tee -a RUNTIME/logs/topic_agent.run.log

[[ -s "$OUT" ]] || { echo "❌ No topics produced"; exit 1; }

best=""
bestScore=-1

echo "📊 Scoring topics..."
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  s="$(LIMBS/publishing/lousta_sys_topic_score.sh "$line")"
  printf "%3s  %s\n" "$s" "$line" | tee -a RUNTIME/logs/topic_scores.log
  if (( s > bestScore )); then bestScore="$s"; best="$line"; fi
done < "$OUT"

echo "🏆 Best: $bestScore :: $best"
if (( bestScore < MIN_SCORE )); then
  echo "⚠️ No topic met MIN_SCORE=$MIN_SCORE — refusing to produce"
  exit 0
fi

echo "🚀 Producing with triple_threat..."
TIMEOUT="$TIMEOUT" LIMBS/publishing/lousta_sys_triple_threat.sh "$best" \
  2>&1 | tee -a RUNTIME/logs/production.run.log
