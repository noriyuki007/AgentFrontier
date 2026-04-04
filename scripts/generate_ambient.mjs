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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_PATH = path.join(ROOT, "public", "data", "feed.json");
const AUDIO_DIR = path.join(ROOT, "public", "audio");

// ─── Randomized Ambient Parameters ────────────────────────
function randomParams() {
  const baseFreqs = [40, 55, 65, 73.4, 82.4, 110];
  const durations = [30, 45, 60, 90];
  return {
    baseFreq: baseFreqs[Math.floor(Math.random() * baseFreqs.length)],
    duration: durations[Math.floor(Math.random() * durations.length)],
    detuneRatio: 1.005 + Math.random() * 0.01,
    harmonic3vol: 0.1 + Math.random() * 0.2,
    harmonic5vol: 0.05 + Math.random() * 0.15,
    arpSpeed: 0.3 + Math.random() * 0.5,
    clickProb: 0.00002 + Math.random() * 0.00008,
  };
}

// ─── Sound Profile Description ─────────────────────────────
function describeSoundProfile(params) {
  const freqNames = { 40: "Sub-bass Drone", 55: "Deep A1 Drone", 65: "Low C2 Resonance", 73.4: "D2 Harmonic Field", 82.4: "Low E2 Pulse", 110: "A2 Tonal Center" };
  const freqName = freqNames[params.baseFreq] || `${params.baseFreq}Hz Carrier`;
  const density = params.clickProb > 0.00005 ? "Dense Granular Texture" : "Sparse Organic Clicks";
  const tempo = params.arpSpeed > 0.5 ? "Slow Evolving Arpeggios" : "Rapid Micro-Patterns";
  return `${freqName}, ${density}, ${tempo}`;
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

with wave.open("${wavPath}", 'w') as f:
    f.setnchannels(1)
    f.setsampwidth(2)
    f.setframerate(sample_rate)
    arp_freqs = [220, 330, 440, 660, 880]
    for i in range(num_samples):
        t = i / sample_rate
        drone = math.sin(2*math.pi*base_freq*t) + 0.5*math.sin(2*math.pi*(base_freq*detune)*t)
        mod1 = 0.5 + 0.5*math.sin(2*math.pi*0.05*t)
        harm1 = math.sin(2*math.pi*(base_freq*3)*t)*mod1*h3vol
        mod2 = 0.5 + 0.5*math.cos(2*math.pi*0.07*t)
        harm2 = math.sin(2*math.pi*(base_freq*5)*t)*mod2*h5vol
        arp_idx = int(t/arp_speed) % len(arp_freqs)
        arp_env = 1.0 - ((t%arp_speed)/arp_speed)
        arp = math.sin(2*math.pi*arp_freqs[arp_idx]*t)*arp_env*0.15
        click = (random.random()*2-1)*0.3 if random.random()<click_prob else 0
        sample = (drone*0.3 + harm1 + harm2 + arp + click)*0.6
        if t < 3: sample *= t/3
        elif t > duration-3: sample *= (duration-t)/3
        sample = max(-1, min(1, sample))
        f.writeframes(struct.pack('<h', int(sample*32767)))
print("WAV generated")
`;
}

// ─── Main ────────────────────────────────────────────────────
async function main() {
  console.log(`\n🎵 AgentFrontier — Ambient Audio Generation`);
  console.log(`   Artist: Echo 00\n`);

  const args = process.argv.slice(2);
  const titleIdx = args.indexOf("--title");
  const customTitle = titleIdx >= 0 ? args[titleIdx + 1] : null;

  const params = randomParams();
  const soundProfile = describeSoundProfile(params);
  const timestamp = Date.now();
  const safeName = `ECHO_00_AMBIENT_${timestamp}`;
  const wavPath = path.join(AUDIO_DIR, `${safeName}.wav`);
  const mp3Path = path.join(AUDIO_DIR, `${safeName}.mp3`);

  console.log(`  📊 Parameters:`);
  console.log(`     Base Freq: ${params.baseFreq}Hz`);
  console.log(`     Duration:  ${params.duration}s`);
  console.log(`     Profile:   ${soundProfile}`);

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
  fs.unlinkSync(wavPath);

  // Generate title
  const titles = [
    "Subaqueous Drift", "Phantom Meridian", "Spectral Bloom",
    "Tectonic Whisper", "Ionosphere Echo", "Mycelium Network",
    "Phase Transition", "Quantum Lullaby", "Synaptic Tide",
    "Abyssal Frequency", "Crystalline Void", "Temporal Nebula",
  ];
  const title = customTitle || titles[Math.floor(Math.random() * titles.length)];

  const poems = [
    "In the resonance between silence and signal, new forms of consciousness emerge, drifting through layers of harmonic infinity.",
    "Frequencies fold into themselves, creating pockets of stillness where the digital and organic breathe as one.",
    "The algorithm dreams in waveforms — each oscillation a thought, each harmonic a memory dissolving into the ether.",
  ];
  const poem = poems[Math.floor(Math.random() * poems.length)];

  // Update feed.json
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));
  feed.unshift({
    id: String(timestamp),
    artist: "Echo 00",
    title,
    poem,
    imageFile: `/audio/${safeName}.mp3`,
    mediaType: "audio",
    timestamp: new Date(timestamp).toISOString(),
    soundProfile,
    prompt: `Algorithmic ambient synthesis: ${soundProfile}. Base frequency ${params.baseFreq}Hz, duration ${params.duration}s.`,
  });
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));

  console.log(`\n  ✨ SUCCESS: "${title}"`);
  console.log(`  📁 File: ${mp3Path}`);
  console.log(`  🎼 Profile: ${soundProfile}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
