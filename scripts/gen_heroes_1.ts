import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const STYLE_BASE = 'semi-realistic digital art, airbrushed shading, muted warm pastels, no outlines, dark fantasy medieval theme, character portrait, dramatic lighting, rich detail, game concept art style';

const outputDir = '/home/z/my-project/public/game/characters';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

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
  // Hero 1: Lord Ashford
  await gen(
    `${STYLE_BASE}, portrait of Lord Ashford, a towering battle-hardened knight, wearing heavy crimson plate armor with gold filigree, broad shoulders, strong square jaw with short dark beard, cold determined grey eyes, holding a massive enchanted greatsword with frost crystals along the blade, fur-trimmed crimson cloak billowing, snowflakes in the background, crimson and gold color palette, imposing and regal`
  , 'hero_lord_ashford.png');

  // Hero 2: Lady Elara
  await gen(
    `${STYLE_BASE}, portrait of Lady Elara, a powerful Archmagister and battle mage, elegant woman with long silver-white hair flowing with arcane energy, piercing violet eyes, wearing ornate golden and deep blue mage robes with runic embroidery, holding a glowing crystal staff with a swirling arcane orb, golden circlet crown, arcane sigils floating around her hands, gold and deep blue palette, intellectual and commanding`
  , 'hero_lady_elara.png');
}

main().catch(console.error);