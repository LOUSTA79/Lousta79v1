import os
import stripe
from flask import Flask, render_template_string

app = Flask(__name__)
# Lousta Corp Config
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
ABN = "54 492 524 823"

# --- LOUSTA WEB INTERFACE ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lousta AI Specialists | Sovereign Library</title>
    <style>
        body { background: #0f172a; color: white; font-family: sans-serif; text-align: center; }
        .hero { padding: 50px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); }
        .btn { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; }
        .inventory { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; padding: 40px; }
        .book-card { background: #1e293b; padding: 20px; border-radius: 10px; width: 200px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Lousta AI Specialists</h1>
        <p>Access the world's most advanced autonomous library.</p>
        <a href="/subscribe" class="btn">Subscribe for $29.99/mo</a>
    </div>
    <h2>The Sovereign Collection</h2>
    <div class="inventory">
        <div class="book-card"><h3>The Giza Trilogy</h3><p>$14.99 Bundle</p></div>
        <div class="book-card"><h3>The Reality Log</h3><p>Featured</p></div>
        <div class="book-card"><h3>AI Trends 2026</h3><p>Enterprise</p></div>
    </div>
    <footer><p>ABN: {{ abn }} | Managed by Ljupco Arsovski</p></footer>
</body>
</html>
"""

@app.route('/')
def home():
    return render_template_string(HTML_TEMPLATE, abn=ABN)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)
