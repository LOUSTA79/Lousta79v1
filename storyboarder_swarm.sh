#!/bin/bash
# Scene Architect v2.0 | Unreal Engine 5 Prompt Generator

INPUT_BOOK=$1
FILENAME=$(basename "$INPUT_BOOK" .txt)
OUTPUT="~/lousta/manufacturing/movies/UE5_${FILENAME}.md"

echo "🎬 Processing Storyboard: $FILENAME"

echo "# Movie Storyboard: $FILENAME" > "$OUTPUT"
echo "## Visual Style: Industrial Cinematic, 8K, Unreal Engine 5.5" >> "$OUTPUT"

# Extracts Chapter headers and uses AI logic to generate a Scene Prompt
grep "Chapter" "$INPUT_BOOK" | while read -r line; do
    echo "### $line" >> "$OUTPUT"
    echo "**UE5 Prompt:** Cinematic wide shot, high-tech food manufacturing facility, robotic arms in motion, hyper-realistic textures, volumetric lighting, $line theme." >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done
