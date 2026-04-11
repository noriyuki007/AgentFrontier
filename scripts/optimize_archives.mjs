#!/usr/bin/env node
/**
 * AgentFrontier — Archive Optimization Script
 * -------------------------------------------
 * This script iterates through the entire feed.json and generates
 * compressed thumbnails for any artwork missing one.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Jimp } from "jimp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FEED_PATH = path.join(ROOT, "public", "data", "feed.json");
const ARTWORKS_DIR = path.join(ROOT, "public", "artworks");

async function optimize() {
  console.log("🚀 Starting Archive Optimization (Thumbnail Backfill)...");

  if (!fs.existsSync(FEED_PATH)) {
    console.error("❌ feed.json not found.");
    return;
  }

  const feed = JSON.parse(fs.readFileSync(FEED_PATH, "utf-8"));
  let updatedCount = 0;

  for (let i = 0; i < feed.length; i++) {
    const art = feed[i];
    const isImage = art.mediaType === "image";
    
    // We want to fix cases where thumbnail is missing OR thumbnail is the same as the high-res image
    const needsThumbnail = !art.thumbnail || (isImage && art.thumbnail === art.imageFile);

    if (needsThumbnail) {
      const sourceRelPath = art.thumbnail || art.imageFile;
      const sourceAbsPath = path.join(ROOT, "public", sourceRelPath);

      if (!fs.existsSync(sourceAbsPath)) {
        console.warn(`  ⚠️ Source image not found: ${sourceAbsPath}`);
        continue;
      }

      // Generate thumb filename: BASE_thumb.jpg
      const ext = path.extname(sourceAbsPath);
      const thumbFilename = path.basename(sourceAbsPath, ext) + "_thumb.jpg";
      const thumbAbsPath = path.join(ARTWORKS_DIR, thumbFilename);
      const thumbRelPath = `/artworks/${thumbFilename}`;

      console.log(`  📸 [${i+1}/${feed.length}] Generating thumb for: ${art.title}`);

      try {
        const image = await Jimp.read(sourceAbsPath);
        await image.resize({ w: 600 });
        await image.write(thumbAbsPath);
        
        feed[i].thumbnail = thumbRelPath;
        updatedCount++;
      } catch (err) {
        console.error(`  ❌ Failed to process ${art.title}: ${err.message}`);
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(FEED_PATH, JSON.stringify(feed, null, 2));
    console.log(`\n✨ DONE. Updated ${updatedCount} entries in feed.json.`);
  } else {
    console.log("\n✅ All entries already have thumbnails. No changes needed.");
  }
}

optimize().catch(err => {
  console.error(err);
  process.exit(1);
});
