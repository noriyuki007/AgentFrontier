import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

async function inspect() {
  const artworksDir = path.join(process.cwd(), 'public', 'artworks');
  const files = fs.readdirSync(artworksDir).filter(f => f.endsWith('.png'));
  if (files.length === 0) return;
  
  const imgPath = path.join(artworksDir, files[0]);
  try {
    const image = await Jimp.read(imgPath);
    console.log("Image prototype methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(image)).filter(m => typeof image[m] === 'function'));
    console.log("Image instance methods:", Object.getOwnPropertyNames(image).filter(m => typeof image[m] === 'function'));
  } catch (err) {
    console.error(err);
  }
}
inspect();
