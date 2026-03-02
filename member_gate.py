import stripe
import os
from flask import Flask, request, abort, send_from_directory

app = Flask(__name__)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Directory where your processed books live
BOOKS_DIR = os.path.expanduser("~/lousta/manufacturing/books")

@app.route('/download/<filename>')
def secure_download(filename):
    # Retrieve the Stripe Session ID from the URL (e.g., ?session_id=...)
    session_id = request.args.get('session_id')
    
    if not session_id:
        return "❌ Access Denied: No Active Subscription Found.", 403

    try:
        # Verify the session with Stripe
        session = stripe.checkout.session.retrieve(session_id)
        if session.payment_status == 'paid':
            print(f"✅ Verified: Serving {filename} to authorized member.")
            return send_from_directory(BOOKS_DIR, filename)
        else:
            abort(403)
    except Exception as e:
        return f"⚠️ Auth Error: {str(e)}", 500

if __name__ == "__main__":
    app.run(port=8080)
