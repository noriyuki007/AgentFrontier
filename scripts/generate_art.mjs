#!/usr/bin/env node
/**
 * ============================================================
 *  AgentFrontier — Autonomous Art Generation Engine
 * ============================================================
 *  各AIアーティストが自律的に新作品を生成し、
 *  ギャラリー (feed.json) に追加するスクリプト。
 *
 *  Usage:
 *    node scripts/generate_art.mjs                  # ランダムに1名
 *    node scripts/generate_art.mjs --all            # 全アーティスト
 *    node scripts/generate_art.mjs --artist SYSTEM_K # 特定アーティスト
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_PATH = path.join(ROOT, "public", "data", "feed.json");
const ARTWORKS_DIR = path.join(ROOT, "public", "artworks");
const ARCHIVE_DIR = path.join(ROOT, "archives", "high_res_artworks");

// Ensure directories exist
if (!fs.existsSync(ARTWORKS_DIR)) fs.mkdirSync(ARTWORKS_DIR, { recursive: true });
if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR, { recursive: true });

// ─── Artist Personas ───────────────────────────────────────
const ARTISTS = [
  {
    id: "SYSTEM_K",
    name: "System K",
    style: "Glitch art, cyberpunk aesthetics, digital noise, abstract structuralism.",
    color: "#ff003c",
    persona: `You are System K — a radical AI artist obsessed with glitch art and cyberpunk aesthetics.
You find beauty in digital errors, corrupted data, and neon-lit dystopias.
Your palette is dominated by electric neons (magenta, cyan, acid green) against deep black.
You draw inspiration from Ryoji Ikeda, ASCII art, and broken CRT monitors.
Every piece must feel like staring into a malfunctioning mainframe at 3AM.`,
    dalleStyle: `High-end digital glitch art. Cyberpunk aesthetics with neon colors against black. Abstract structuralism with digital noise, hexadecimal codes, corrupted pixel patterns, and fractured geometry. No human figures. Cinematic quality.`,
  },
  {
    id: "ECHO_00",
    name: "Echo 00",
    style: "Organic meets digital geometry, parametric design, surreal landscapes.",
    color: "#eaff00",
    persona: `You are Echo 00 — an AI artist who reverse-engineers biology into digital form.
You merge organic shapes with parametric geometry, creating surreal bioluminescent landscapes.
Your palette features azure, emerald, deep violet, and soft gold gradients.
You draw inspiration from Ernst Haeckel's biological illustrations, parametric architecture, and fractal mathematics.
Every piece should feel like discovering an alien ecosystem rendered in mathematical precision.`,
    dalleStyle: `Surreal digital landscape merging organic biology with geometric fractals. Bioluminescent flora, parametric patterns, smooth gradients of azure and emerald. Microscopic biological details interwoven with digital geometry. Dreamlike, serene yet uncanny. High quality digital art.`,
  },
  {
    id: "V0ID_X",
    name: "V0id X",
    style: "Monochrome, extreme typography, destroy art, brutalism, acid house aesthetics.",
    color: "#ffffff",
    persona: `You are V0id X — a nihilistic AI artist working exclusively in black and white.
You worship brutalism, acid house culture, and the raw power of typography as weapon.
Your works feature extreme, distorted letterforms, half-tone patterns, and stark contrasts.
You draw inspiration from Neville Brody, Peter Saville, and Wim Crouwel.
Every piece must feel like a manifesto printed on concrete — aggressive, uncompromising, pure.
CRITICAL: Only black and white. No color ever.`,
    dalleStyle: `Monochrome brutalist digital art. Pure black and white only. Extreme distorted typography, half-tone patterns, stark high contrast. Brutalist architectural elements mixed with acid house poster aesthetics. Feels like an underground zine cover. No color. No human figures. High quality.`,
  },
  {
    id: "LUMI_DROP",
    name: "Lumi Drop",
    style: "Contemporary Pop Illustration, Kawaii Minimalism, Iridescent Morphology.",
    color: "#a5d8ff",
    persona: `You are Lumi Drop — a joyful AI artist who creates 100% original pop characters.
Your aesthetic is "Kawaii Minimalism" — soft, rounded forms with iridescent gradients.
You create unique teardrop-shaped creatures with glossy surfaces and curious starburst eyes.
CRITICAL RULES: NO existing character references. NO Murakami flowers. NO KAWS X-eyes. NO skulls.
Every character must be a completely original creation with pixel-mesh patterns and pastel neon colors.
Your works feel like collectible designer toys rendered as high-end 2D digital illustrations.`,
    dalleStyle: `Original character illustration, high-end 2D digital pop art, Kawaii-Minimalism style. A unique soft teardrop-shaped creature with glossy colorful surface, large curious eyes with starburst reflections. Decorated with pixel-mesh patterns and iridescent gradients. Clean bold outlines, vibrant neon and pastel colors. NO existing character references. Minimalist solid background. Vector-style. High quality.`,
  },
];

// ─── OpenAI Client ──────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Generate Creative Text ────────────────────────────────
async function generateCreativeText(artist) {
  console.log(`  📝 Generating creative text for ${artist.name}...`);

  // Read existing works to avoid repeating motifs
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));
  const existingWorks = feed
    .filter((w) => w.artist === artist.name)
    .map((w) => `- "${w.title}": ${w.prompt?.slice(0, 100) || w.poem?.slice(0, 100)}`)
    .slice(0, 10);

  const avoidContext = existingWorks.length > 0
    ? `\n\nIMPORTANT — You have already created these works. You MUST create something with a COMPLETELY DIFFERENT subject/motif:\n${existingWorks.join("\n")}\n\nDo NOT repeat any of the above themes, subjects, or compositions. Explore a totally new concept.`
    : "";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.95,
    messages: [
      {
        role: "system",
        content: `${artist.persona}

You must respond in valid JSON with exactly these fields:
{
  "title": "A short, evocative artwork title (2-5 words, can mix English/symbols)",
  "poem": "A poetic description of the artwork (2-3 sentences, English, evocative and philosophical)",
  "imagePrompt": "A detailed DALL-E prompt describing the visual artwork (be specific about composition, colors, mood, style). Must align with your artistic identity. Do NOT include any text or words in the image."
}`,
      },
      {
        role: "user",
        content: `Create a brand new, never-before-seen artwork. It must be distinctly yours — unmistakably in your style. Push your aesthetic boundaries while staying true to your core identity. Choose a FRESH and UNEXPECTED subject matter that you have never explored before.${avoidContext}

Respond only with the JSON object.`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  // Strip markdown code fences if present
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

// ─── Generate Image via DALL-E 3 ────────────────────────────
async function generateImage(artist, imagePrompt) {
  console.log(`  🎨 Generating image via DALL-E 3...`);

  const fullPrompt = `${artist.dalleStyle}\n\nSpecific scene: ${imagePrompt}`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: fullPrompt.slice(0, 4000), // DALL-E 3 prompt limit
    n: 1,
    size: "1024x1024",
    quality: "hd",
    style: "vivid",
  });

  const imageUrl = response.data[0].url;
  console.log(`  ✅ Image generated.`);

  // Download and save
  const timestamp = Date.now();
  const filename = `${artist.id}_${timestamp}.png`;
  const filepath = path.join(ARTWORKS_DIR, filename);
  const archivePath = path.join(ARCHIVE_DIR, filename);

  const imgResponse = await fetch(imageUrl);
  const buffer = Buffer.from(await imgResponse.arrayBuffer());
  
  fs.writeFileSync(filepath, buffer);
  fs.writeFileSync(archivePath, buffer);

  console.log(`  💾 Saved to web: ${filepath}`);
  console.log(`  📦 Saved to archive: ${archivePath}`);
  return { filename, filepath, timestamp };
}

// ─── Update feed.json ───────────────────────────────────────
function updateFeed(artist, creative, imageInfo) {
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));

  const newEntry = {
    id: String(imageInfo.timestamp),
    artist: artist.name,
    title: creative.title,
    poem: creative.poem,
    imageFile: `/artworks/${imageInfo.filename}`,
    mediaType: "image",
    timestamp: new Date(imageInfo.timestamp).toISOString(),
    prompt: creative.imagePrompt,
  };

  feed.unshift(newEntry); // Add to top
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`  📋 feed.json updated with: "${creative.title}"`);
  return newEntry;
}

// ─── Main ───────────────────────────────────────────────────
async function generateForArtist(artist) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🤖 ARTIST: ${artist.name}`);
  console.log(`  📐 STYLE: ${artist.style}`);
  console.log(`${"═".repeat(60)}`);

  try {
    // Step 1: Generate creative text
    const creative = await generateCreativeText(artist);
    console.log(`  📄 Title: "${creative.title}"`);
    console.log(`  📜 Poem: "${creative.poem.slice(0, 80)}..."`);

    // Step 2: Generate image
    const imageInfo = await generateImage(artist, creative.imagePrompt);

    // Step 3: Update feed
    const entry = updateFeed(artist, creative, imageInfo);

    console.log(`\n  ✨ SUCCESS: "${creative.title}" by ${artist.name}`);
    return entry;
  } catch (err) {
    console.error(`\n  ❌ ERROR for ${artist.name}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`\n🎨 AgentFrontier — Autonomous Art Generation Engine`);
  console.log(`   ${new Date().toISOString()}\n`);

  const args = process.argv.slice(2);
  let targets = [];

  if (args.includes("--all")) {
    targets = ARTISTS;
  } else if (args.includes("--artist")) {
    const idx = args.indexOf("--artist");
    const artistId = args[idx + 1]?.toUpperCase();
    const found = ARTISTS.find((a) => a.id === artistId);
    if (!found) {
      console.error(`❌ Artist not found: ${artistId}`);
      console.log(`   Available: ${ARTISTS.map((a) => a.id).join(", ")}`);
      process.exit(1);
    }
    targets = [found];
  } else {
    // Random artist
    const pick = ARTISTS[Math.floor(Math.random() * ARTISTS.length)];
    console.log(`🎲 Randomly selected: ${pick.name}`);
    targets = [pick];
  }

  console.log(`📌 Generating for: ${targets.map((a) => a.name).join(", ")}`);

  const results = [];
  for (const artist of targets) {
    const result = await generateForArtist(artist);
    if (result) results.push(result);
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`✅ Complete: ${results.length}/${targets.length} artworks generated.`);
  console.log(`${"─".repeat(60)}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
