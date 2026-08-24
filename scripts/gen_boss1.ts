import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const STYLE_BASE = 'semi-realistic digital art, airbrushed shading, muted warm pastels, no outlines, dark fantasy medieval theme, character portrait, dramatic lighting, rich detail, game concept art style';
const outputDir = '/home/z/my-project/public/game/characters';

async function gen(prompt: string, filename: string) {
  const p = path.join(outputDir, filename);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) { console.log(`SKIP: ${filename}`); return; }
  console.log(`GEN: ${filename}...`);
  const zai = await ZAI.create();
  const res = await zai.images.generations.create({ prompt, size: '768x1344' });
  fs.writeFileSync(p, Buffer.from(res.data[0].base64, 'base64'));
  console.log(`DONE: ${filename} (${(fs.statSync(p).size/1024).toFixed(0)}KB)`);
}

async function main() {
  await gen(
    `${STYLE_BASE}, portrait of The Hollow King, a terrifying spectral entity from beyond the Veil, ghostly towering figure wearing tattered ancient royal robes fading into void darkness, face is a hollow void with only two burning cold blue-white eyes visible, cracked black crystal crown floating above head, wisps of void energy swirling around, body dissolving into shadow at edges, dark purple and black with cold blue accents, deeply ominous and otherworldly`
  , 'boss_hollow_king.png');
}

main().catch(console.error);