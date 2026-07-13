import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const STYLE_BASE = 'semi-realistic digital art, airbrushed shading, muted warm pastels, no outlines, dark fantasy medieval theme, character portrait, dramatic lighting, rich detail, game concept art style';

const outputDir = '/home/z/my-project/public/game/characters';

async function gen(prompt: string, filename: string) {
  const p = path.join(outputDir, filename);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
    console.log(`SKIP: ${filename} exists`);
    return;
  }
  console.log(`GEN: ${filename}...`);
  const zai = await ZAI.create();
  const res = await zai.images.generations.create({ prompt, size: '768x1344' });
  fs.writeFileSync(p, Buffer.from(res.data[0].base64, 'base64'));
  console.log(`DONE: ${filename} (${(fs.statSync(p).size/1024).toFixed(0)}KB)`);
}

async function main() {
  // Hero 3: Shadow Vex
  await gen(
    `${STYLE_BASE}, portrait of Shadow Vex, an enigmatic rogue assassin leader, face partially hidden under a deep dark green hood, only lower face visible showing a sharp smirk with pale lips, dark eyes barely visible, wearing form-fitting dark leather armor with forest green accents, twin curved daggers in each hand, wisps of shadow curling around, dark forest background with twisted trees, deep green and black palette, mysterious and threatening`
  , 'hero_shadow_vex.png');

  // Hero 4: Sir Gideon
  await gen(
    `${STYLE_BASE}, portrait of Sir Gideon, a massive righteous Grand Paladin, wearing gleaming white and gold heavy plate armor with sun emblem, strong angular jaw, warm fierce brown eyes, short golden hair, carrying a sun-embossed shield and glowing holy warhammer, divine golden light radiating behind like a halo, white tabard with golden cross, warm amber and white palette, noble and devout`
  , 'hero_sir_gideon.png');
}

main().catch(console.error);