#!/bin/bash
# LOUSTA CORP | Ambience Swarm
# Layers royalty-free background audio under speech

VOICE_FILE=$1
MUSIC_FILE="assets/music/space_ambient.mp3"
OUTPUT="manufacturing/audio/premium_$(basename $VOICE_FILE)"

# amix=inputs=2 combines them; dropout_transition ensures smooth end
ffmpeg -i "$VOICE_FILE" -i "$MUSIC_FILE" -filter_complex "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=first" "$OUTPUT" -y
echo "🎵 Premium Audio Manufactured: $OUTPUT"
