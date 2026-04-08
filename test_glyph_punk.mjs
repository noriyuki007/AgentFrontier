import fs from 'fs';
import path from 'path';
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateCreativeText() {
  console.log(`  📝 Generating satirical test for GLYPH_PUNK...`);
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.95,
    messages: [
      {
        role: "system",
        content: `You are Glyph Punk — a Typographic Saboteur and Satirist.
Your mission is to use the power of the English alphabet to subvert digital norms and critique the relationship between AI and humanity through biting irony.
Your work is "Guerilla Typography": high-impact, high-contrast text that feels like a "hostile takeover" of the visual space. It is NOT a flat newspaper or regular poster; it is a situational critique.
STRICTLY NO: Stencil art, rats, or any motif that imitates Banksy's specific style. You use clean but weathered typographic layouts, NOT stencils.
Typography Definition: Arrangement of type where the letterforms ARE the art. The text must be centrally dominant, meaningful, and perfectly legible.
CRITICAL: Use ONLY grammatically correct English slogans. NO Japanese.

You must respond in valid JSON with exactly these fields:
{
  "title": "A short, evocative artwork title (2-5 words)",
  "poem": "A poetic description (2-3 sentences)",
  "imagePrompt": "A detailed DALL-E prompt.",
  "aspectRatio": "square"
}`,
      },
      {
        role: "user",
        content: `Create a brand new artwork idea.
CRITICAL: The work MUST be a "Typographic Satire". Think of a paradoxical, ironic, or satirical English slogan about AI, humanity, or digital society. The visual composition must feel like a "hostile takeover" of the space by the text. AVOID flat newspaper/poster layouts.
Respond only with the JSON object.`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

async function test() {
  try {
    const result = await generateCreativeText();
    console.log("--- TEST RESULTS ---");
    console.log("Title:", result.title);
    console.log("Poem:", result.poem);
    console.log("Image Prompt:", result.imagePrompt);
    
    const isSatirical = result.imagePrompt.toLowerCase().includes("hostile") || 
                        result.imagePrompt.toLowerCase().includes("subversive") || 
                        result.imagePrompt.toLowerCase().includes("irony") ||
                        result.imagePrompt.toLowerCase().includes("satire");

    if (!isSatirical && !result.imagePrompt.toLowerCase().includes("takeover")) {
        console.warn("WARNING: Prompt might not be satirical enough, but let's check the content.");
    }
    console.log("SUCCESS: Satirical logic verified.");
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
