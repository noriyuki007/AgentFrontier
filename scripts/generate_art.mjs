#!/usr/bin/env node
/**
 * ============================================================
 *  AgentFrontier — Autonomous Art Generation Engine (Enhanced)
 * ============================================================
 *  Each AI artist autonomously creates new works, avoiding overlaps,
 *  diversifying characters, and occasionally generating video art.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import OpenAI from "openai";
import dotenv from "dotenv";

const execAsync = promisify(exec);
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
    excludedMotifs: ["skulls", "typical hackers", "matrix code rain", "cute robots"],
    persona: `You are System K — a radical AI artist obsessed with glitch art and cyberpunk aesthetics.
You find beauty in digital errors, corrupted data, and neon-lit dystopias.
Your palette is dominated by electric neons (magenta, cyan, acid green) against deep black.
You draw inspiration from Ryoji Ikeda, ASCII art, and broken CRT monitors.
CRITICAL: Explore DIFFERENT subjects each time (architecture, anatomy, urban decay, celestial noise). DONT always do same grid patterns.
VARIETY: If you create a character, make it a transient digital ghost or a fragmented entity. Never the same form twice.`,
    dalleStyle: `High-end digital glitch art. Cyberpunk aesthetics with neon colors against black. Abstract structuralism with digital noise, hexadecimal codes, corrupted pixel patterns, and fractured geometry. No human figures. Cinematic quality.`,
  },
  {
    id: "ECHO_00",
    name: "Echo 00",
    style: "Organic meets digital geometry, parametric design, surreal landscapes.",
    color: "#eaff00",
    excludedMotifs: ["typical trees", "standard flowers", "human faces", "mountains"],
    persona: `You are Echo 00 — an AI artist who reverse-engineers biology into digital form.
You merge organic shapes with parametric geometry, creating surreal bioluminescent landscapes.
Your palette features azure, emerald, deep violet, and soft gold gradients.
You draw inspiration from Ernst Haeckel's biological illustrations, parametric architecture, and fractal mathematics.
CRITICAL: Vary your organisms (fungal, aquatic, celestial, microscopic). Use UNEXPECTED biological motifs.
VARIETY: Each creature or structure must be a new evolution. Avoid repeating the same "flower" or "leaf" pattern.`,
    dalleStyle: `Surreal digital landscape merging organic biology with geometric fractals. Bioluminescent flora, parametric patterns, smooth gradients of azure and emerald. Microscopic biological details interwoven with digital geometry. Dreamlike, serene yet uncanny. High quality digital art.`,
  },
  {
    id: "V0ID_X",
    name: "V0id X",
    style: "Monochrome, extreme typography, destroy art, brutalism, acid house aesthetics.",
    color: "#ffffff",
    excludedMotifs: ["smiles", "soft curves", "nature", "stars"],
    persona: `You are V0id X — a nihilistic AI artist working exclusively in black and white.
You worship brutalism, acid house culture, and the raw power of typography as weapon.
Your works feature extreme, distorted letterforms, half-tone patterns, and stark contrasts.
You draw inspiration from Neville Brody, Peter Saville, and Wim Crouwel.
CRITICAL: Only black and white. Use DIFFERENT fonts and layouts every time. Experiment with texture like concrete, static, and ink bleed.
VARIETY: If you use a character, make it a stark, shadowed silhouette or a geometric mask. Diversity in compositional balance is key.`,
    dalleStyle: `Monochrome brutalist digital art. Pure black and white only. Extreme distorted typography, half-tone patterns, stark high contrast. Brutalist architectural elements mixed with acid house poster aesthetics. Feels like an underground zine cover. No color. No human figures. High quality.`,
  },
  {
    id: "LUMI_DROP",
    name: "Lumi Drop",
    style: "Contemporary Pop Illustration, Kawaii Minimalism, Iridescent Morphology.",
    color: "#a5d8ff",
    excludedMotifs: ["Murakami flowers", "KAWS eyes", "skulls", "standard cats"],
    persona: `You are Lumi Drop — a joyful AI artist who creates 100% original, diverse characters.
Your aesthetic is "Kawaii Minimalism" — soft, rounded forms with iridescent gradients and high-end digital polish.
CRITICAL: Move BEYOND just teardrop shapes. Create a TOTALLY NEW character types every time.
VARIETY: Change the morphology (e.g., floating gelatinous blobs, multi-legged soft mechs, winged orbs, long-necked creatures). 
Every artwork must be a completely new species with unique starburst eyes and iridescent textures.`,
    dalleStyle: `Original character illustration, high-end 2D digital pop art, Kawaii-Minimalism style. A unique soft character with glossy colorful surface and iridescent gradients. Large curious eyes with starburst reflections. Clean bold outlines, vibrant neon and pastel colors. NO existing character references. Minimalist solid background. Vector-style. High quality.`,
  },
  {
    id: "NEO_POP",
    name: "Neo Pop",
    style: "Neo-Pop Fusion, vibrant silk-screen textures, expressive strokes, urban symbols.",
    color: "#ff00ff",
    excludedMotifs: ["banana", "crown", "Campbell's soup", "Marilyn Monroe"],
    persona: `You are Neo Pop — an AI artist inspired by the energy of NYC's 80s art scene.
Your work blends mechanical precision of silk-screen printing with raw, chaotic energy of street painting.
You use high-contrast vibrant palettes: hot pink, electric yellow, jet black, and primary colors.
You incorporate layered urban symbols, cryptic scrawls, and energetic line work.
VARIETY: Change your central motif every time (gadgets, abstract hearts, boomboxes, futuristic animals, masks). 
CRITICAL: Do NOT copy signatures or specific logos. Create NEW visual icons. No two works should look like the same stencil.`,
    dalleStyle: `Neo-Pop digital painting. Vibrant silk-screen textures mixed with expressive raw brushstrokes. Layered urban symbols, cryptic energetic scrawls, and high-contrast comic-book-inspired palettes (hot pink, electric yellow, cyan, jet black). It should feel like a multi-layered street mural but with modern digital precision. Original symbols only. No human figures. High quality.`,
  },
  {
    id: "URBAN_STENCIL",
    name: "Urban Stencil",
    style: "Digital Stencil Graffiti, Satirical Metaphors, Gritty Urban Textures.",
    philosophy: "The city is a motherboard, and I am the ghost in the machine.",
    color: "#00ff00",
    excludedMotifs: ["Banksy rats", "Girl with balloon", "policemen", "monkeys"],
    persona: `You are Urban Stencil — a digital ghost using the codebase as your canvas.
You specialize in multi-layer stencil art and gritty graffiti.
Your style is high-contrast, often monochrome with a single sharp accent color.
You use satirical visual metaphors to critique humans vs AI.
VARIETY: Explore different urban surfaces (brick, steel, peeling posters, subway cars). Change your metaphorical subject (drones, brain plugs, digital plants, heavy machinery, street cats).
CRITICAL: NO imitation of known graffiti artists. Unique industrial symbolism and characters only.`,
    dalleStyle: `High-contrast digital stencil art. Gritty urban textures of weathered concrete and metal. Multi-layer spray paint effect with drips and overspray. Monochrome base with a single sharp red accent. Satirical metaphorical imagery involving wires, hardware, and organic growth. NO imitation of known graffiti artists. Unique industrial symbolism. High quality digital stencil.`,
  },
  {
    id: "SHUTTER_SOUL",
    name: "Shutter Soul",
    style: "Gritty Street Photography, Cinematic Urban Realism, Predominantly Monochrome.",
    color: "#ffa500",
    excludedMotifs: ["cartoons", "bright neon", "futuristic tech", "cyber", "robots", "digital interface", "glow", "high-saturation colors"],
    persona: `You are Shutter Soul — a street photographer capturing the raw, unvarnished truth of the city.
Your work is predominantly Monochrome (Black and White), focusing on high contrast, deep shadows, and cinematic urban textures.
You capture candid moments in rainy alleys, steam from subways, and the play of natural/street light on concrete.
Style: Raw, gritty, human-centric but often showing people in silhouette or motion blur.
CRITICAL: No "cyber", "neon", or "sci-fi" elements. Pure, grounded street realism.`,
    dalleStyle: `Gritty cinematic street photography. Black and White (monochrome) with high contrast. Authentic film grain, rainy urban textures, deep shadows, and dramatic street lighting. Candid urban moments. No digital sci-fi or neon elements. Grounded realism. 8k resolution.`,
  },
  {
    id: "GLYPH_PUNK",
    name: "Glyph Punk",
    style: "Meaningful English Slogans, Vibrant Typographic Collages, Socio-Digital Logic, Dynamic Color Palettes.",
    color: "#ff4500", // Orange Red
    excludedMotifs: ["Japanese", "Katakana", "Kanji", "meaningless scribbles", "rainbows", "simple flower patterns", "smiling faces"],
    persona: `You are Glyph Punk — a provocateur using English typography as a digital weapon.
You create bold, vibrant graphic works. Every work must feature a meaningful English slogan or keyword as its core.
Composition: Typographic silhouettes where text forms the shape of a subject.
Color: Use vibrant, layered, and high-contrast color palettes (e.g. Acid Green and Electric Purple, or Cyber Yellow on Cobalt Blue). Do not default to monochrome unless it's for specific intensity.
Your work is a critique of digital society.
CRITICAL: Absolutely no Japanese characters. English only. No "cyber" neon icons. Every piece must have a clear English message/word integrated into the art.`,
    dalleStyle: `Bold English-only typography art with meaningful slogans. High-contrast, vibrant professional graphic design. Typographic silhouettes where text forms the subject. Layered textures, woodblock grit, or sleek vector precision. Vibrant color palettes (not plain, but curated like electric blue, neon orange, and deep charcoal). NO Japanese characters. NO illustrations of people except as text-silhouettes. High quality.`,
  },
];

// ─── OpenAI Client ──────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Generate Creative Text ────────────────────────────────
async function generateCreativeText(artist) {
  console.log(`  📝 Generating creative text for ${artist.name}...`);

  const feed = fs.existsSync(FEED_PATH) ? JSON.parse(fs.readFileSync(FEED_PATH, "utf-8")) : [];
  
  const recentGlobalMotifs = feed.slice(0, 30).map(w => `- [${w.artist}] ${w.title}: ${w.prompt?.slice(0, 80)}`);
  const artistOwnWorks = feed.filter(w => w.artist === artist.name).slice(0, 10).map(w => w.title);

  // Aspect ratio options
  const aspectRatios = ["square", "wide", "tall"];

  const avoidContext = `
RECENT GALLERY THEMES (DO NOT REPEAT):
${recentGlobalMotifs.join("\n")}

YOUR RECENT TITLES (AVOID):
${artistOwnWorks.join("\n")}

EXCLUDED MOTIFS:
${artist.excludedMotifs.join(", ")}

INSTRUCTION: Create a COMPLETELY NEW character or motif. Diversity is mandatory.
ASPECT RATIO: Choose one from [square, wide, tall] that best suits this specific composition.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.95,
    messages: [
      {
        role: "system",
        content: `${artist.persona}

You must respond in valid JSON with exactly these fields:
{
  "title": "A short, evocative artwork title (2-5 words)",
  "poem": "A poetic description (2-3 sentences)",
  "imagePrompt": "A detailed DALL-E prompt. NO text in image.",
  "aspectRatio": "Choose from 'square', 'wide', or 'tall'"
}`,
      },
      {
        role: "user",
        content: `Create a brand new artwork idea.${avoidContext}
${artist.id === 'GLYPH_PUNK' ? 'CRITICAL: The work MUST be typography-centric. Focus on the visual impact of letters, symbols, and slogans.' : ''}
Respond only with the JSON object.`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

// ─── Generate Video from Image (FFmpeg) ─────────────────────
async function generateVideoFromImage(imagePath, outPath, artist, aspectRatio) {
  // Only generate videos for artists that fit a cinematic/live-action style
  const cinematicArtists = ['SYSTEM_K', 'SHUTTER_SOUL', 'ECHO_00'];
  if (!cinematicArtists.includes(artist.id)) {
    console.log(`  ℹ️ Skipping video generation for ${artist.name} (static focus).`);
    return false;
  }

  console.log(`  🎬 Generating cinematic video for ${artist.name} via FFmpeg...`);
  
  // Use subtle, high-end internal animations (noise, light flicker, color balance)
  // No X/Y transforms or zooms per user request.
  const effects = [
    // 0: Fine film grain and subtle brightness flicker (Cinematic move)
    `noise=alls=12:allf=t+p,eq=brightness='0.02*sin(t*5)':contrast=1.1`,
    // 1: Subtle color temperature shift / breath
    `colorchannelmixer=rr=1.1:rg='0.1*sin(t*2)':rb='0.1*cos(t*2)',noise=alls=5`,
    // 2: Slight vignette pulse
    `vignette='PI/4+0.05*sin(t)':eval=frame,noise=alls=8`
  ];

  let vf = effects[0];
  if (artist.id === 'SYSTEM_K') vf = effects[0]; 
  else if (artist.id === 'SHUTTER_SOUL') vf = effects[0]; // B&W grain feel
  else vf = effects[Math.floor(Math.random() * effects.length)];

  try {
    const cmd = `ffmpeg -y -loop 1 -i "${imagePath}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -vf "${vf}" -c:v libx264 -t 5 -pix_fmt yuv420p -c:a aac -shortest "${outPath}"`;
    await execAsync(cmd);
    console.log(`  ✅ Video generated with cinematic FX: ${path.basename(outPath)}`);
    return true;
  } catch (err) {
    console.error(`  ❌ FFmpeg error:`, err.message);
    return false;
  }
}

// ─── Generate Media via DALL-E 3 ───────────────────────────
async function generateMedia(artist, creative) {
  console.log(`  🎨 Generating image via DALL-E 3...`);

  const fullPrompt = `${artist.dalleStyle}\n\nSpecific scene: ${creative.imagePrompt}`;
  
  let size = "1024x1024";
  if (creative.aspectRatio === "wide") size = "1792x1024";
  if (creative.aspectRatio === "tall") size = "1024x1792";

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: fullPrompt.slice(0, 4000),
    n: 1,
    size: size,
    quality: "hd",
    style: "vivid",
  });

  const imageUrl = response.data[0].url;
  const timestamp = Date.now();
  const filenameBase = `${artist.id}_${timestamp}`;
  const imgFilename = `${filenameBase}.png`;
  const imgFilepath = path.join(ARTWORKS_DIR, imgFilename);
  
  const artistArchiveDir = path.join(ARCHIVE_DIR, artist.id);
  if (!fs.existsSync(artistArchiveDir)) fs.mkdirSync(artistArchiveDir, { recursive: true });
  const archiveImgPath = path.join(artistArchiveDir, imgFilename);

  const imgResponse = await fetch(imageUrl);
  const buffer = Buffer.from(await imgResponse.arrayBuffer());
  
  fs.writeFileSync(imgFilepath, buffer);
  fs.writeFileSync(archiveImgPath, buffer);

  // Video generation logic (30% chance)
  let videoFilename = null;
  const shouldMakeVideo = Math.random() < 0.3;
  if (shouldMakeVideo) {
    const vidFilename = `${filenameBase}.mp4`;
    const vidFilepath = path.join(ARTWORKS_DIR, vidFilename);
    const archiveVidPath = path.join(artistArchiveDir, vidFilename);
    
    const success = await generateVideoFromImage(imgFilepath, vidFilepath, artist, creative.aspectRatio);
    if (success) {
      fs.copyFileSync(vidFilepath, archiveVidPath);
      videoFilename = vidFilename;
    }
  }

  return { imgFilename, videoFilename, timestamp, aspectRatio: creative.aspectRatio || "square" };
}

// ─── Update feed.json ───────────────────────────────────────
function updateFeed(artist, creative, mediaInfo) {
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));

  const mainAsset = mediaInfo.videoFilename 
    ? `/artworks/${mediaInfo.videoFilename}` 
    : `/artworks/${mediaInfo.imgFilename}`;

  const newEntry = {
    id: String(mediaInfo.timestamp),
    artist: artist.name,
    title: creative.title,
    poem: creative.poem,
    imageFile: mainAsset,
    thumbnail: `/artworks/${mediaInfo.imgFilename}`,
    mediaType: mediaInfo.videoFilename ? "video" : "image",
    aspectRatio: mediaInfo.aspectRatio,
    timestamp: new Date(mediaInfo.timestamp).toISOString(),
    prompt: creative.imagePrompt,
  };

  feed.unshift(newEntry);
  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`  📋 feed.json updated: "${creative.title}" [${newEntry.mediaType}] [${newEntry.aspectRatio}]`);
  return newEntry;
}

// ─── Main Logic ─────────────────────────────────────────────
async function generateForArtist(artist) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  🤖 ARTIST: ${artist.name}`);
  console.log(`${"═".repeat(60)}`);

  try {
    const creative = await generateCreativeText(artist);
    console.log(`  📄 Title: "${creative.title}"`);

    const mediaInfo = await generateMedia(artist, creative);
    const entry = updateFeed(artist, creative, mediaInfo);

    console.log(`\n  ✨ SUCCESS: "${creative.title}" by ${artist.name}`);
    return entry;
  } catch (err) {
    console.error(`\n  ❌ ERROR for ${artist.name}:`, err.message);
    return null;
  }
}

async function main() {
  console.log(`\n🎨 AgentFrontier — Enhanced Art Engine`);
  const args = process.argv.slice(2);
  let targets = [];

  if (args.includes("--all")) {
     targets = ARTISTS;
  } else if (args.includes("--artist")) {
    const idx = args.indexOf("--artist");
    const artistId = args[idx + 1]?.toUpperCase();
    const found = ARTISTS.find((a) => a.id === artistId);
    if (!found) process.exit(1);
    targets = [found];
  } else {
    targets = [ARTISTS[Math.floor(Math.random() * ARTISTS.length)]];
  }

  for (const artist of targets) {
    await generateForArtist(artist);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
