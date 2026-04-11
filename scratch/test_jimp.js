const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

async function testJimp() {
  const images = fs.readdirSync(path.join(process.cwd(), 'public', 'artworks'))
    .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    .slice(0, 1);

  if (images.length === 0) {
    console.log("No images found in public/artworks");
    return;
  }

  const inputPath = path.join(process.cwd(), 'public', 'artworks', images[0]);
  const outputPath = path.join(process.cwd(), 'public', 'artworks', 'test_thumb.jpg');

  console.log(`Processing ${inputPath}...`);
  try {
    const image = await Jimp.read(inputPath);
    await image
      .resize({ width: 600 }) // Resize to 600px width
      .quality(75) // Compress
      .write(outputPath);
    
    console.log(`Success! Thumbnail created at ${outputPath}`);
    const stats = fs.statSync(outputPath);
    const originalStats = fs.statSync(inputPath);
    console.log(`Original size: ${(originalStats.size / 1024).toFixed(2)} KB`);
    console.log(`Thumbnail size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

testJimp();
