#!/data/data/com.termux/files/usr/bin/bash
set -e

pkg update -y
pkg install -y python

# Termux forbids upgrading pip via pip (by design). Don't do it.
python -m pip install stripe httpx python-dotenv fastapi uvicorn

echo "OK"
