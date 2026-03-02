#!/bin/bash
# LAc Vault → Publishing Empire Sync
# Built by LOUSTA | ABN 54 492 524 823

VAULT_API="http://localhost:9999/retrieve"
OUTPUT_FILE="../.env.connectors"

echo "🔐 Pulling validated credentials from LAc Vault..."

# Function to fetch and format
fetch_key() {
    local connector=$1
    local key_name=$2
    # Retrieve from local vault agent
    val=$(curl -s -X POST $VAULT_API \
      -H "Content-Type: application/json" \
      -d "{\"connector\": \"$connector\", \"keyName\": \"$key_name\"}" | jq -r '.value')
    
    if [ "$val" != "null" ]; then
        echo "$key_name=\"$val\"" >> $OUTPUT_FILE
        echo "✅ $key_name synced."
    else
        echo "❌ $key_name missing in vault."
    fi
}

# Clear old connectors
> $OUTPUT_FILE
chmod 600 $OUTPUT_FILE

# Sync core stack
fetch_key "github" "GITHUB_TOKEN"
fetch_key "stripe" "STRIPE_SECRET_KEY"
fetch_key "railway" "RAILWAY_TOKEN"
fetch_key "anthropic" "ANTHROPIC_API_KEY"

echo "🚀 Sync complete. .env.connectors is live."
