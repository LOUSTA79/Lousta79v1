#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

die(){ echo "❌ PRE-FLIGHT FAIL: $*" >&2; exit 1; }
ok(){ echo "✅ $*"; }

AUDIO="LIMBS/publishing/lousta_sys_audio_swarm.js"
VIDEO="LIMBS/media/lousta_sys_video_swarm.js"
TRIPLE="LIMBS/publishing/lousta_sys_triple_threat.sh"

command -v rg >/dev/null 2>&1 || die "ripgrep (rg) not installed"

# --- must exist ---
[[ -f "$AUDIO" ]]  || die "Missing $AUDIO"
[[ -f "$VIDEO" ]]  || die "Missing $VIDEO"
[[ -f "$TRIPLE" ]] || die "Missing $TRIPLE"

# --- syntax checks ---
node -c "$AUDIO"  >/dev/null 2>&1 || die "JS syntax invalid: $AUDIO"
node -c "$VIDEO"  >/dev/null 2>&1 || die "JS syntax invalid: $VIDEO"
bash -n "$TRIPLE" >/dev/null 2>&1 || die "Bash syntax invalid: $TRIPLE"
ok "Syntax checks passed"

# --- forbid broken template endings (the thing that caused blanks) ---
if rg -n 'for:\s*\x60\);' "$AUDIO" "$VIDEO" >/dev/null; then
  rg -n 'for:\s*\x60\);' "$AUDIO" "$VIDEO" || true
  die "Found broken template ending: for: (backtick);"
fi
ok "No broken template endings"

# --- require ${topic} interpolation exists where it matters ---
# We require at least one ${topic} reference in each file.
for f in "$AUDIO" "$VIDEO"; do
  rg -n '\$\{topic\}' "$f" >/dev/null || die "Missing \${topic} in $f"
done
ok "\${topic} present in both JS swarms"

# --- also ensure topicSlug is used for filenames (stability) ---
rg -n 'const\s+topicSlug\s*=' "$AUDIO" >/dev/null || die "Missing topicSlug init in AUDIO"
rg -n 'const\s+topicSlug\s*=' "$VIDEO" >/dev/null || die "Missing topicSlug init in VIDEO"
ok "topicSlug init present"

# --- basic output path sanity ---
rg -n 'RUNTIME' "$AUDIO" >/dev/null || die "AUDIO missing RUNTIME output usage"
rg -n 'RUNTIME' "$VIDEO" >/dev/null || die "VIDEO missing RUNTIME output usage"
ok "Output paths sane"

echo "🛡️ PRE-FLIGHT OK"
