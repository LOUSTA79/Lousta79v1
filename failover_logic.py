import os

def call_gemini_with_failover(prompt):
    # Retrieve your multiple keys from Termux env
    keys = [os.getenv("GEMINI_KEY_1"), os.getenv("GEMINI_KEY_2")]
    for key in keys:
        if not key: continue
        try:
            print(f"🤖 Attempting with Key: {key[:8]}...")
            # Your API call logic goes here
            return "Success" 
        except Exception as e:
            print(f"⚠️ Key failed, swapping... {e}")
    return "All keys failed."

if __name__ == "__main__":
    call_gemini_with_failover("Test prompt")
