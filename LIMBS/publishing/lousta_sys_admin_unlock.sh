#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

FILES=(
  "LIMBS/publishing/lousta_sys_audio_swarm.js"
  "LIMBS/media/lousta_sys_video_swarm.js"
  "LIMBS/publishing/lousta_sys_harden_preflight.sh"
)

echo "🔓 Unlocking swarm files (writable)..."
chmod 644 "${FILES[@]}"
echo "✅ Unlocked"
