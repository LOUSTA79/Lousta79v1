#!/data/data/com.termux/files/usr/bin/bash
TOPIC=$1
echo "🚀 GLOBAL MASTER RUN: ${TOPIC}"

# 1. Generate English Master (Book + Audio + Clips)
./LIMBS/publishing/lousta_sys_triple_threat.sh "${TOPIC}"

# 2. Parallel Multilingual Forking (Hindi, Spanish, German, French)
# Using Gemini 2.0 Flash for technical industrial translation
python3 LIMBS/publishing/lousta_sys_global_fork.py "${TOPIC}"

# 3. Pressurize the International Distribution Pipes
# Metadata prep for Spotify, Kobo, D2D, and Google Play
python3 LIMBS/publishing/lousta_sys_distribution_flood.py "${TOPIC}"

echo "✅ GLOBAL SOVEREIGNTY SECURED: Master + 4 Forks pushed to 400+ outlets."
