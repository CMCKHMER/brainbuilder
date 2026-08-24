import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const STYLE_BASE = 'semi-realistic digital art, airbrushed shading, muted warm pastels, no outlines, dark fantasy medieval theme, character portrait, dramatic lighting, rich detail, game concept art style';

interface CharacterDef {
  id: string;
  name: string;
  prompt: string;
}

const CHARACTERS: CharacterDef[] = [
  // === MAIN HEROES ===
  {
    id: 'hero_lord_ashford',
    name: 'Lord Ashford',
    prompt: `${STYLE_BASE}, portrait of Lord Ashford, a towering battle-hardened knight and supreme military commander, wearing heavy crimson plate armor with gold filigree engravings, broad shoulders, strong square jaw with short dark beard, cold determined grey eyes, holding a massive enchanted greatsword with frost crystals along the blade called Winter\'s Edge, fur-trimmed crimson cloak billowing behind him, snowflakes in the background, crimson and gold color palette, imposing and regal presence, chest plate bears the crest of the Crimson Banner faction`
  },
  {
    id: 'hero_lady_elara',
    name: 'Lady Elara',
    prompt: `${STYLE_BASE}, portrait of Lady Elara, a powerful Archmagister and grand battle mage, elegant middle-aged woman with long silver-white hair flowing with arcane energy, piercing violet eyes, wearing ornate golden and deep blue mage robes with runic embroidery, holding a glowing crystal staff topped with a swirling arcane orb, golden circlet crown on her head, arcane sigils floating around her hands, crystal lake and academy spires in the blurred background, gold and deep blue color palette, intellectual and commanding presence`
  },
  {
    id: 'hero_shadow_vex',
    name: 'Shadow Vex',
    prompt: `${STYLE_BASE}, portrait of Shadow Vex, an enigmatic and dangerous rogue assassin leader, face partially hidden under a deep dark green hood and shadow-wrapped cowl, only the lower face visible showing a sharp smirk with pale lips, dark eyes barely visible in the hood\'s shadow, wearing form-fitting dark leather armor with forest green accents, twin curved daggers gleaming in each hand, wisps of shadow and mist curling around the figure, dark forest background with twisted ancient trees, deep green and black color palette, mysterious and threatening presence`
  },
  {
    id: 'hero_sir_gideon',
    name: 'Sir Gideon',
    prompt: `${STYLE_BASE}, portrait of Sir Gideon, a massive and righteous Grand Paladin, wearing gleaming white and gold heavy plate armor with a sun emblem on the breastplate, strong angular jaw, warm but fierce brown eyes, short golden hair, carrying a large sun-embossed shield on one arm and a glowing holy warhammer in the other hand, divine golden light radiating from behind him like a halo, tattered white tabard with golden cross, warm amber and white color palette, noble and devout presence`
  },

  // === VILLAINS & BOSSES ===
  {
    id: 'boss_hollow_king',
    name: 'The Hollow King',
    prompt: `${STYLE_BASE}, portrait of The Hollow King, a terrifying spectral entity from beyond the Veil, a ghostly towering figure wearing tattered ancient royal robes that fade into void darkness, the face is a hollow void with only two burning cold blue-white eyes visible, a cracked and shattered crown of black crystal floating above the head, wisps of void energy and dark aether swirling around the body, the form seems to be dissolving into shadow at the edges, dark purple and black color palette with cold blue accents, deeply ominous and otherworldly presence, the remnant of a fallen king consumed by the Void`
  },
  {
    id: 'boss_hollowed_general',
    name: 'The Hollowed General',
    prompt: `${STYLE_BASE}, portrait of a Hollowed General, a spectral undead warrior commander serving the Hollow King, ghostly translucent armored figure wearing ancient corroded plate armor with glowing violet cracks running through the metal, empty eye sockets blazing with cold spectral blue light, a tattered cape of shadow, wielding a ghostly greatsword that drips void energy, the body below the chest fades into dark spectral mist, dark iron and spectral blue color palette, menacing and tragic undead presence`
  },
  {
    id: 'boss_king_aldric',
    name: 'King Aldric',
    prompt: `${STYLE_BASE}, portrait of King Aldric the Undecided, the last king of the Aethernote dynasty, a regal but troubled-looking middle-aged monarch, wearing rich dark purple and gold royal robes with ermine trim, a heavy golden crown set with dark gemstones, gaunt face with deep sorrowful eyes, dark circles under eyes showing sleepless guilt, long dark hair streaked with grey, one hand reaching toward a glowing crack in reality showing the void beyond, ornate throne room with cracks of light breaking through in the background, purple and gold color palette, tragic and regal presence, the man who shattered the world`
  },

  // === NPC ===
  {
    id: 'npc_archivist_meren',
    name: 'Archivist Meren',
    prompt: `${STYLE_BASE}, portrait of Archivist Meren, an elderly scholarly historian in his seventies, thin and slightly hunched, long grey beard, wise wrinkled face with kind but worried blue eyes, wearing worn brown scholar robes with a leather belt holding scrolls and quills, thick reading spectacles perched on his nose, holding an ancient leather-bound tome open in one hand with a quill in the other, surrounded by floating magical texts and ancient maps, candlelit archive library with towering bookshelves in the background, warm brown and amber color palette, learned and gentle presence`
  },
];

async function generateCharacter(zai: any, char: CharacterDef, outputDir: string): Promise<boolean> {
  const outputPath = path.join(outputDir, `${char.id}.png`);
  
  // Skip if already exists
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    if (stats.size > 1000) {
      console.log(`  SKIP (exists): ${char.name} → ${outputPath}`);
      return true;
    }
  }

  console.log(`  GENERATING: ${char.name}...`);
  
  try {
    const response = await zai.images.generations.create({
      prompt: char.prompt,
      size: '768x1344'
    });

    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(outputPath, buffer);

    console.log(`  DONE: ${char.name} → ${outputPath} (${(buffer.length / 1024).toFixed(0)}KB)`);
    return true;
  } catch (error: any) {
    console.error(`  FAILED: ${char.name} → ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Realm of Aethermoore - Character Portrait Generation ===\n');

  const zai = await ZAI.create();

  const outputDir = '/home/z/my-project/public/game/characters';
  const downloadDir = '/home/z/my-project/download/game_characters';

  // Ensure directories exist
  for (const dir of [outputDir, downloadDir]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  console.log('--- MAIN HEROES (4) ---');
  const heroes = CHARACTERS.slice(0, 4);
  for (const hero of heroes) {
    await generateCharacter(zai, hero, outputDir);
  }

  console.log('\n--- VILLAINS & BOSSES (3) ---');
  const villains = CHARACTERS.slice(4, 7);
  for (const villain of villains) {
    await generateCharacter(zai, villain, outputDir);
  }

  console.log('\n--- NPC (1) ---');
  const npc = CHARACTERS[7];
  await generateCharacter(zai, npc, outputDir);

  // Copy all to download folder
  console.log('\n--- Copying to download folder ---');
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.png'));
  for (const file of files) {
    fs.copyFileSync(path.join(outputDir, file), path.join(downloadDir, file));
    console.log(`  Copied: ${file}`);
  }

  console.log(`\n=== COMPLETE: ${files.length} character portraits generated ===`);
}

main().catch(console.error);