#!/bin/bash
# LOUSTA CORP | System Notification Agent
# ABN: 54 492 524 823

TITLE=$1
MESSAGE=$2

termux-notification \
    --title "👑 LAc Empire: $TITLE" \
    --content "$MESSAGE" \
    --id "lousta_prod" \
    --priority "high" \
    --led-color "00FF00" \
    --on-click "termux-open-url http://localhost:8000"
