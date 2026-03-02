import stripe
import os
import subprocess
from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import FileResponse

# LOUSTA CORP | GATEKEEPER LIVE-SYNC v2.0
app = FastAPI()

# Configuration
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
ASSET_DIR = os.path.expanduser("~/lousta/manufacturing")

@app.post("/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, endpoint_secret)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        customer_email = session.get('customer_details', {}).get('email')
        customer_name = session.get('customer_details', {}).get('name', "New Member")
        
        print(f"💰 Payment Verified: {customer_email}")
        
        # TRIGGER WELCOME AGENT
        subprocess.run(["python", os.path.expanduser("~/lousta/member_welcome_agent.py"), customer_email, customer_name])

    return {"status": "success"}

@app.get("/download/{asset_type}/{filename}")
def download_asset(asset_type: str, filename: str, token: str):
    # Live check logic can be added here
    file_path = os.path.join(ASSET_DIR, asset_type, filename)
    return FileResponse(path=file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
