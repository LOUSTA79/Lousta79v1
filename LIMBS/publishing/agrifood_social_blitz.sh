#!/data/data/com.termux/files/usr/bin/bash
echo "🌾 [AGRI-BLITZ] Targeting Wimmera Field Days & FaBA Kickstarter..."

# Key Players for the March 2-5 window
TARGETS=("AgriFutures AU" "FaBA Accelerator" "Victorian Chamber" "Wimmera Field Days")
TAGS=("#AgTech2026" "#FaBA" "#SmartFarming" "#OEE")

echo "🚀 Posting: 'Wimmera tomorrow? Don't leave OEE in the shed. The 2026 AgTech & Food Strategy is LIVE.'"
echo "📍 GEO-TAG: Longerenong VIC, Jerilderie NSW, Laverton North"

# Triggering the social assets for Batch #015
python3 LIMBS/publishing/lousta_sys_distribution_flood.py "AgTech Strategy 2026" --live --geo=REGIONAL_VIC
