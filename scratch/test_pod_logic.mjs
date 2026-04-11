import { Jimp } from 'jimp';
import path from 'path';
import fs from 'fs';

async function testPOD() {
  const artworksDir = path.join(process.cwd(), 'public', 'artworks');
  const files = fs.readdirSync(artworksDir).filter(f => f.endsWith('.png') && !f.includes('_thumb'));
  if (files.length === 0) {
    console.log("No images found to test.");
    return;
  }
  
  const sourceFile = files[0];
  const imgFilepath = path.join(artworksDir, sourceFile);
  const testOutputFile = path.join(process.cwd(), 'scratch', 'pod_test_output.png');

  console.log(`Testing POD optimization on: ${sourceFile}`);
  try {
    const image = await Jimp.read(imgFilepath);
    console.log(`Original Size: ${image.width}x${image.height}`);

    // Simulate 3x Upscale
    console.log("Applying 3x Upscale...");
    await image.resize({ w: image.width * 3 });
    console.log(`New Size: ${image.width}x${image.height}`);

    // Simulate Transparency (White to Alpha)
    console.log("Applying Transparency...");
    image.scan(0, 0, image.width, image.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      if (r > 245 && g > 245 && b > 245) {
        this.bitmap.data[idx + 3] = 0;
      }
    });

    await image.write(testOutputFile);
    console.log(`✅ Success! Test output saved to: ${testOutputFile}`);
  } catch (err) {
    console.error("❌ POD Test failed:", err);
  }
}

testPOD();
