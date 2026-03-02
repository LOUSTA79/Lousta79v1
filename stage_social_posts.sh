#!/bin/bash
# LOUSTA CORP | Social Staging Agent
# ABN: 54 492 524 823

STAGING_DIR="$HOME/lousta/READY_TO_POST"
mkdir -p "$STAGING_DIR"

# Find the latest book and its matching assets
LATEST_BOOK=$(ls -t ~/lousta/manufacturing/books/*.txt | head -1)
BOOK_NAME=$(basename "$LATEST_BOOK" .txt)
COVER="~/lousta/manufacturing/covers/social_mockup.jpg"
THREAD="~/lousta/manufacturing/books/${BOOK_NAME}_X_THREAD.txt"

# Create a dedicated bundle folder for the campaign
CAMPAIGN_DIR="$STAGING_DIR/${BOOK_NAME}_CAMPAIGN"
mkdir -p "$CAMPAIGN_DIR"

# Move assets into the staging bundle
cp "$COVER" "$CAMPAIGN_DIR/"
cp "$THREAD" "$CAMPAIGN_DIR/"

echo "------------------------------------------"
echo "📢 SOCIAL CAMPAIGN STAGED: $BOOK_NAME"
echo "📂 Location: $CAMPAIGN_DIR"
echo "🖼️ Image: social_mockup.jpg"
echo "📝 Text: ${BOOK_NAME}_X_THREAD.txt"
echo "------------------------------------------"
