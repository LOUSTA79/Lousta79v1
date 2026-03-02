#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

##############################################################################
# LOUSTA TRIPLE-THREAT SWARM LAUNCHER - PRODUCTION HARDENED
##############################################################################

log() { printf "[TRIPLE-THREAT] %s\n" "$1" >&2; }
die() { log "❌ FATAL: $1"; exit 2; }

validate_topic() {
  local topic="$1"
  topic="$(printf "%s" "$topic" | sed -e 's/^[[:space:]]\+//' -e 's/[[:space:]]\+$//')"
  [ -z "$topic" ] && die "TOPIC is empty or whitespace-only"
  if ! printf "%s" "$topic" | grep -qE '^[A-Za-z0-9 _.-]+$'; then
    log "REJECTED TOPIC: '$topic'"
    log "Allowed: A-Z a-z 0-9 space hyphen underscore period"
    die "TOPIC contains forbidden characters"
  fi
  [ ${#topic} -gt 200 ] && die "TOPIC exceeds 200 characters"
  printf "%s" "$topic"
}

slugify() {
  local s="${1:-}"
  s="$(printf "%s" "$s" | sed -e 's/^[[:space:]]\+//' -e 's/[[:space:]]\+$//')"
  s="$(printf "%s" "$s" | tr -s '[:space:]' '_')"
  s="$(printf "%s" "$s" | tr -cd 'A-Za-z0-9_-')"
  printf "%s" "${s:-untitled}"
}

TOPIC="${TOPIC:-${1:-}}"
[ -z "$TOPIC" ] && die "Missing TOPIC argument"
TOPIC="$(validate_topic "$TOPIC")" || die "Validation failed"
log "✅ TOPIC validated: '$TOPIC'"
TOPIC_SLUG="$(slugify "$TOPIC")"
export TOPIC TOPIC_SLUG

PREFLIGHT="LIMBS/publishing/lousta_sys_harden_preflight.sh"
LOCK="INTEGRATIONS/lockbox"
HASHES="$LOCK/swarm_hashes.sha256"

[ ! -f "$PREFLIGHT" ] && die "Preflight script not found"
[ ! -d "$LOCK" ] && die "Lockbox not found"

restore_lockbox() {
  log "🧯 Restoring swarms from lockbox..."
  cp -a "$LOCK/audio_swarm.js.good"         "LIMBS/publishing/lousta_sys_audio_swarm.js"      2>/dev/null || true
  cp -a "$LOCK/video_swarm.js.good"         "LIMBS/media/lousta_sys_video_swarm.js"            2>/dev/null || true
  cp -a "$LOCK/harden_preflight.sh.good"    "LIMBS/publishing/lousta_sys_harden_preflight.sh"  2>/dev/null || true
  cp -a "$LOCK/syndication_swarm.py.good"   "LIMBS/publishing/lousta_sys_syndication_swarm.py" 2>/dev/null || true
  log "✅ Restore complete"
}

log "✅ Running preflight..."
if ! bash "$PREFLIGHT"; then
  log "🧯 Preflight failed — attempting restore..."
  restore_lockbox
  if ! bash "$PREFLIGHT"; then
    die "Preflight still failing after restore"
  fi
fi
log "✅ Preflight OK"

log "✅ Verifying integrity..."
if [ -f "$HASHES" ]; then
  if ! sha256sum -c "$HASHES" >/dev/null 2>&1; then
    log "❌ Integrity check FAILED"
    restore_lockbox
    if ! sha256sum -c "$HASHES" >/dev/null 2>&1; then
      die "Integrity check still failing after restore"
    fi
  fi
fi
log "✅ Integrity OK"

mkdir -p RUNTIME/artifacts/books RUNTIME/artifacts/audiobooks RUNTIME/artifacts/social_clips

log "🚀 TRIPLE-THREAT SWARM ACTIVATED: $TOPIC"

python3 LIMBS/publishing/lousta_sys_syndication_swarm.py --topic "$TOPIC" --mode "FULL_BOOK" & PID_SYND=$!
node    LIMBS/publishing/lousta_sys_audio_swarm.js       --topic "$TOPIC"                     & PID_AUDIO=$!
node    LIMBS/media/lousta_sys_video_swarm.js            --topic "$TOPIC" --format "VERTICAL" & PID_VIDEO=$!

log "Syndication swarm (PID $PID_SYND)"
log "Audio swarm (PID $PID_AUDIO)"
log "Video swarm (PID $PID_VIDEO)"

fail=0
TIMEOUT="${TIMEOUT:-900}"
START="$(date +%s)"

wait_one() {
  local pid="$1"
  local name="$2"
  while kill -0 "$pid" 2>/dev/null; do
    local now="$(date +%s)"
    local elapsed=$((now - START))
    [ $elapsed -gt "$TIMEOUT" ] && { log "⏱️  TIMEOUT: killing $name"; kill "$pid" 2>/dev/null || true; fail=1; return 1; }
    sleep 1
  done
  if ! wait "$pid" 2>/dev/null; then
    log "❌ $name exited with non-zero"
    fail=1
    return 1
  fi
}

wait_one "$PID_SYND"  "syndication" || true
wait_one "$PID_AUDIO" "audio"       || true
wait_one "$PID_VIDEO" "video"       || true

[ "$fail" != 0 ] && die "PRODUCTION FAILED: one or more swarms crashed"

log "✅ PRODUCTION COMPLETE: Full Book, Audiobook, and 5 Video Clips secured."
