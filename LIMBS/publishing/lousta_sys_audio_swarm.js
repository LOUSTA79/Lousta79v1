#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function getArg(name) {
  // supports: --topic "X", --topic=X
  const idx = process.argv.indexOf(name);
  if (idx !== -1) return process.argv[idx + 1];
  const pref = name + "=";
  const hit = process.argv.find(a => a.startsWith(pref));
  if (hit) return hit.slice(pref.length);
  return null;
}

function slugify(s) {
  return (s || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^A-Za-z0-9_\-]/g, "") || "untitled";
}


const topic = getArg("--topic") || process.env.TOPIC || "The Reality Log";
const topicSlug = slugify(topic);

const outDir = path.join("RUNTIME", "artifacts", "audiobooks");
fs.mkdirSync(outDir, { recursive: true });

console.log(`[AUDIO-SWARM] ${new Date().toISOString()} - 🎙️ Starting Neural Narration for: ${topic}`);

const outFile = path.join(outDir, `${topicSlug}.mp3`);

// Placeholder “synthesis”: create a file so pipeline proves it works.
// Replace this with real TTS later.
fs.writeFileSync(outFile, `AUDIOBOOK PLACEHOLDER for: ${topic}\nGenerated: ${new Date().toISOString()}\n`, "utf8");

console.log(`[AUDIO-SWARM] ${new Date().toISOString()} - ✅ Audiobook Synthesis Complete: ${outFile}`);
