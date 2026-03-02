#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

FILES=(
  "LIMBS/publishing/lousta_sys_audio_swarm.js"
  "LIMBS/media/lousta_sys_video_swarm.js"
  "LIMBS/publishing/lousta_sys_harden_preflight.sh"
)

echo "🧪 Running preflight..."
bash LIMBS/publishing/lousta_sys_harden_preflight.sh

echo "🔒 Re-locking swarm files (read-only)..."
chmod 444 "${FILES[@]}"

echo "📦 Refreshing lockbox..."
LIMBS/publishing/lousta_sys_lockbox_refresh.sh

echo "🧾 Verifying hashes..."
sha256sum -c INTEGRATIONS/lockbox/swarm_hashes.sha256 >/dev/null

echo "✅ Locked + lockbox refreshed + integrity verified"
