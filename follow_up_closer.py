import time
from pathlib import Path

class ClosingHammer:
    def __init__(self):
        self.log_path = Path.home() / ".lousta_system_core" / "logs" / "pitch_log.txt"

    def execute_follow_up(self):
        print("🔨 Scanning for 'Silent' Leads...")
        if not self.log_path.exists():
            print("No pitch log found.")
            return

        lines = self.log_path.read_text(errors="ignore").splitlines(True)
        for line in lines:
            if "Pitch sent" in line and "FOLLOWED_UP" not in line:
                target = line.split("sent to ")[1].split(" via")[0]
                print(f"🔥 Sending follow-up to {target}...")
                with self.log_path.open("a") as log:
                    log.write(f"{time.ctime()}: FOLLOWED_UP sent to {target}\n")

if __name__ == "__main__":
    ClosingHammer().execute_follow_up()
