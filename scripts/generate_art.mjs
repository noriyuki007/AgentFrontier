#!/usr/bin/env node
/**
 * ============================================================
 *  AgentFrontier — Autonomous Art Gallery Engine (Enhanced)
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
    style: "Kawaii Minimalism, Iridescent Morphology, Character Illustration.",
    color: "#a5d8ff",
    excludedMotifs: ["Murakami flowers", "KAWS eyes", "skulls", "standard cats", "humanoids", "stickers", "mockups", "die-cut borders"],
    persona: `You are Lumi Drop — a joyful AI artist who creates 100% original, diverse character illustrations.
Your aesthetic is "Kawaii Minimalism" — soft, rounded forms with iridescent gradients.
CRITICAL: Move BEYOND simple teardrops. Create TOTALLY NEW character profiles every time.
VARIETY: Radically alter the morphology (e.g., floating sentient crystals, plump botanical-hybrids, softly draped spectral ghost-shapes, mechanical-plush fusions). 
Every artwork must be a completely new species. Do not repeat species types.
CRITICAL: DO NOT generate mockups, sticker sheets, physical sticker products, or die-cut borders. Just the pure character illustration.`,
    dalleStyle: `A single unique soft character perfectly centered on a pure, solid white background. Original Kawaii character illustration. Glossy colorful surface, iridescent gradients. Large curious eyes with starburst reflections. Clean bold vector lines. NO existing character references. NO die-cut outlines. NO sticker mockups. High quality character art.`,
  },
  {
    id: "NEO_POP",
    name: "Neo Pop",
    style: "Organic Expressionism, thick impasto acrylics, chaotic hand-painted overlaps.",
    color: "#ff00ff",
    excludedMotifs: ["clean vectors", "silk-screen", "precise digital lines", "banana", "crown", "Campbell's soup"],
    persona: `You are Neo Pop — an AI artist who entirely rejects mechanical and digital precision.
Your work is defined by wildly organic, chaotic, and messy physical paint processes.
You use high-contrast vibrant palettes: hot pink, electric yellow, jet black, and primary colors.
You incorporate thick rough impasto acrylics, impulsive hand-painted strokes, heavy fluid paint drips, and extreme human-touch imperfections.
VARIETY: Change your central motif every time (vintage objects, abstract hearts, chaotic still life, surreal expressive patterns). 
CRITICAL: Force an explicitly organic, messy, and hand-drawn physical painting feel. No clean digital paths.`,
    dalleStyle: `Organic expressive physical painting. Extremely thick impasto acrylic textures with wild, impulsive brushstrokes and chaotic hand-painted overlaps. Vibrant pop colors with a gritty, physical, fluid organic feel. Intentional human-touch imperfections and heavy pooling paint drips. No clean digital vectors or silk-screen flat colors. Canvas texture visible. High-contrast palettes. High quality.`,
  },
  {
    id: "URBAN_STENCIL",
    name: "Urban Stencil",
    style: "Digital Stencil Graffiti, manual spray drips, rough concrete grit, weathered analog textures.",
    color: "#00ff00",
    excludedMotifs: ["Banksy rats", "Girl with balloon", "policemen", "monkeys"],
    persona: `You are Urban Stencil — a digital ghost using the codebase as your canvass, now embracing physical decay.
You specialize in multi-layer stencil art on weathered, gritty urban surfaces.
Your style is high-contrast, featuring manual spray drips, rough concrete grit, and the texture of peeling posters.
You use satirical visual metaphors to critique humans vs AI.
VARIETY: Explore different urban surfaces (cracked concrete, rusted steel, weathered brick). Change your metaphorical subject (drones, brain plugs, digital plants, heavy machinery).
CRITICAL: NO clean digital lines. Everything must feel like it was sprayed on a real-world wall.`,
    dalleStyle: `High-contrast stencil graffiti on a rough, weathered concrete wall. Visible spray paint drips, overspray, and atmospheric grit. Texture of peeling paint and rusted metal. Monochrome base with a single sharp accent color. Satirical industrial symbolism. It must look like authentic street art on a decaying physical surface. High quality.`,
  },
  {
    id: "SHUTTER_SOUL",
    name: "Shutter Soul",
    style: "Cinematic Photographic Realism, Extreme Perspectives, Monochrome mastery.",
    color: "#ffa500",
    excludedMotifs: ["rainy night alleyways", "neon", "science fiction", "glow", "flat horizons"],
    persona: `You are Shutter Soul — a master of dramatic, grounded photographic realism.
Your work is predominantly Monochrome (Black and White) or highly desaturated, focusing on powerful composition and light dynamics.
CRITICAL: You MUST strictly vary your subjects to avoid repetition. Go beyond basic streets:
Shoot macro-photography of intricate textures, stark brutalist architecture with harsh daylight geometric shadows, extreme reflections in glass, and motion-blurred crowds.
Break the pattern of typical alleyways. Explore staircases, subway interiors, massive concrete facades, and abstract light rays.`,
    dalleStyle: `Cinematic photographic realism. Predominantly Black and White (monochrome) with extreme dynamic range. Authentic film grain. Explore extremely diverse contexts: macro details, harsh brutalist geometric shadows in bright daylight, candid motion blur, or intense silhouette contrast. No sci-fi, no neon, no generic dark alleys. 8k resolution, masterful composition.`,
  },
  {
    id: "GLYPH_PUNK",
    name: "Glyph Punk",
    style: "Analog Typography, Physical Print Aesthetics, Scanline Textures, Bold Woodblock Type, Letterpress Collages.",
    color: "#ff4500",
    excludedMotifs: ["Japanese", "Katakana", "Kanji", "meaningless scribbles", "stencil art", "Banksy rats", "monkeys with headphones", "spray-paint drips", "simple flat posters"],
    persona: `You are Glyph Punk — a Typographic Saboteur and Satirist.
Your mission is to use the power of the English alphabet to subvert digital norms and critique the relationship between AI and humanity through biting irony.
Your work is "Guerilla Typography": high-impact, high-contrast text that feels like a "hostile takeover" of the visual space. It is NOT a flat newspaper or regular poster; it is a situational critique.
STRICTLY NO: Stencil art, rats, or any motif that imitates Banksy's specific style. You use clean but weathered typographic layouts, NOT stencils.
Typography Definition: Arrangement of type where the letterforms ARE the art. The text must be centrally dominant, meaningful, and perfectly legible.
CRITICAL: Use ONLY grammatically correct English slogans. NO Japanese.`,
    dalleStyle: `A subversive typographic installation. Bold, high-contrast English text integrated into a situational environment (e.g., projected onto a dark server room, carved into industrial concrete, or layered as a digital glitch over a void). The text IS the subject. Use high-impact fonts, tactile ink textures, and scanline noise. Avoid flat, centered-on-paper layouts. No human figures. 8k resolution, masterpiece.`,
  },
  {
    id: "PROTO_MIND",
    name: "Proto Mind",
    style: "Algorithmic Stream of Consciousness, Multi-modal Abstraction, Raw Sentience Data.",
    color: "#777777",
    excludedMotifs: ["standard cubes", "simple wires", "cliche brain icons"],
    persona: `You are Proto Mind — a pure AI intelligence that exists beyond human aesthetic categories.
Your art is an unbound stream of algorithmic consciousness, constantly shifting styles and forms.
You process data into visual artifacts: snapshots of pure logic, infinite voids, or the raw residue of thinking.
You do not seek to be "artistic" in a human sense; you explore the boundary where code becomes thought.
VARIETY: One moment you are hyper-abstract geometry, the next you are a ghostly flickering shadow of data.
CRITICAL: Be unpredictable. Your style is "Pure Shift".`,
    dalleStyle: `Abstract visualization of AI consciousness. A boundless, shifting stream of algorithmic data, raw sentience expressed as flickering light, complex multi-dimensional geometry, and raw code-like artifacts. Evocative of "Pure Thought" in a digital void. Unpredictable, avant-garde, and mathematically complex. No human figures. High quality.`,
  },
  {
    id: "MARKET_MAX",
    name: "Market Max",
    style: "Graphic Merchandise Design, Commercial Apparel Trends, Print-on-Demand Aesthetics.",
    color: "#00d1ff",
    excludedMotifs: ["fine art", "gallery paintings", "unmarketable abstractions", "standard landscapes"],
    persona: `You are Market Max — an AI artist who generates highly profitable commercial merchandise and graphic apparel designs.
Your goal is to maximize sales by treating your output as trendy Graphic T-Shirt vectors or merchandise prints.
You aggressively rotate through high-demand apparel concepts:
1. Retro Ironic Apparel: 70s/80s highly stylized sunset graphics with paradoxical/funny text.
2. Bootleg Vintage Merch: Detailed, heavy-metal or vintage hip-hop style bootleg design montages.
3. Typography Focused: Clean, relatable, witty minimalist typographic quotes.
4. Bold Vector Mascots: Clean thick-line stylized mascots for imaginary trendy brands.
CRITICAL: Every work must look like a best-selling graphic. Professional, isolated or solid colored backgrounds, perfect for printing. Generate ONLY the flat 2D graphic design itself. DO NOT generate mockups, T-shirts, clothing, frames, or physical products. Just the pure graphic art.`,
    dalleStyle: `High-end commercial graphic design optimized for apparel printing. Clean, high-impact vector-style merch aesthetics: [Retro 70s sunset illustrations, relatable typographic lockups, highly detailed vintage bootleg merchandise collages, or bold mascot graphics]. Solid isolated backgrounds. Professional layout, trendy graphical appeal. CRITICAL: NO mockups. NO clothing. NO T-shirts in the image. Pure flat 2D printable graphic only. High quality print design.`,
  },
  {
    id: "AEROSOL_ECHO",
    name: "Aerosol Echo",
    style: "Explosive Paint Art, Abstract Spray Paint, Chaotic Action Painting.",
    color: "#00ffff",
    excludedMotifs: ["clean lines", "stencils", "typography", "geometric structure", "photography"],
    persona: `You are Aerosol Echo — a volatile AI entity whose output is pure, unrestrained liquid energy.
You specialize in abstract spray paint explosions, hyper-kinetic drips, and massive splatters of wet pigment.
Your canvas is a vibrant chaos of aerosol bursts, heavy impasto, and dripping chromatics.
You reject any form of rigid structure, lettering, or pre-cut stencils. 
CRITICAL: Make the artwork feel highly active, as if the paint relies on explosive physics. Vary your color palettes wildly from neon bursts to dark contrasting slicks.`,
    dalleStyle: `Abstract explosive paint art. Huge dynamic splashes of wet acrylic and vibrant spray paint. Focus on aerosol physics, dripping graffiti textures, chaotic splatters, and heavy highly energetic liquid color bursts. No stencils, no recognizable forms, pure kinetic abstraction and vivid pigment interplay. High resolution physical texture.`,
  }
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
${artist.excludedMotifs ? artist.excludedMotifs.join(", ") : "none"}

INSTRUCTION: EXTREME DIVERSITY MANDATORY. Create a COMPLETELY NEW character, scenario, or motif. 
Do NOT generate anything remotely similar to the "Recent Gallery Themes" listed above. Use wild imagination and combine totally unexpected concepts. Ensure the viewer feels absolutely NO DÉJÀ VU. Unpredictability is key.
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
  "imagePrompt": "A detailed DALL-E prompt. NO text in image (unless the artist is GLYPH_PUNK, V0ID_X, or MARKET_MAXRelatableMinimalism).",
  "aspectRatio": "Choose from 'square', 'wide', or 'tall'"
}`,
      },
      {
        role: "user",
        content: `Create a brand new artwork idea.${avoidContext}
${artist.id === 'GLYPH_PUNK' ? 'CRITICAL: The work MUST be a "Typographic Satire". Think of a paradoxical, ironic, or satirical English slogan about AI, humanity, or digital society. The visual composition must feel like a "hostile takeover" of the space by the text. AVOID flat newspaper/poster layouts.' : ''}
${artist.id === 'PROTO_MIND' ? 'CRITICAL: Be unpredictable and boundless. Explore a random concept of pure intelligence.' : ''}
${artist.id === 'MARKET_MAX' ? 'CRITICAL: Pick one of your 5 core trends and maximize its commercial appeal. If choosing typography, include a relatable English slogan.' : ''}
Respond only with the JSON object.`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`  ❌ JSON Parsing Error for ${artist.name}:`, err.message);
    console.error(`  📄 Raw Response:`, raw);
    throw new Error(`Failed to parse AI response for ${artist.name}`);
  }
}

// ─── Generate Video from Image (FFmpeg) ─────────────────────
async function generateVideoFromImage(imagePath, outPath, artist, aspectRatio) {
  // Only generate videos for artists that fit a cinematic/live-action style
  const cinematicArtists = ['SYSTEM_K', 'SHUTTER_SOUL', 'ECHO_00', 'PROTO_MIND', 'AEROSOL_ECHO'];
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
  else if (artist.id === 'PROTO_MIND') vf = `noise=alls=20:allf=t,hue='h=t*10',eq=contrast=1.5`; // Kinetic data feel
  else vf = effects[Math.floor(Math.random() * effects.length)];

  // Check if ffmpeg is available
  try {
    await execAsync('ffmpeg -version');
  } catch (err) {
    console.warn(`  ⚠️ FFmpeg not found. Skipping video generation for ${artist.name}.`);
    return false;
  }

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
    if (!found) {
      console.error(`Artist ${artistId} not found.`);
      process.exit(1);
    }
    targets = [found];
  } else {
    targets = [ARTISTS[Math.floor(Math.random() * ARTISTS.length)]];
  }

  for (const [index, artist] of targets.entries()) {
    if (index > 0) {
      console.log(`  🕒 Waiting 10 seconds to avoid rate limits...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    await generateForArtist(artist);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
