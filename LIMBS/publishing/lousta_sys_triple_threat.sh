#!/data/data/com.termux/files/usr/bin/bash
TOPIC=$1
echo "🚀 TRIPLE-THREAT SWARM ACTIVATED: ${TOPIC}"

# Create artifact subfolders
mkdir -p RUNTIME/artifacts/books RUNTIME/artifacts/audiobooks RUNTIME/artifacts/social_clips

# 1. Branch A: Full Book Generation (Python)
# High-depth manuscript generation with chapter-by-chapter synthesis
python3 LIMBS/publishing/lousta_sys_syndication_swarm.py --topic "$TOPIC" --mode "FULL_BOOK" &

# 2. Branch B: Audiobook Synthesis (Node.js + Neural TTS)
# Uses 2026 VALL-E 2 / Bark 3.0 logic for 100% human-like narration
node LIMBS/publishing/lousta_sys_audio_swarm.js --topic "$TOPIC" &

# 3. Branch C: Social Video Clipping (AutoClips/ViMax Logic)
# Generates 5 "Industrial Insights" vertical clips (9:16) for TikTok/Shorts
node LIMBS/media/lousta_sys_video_swarm.js --topic "$TOPIC" --format "VERTICAL" &

wait
echo "✅ PRODUCTION COMPLETE: Full Book, Audiobook, and 5 Video Clips secured."
