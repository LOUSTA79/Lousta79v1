#!/usr/bin/env bash
set -euo pipefail


slugify() {
  local s="${1:-}"
  s="${s#"${s%%[![:space:]]*}"}"   # ltrim
  s="${s%"${s##*[![:space:]]}"}"   # rtrim
  s="$(printf "%s" "$s" | tr -s '[:space:]' '_' )"
  s="$(printf "%s" "$s" | tr -cd 'A-Za-z0-9_-' )"
  printf "%s" "${s:-untitled}"
}

# Usage:
#   ./LIMBS/publishing/lousta_sys_global_master.sh --topic "Agentic Manufacturing"
#   ./LIMBS/publishing/lousta_sys_global_master.sh "Agentic Manufacturing"
TOPIC=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --topic)
      shift
      TOPIC="${1:-}"
      ;;
    --topic=*)
      TOPIC="${1#--topic=}"
      ;;
    -*)
      echo "❌ Unknown flag: $1"
      exit 1
      ;;
    *)
      # first positional becomes topic
      if [[ -z "$TOPIC" ]]; then
        TOPIC="$1"
      fi
      ;;
  esac
  shift || true
done

if [[ -z "${TOPIC}" ]]; then
  echo '❌ Missing topic. Use: --topic "My Topic"'
  exit 1
fi

echo "🚀 GLOBAL MASTER RUN: ${TOPIC}"

./LIMBS/publishing/lousta_sys_triple_threat.sh "${TOPIC}"
python3 LIMBS/publishing/lousta_sys_global_fork.py "${TOPIC}"
python3 LIMBS/publishing/lousta_sys_distribution_flood.py "${TOPIC}"
