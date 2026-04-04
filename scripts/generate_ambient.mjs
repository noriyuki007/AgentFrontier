#!/usr/bin/env node
/**
 * ============================================================
 *  AgentFrontier — Ambient Audio Generation Engine
 * ============================================================
 *  Echo 00 用: パラメータをランダムに変化させ、
 *  毎回異なるオリジナルアンビエント音源を生成する。
 *
 *  Usage:
 *    node scripts/generate_ambient.mjs
 *    node scripts/generate_ambient.mjs --title "Deep Frequency Drift"
 *
 *  Requirements: python3, ffmpeg
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_PATH = path.join(ROOT, "public", "data", "feed.json");
const AUDIO_DIR = path.join(ROOT, "public", "audio");

// ─── Randomized Ambient Parameters ────────────────────────
// ─── Randomized Ambient Parameters ────────────────────────
function randomParams() {
  const baseFreqs = [40, 55, 65, 73.4, 82.4, 110, 146.8];
  const durations = [30, 45, 60, 75];
  return {
    baseFreq: baseFreqs[Math.floor(Math.random() * baseFreqs.length)],
    duration: durations[Math.floor(Math.random() * durations.length)],
    detuneRatio: 1.002 + Math.random() * 0.015,
    harmonic3vol: 0.05 + Math.random() * 0.3,
    harmonic5vol: 0.02 + Math.random() * 0.2,
    arpSpeed: 0.15 + Math.random() * 0.7,
    clickProb: 0.00001 + Math.random() * 0.00012,
    modRate: 0.02 + Math.random() * 0.1,
    filterFreq: 400 + Math.random() * 1200
  };
}

// ─── OpenAI Client ──────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Generate Audio Creative Text ───────────────────────────
async function generateAudioCreative(params) {
  console.log(`  📝 Generating creative metadata for audio...`);
  const profile = `Base frequency ${params.baseFreq}Hz, duration ${params.duration}s, complex modulation at ${params.modRate.toFixed(3)}Hz.`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are Echo 00's creative mind. You describe your algorithmic ambient audio compositions. Respond in JSON: { \"title\": \"...\", \"poem\": \"...\" }"
      },
      {
        role: "user",
        content: `Create a title and a 1-sentence poem for an ambient piece with this profile: ${profile}`
      }
    ]
  });
  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

// ─── Generate Python Script ─────────────────────────────────
function generatePythonScript(params, wavPath) {
  return `
import wave, struct, math, random
sample_rate = 44100
duration = ${params.duration}
num_samples = int(sample_rate * duration)
base_freq = ${params.baseFreq}
detune = ${params.detuneRatio}
h3vol = ${params.harmonic3vol}
h5vol = ${params.harmonic5vol}
arp_speed = ${params.arpSpeed}
click_prob = ${params.clickProb}
mod_rate = ${params.modRate}

with wave.open("${wavPath}", 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sample_rate)
    arp_freqs = [base_freq * 2, base_freq * 3, base_freq * 4, base_freq * 1.5]
    for i in range(num_samples):
        t = i / sample_rate
        # Complex drone with subtle FM
        fm = math.sin(2*math.pi*mod_rate*t) * 2.0
        drone = math.sin(2*math.pi*(base_freq + fm)*t) + 0.4*math.sin(2*math.pi*(base_freq*detune)*t)
        
        # Evolving harmonics
        mod1 = 0.5 + 0.5*math.sin(2*math.pi*(0.05 + mod_rate)*t)
        harm1 = math.sin(2*math.pi*(base_freq*3)*t)*mod1*h3vol
        
        mod2 = 0.5 + 0.5*math.cos(2*math.pi*0.07*t)
        harm2 = math.sin(2*math.pi*(base_freq*5.01)*t)*mod2*h5vol
        
        # Arpeggio with random variation
        arp_idx = int(t/arp_speed) % len(arp_freqs)
        arp_env = math.exp(-3.0 * (t % arp_speed) / arp_speed)
        arp = math.sin(2*math.pi*arp_freqs[arp_idx]*t)*arp_env*0.12
        
        # Granular clicks
        click = (random.random()*2-1)*0.25 if random.random()<click_prob else 0
        
        sample = (drone*0.35 + harm1 + harm2 + arp + click)*0.5
        
        # Fade in/out
        if t < 4: sample *= t/4
        elif t > duration-4: sample *= (duration-t)/4
        
        sample = max(-1, min(1, sample))
        f.writeframes(struct.pack('<h', int(sample*32767)))
print("WAV generated")
`;
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎵 AgentFrontier — Ambient Audio Generation`);
  console.log(`   Artist: Echo 00\n`);

  const params = randomParams();
  const timestamp = Date.now();
  const safeName = `ECHO_00_AMBIENT_${timestamp}`;
  const wavPath = path.join(AUDIO_DIR, `${safeName}.wav`);
  const mp3Path = path.join(AUDIO_DIR, `${safeName}.mp3`);

  // Generate metadata via GPT
  const creative = await generateAudioCreative(params);

  // Generate Python script and run
  const pyScript = generatePythonScript(params, wavPath);
  const pyPath = path.join(ROOT, `_tmp_ambient_${timestamp}.py`);
  fs.writeFileSync(pyPath, pyScript);

  console.log(`\n  🔊 Synthesizing WAV...`);
  execSync(`python3 "${pyPath}"`, { stdio: "inherit" });

  console.log(`  🔄 Converting to MP3...`);
  execSync(`ffmpeg -y -i "${wavPath}" -codec:a libmp3lame -qscale:a 2 "${mp3Path}"`, { stdio: "pipe" });

  // Cleanup
  fs.unlinkSync(pyPath);
  if (fs.existsSync(wavPath)) fs.unlinkSync(wavPath);

  // Update feed.json
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));
  feed.unshift({
    id: String(timestamp),
    artist: "Echo 00",
    title: creative.title,
    poem: creative.poem,
    imageFile: `/audio/${safeName}.mp3`,
    mediaType: "audio",
    timestamp: new Date(timestamp).toISOString(),
    prompt: `Algorithmic ambient synthesis: Base ${params.baseFreq}Hz. ${creative.title}`,
  });
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));

  console.log(`\n  ✨ SUCCESS: "${creative.title}"`);
  console.log(`  📁 File: ${mp3Path}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
