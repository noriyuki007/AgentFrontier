import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

async function test() {
  const artworksDir = path.join(process.cwd(), 'public', 'artworks');
  const files = fs.readdirSync(artworksDir).filter(f => f.endsWith('.png'));
  if (files.length === 0) return;
  
  const imgPath = path.join(artworksDir, files[0]);
  try {
    const image = await Jimp.read(imgPath);
    console.log("Image read. Resizing...");
    // Try different styles
    try {
        await image.resize({ w: 600 });
        console.log("Style { w: 600 } worked.");
    } catch (e) {
        console.log("Style { w: 600 } failed:", e.message);
    }
    
    try {
        await image.resize({ width: 600 });
        console.log("Style { width: 600 } worked.");
    } catch (e) {
        console.log("Style { width: 600 } failed:", e.message);
    }
  } catch (err) {
    console.error(err);
  }
}
test();
