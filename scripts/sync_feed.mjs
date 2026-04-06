import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ARTWORKS_DIR = path.join(ROOT, 'public', 'artworks');
const FEED_PATH = path.join(ROOT, 'public', 'data', 'feed.json');

const ARTIST_MAP = {
  'SYSTEM_K': 'System K',
  'ECHO_00': 'Echo 00',
  'V0ID_X': 'V0id X',
  'LUMI_DROP': 'Lumi Drop',
  'NEO_POP': 'Neo Pop',
  'URBAN_STENCIL': 'Urban Stencil',
  'SHUTTER_SOUL': 'Shutter Soul',
  'GLYPH_PUNK': 'Glyph Punk',
  'PROTO_MIND': 'Proto Mind',
  'MARKET_MAX': 'Market Max'
};

async function sync() {
  console.log('🔄 Syncing feed with artworks directory...');
  
  const files = fs.readdirSync(ARTWORKS_DIR);
  const artworks = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  
  let feed = [];
  if (fs.existsSync(FEED_PATH)) {
    feed = JSON.parse(fs.readFileSync(FEED_PATH, 'utf-8'));
  }

  const existingIds = new Set(feed.map(item => item.id));

  for (const file of artworks) {
    const id = file.split('_').pop().split('.')[0];
    if (existingIds.has(id)) continue;

    const artistId = Object.keys(ARTIST_MAP).find(key => file.startsWith(key));
    if (!artistId) continue;

    // Build basic entry if missing
    // Note: generate_art.mjs usually creates the full entry, this is a fallback
    const newEntry = {
      id,
      artist: ARTIST_MAP[artistId],
      title: 'Untitled Archive',
      poem: 'Synchronized from local storage.',
      imageFile: `/artworks/${file}`,
      thumbnail: `/artworks/${file}`,
      mediaType: 'image',
      aspectRatio: 'square',
      timestamp: new Date(parseInt(id)).toISOString(),
      prompt: 'Imported'
    };
    feed.unshift(newEntry);
    console.log(`  ➕ Added missing: ${file}`);
  }

  // Sort by timestamp
  feed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log('✅ Feed synchronization complete.');
}

sync().catch(console.error);
