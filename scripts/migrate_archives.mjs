import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const FEED_PATH = path.join(ROOT, 'public', 'data', 'feed.json');
const ARTWORKS_DIR = path.join(ROOT, 'public', 'artworks');
const ARCHIVE_DIR = path.join(ROOT, 'archives', 'high_res_artworks');

const ARTIST_IDS = ["SYSTEM_K", "ECHO_00", "V0ID_X", "LUMI_DROP", "NEO_POP", "URBAN_STENCIL"];

async function migrate() {
  // 1. Move files in archive to subfolders
  const archiveFiles = fs.readdirSync(ARCHIVE_DIR).filter(f => fs.lstatSync(path.join(ARCHIVE_DIR, f)).isFile());
  
  for (const file of archiveFiles) {
    const artistId = ARTIST_IDS.find(id => file.startsWith(id));
    if (artistId) {
      const targetDir = path.join(ARCHIVE_DIR, artistId);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.renameSync(path.join(ARCHIVE_DIR, file), path.join(targetDir, file));
      console.log(`Moved ${file} to ${artistId}/`);
    }
  }

  // 2. Sync feed with public/artworks
  const feed = JSON.parse(fs.readFileSync(FEED_PATH, 'utf-8'));
  const artworkFiles = fs.readdirSync(ARTWORKS_DIR).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
  const existingFiles = new Set(feed.map(item => path.basename(item.imageFile)));
  
  let added = 0;
  for (const file of artworkFiles) {
    if (!existingFiles.has(file)) {
      let artist = "UNKNOWN";
      if (file.includes("SYSTEM_K")) artist = "System K";
      else if (file.includes("ECHO_00")) artist = "Echo 00";
      else if (file.includes("V0ID_X")) artist = "V0id X";
      else if (file.includes("LUMI_DROP")) artist = "Lumi Drop";
      else if (file.includes("NEO_POP")) artist = "Neo Pop";
      else if (file.includes("URBAN_STENCIL")) artist = "Urban Stencil";

      const timestamp = file.split('_').pop().split('.')[0];
      const id = isNaN(Number(timestamp)) ? Date.now() + added : timestamp;

      feed.push({
        id: String(id),
        artist: artist,
        title: `Restored Work: ${file.split('_')[0]} Series`,
        poem: "A recovered fragment from the digital frontier.",
        imageFile: `/artworks/${file}`,
        mediaType: "image",
        timestamp: new Date(Number(id) || Date.now()).toISOString(),
        prompt: "Historical archive synchronization."
      });
      added++;
    }
  }

  if (added > 0) {
    feed.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    console.log(`Synced ${added} images to feed.json`);
  }
}

migrate();
