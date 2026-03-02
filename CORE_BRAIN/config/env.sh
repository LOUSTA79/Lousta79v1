#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MODE_FILE="$ROOT/CORE_BRAIN/config/mode.env"

# Load mode
if [ -f "$MODE_FILE" ]; then
  # shellcheck disable=SC1090
  source "$MODE_FILE"
else
  LOU_MODE="IDLE"
fi

# Load .env only when ACTIVE (keeps secrets out of casual runs)
if [ "${LOU_MODE:-IDLE}" = "ACTIVE" ] && [ -f "$ROOT/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ROOT/.env"
  set +a
fi

export ROOT LOU_MODE
