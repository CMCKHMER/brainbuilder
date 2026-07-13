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
  // Boss 1: The Hollow King
  await gen(
    `${STYLE_BASE}, portrait of The Hollow King, a terrifying spectral entity from beyond the Veil, ghostly towering figure wearing tattered ancient royal robes fading into void darkness, face is a hollow void with only two burning cold blue-white eyes visible, cracked black crystal crown floating above head, wisps of void energy swirling around, body dissolving into shadow at edges, dark purple and black with cold blue accents, deeply ominous and otherworldly`
  , 'boss_hollow_king.png');

  // Boss 2: The Hollowed General
  await gen(
    `${STYLE_BASE}, portrait of a Hollowed General, a spectral undead warrior commander, ghostly translucent armored figure in ancient corroded plate armor with glowing violet cracks, empty eye sockets blazing with cold spectral blue light, tattered cape of shadow, wielding a ghostly greatsword dripping void energy, body below chest fades into dark spectral mist, dark iron and spectral blue palette, menacing and tragic undead`
  , 'boss_hollowed_general.png');

  // Boss 3: King Aldric
  await gen(
    `${STYLE_BASE}, portrait of King Aldric the last king, regal but troubled middle-aged monarch, wearing rich dark purple and gold royal robes with ermine trim, heavy golden crown with dark gemstones, gaunt face with sorrowful eyes and dark circles, long dark hair streaked with grey, one hand reaching toward a glowing crack in reality, ornate throne room background, purple and gold palette, tragic and regal, the man who shattered the world`
  , 'boss_king_aldric.png');

  // NPC: Archivist Meren
  await gen(
    `${STYLE_BASE}, portrait of Archivist Meren, an elderly scholar in his seventies, thin and slightly hunched, long grey beard, wise wrinkled face with kind worried blue eyes, wearing worn brown scholar robes with leather belt holding scrolls, thick reading spectacles, holding ancient leather-bound tome with quill, floating magical texts and maps around him, candlelit archive library with towering bookshelves, warm brown and amber palette, learned and gentle`
  , 'npc_archivist_meren.png');
}

main().catch(console.error);