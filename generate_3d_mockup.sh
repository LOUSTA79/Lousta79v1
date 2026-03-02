#!/bin/bash
# Uses FFmpeg to add depth and shadow to your 2D cover
INPUT_IMAGE="manufacturing/covers/default.jpg"
OUTPUT_IMAGE="manufacturing/covers/social_mockup.jpg"

ffmpeg -i "$INPUT_IMAGE" -vf "pad=iw+40:ih+40:20:20:black,boxblur=2,unsharp" "$OUTPUT_IMAGE" -y
echo "🖼️ 3D Mockup Generated: $OUTPUT_IMAGE"
