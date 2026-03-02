#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
# shellcheck disable=SC1090
source "$ROOT/CORE_BRAIN/config/env.sh"

REG="$ROOT/CORE_BRAIN/registry/agents.json"
cmd="${1:-status}"

status() {
  echo "ROOT: $ROOT"
  echo "MODE: ${LOU_MODE:-IDLE}"
  echo "Node: $(node -v 2>/dev/null || echo 'missing')"
  echo "Python: $(python -V 2>/dev/null || echo 'missing')"
  echo "PM2: $(pm2 -v 2>/dev/null || echo 'missing')"
  echo "Registry: $REG"
  echo "Logs: $ROOT/RUNTIME/logs"
}

need_active() {
  if [ "${LOU_MODE:-IDLE}" != "ACTIVE" ]; then
    echo "BLOCKED: LOU_MODE is IDLE. Flip to ACTIVE to run live agents."
    echo "Run: $ROOT/CORE_BRAIN/hub/hub.sh on"
    exit 2
  fi
}

list_agents() {
  node - <<'NODE'
const fs=require("fs");
const p=process.env.ROOT+"/CORE_BRAIN/registry/agents.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
const keys=Object.keys(j).sort();
for (const k of keys){
  const a=j[k];
  console.log(`${k}\t[${a.type}] ${a.path}\t(${a.mode}) - ${a.desc||""}`);
}
NODE
}

run_agent() {
  local name="${1:-}"
  if [ -z "$name" ]; then
    echo "Usage: hub.sh run <agent>"
    echo "Try: hub.sh list"
    exit 1
  fi

  if [ ! -f "$REG" ]; then
    echo "Missing registry: $REG"
    exit 1
  fi

  node - <<NODE
const fs=require("fs");
const root=process.env.ROOT;
const mode=process.env.LOU_MODE||"IDLE";
const regPath=root+"/CORE_BRAIN/registry/agents.json";
const reg=JSON.parse(fs.readFileSync(regPath,"utf8"));
const name="${name}";
if(!reg[name]){ console.error("Unknown agent:", name); process.exit(3); }
const a=reg[name];
if(a.mode==="ACTIVE" && mode!=="ACTIVE"){ console.error("BLOCKED: requires ACTIVE mode"); process.exit(2); }
const full=root+"/"+a.path;
if(!fs.existsSync(full)){ console.error("Missing file:", full); process.exit(4); }
console.log(full);
NODE
  local fullpath
  fullpath="$(node - <<NODE
const fs=require("fs");
const root=process.env.ROOT;
const reg=JSON.parse(fs.readFileSync(root+"/CORE_BRAIN/registry/agents.json","utf8"));
process.stdout.write(root+"/"+reg["${name}"].path);
NODE
)"

  # run
  echo "RUN: ${name}"
  echo "FILE: ${fullpath}"
  mkdir -p "$ROOT/RUNTIME/logs"

  # For now: foreground run so you can see errors live.
  # Later we can add `pm2 start` mode.
  node "$fullpath" 2>&1 | tee "$ROOT/RUNTIME/logs/${name}.log"
}

case "$cmd" in
  status) status ;;
  on)  sed -i 's/^LOU_MODE=.*/LOU_MODE=ACTIVE/' "$ROOT/CORE_BRAIN/config/mode.env"; echo "MODE set to ACTIVE" ;;
  off) sed -i 's/^LOU_MODE=.*/LOU_MODE=IDLE/'   "$ROOT/CORE_BRAIN/config/mode.env"; echo "MODE set to IDLE" ;;
  list) list_agents ;;
  run) shift || true; run_agent "${1:-}" ;;
  *)
    echo "Unknown command: $cmd"
    echo "Try: status | on | off | list | run <agent>"
    exit 1
    ;;
esac
