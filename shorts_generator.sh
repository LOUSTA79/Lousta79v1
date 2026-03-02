#!/bin/bash
# LOUSTA CORP | YouTube Shorts Pipeline
# Built for S25 Ultra | ABN 54 492 524 823

INPUT_AUDIO=$1
MANUSCRIPT=$2
OUTPUT_NAME=$(basename "$INPUT_AUDIO" .mp3)_short.mp4

# 1. AI Hook Extraction (Simulated for this script)
# Gemini Flash identifies the most "viral" 58 seconds of your text.
echo "🤖 Gemini is extracting the viral hook from $MANUSCRIPT..."

# 2. FFmpeg Vertical Render (9:16 Aspect Ratio)
# Uses your book cover as the background
echo "🎬 Rendering Vertical Video for TikTok/Shorts..."

ffmpeg -loop 1 -i manufacturing/covers/default_cover.jpg \
       -i "$INPUT_AUDIO" \
       -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,drawtext=text='LOUSTA BOOKS PRESENTS':fontcolor=white:fontsize=64:x=(w-text_w)/2:y=200,drawtext=text='LISTEN TO THE FULL STORY':fontcolor=yellow:fontsize=50:x=(w-text_w)/2:y=h-300" \
       -c:v libx264 -t 58 -pix_fmt yuv420p -c:a aac -shortest "$OUTPUT_NAME"

echo "✅ Short Produced: $OUTPUT_NAME"
