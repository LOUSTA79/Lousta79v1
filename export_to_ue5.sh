#!/bin/bash
# LOUSTA CORP | UE5 Metadata Exporter

STORYBOARD=$1
EXPORT_FILE="${STORYBOARD%.md}_UE5_SHOTLIST.csv"

echo "Shot_Name,Start_Frame,End_Frame,Description" > "$EXPORT_FILE"
grep "Chapter" "$STORYBOARD" | awk -F: '{print $1",0,300,Cinematic wide shot for "$1}' >> "$EXPORT_FILE"

echo "🎥 UE5 Shot-List Ready for Import: $EXPORT_FILE"
