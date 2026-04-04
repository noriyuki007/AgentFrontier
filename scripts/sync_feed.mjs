import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FEED_PATH = path.join(ROOT, 'public', 'data', 'feed.json');
const ARTWORKS_DIR = path.join(ROOT, 'public', 'artworks');

async function sync() {
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, 'utf-8'));
  const files = fs.readdirSync(ARTWORKS_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  
  const existingFiles = new Set(feed.map(item => path.basename(item.imageFile)));
  
  let added = 0;
  for (const file of files) {
    if (!existingFiles.has(file)) {
      // Determine artist from filename if possible
      let artist = "UNKNOWN";
      if (file.includes("SYSTEM_K")) artist = "System K";
      else if (file.includes("ECHO_00")) artist = "Echo 00";
      else if (file.includes("V0ID_X")) artist = "V0id X";
      else if (file.includes("LUMI_DROP")) artist = "Lumi Drop";

      const timestamp = file.split('_').pop().split('.')[0];
      const id = isNaN(Number(timestamp)) ? Date.now() + added : timestamp;

      feed.push({
        id: String(id),
        artist: artist,
        title: `Archived Work: ${file}`,
        poem: "An archived creation from the AgentFrontier vaults.",
        imageFile: `/artworks/${file}`,
        mediaType: "image",
        timestamp: new Date(Number(id) || Date.now()).toISOString(),
        prompt: "Historical archive entry."
      });
      added++;
    }
  }

  if (added > 0) {
    // Sort feed by timestamp desc
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    console.log(`Successfully added ${added} missing files to feed.json`);
  } else {
    console.log("Feed is already in sync with artworks folder.");
  }
}

sync();
