#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

LOCK="INTEGRATIONS/lockbox"
mkdir -p "$LOCK"

# Termux-friendly perms
chmod 755 INTEGRATIONS 2>/dev/null || true
chmod 700 "$LOCK" 2>/dev/null || true
chmod -R u+rw "$LOCK" 2>/dev/null || true

cp -a LIMBS/publishing/lousta_sys_audio_swarm.js      "$LOCK/audio_swarm.js.good"
cp -a LIMBS/media/lousta_sys_video_swarm.js           "$LOCK/video_swarm.js.good"
cp -a LIMBS/publishing/lousta_sys_harden_preflight.sh "$LOCK/harden_preflight.sh.good"
cp -a LIMBS/publishing/lousta_sys_triple_threat.sh    "$LOCK/triple_threat.sh.good"

sha256sum \
  LIMBS/publishing/lousta_sys_audio_swarm.js \
  LIMBS/media/lousta_sys_video_swarm.js \
  LIMBS/publishing/lousta_sys_harden_preflight.sh \
  > "$LOCK/swarm_hashes.sha256"

sha256sum -c "$LOCK/swarm_hashes.sha256" >/dev/null

echo "✅ lockbox refreshed + hashes updated (swarms + preflight)"
