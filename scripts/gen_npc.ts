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
    `${STYLE_BASE}, portrait of Archivist Meren, an elderly scholar in his seventies, thin and slightly hunched, long grey beard, wise wrinkled face with kind worried blue eyes, wearing worn brown scholar robes with leather belt holding scrolls, thick reading spectacles, holding ancient leather-bound tome with quill, floating magical texts and maps around him, candlelit archive library with towering bookshelves, warm brown and amber palette, learned and gentle`
  , 'npc_archivist_meren.png');
}

main().catch(console.error);