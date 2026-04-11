import fs from "fs";
import path from "path";
import { Jimp } from "jimp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_PATH = path.join(ROOT, "public", "data", "feed.json");
const ARTWORKS_DIR = path.join(ROOT, "public", "artworks");
const ARCHIVE_DIR = path.join(ROOT, "archives", "high_res_artworks");

async function reorganize() {
  console.log("🚀 Starting Media Reorganization...");

  if (!fs.existsSync(FEED_PATH)) {
    console.error("Feed not found.");
    return;
  }

  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf8"));
  let updatedCount = 0;

  for (const entry of feed) {
    if (entry.mediaType !== "image") continue;

    const oldFilename = path.basename(entry.imageFile);
    const oldPath = path.join(ARTWORKS_DIR, oldFilename);

    if (!fs.existsSync(oldPath)) {
      console.warn(`⚠️  Missing file: ${oldFilename}`);
      continue;
    }

    // 1. Prepare Archive Path
    const artistId = entry.artist.toUpperCase().replace(/\s+/g, '_');
    const artistArchiveDir = path.join(ARCHIVE_DIR, artistId);
    if (!fs.existsSync(artistArchiveDir)) fs.mkdirSync(artistArchiveDir, { recursive: true });
    
    // Archive the original (keep it as .png or whatever it was)
    const archivePath = path.join(artistArchiveDir, oldFilename);
    if (!fs.existsSync(archivePath)) {
      fs.copyFileSync(oldPath, archivePath);
      console.log(`📦 Archived: ${oldFilename}`);
    }

    // 2. Create Optimized Web Version (1600px JPG)
    const newFilename = oldFilename.replace(/\.[^/.]+$/, "") + ".jpg";
    const newPath = path.join(ARTWORKS_DIR, newFilename);

    if (!fs.existsSync(newPath) || oldFilename.endsWith(".png")) {
      try {
        const image = await Jimp.read(oldPath);
        if (image.width > 1600) {
          await image.resize({ w: 1600 });
        }
        await image.write(newPath); // Jimp handles JPG extension automatic quality
        console.log(`🎨 Optimized: ${newFilename}`);

        // 3. Update Feed
        entry.imageFile = `/artworks/${newFilename}`;
        updatedCount++;

        // 4. Cleanup old large PNG if it's different from the new JPG
        if (oldFilename !== newFilename) {
          fs.unlinkSync(oldPath);
          console.log(`🗑️  Removed heavy original: ${oldFilename}`);
        }
      } catch (err) {
        console.error(`❌ Failed to optimize ${oldFilename}: ${err.message}`);
      }
    } else {
        // Just update path if it's already a JPG but feed is old
        entry.imageFile = `/artworks/${newFilename}`;
    }
  }

  fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
  console.log(`\n✨ DONE. Optimized ${updatedCount} artworks.`);
}

reorganize().catch(console.error);
