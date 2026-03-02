import os

def loubot_speak(text):
    os.system(f"termux-tts-speak '{text}'")

if __name__ == "__main__":
    loubot_speak("Lousta Corp is now at full production capacity. All channels are open. Revenue mode is active.")
