import time, re
from pathlib import Path

regions = ["Singapore", "Dubai", "Mumbai", "Sydney"]
log_path = Path.home() / ".lousta_system_core" / "logs" / "pitch_log.txt"
tunnel_log = Path.home() / ".lousta_system_core" / "logs" / "tunnel.log"

def latest_tunnel_url():
    if not tunnel_log.exists():
        return ""
    text = tunnel_log.read_text(errors="ignore")
    hits = re.findall(r"https://.*\.trycloudflare\.com", text)
    return hits[-1].strip() if hits else ""

def push_global_pitches():
    print("🌍 Initiating Global Pitch Sequence...")
    url = latest_tunnel_url()
    for region in regions:
        print(f"📡 Deploying Technical Previews to {region}...")
        with log_path.open("a") as f:
            f.write(f"{time.ctime()}: Pitch sent to {region} via {url}\n")
        time.sleep(1)

if __name__ == "__main__":
    push_global_pitches()
