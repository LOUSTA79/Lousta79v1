#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

OUT="RUNTIME/audits/termux_inventory_$(date -u +%Y%m%dT%H%M%SZ).txt"
mkdir -p "$(dirname "$OUT")"

{
  echo "=== TERMUX INVENTORY ==="
  echo "UTC: $(date -u)"
  echo "PWD: $(pwd)"
  echo

  echo "--- Device/OS ---"
  uname -a || true
  getprop ro.product.model 2>/dev/null || true
  getprop ro.build.version.release 2>/dev/null || true
  echo

  echo "--- Disk ---"
  df -h || true
  echo

  echo "--- Termux packages (pkg) ---"
  pkg list-installed 2>/dev/null || true
  echo

  echo "--- Python ---"
  command -v python3 >/dev/null 2>&1 && python3 -V || true
  command -v pip >/dev/null 2>&1 && pip -V || true
  command -v python3 >/dev/null 2>&1 && python3 -m pip list || true
  echo

  echo "--- Node ---"
  command -v node >/dev/null 2>&1 && node -v || true
  command -v npm  >/dev/null 2>&1 && npm -v  || true
  command -v npm  >/dev/null 2>&1 && npm -g ls --depth=0 || true
  echo

  echo "--- PM2 ---"
  command -v pm2 >/dev/null 2>&1 && pm2 ls || true
  echo

  echo "--- Running processes (top-ish) ---"
  ps -A -o pid,ppid,etime,cmd | head -n 200 || true
  echo

  echo "--- Cron/at (if present) ---"
  command -v crontab >/dev/null 2>&1 && crontab -l || true
  command -v at >/dev/null 2>&1 && atq || true
  echo

  echo "--- Key folders snapshot ---"
  ls -la || true
  echo
  echo "--- Repo status (if git) ---"
  command -v git >/dev/null 2>&1 && git status -sb 2>/dev/null || true
} > "$OUT"

echo "✅ Wrote: $OUT"
