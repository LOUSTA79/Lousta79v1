#!/bin/bash
# LOUSTA CORP | EPUB Formatter
# ABN: 54 492 524 823

INPUT=$1
OUTPUT="${INPUT%.txt}.epub"
TITLE=$(basename "$INPUT" .txt | tr '_' ' ')

echo "📖 Formatting $TITLE for Kindle..."

pandoc "$INPUT" \
    -o "$OUTPUT" \
    --metadata title="$TITLE" \
    --metadata author="LOUSTA" \
    --toc --toc-depth=2

echo "✅ EPUB Ready: $OUTPUT"
