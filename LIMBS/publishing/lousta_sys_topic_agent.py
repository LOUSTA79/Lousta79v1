#!/usr/bin/env python3
import argparse, os, re, sys, time
from pathlib import Path
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

FALLBACK = [
  "Agentic Manufacturing",
  "AI Agents for Small Business",
  "Local AI on Android Termux",
  "Autonomous Book Production Pipelines",
  "RAG vs Fine-Tuning 2026",
  "AI Safety for Creator Automation",
  "Stripe + Webhooks for Digital Products",
  "Short-Form Video Automation Workflow",
  "Prompt Engineering for Story Worlds",
  "AI Copyright & Platform Compliance Checklist",
]

CAT_QUERIES = {

  "ai": [
    "AI agents", "agentic workflows", "open source LLM", "RAG pipeline",
    "on-device AI", "AI automation", "multimodal models"
  ],
  "books": [
    "kindle publishing trends", "audiobooks AI narration", "romance book trends",
    "cozy mystery trends", "children book trends"
  ],
  "business": [
    "small business automation", "shopify AI", "creator economy tools",
    "digital products trend", "side hustle automation"
  ],
}

BANNED_WORDS = {
  "malicious","hijack","kill","flaw","exploit","breach","obnoxious","scam","lawsuit",
  "terror","porn","adult","extremist","hate","illegal","weapon","drugs"
}

def is_good_topic(s: str) -> bool:
  s2 = s.lower()
  if any(w in s2 for w in BANNED_WORDS):
    return False
  # avoid super clickbait punctuation
  if s.count(":") > 2 or s.count("!") > 1:
    return False
  return True

def normalize_topic(s: str, max_len: int = 90) -> str:
  s = re.sub(r"\s+", " ", s).strip()
  # remove quotes weirdness
  s = s.replace("“","").replace("”","").replace('"',"").strip()
  if len(s) > max_len:
    s = s[:max_len].rstrip()
  return s


def fetch_rss_titles(query: str, timeout: int = 12) -> list[str]:
  q = urllib.parse.quote(query)
  url = f"https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"
  req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Termux; Lousta) TopicAgent/1.0"})
  with urllib.request.urlopen(req, timeout=timeout) as r:
    data = r.read()
  root = ET.fromstring(data)
  titles = []
  for item in root.findall(".//item/title"):
    if item.text:
      t = item.text.strip()
      # Google News titles often include " - Source"; remove that
      t = re.sub(r"\s+-\s+[^-]{2,}$", "", t).strip()
      if t and t.lower() not in ("rss",):
        titles.append(t)
  return titles

def clean_unique(titles: list[str], limit: int) -> list[str]:
  seen = set()
  out = []
  for t in titles:
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) < 6:
      continue
    key = t.lower()
    if key in seen:
      continue
    seen.add(key)
    out.append(t)
    if len(out) >= limit:
      break
  return out

def write_out(outpath: str, titles: list[str]) -> None:
  p = Path(outpath)
  p.parent.mkdir(parents=True, exist_ok=True)
  with p.open("w", encoding="utf-8") as f:
    for t in titles:
      f.write(t + "\n")

def main():
  ap = argparse.ArgumentParser()
  ap.add_argument("--cat", default="ai")
  ap.add_argument("--limit", type=int, default=10)
  ap.add_argument("--out", default="RUNTIME/topics_queue.txt")
  args = ap.parse_args()

  cat = (args.cat or "ai").lower()
  limit = max(1, min(int(args.limit), 50))
  outpath = args.out

  queries = CAT_QUERIES.get(cat, CAT_QUERIES["ai"])
  all_titles: list[str] = []

  errors = []
  for q in queries:
    try:
      all_titles.extend(fetch_rss_titles(q))
      time.sleep(0.2)
    except Exception as e:
      errors.append(f"{q}: {type(e).__name__}: {e}")

  titles = [normalize_topic(x) for x in clean_unique(all_titles, limit*3) if is_good_topic(x)]
  titles = titles[:limit]

  if not titles:
    titles = FALLBACK[:limit]

  write_out(outpath, titles)

  print(f"✅ Wrote {len(titles)} topics to {outpath}")
  for i, t in enumerate(titles, 1):
    print(f"{i}. {t}")

  if errors:
    # Non-fatal: we still wrote a queue.
    print("⚠️ RSS fetch issues (non-fatal):", file=sys.stderr)
    for e in errors[:10]:
      print(" - " + e, file=sys.stderr)

if __name__ == "__main__":
  main()
