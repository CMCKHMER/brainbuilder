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
    `${STYLE_BASE}, portrait of King Aldric the last king, regal but troubled middle-aged monarch, wearing rich dark purple and gold royal robes with ermine trim, heavy golden crown with dark gemstones, gaunt face with sorrowful eyes and dark circles, long dark hair streaked with grey, one hand reaching toward a glowing crack in reality, ornate throne room background, purple and gold palette, tragic and regal, the man who shattered the world`
  , 'boss_king_aldric.png');
}

main().catch(console.error);