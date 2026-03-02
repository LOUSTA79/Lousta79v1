#!/bin/bash
# LOUSTA INDUSTRIAL HARDENING WRAPPER (Grandle Logic)

echo "🛡️ HARDENING SYSTEM: Initiating Pressure Test..."

# 1. PATH VALIDATION (No more "File Not Found" jams)
REQUIRED_DIRS=( "~/LA-Nexus/ALourithm_Core/output" "~/LA-Nexus/LouBooks_Archive" "~/.lousta_system_core/finance" )
for dir in "${REQUIRED_DIRS[@]}"; do
    eval dir_path=$dir
    if [ ! -d "$dir_path" ]; then
        echo "🔧 Fixing Infrastructure: Creating $dir_path..."
        mkdir -p "$dir_path"
    fi
done

# 2. DEPENDENCY PRESSURE TEST
echo "🌡️ Stress Testing Python Packages..."
pip install --quiet fpdf2 pandas requests || { echo "❌ Critical Failure: Dependency missing."; exit 1; }

# 3. CONVEYOR CALIBRATION (Fixing those path errors automatically)
echo "🎯 Calibrating Output Chutes..."
sed -i 's|/home/lousta/output/|/data/data/com.termux/files/home/LA-Nexus/ALourithm_Core/output/|g' ~/.lousta_system_core/report_generator_agent.py

echo "✅ SYSTEM HARDENED. Launching Multi-Swarm Orchestra..."
