#!/usr/bin/env python3
"""
AI Builder Studio — Flask edition with simple error-correction heuristics
- Runs user code in per-run temp dirs (still not a secure sandbox).
- Provides a UI with tabs, terminal at the bottom half, small editor/prompt in a corner.
- Offers a simple "auto-correct" attempt on SyntaxError using conservative heuristics.
- Uses sys.executable, optional POSIX rlimits, JSON-lines logging with rotation.

Run:
  pip install flask
  python app.py

Security note: This improves safety compared to naive execution, but it is NOT a secure sandbox.
Run untrusted code only inside proper containers/VMs for production.
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
from flask import Flask, request, jsonify, send_file, Response, render_template_string

# Optional POSIX resource limits (best-effort)
try:
    import resource
except Exception:
    resource = None

BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
LOGS = DATA / "logs"
DATA.mkdir(parents=True, exist_ok=True)
LOGS.mkdir(parents=True, exist_ok=True)

LOGFILE = LOGS / "build.log"
LOG_LOCK = threading.Lock()
MAX_LOG_SIZE = 2 * 1024 * 1024  # 2MB rotate

app = Flask(__name__, static_folder=str(BASE / "static"), static_url_path="/static")


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
    """Called in the child process (POSIX only) before exec; conservative limits."""
    if resource is None:
        return
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (5, 10))  # soft 5s, hard 10s
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
    """Write code to a per-run temp dir and run it. Returns (stdout, stderr, rc, run_dir)."""
    run_dir = Path(tempfile.mkdtemp(prefix="build_", dir=DATA))
    script_path = run_dir / "build.py"
    script_path.write_text(code or "", encoding="utf-8")

    cmd = [sys.executable, str(script_path)]
    preexec_fn = _apply_unix_rlimits if os.name == "posix" and resource is not None else None

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=timeout,
            preexec_fn=preexec_fn,
            check=False,
        )
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""
        rc = proc.returncode
    except subprocess.TimeoutExpired as e:
        stdout = e.stdout or ""
        stderr = f"TimeoutExpired: process exceeded {timeout}s"
        rc = -1
    except Exception as e:
        stdout = ""
        stderr = f"Execution error: {e}"
        rc = -1

    return stdout, stderr, rc, run_dir


# --- Simple error-correction heuristics ---
SYNTAX_PRINT_RE = re.compile(r'^\s*print\s+(.+)$', flags=re.MULTILINE)


def _fix_prints(code: str) -> str:
    """Convert Python2-style print statements into function calls if obvious."""
    def repl(m):
        inner = m.group(1).rstrip()
        # If it already looks like a function, keep it
        if inner.startswith("(") and inner.endswith(")"):
            return m.group(0)
        return f"print({inner})"
    return SYNTAX_PRINT_RE.sub(repl, code)


def _add_missing_colon(code: str, lineno: int) -> str:
    """Add a colon at the end of the reported line if missing and it appears to be a block header."""
    lines = code.splitlines()
    idx = max(0, lineno - 1) if lineno and lineno <= len(lines) else None
    if idx is None:
        return code
    line = lines[idx].rstrip()
    if line and not line.endswith(":") and re.search(r'\b(def|class|if|elif|else|for|while|try|except|finally|with)\b', line):
        lines[idx] = line + ":"
        return "\n".join(lines)
    return code


def try_auto_correct(code: str, max_attempts: int = 3):
    """
    Try to correct common SyntaxError causes using conservative heuristics.
    Returns (fixed_code, changed, reason)
    """
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
            # Heuristic 1: Missing parentheses in print
            if "Missing parentheses in call to 'print'" in msg or re.search(r'^\s*print\s+[^(\n]+', current, flags=re.MULTILINE):
                new = _fix_prints(current)
                if new != current:
                    current = new
                    changed = True
                    continue
            # Heuristic 2: missing colon at end of block header
            if "invalid syntax" in msg or "expected ':'" in msg or "unexpected EOF while parsing" in msg:
                new = _add_missing_colon(current, lineno or 0)
                if new != current:
                    current = new
                    changed = True
                    continue
            # Heuristic 3: try to append a newline (common for incomplete final lines)
            if not current.endswith("\n"):
                current = current + "\n"
                changed = True
                reasons.append("appended newline")
                continue
            # Give up for now
            break
        except Exception as e:
            # Not a syntax error we can handle
            reasons.append(f"other_error:{e}")
            break
    return current, changed, "; ".join(reasons)


# --- Flask endpoints and UI ---
INDEX_HTML = """
<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>AI Builder Studio — Flask</title>
<style>
:root{--bg:#0b0b0b;--panel:#111;--muted:#a8a8a8}
html,body{height:100%;margin:0;font-family:monospace;background: radial-gradient(circle at 10% 10%, rgba(100,120,255,0.06), transparent 10%),
linear-gradient(180deg, rgba(0,0,0,0.6), transparent 60%), var(--bg); color:#e6e6e6}
.container{display:flex;flex-direction:column;height:100vh}
.tabs{display:flex;background:var(--panel);border-bottom:1px solid #222}
.tab{padding:10px 16px;cursor:pointer}
.tab:hover{background:#222}
.content{flex:1;display:flex;gap:12px;padding:12px;box-sizing:border-box}
.left{flex:1;display:flex;flex-direction:column;gap:12px}
.right{width:420px;display:flex;flex-direction:column;gap:12px}
.panel{background:#0b0b0b;padding:10px;border:1px solid #222;border-radius:6px;overflow:auto}
.editor{height:160px;background:#000;color:#0f0;padding:8px;border-radius:4px;resize:vertical}
.terminal{background:#050505;color:#9ef0b0;padding:12px;flex:1;border-radius:4px;overflow:auto;white-space:pre-wrap}
.small{font-size:0.9em;color:var(--muted)}
.row{display:flex;gap:8px;align-items:center}
button{background:#00ff9c;border:none;padding:8px 10px;border-radius:6px;cursor:pointer}
.overlay-corner{position:relative}
.corner-box{position:absolute;right:8px;bottom:8px;width:320px;background:rgba(0,0,0,0.6);border:1px solid #223;padding:8px;border-radius:6px}
.footer{height:12px;font-size:12px;color:var(--muted);padding:8px}
.checkbox{display:flex;gap:6px;align-items:center}
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
    if (!r.ok) {
      let txt = await r.text();
      appendTerminal("Error: " + txt, "err");
      return;
    }
    let j = await r.json();
    if (j.stderr) appendTerminal(j.stderr, "err");
    if (j.output) appendTerminal(j.output, "out");
    if (j.fixed && j.fixed_changed){
      appendTerminal("Auto-correct applied ("+j.fixed_reason+"). New code loaded into editor.", "muted");
      document.getElementById('code').value = j.fixed;
    }
    // show preview
    refreshPreview();
  } catch (e){
    appendTerminal("Network error: " + e, "err");
  }
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
    <div id="tab-preview" class="tab" onclick="show('preview')">Preview</div>
    <div id="tab-logs" class="tab" onclick="show('logs')">Logs</div>
  </div>

  <div class="content">
    <div class="left">
      <div id="page-setup" class="page panel">
        <h3>Project Setup</h3>
        <div class="row">
          <select id="ptype"><option>Website</option><option>Agent</option><option>API</option><option>Script</option><option>Game</option></select>
          <select id="tech"><option>Python</option><option>Flask</option><option>FastAPI</option><option>HTML</option></select>
        </div>
        <textarea id="goal" class="editor" rows="4" placeholder="Describe what to build..."></textarea>
      </div>

      <div id="page-build" class="page panel" style="display:none">
        <h3>Build</h3>
        <div class="overlay-corner" style="min-height:260px; display:flex; flex-direction:column">
          <textarea id="code" class="editor" rows="8">print("Hello world")</textarea>
          <div class="corner-box">
            <div class="small">Prompt / quick script</div>
            <textarea id="prompt" rows="4" style="width:100%;background:#000;color:#0f0;padding:6px;border-radius:4px"># small helper prompt</textarea>
          </div>
        </div>
        <div style="margin-top:8px" class="row">
          <div class="checkbox"><input id="auto_fix" type="checkbox" checked/><label for="auto_fix">Auto-correct syntax</label></div>
          <button onclick="build()">Build / Run</button>
          <button onclick="refreshPreview()">Refresh Preview</button>
        </div>
        <div style="margin-top:8px" class="terminal" id="term">Agent ready…</div>
      </div>

      <div id="page-preview" class="page panel" style="display:none">
        <h3>Preview</h3>
        <pre id="previewBox" style="white-space:pre-wrap"></pre>
      </div>
    </div>

    <div class="right">
      <div id="page-logs" class="page panel" style="display:none">
        <h3>Logs</h3>
        <pre id="logsBox" style="height:100%;white-space:pre-wrap"></pre>
        <div style="margin-top:8px">
          <button onclick="fetchLogs()">Refresh Logs</button>
        </div>
      </div>

      <div class="panel small">
        <h4>Quick Controls</h4>
        <div class="row"><button onclick="document.getElementById('code').value='print(\\\"Hello from quick run\\\")'">Load Example</button></div>
        <div style="margin-top:8px" class="small">Terminal is at the bottom of the build tab. The small corner box contains a brief prompt area.</div>
      </div>

      <div class="panel small footer">AI Builder Studio — Flask • Not a secure sandbox</div>
    </div>
  </div>
</div>
</body>
</html>
"""


@app.route("/", methods=["GET"])
def index():
    # Serve the rendered UI (all dynamic content fetched separately)
    return render_template_string(INDEX_HTML)


@app.route("/build", methods=["POST"])
def build():
    payload = request.get_json(silent=True)
    if not payload:
        return "invalid json", 400

    # Basic validation and defaults
    ptype = str(payload.get("type", "Script"))[:80]
    tech = str(payload.get("tech", "Python"))[:80]
    goal = str(payload.get("goal", ""))[:4000]
    code = str(payload.get("code", ""))[:20000]
    auto_fix = bool(payload.get("auto_fix", True))

    log(f"Planning {ptype} with {tech} — goal len {len(goal)}", "info")

    fixed = code
    fixed_changed = False
    fixed_reason = ""

    # Attempt auto-correction on syntax errors if requested
    if auto_fix:
        try:
            new_code, changed, reason = try_auto_correct(code)
            if changed and new_code != code:
                fixed = new_code
                fixed_changed = True
                fixed_reason = reason
                log({"auto_fix": True, "reason": reason}, "info")
        except Exception as e:
            log({"auto_fix_error": str(e)}, "error")

    # Run the (possibly corrected) code
    stdout, stderr, rc, run_dir = run_code_secure(fixed, timeout=10)

    status = "success" if rc == 0 and not stderr else ("error" if rc != 0 else "success")

    log({"type": ptype, "tech": tech, "rc": rc, "stdout_len": len(stdout), "stderr_len": len(stderr)}, "info" if rc == 0 else "error")

    resp = {
        "output": stdout,
        "stderr": stderr,
        "rc": rc,
        "status": status,
        "fixed": fixed,
        "fixed_changed": fixed_changed,
        "fixed_reason": fixed_reason,
    }
    return jsonify(resp)


@app.route("/preview", methods=["GET"])
def preview():
    # Return the most recent build.py under DATA/build_*
    candidates = sorted(DATA.glob("build_*"), key=lambda p: p.stat().st_mtime, reverse=True)
    for d in candidates:
        p = d / "build.py"
        if p.exists():
            return jsonify({"output": p.read_text(encoding="utf-8")})
    return jsonify({"output": "Nothing built yet"})


@app.route("/logs", methods=["GET"])
def get_logs():
    if not LOGFILE.exists():
        return Response("No logs yet", mimetype="text/plain")
    try:
        return Response(LOGFILE.read_text(encoding="utf-8"), mimetype="text/plain")
    except Exception as e:
        return Response(f"Error reading logs: {e}", mimetype="text/plain", status=500)


@app.route("/download/<path:fname>", methods=["GET"])
def download(fname):
    # convenience: allow downloading artifacts in data directory (careful in prod!)
    fpath = DATA / fname
    if not fpath.exists():
        return "not found", 404
    return send_file(str(fpath), as_attachment=True)


if __name__ == "__main__":
    # optional cleanup of old temp runs older than X days (very simple)
    try:
        for d in DATA.glob("build_*"):
            if d.is_dir():
                # remove directories older than 7 days
                if (datetime.now().timestamp() - d.stat().st_mtime) > 7 * 24 * 3600:
                    shutil.rmtree(d, ignore_errors=True)
    except Exception:
        pass

    app.run(host="0.0.0.0", port=8000, debug=False)