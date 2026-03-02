#!/bin/bash
# LOUSTA CORP | GLOBAL TUNNEL v1.0
# ABN: 54 492 524 823

echo "🕵️ Loubot: Initializing Secure Global Tunnel..."
echo "--------------------------------------------------"
echo "🌍 TARGET: http://localhost:8080 (Executive Dashboard & Docs)"
echo "🔒 ENCRYPTION: TLS 1.3 Activated"
echo "--------------------------------------------------"

# Launch Cloudflare Quick Tunnel
# This will output a unique .trycloudflare.com URL
cloudflared tunnel --url http://localhost:8080
