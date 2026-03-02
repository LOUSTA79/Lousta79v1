#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="${1:-$PWD}"
OUT="${2:-$ROOT/_audit}"
TS="$(date +%Y%m%d_%H%M%S)"
REPORT="$OUT/report_$TS.txt"

mkdir -p "$OUT"

say(){ printf "\n===== %s =====\n" "$*" | tee -a "$REPORT"; }
cmd(){ printf "\n$ %s\n" "$*" | tee -a "$REPORT"; eval "$*" 2>&1 | tee -a "$REPORT" || true; }

say "BASIC"
cmd "pwd"
cmd "whoami || true"
cmd "uname -a || true"
cmd "node -v || true"
cmd "npm -v || true"
cmd "pm2 -v || true"
cmd "date || true"

say "PROJECT TREE (TOP)"
cmd "ls -la"
cmd "find \"$ROOT\" -maxdepth 3 -type f \\( -name \"*.js\" -o -name \"*.mjs\" -o -name \"*.cjs\" -o -name \"*.json\" -o -name \"*.sh\" -o -name \"*.env*\" \\) 2>/dev/null | sed 's#^#FILE: #'"

say "ENV FILES (SAFE PREVIEW: KEYS ONLY, VALUES REDACTED)"
cmd "find \"$ROOT\" -maxdepth 6 -type f -name \".env*\" 2>/dev/null | while read -r f; do \
  echo \"--- $f\"; \
  rg -n '^[A-Za-z_][A-Za-z0-9_]*=' \"$f\" | sed -E 's#=.+#=<redacted>#'; \
done"

say "STRIPE-RELATED REFERENCES"
cmd "rg -n \"STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|stripe-signature|webhooks\\.constructEvent|checkout\\.session\\.completed|/webhook/stripe|3009\" \"$ROOT\" 2>/dev/null || true"

say "STRIPE BRIDGE FILE (FIRST 140 LINES)"
BRIDGE="$ROOT/LIMBS/stripe/stripe_sales_bridge.js"
if [ -f "$BRIDGE" ]; then
  cmd "nl -ba \"$BRIDGE\" | sed -n '1,140p'"
  say "NODE SYNTAX CHECK (BRIDGE)"
  cmd "node --check \"$BRIDGE\""
else
  say "BRIDGE NOT FOUND: $BRIDGE"
fi

say "PACKAGE.JSON + LOCKFILES"
cmd "ls -la package.json package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null || true"
cmd "cat package.json 2>/dev/null | sed -n '1,220p' || true"

say "PM2 STATUS"
cmd "pm2 ls || true"
cmd "pm2 jlist 2>/dev/null | head -n 60 || true"

say "PM2 DUMP / ECOSYSTEM"
cmd "ls -la ~/.pm2 2>/dev/null || true"
cmd "ls -la ~/.pm2/dump.pm2 2>/dev/null || true"
cmd "test -f ~/.pm2/dump.pm2 && sed -n '1,220p' ~/.pm2/dump.pm2 || true"
cmd "find \"$ROOT\" -maxdepth 4 -type f \\( -name \"ecosystem.config.js\" -o -name \"ecosystem.config.cjs\" -o -name \"ecosystem.config.json\" \\) -print 2>/dev/null | sed 's#^#FOUND: #'"

say "PM2 APP DETAIL: Stripe_Bridge"
cmd "pm2 describe Stripe_Bridge 2>/dev/null || true"
cmd "pm2 info Stripe_Bridge 2>/dev/null || true"
cmd "pm2 logs Stripe_Bridge --lines 80 2>/dev/null || true"

say "LISTEN CHECK (NO -p)"
cmd "netstat -lnt 2>/dev/null | rg ':3009\\b' || echo '❌ 3009 not listening (netstat)'"
cmd "lsof -iTCP -sTCP:LISTEN -nP 2>/dev/null | rg ':3009' || true"

say "PROCESS CHECK"
cmd "ps -ef | rg 'Stripe_Bridge|stripe_sales_bridge|node .*3009' || true"

say "DONE"
echo
echo "✅ Wrote report: $REPORT"
