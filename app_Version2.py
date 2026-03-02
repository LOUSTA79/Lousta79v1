#!/usr/bin/env python3
"""
AI Terminal Studio — Flask + PWA front-end, with simple error-correction.
Run:
  pip install flask
  python app.py

Security: This is NOT a full sandbox. For production, run code in containers / VMs.
"""
import os
import re
import sys
import json
import shutil
import tempfile
import threading
import subprocess
from datetime import datetime
from pathlib import Path
from flask import Flask, request, jsonify, Response, render_template_string, send_from_directory

# Optional POSIX resource limits
try:
    import resource
except Exception:
    resource = None

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
LOGS = DATA / "logs"
STATIC = BASE / "static"
DATA.mkdir(parents=True, exist_ok=True)
LOGS.mkdir(parents=True, exist_ok=True)
STATIC.mkdir(parents=True, exist_ok=True)

LOGFILE = LOGS / "build.log"
LOG_LOCK = threading.Lock()
MAX_LOG_SIZE = 2 * 1024 * 1024  # rotate at 2MB

app = Flask(__name__, static_folder=str(STATIC), static_url_path="/static")


def _rotate_logs_if_needed():
    try:
        if LOGFILE.exists() and LOGFILE.stat().st_size > MAX_LOG_SIZE:
            ts = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
            backup = LOGS / f"build-{ts}.log"
            LOGFILE.rename(backup)
    except Exception:
        pass


def log(msg, level="info"):
    entry = {"time": datetime.utcnow().isoformat(), "level": level, "msg": str(msg)}
    with LOG_LOCK:
        _rotate_logs_if_needed()
        with open(LOGFILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def _apply_unix_rlimits():
    if resource is None:
        return
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (5, 10))
    except Exception:
        pass
    try:
        mem_bytes = 200 * 1024 * 1024
        resource.setrlimit(resource.RLIMIT_AS, (mem_bytes, mem_bytes))
    except Exception:
        pass
    try:
        resource.setrlimit(resource.RLIMIT_FSIZE, (10 * 1024 * 1024, 10 * 1024 * 1024))
    except Exception:
        pass


def run_code_secure(code: str, timeout: int = 10):
    run_dir = Path(tempfile.mkdtemp(prefix="build_", dir=DATA))
    script_path = run_dir / "build.py"
    script_path.write_text(code or "", encoding="utf-8")
    cmd = [sys.executable, str(script_path)]
    preexec = _apply_unix_rlimits if (os.name == "posix" and resource is not None) else None
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            preexec_fn=preexec,
            check=False,
        )
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""
        rc = proc.returncode
    except subprocess.TimeoutExpired as e:
        stdout = e.stdout or ""
        stderr = f"TimeoutExpired: exceeded {timeout}s"
        rc = -1
    except Exception as e:
        stdout = ""
        stderr = f"Execution error: {e}"
        rc = -1
    return stdout, stderr, rc, run_dir


# ----- Simple auto-correct heuristics -----
SYNTAX_PRINT_RE = re.compile(r'^\s*print\s+(.+)$', flags=re.MULTILINE)


def _fix_prints(code: str) -> str:
    def repl(m):
        inner = m.group(1).rstrip()
        if inner.startswith("(") and inner.endswith(")"):
            return m.group(0)
        return f"print({inner})"
    return SYNTAX_PRINT_RE.sub(repl, code)


def _add_missing_colon(code: str, lineno: int) -> str:
    lines = code.splitlines()
    idx = lineno - 1 if lineno and 1 <= lineno <= len(lines) else None
    if idx is None:
        return code
    line = lines[idx].rstrip()
    if line and not line.endswith(":") and re.search(r'\b(def|class|if|elif|else|for|while|try|except|finally|with)\b', line):
        lines[idx] = line + ":"
        return "\n".join(lines)
    return code


def try_auto_correct(code: str, max_attempts: int = 3):
    import ast
    attempt = 0
    current = code
    changed = False
    reasons = []
    while attempt < max_attempts:
        attempt += 1
        try:
            ast.parse(current)
            return current, changed, "; ".join(reasons) if reasons else ""
        except SyntaxError as se:
            msg = getattr(se, "msg", str(se))
            lineno = getattr(se, "lineno", None)
            reasons.append(f"SyntaxError:{msg}@{lineno}")
            if "Missing parentheses in call to 'print'" in msg or re.search(r'^\s*print\s+[^(\n]+', current, flags=re.MULTILINE):
                new = _fix_prints(current)
                if new != current:
                    current = new
                    changed = True
                    continue
            if "invalid syntax" in msg or "expected ':'" in msg or "unexpected EOF while parsing" in msg:
                new = _add_missing_colon(current, lineno or 0)
                if new != current:
                    current = new
                    changed = True
                    continue
            if not current.endswith("\n"):
                current = current + "\n"
                changed = True
                reasons.append("appended newline")
                continue
            break
        except Exception as e:
            reasons.append(f"other_error:{e}")
            break
    return current, changed, "; ".join(reasons)


# ----- UI (responsive + DeX-friendly) -----
INDEX_HTML = """
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>AI Terminal Studio</title>
<link rel="manifest" href="/manifest.json">
<style>
:root{--bg:#0b0b0b;--panel:#111;--muted:#a8a8a8}
html,body{height:100%;margin:0;font-family:monospace;background:linear-gradient(180deg,#071428 0%, #0b0b0b 40%);color:#e6e6e6}
.container{display:flex;flex-direction:column;height:100vh}
.tabs{display:flex;background:var(--panel);border-bottom:1px solid #222}
.tab{padding:10px 16px;cursor:pointer}
.tab:hover{background:#222}
.content{flex:1;display:flex;gap:12px;padding:12px;box-sizing:border-box;min-height:0}
.left{flex:1;display:flex;flex-direction:column;gap:12px;min-width:0}
.right{width:360px;display:flex;flex-direction:column;gap:12px}
.panel{background:#0b0b0b;padding:10px;border:1px solid #222;border-radius:6px;overflow:auto;min-height:80px}
.editor{height:160px;background:#000;color:#0f0;padding:8px;border-radius:4px;resize:vertical;border:1px solid #222}
.terminal{background:#050505;color:#9ef0b0;padding:12px;flex:1;border-radius:4px;overflow:auto;white-space:pre-wrap}
.corner{position:relative}
.corner-box{position:absolute;right:8px;bottom:8px;width:300px;background:rgba(0,0,0,0.6);border:1px solid #223;padding:8px;border-radius:6px}
.row{display:flex;gap:8px;align-items:center}
button{background:#00ff9c;border:none;padding:8px 10px;border-radius:6px;cursor:pointer}
.small{font-size:0.9em;color:var(--muted)}
.footer{height:12px;font-size:12px;color:var(--muted);padding:8px}
@media (max-width:900px){
  .content{flex-direction:column}
  .right{width:100%}
  .corner-box{position:static;margin-top:8px;width:100%}
}
</style>
<script>
function show(id){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
  document.getElementById('tab-'+id).classList.add('active');
  document.getElementById('page-'+id).style.display='block';
}
async function build(){
  let payload = {
    type: document.getElementById('ptype').value,
    tech: document.getElementById('tech').value,
    goal: document.getElementById('goal').value,
    code: document.getElementById('code').value,
    auto_fix: document.getElementById('auto_fix').checked
  };
  appendTerminal(">> Running build...", "muted");
  try {
    let r = await fetch('/build', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if (!r.ok) { appendTerminal("Build request failed: " + r.statusText, "err"); return; }
    let j = await r.json();
    if (j.stderr) appendTerminal(j.stderr, "err");
    if (j.output) appendTerminal(j.output, "out");
    if (j.fixed_changed){
      appendTerminal("Auto-correct applied ("+j.fixed_reason+"). New code loaded.", "muted");
      document.getElementById('code').value = j.fixed;
    }
    refreshPreview();
  } catch (e) { appendTerminal("Network error: " + e, "err"); }
}
function appendTerminal(text, t){
  let box = document.getElementById('term');
  let el = document.createElement('div');
  el.textContent = text;
  if (t==='err') el.style.color='#ff8080';
  if (t==='muted') el.style.color='#bfc7d7';
  box.appendChild(el);
  box.scrollTop = box.scrollHeight;
}
async function refreshPreview(){
  let r = await fetch('/preview');
  if (!r.ok) return;
  let j = await r.json();
  document.getElementById('previewBox').textContent = j.output;
}
async function fetchLogs(){
  let r = await fetch('/logs');
  if (!r.ok) return;
  let txt = await r.text();
  document.getElementById('logsBox').textContent = txt;
}
window.addEventListener('load', ()=>{ show('setup'); fetchLogs(); refreshPreview(); });
</script>
</head>
<body>
<div class="container">
  <div class="tabs">
    <div id="tab-setup" class="tab" onclick="show('setup')">Setup</div>
    <div id="tab-build" class="tab" onclick="show('build')">Build</div>
    <div id="tab-preview