#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

slugify() {
  local s="${1:-}"
  s="${s#"${s%%[![:space:]]*}"}"
  s="${s%"${s##*[![:space:]]}"}"
  s="$(printf "%s" "$s" | tr -s '[:space:]' '_' )"
  s="$(printf "%s" "$s" | tr -cd 'A-Za-z0-9_-' )"
  printf "%s" "${s:-untitled}"
}

TOPIC="${TOPIC:-${1:-}}"
if [[ -z "$TOPIC" ]]; then
  echo "❌ Missing TOPIC"
  exit 1
fi

echo "🚀 TRIPLE-THREAT SWARM ACTIVATED: ${TOPIC}"

PREFLIGHT="LIMBS/publishing/lousta_sys_harden_preflight.sh"
LOCK="INTEGRATIONS/lockbox"
HASHES="$LOCK/swarm_hashes.sha256"

restore_lockbox() {
  echo "🧯 Restoring last-known-good swarms from lockbox..."
  cp -a "$LOCK/audio_swarm.js.good"        LIMBS/publishing/lousta_sys_audio_swarm.js  2>/dev/null || true
  cp -a "$LOCK/video_swarm.js.good"        LIMBS/media/lousta_sys_video_swarm.js       2>/dev/null || true
  cp -a "$LOCK/harden_preflight.sh.good"   LIMBS/publishing/lousta_sys_harden_preflight.sh 2>/dev/null || true
  echo "✅ Restore complete"
}

echo "✅ Running preflight..."
if ! bash "$PREFLIGHT"; then
  echo "🧯 Preflight failed — attempting restore..."
  [[ -d "$LOCK" ]] && restore_lockbox
  bash "$PREFLIGHT" || { echo "❌ Preflight still failing after restore"; exit 1; }
fi
echo "✅ Preflight OK"

echo "✅ Integrity: verifying swarms..."
if ! sha256sum -c "$HASHES" >/dev/null 2>&1; then
  echo "❌ Integrity check failed: swarms do not match lockbox"
  sha256sum -c "$HASHES" || true
  echo "🧯 Restoring swarms from lockbox..."
  restore_lockbox
  echo "✅ Re-checking integrity after restore..."
  sha256sum -c "$HASHES" >/dev/null 2>&1 || { echo "❌ Integrity still failing after restore"; exit 1; }
fi
echo "✅ Integrity OK"

export TOPIC
TOPIC_SLUG="$(slugify "$TOPIC")"
export TOPIC_SLUG

mkdir -p RUNTIME/artifacts/books RUNTIME/artifacts/audiobooks RUNTIME/artifacts/social_clips

python3 LIMBS/publishing/lousta_sys_syndication_swarm.py --topic "$TOPIC" --mode "FULL_BOOK" & PID_SYND=$!
node   LIMBS/publishing/lousta_sys_audio_swarm.js       --topic "$TOPIC" & PID_AUDIO=$!
node   LIMBS/media/lousta_sys_video_swarm.js            --topic "$TOPIC" --format "VERTICAL" & PID_VIDEO=$!

fail=0
TIMEOUT="${TIMEOUT:-900}"
START="$(date +%s)"

wait_one() {
  local pid="$1"
  while kill -0 "$pid" 2>/dev/null; do
    local now="$(date +%s)"
    if (( now - START > TIMEOUT )); then
      echo "❌ TIMEOUT: killing pid=$pid"
      kill "$pid" 2>/dev/null || true
      fail=1
      return 1
    fi
    sleep 1
  done
  if ! wait "$pid"; then
    echo "❌ A job failed (pid=$pid)"
    fail=1
    return 1
  fi
}

wait_one "$PID_SYND"  || true
wait_one "$PID_AUDIO" || true
wait_one "$PID_VIDEO" || true

if (( fail != 0 )); then
  echo "❌ PRODUCTION FAILED: at least one swarm crashed"
  exit 1
fi

echo "✅ PRODUCTION COMPLETE: Full Book, Audiobook, and 5 Video Clips secured."
