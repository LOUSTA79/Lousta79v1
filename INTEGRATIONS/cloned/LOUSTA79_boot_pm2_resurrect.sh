#!/data/data/com.termux/files/usr/bin/bash
export HOME=/data/data/com.termux/files/home
cd "$HOME"
# Load your env (Stripe keys, etc)
[ -f "$HOME/.lousta_env" ] && source "$HOME/.lousta_env"
# Restore pm2 process list
pm2 resurrect || true
pm2 save || true
