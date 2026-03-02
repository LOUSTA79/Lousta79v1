from flask import Flask, render_template_string, Response
import os, time, json, socket

app = Flask(__name__)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <title>LOUSTA LIVE</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { background: #050505; color: #00ff41; font-family: sans-serif; margin: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .card { border: 1px solid #1a1a1a; padding: 15px; background: #0f0f0f; border-radius: 8px; }
    .label { color: #008f11; font-size: 0.7em; text-transform: uppercase; letter-spacing: 1px; }
    .value { font-size: 1.2em; font-weight: bold; display: block; margin-top: 5px; color: #fff; }
    .pulse { height: 10px; width: 10px; background: #00ff41; border-radius: 50%; display: inline-block; margin-right: 5px; animation: blink 1s infinite; }
    @keyframes blink { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
    .log-box { margin-top: 20px; font-family: monospace; font-size: 0.8em; color: #888; border-top: 1px solid #1a1a1a; padding-top: 10px; }
  </style>
</head>
<body>
  <h3><span class="pulse"></span> LOUSTA COMMAND</h3>
  <div class="grid">
    <div class="card"><span class="label">Revenue</span><span class="value" id="rev">$0.00</span></div>
    <div class="card"><span class="label">Leads</span><span class="value" id="leads">0</span></div>
    <div class="card"><span class="label">Status</span><span class="value" style="color:#00ff41;">ACTIVE</span></div>
    <div class="card"><span class="label">Temp</span><span class="value">—</span></div>
  </div>
  <div class="log-box" id="log">📡 Connecting…</div>

  <script>
    const es = new EventSource("/stream");
    es.onmessage = function(e) {
      const data = JSON.parse(e.data);
      document.getElementById('rev').innerText = data.revenue;
      document.getElementById('leads').innerText = data.leads;
      const log = document.getElementById('log');
      log.innerHTML = "<div>[" + new Date().toLocaleTimeString() + "] " + data.last_event + "</div>" + log.innerHTML;
    };
  </script>
</body>
</html>
"""

@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)

@app.route("/stream")
def stream():
    def generate():
        while True:
            stats = {
                "revenue": "$18,500.00 AUD",
                "leads": "34",
                "last_event": "Live pulse ok."
            }
            yield f"data: {json.dumps(stats)}\n\n"
            time.sleep(5)
    return Response(generate(), mimetype="text/event-stream")

def pick_port(preferred: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", preferred))
            return preferred
        except OSError:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s2:
                s2.bind(("127.0.0.1", 0))
                return s2.getsockname()[1]

if __name__ == "__main__":
    preferred = int(os.environ.get("PORT", "8081"))
    port = pick_port(preferred)
    print(f"✅ Dashboard: http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port)
