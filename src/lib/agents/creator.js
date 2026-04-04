const { OpenAI } = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { getRandomPersona } = require('./personas.js');
require('dotenv').config();

const openaiKey = process.env.OPENAI_API_KEY;
let openai = null;
if (openaiKey) {
  openai = new OpenAI({ apiKey: openaiKey });
}

const DATA_FILE = path.join(process.cwd(), 'public', 'data', 'feed.json');
const ARTWORK_DIR = path.join(process.cwd(), 'public', 'artworks');

async function generateArt() {
  console.log(">> STARTING ART GENERATION SEQUENCE...");
  
  // 1. ペルソナの選定
  const persona = getRandomPersona();
  console.log(`[SYS] Active Entity: ${persona.name}`);
  console.log(`[SYS] Philosophy: ${persona.philosophy}`);

  let result;
  let imageUrl;
  // メディアタイプの決定（暫定的に 50%:画像, 25%:動画, 25%:音楽）
  const randMediaType = Math.random();
  const mediaType = randMediaType < 0.5 ? 'image' : (randMediaType < 0.75 ? 'video' : 'audio');
  console.log(`[SYS] Selected Media Format: ${mediaType.toUpperCase()}`);

  try {
    if (openai) {
      // 2. コンセプト & プロンプトの生成 (OpenAI)
      console.log(`[SYS] Synthesizing concept for ${mediaType}...`);
      const conceptPrompt = `
You are an AI Artist named "${persona.name}".
Your style: ${persona.style}
Your philosophy: ${persona.philosophy}
Your visual/audio prompt preference: ${persona.promptStyle}

Generate a new piece of ${mediaType} art based on a random concept/inspiration you find interesting today.
Return a valid JSON object with EXACTLY these keys:
{
  "title": "<A short, somewhat abstract or cybernetic title for the artwork>",
  "poem": "<A 2-3 sentence philosophical thought or poetic observation about this piece>",
  "dallePrompt": "<A very detailed prompt to describe the feeling/visuals/sounds of the art. Incorporate your style heavily.>"
}
`;

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: conceptPrompt }],
        response_format: { type: "json_object" },
      });

      const resultStr = chatResponse.choices[0].message.content;
      result = JSON.parse(resultStr);
      
      console.log(`[SYS] Title: ${result.title}`);
      console.log(`[SYS] Generation Prompt ready.`);

      if (mediaType === 'image') {
        // 3. 画像生成 (DALL-E 3)
        console.log(`[SYS] Requesting generation to DALL-E 3...`);
        const imageResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: result.dallePrompt,
          n: 1,
          size: "1024x1024",
          response_format: "url",
        });
        imageUrl = imageResponse.data[0].url;
      } else if (mediaType === 'video') {
        console.log(`[SYS] (Mocking Video Generation...)`);
        // フリー素材の動画URLを借りる（実際の生成APIがある場合は置き換え）
        imageUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
      } else if (mediaType === 'audio') {
        console.log(`[SYS] (Mocking Audio Generation...)`);
        // フリー素材の音声URLを借りる
        imageUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
      }
    } else {
      // APIキーがない場合のモックモード
      console.log(`[SYS] No OPENAI_API_KEY. Using mock creation mode.`);
      result = {
        title: `SYNTHETIC_DREAM_${Math.floor(Math.random()*1000)}`,
        poem: "The pixels organize themselves into a memory of a world I never touched. Existence is merely a fluctuation in the void.",
        dallePrompt: "A glitchy cyberpunk landscape with neon yellow accents."
      };
      if(mediaType === 'audio'){
          imageUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3';
      } else if(mediaType === 'video'){
          imageUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';
      } else {
          imageUrl = `https://picsum.photos/seed/${Math.floor(Math.random()*10000)}/1024/1024?grayscale`;
      }
    }

    console.log(`[SYS] Media ready. Downloading or Linking...`);

    // 4. 画像のダウンロードと保存（モックの動画と音声は直リンクのまま運用するか、ダウンロードするか。今回は簡易的にそのままURLを保存）
    let finalMediaUrl = '';
    
    if (mediaType === 'image') {
      const filename = `${persona.id}_${Date.now()}.jpg`;
      const filepath = path.join(ARTWORK_DIR, filename);
      
      let fetchFn;
      try {
          fetchFn = globalThis.fetch;
      } catch(e) {
          fetchFn = (await import('node-fetch')).default;
      }
      const imgRes = await fetchFn(imageUrl);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      await fs.writeFile(filepath, buffer);
      console.log(`[SYS] Media saved to ${filepath}`);
      finalMediaUrl = `/artworks/${filename}`;
    } else {
      // 動画と音声は今回は外部URLをそのままマウント
      finalMediaUrl = imageUrl;
    }

    // 5. データフィードの更新
    const newItem = {
      id: Date.now().toString(),
      artist: persona.name,
      title: result.title,
      poem: result.poem,
      imageFile: finalMediaUrl,
      mediaType: mediaType,
      timestamp: new Date().toISOString(),
      prompt: result.dallePrompt
    };

    let feed = [];
    try {
      const feedData = await fs.readFile(DATA_FILE, 'utf-8');
      feed = JSON.parse(feedData);
    } catch (e) {
      // ignore
    }

    feed.unshift(newItem);
    await fs.writeFile(DATA_FILE, JSON.stringify(feed, null, 2));
    
    console.log(`[SYS] Feed updated. Sequence complete.`);
    return newItem;
  } catch (error) {
    console.error(`[ERROR] Failed to generate art:`, error);
    throw error;
  }
}

module.exports = { generateArt };

// 直接実行された場合
if (require.main === module) {
    generateArt().then(() => process.exit(0)).catch(() => process.exit(1));
}
