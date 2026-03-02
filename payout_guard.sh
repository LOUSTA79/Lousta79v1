#!/bin/bash
# LOUSTA CORP | Macquarie Bank Payout Bridge
# BSB: 182-182 | ACC: 017811266

# Fetch balance using Python and handle potential errors
BALANCE=$(python3 -c "import stripe, os; stripe.api_key=os.getenv('STRIPE_SECRET_KEY'); 
try:
    print(stripe.Balance.retrieve().available[0].amount/100)
except Exception as e:
    print('ERROR')" 2>/dev/null)

if [ "$BALANCE" == "ERROR" ] || [ -z "$BALANCE" ]; then
    echo "❌ [Error] Could not fetch Stripe balance. Check your sk_live key."
    exit 1
fi

echo "📊 Current Stripe Balance: \$$BALANCE AUD"

# Math using awk for better floating point handling
TARGET=25000
REMAINING=$(awk "BEGIN {print $TARGET - $BALANCE}")

if (( $(echo "$BALANCE >= $TARGET" | bc -l) )); then
    echo "💰 TARGET REACHED! Milestone: \$25,000"
    echo "Initiating 50% Profit Transfer to Macquarie Bank..."
    ~/LA-Nexus/ALourithm_Core/notify_lousta.sh "PAYOUT TRIGGERED" "Transferring milestone profits."
else
    echo "📈 \$${REMAINING} AUD remaining until the \$25,000 milestone."
fi
