#!/usr/bin/env python3
import os
import re
import sys
import argparse

CHANNELS = ["LinkedIn", "X", "TikTok", "YouTube", "Instagram", "Facebook"]

def slugify(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"[^A-Za-z0-9_\-]", "", s)
    return s or "untitled"

def syndicate_content(title: str, mode: str) -> None:
    title_clean = title.strip() or "The Reality Log"
    title_slug = slugify(title_clean)

    out_dir = os.path.join("manufacturing", "syndication")
    os.makedirs(out_dir, exist_ok=True)

    print(f"📡 Syndicating: {title_clean} across all channels...")

    for channel in CHANNELS:
        path = os.path.join(out_dir, f"{channel}_{title_slug}.txt")
        with open(path, "w", encoding="utf-8") as f:
            f.write(f"{channel} | {mode}\n")
            f.write(f"TITLE: {title_clean}\n\n")
            f.write(f"[AUTO-GENERATED SYNDICATION PACK]\n")
            f.write(f"Topic: {title_clean}\n")
            f.write(f"Mode: {mode}\n")

    print(f"✅ Syndication complete for {title_clean}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--topic", default=None)
    p.add_argument("--mode", default="FULL_BOOK")
    p.add_argument("topic_positional", nargs="?", default=None)
    args = p.parse_args()

    topic = args.topic if args.topic is not None else args.topic_positional
    if not topic:
        topic = "The Reality Log"

    syndicate_content(topic, args.mode)

if __name__ == "__main__":
    main()
