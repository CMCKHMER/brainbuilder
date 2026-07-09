import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = '/home/z/my-project/download/game_heroes';
const publicDir = '/home/z/my-project/public/game/heroes';

interface HeroDef {
  name: string;
  class: string;
  color: string;
  prompt: string;
}

const HEROES: HeroDef[] = [
  {
    name: 'Lord Ashford',
    class: 'Knight',
    color: '#DC2626',
    prompt: `Medieval fantasy portrait of Lord Ashford, a noble knight commander of the Crimson Legion. He has a strong angular jawline, short dark hair streaked with silver, and piercing steel-blue eyes. Wearing ornate crimson plate armor with gold filigree, a black fur-lined crimson cape draped over one shoulder. A glowing ruby-encrusted longsword rests at his hip. Battle scars cross his left cheek. Stern, commanding expression. Semi-realistic digital art, airbrushed shading, muted warm color palette, no black outlines, cinematic lighting from torchlight, dark atmospheric background with hints of a burning fortress. Character portrait, upper body composition, fantasy game character art.`
  },
  {
    name: 'Lady Elara',
    class: 'Mage',
    color: '#D4A017',
    prompt: `Medieval fantasy portrait of Lady Elara, a powerful archmage of the Golden Order. She has long flowing silver-white hair with golden streaks, luminous violet eyes, and ethereal pale skin. Wearing elegant golden-accented deep purple robes with arcane rune patterns that glow faintly. A crystal staff topped with a burning golden orb floats beside her. Spectral arcane energy swirls around her hands. Wise yet mysterious expression, slight knowing smile. Semi-realistic digital art, airbrushed shading, muted warm pastels, no black outlines, magical golden hour lighting, mystical background with floating runes and arcane circles. Character portrait, upper body composition, fantasy game character art.`
  },
  {
    name: 'Shadow Vex',
    class: 'Rogue',
    color: '#166534',
    prompt: `Medieval fantasy portrait of Shadow Vex, a master assassin of the Emerald Syndicate. He has sharp angular features, emerald-green eyes that gleam in darkness, and messy dark hair with green-tinted tips. Wearing dark forest-green leather armor with black clasps, a hooded cloak that fades into shadow. Twin poisoned daggers are visible at his belt. A tattered green scarf obscures the lower half of his face. Cunning, dangerous smirk. Semi-realistic digital art, airbrushed shading, muted warm color palette, no black outlines, moody moonlit forest lighting, dark background with shadowy thorns and mist. Character portrait, upper body composition, fantasy game character art.`
  },
  {
    name: 'Sir Gideon',
    class: 'Paladin',
    color: '#7E22CE',
    prompt: `Medieval fantasy portrait of Sir Gideon, a holy paladin of the Violet Sanctum. He has a noble weathered face, warm amber eyes, and neatly trimmed golden-brown beard. Wearing majestic purple-accented silver plate armor with a glowing sun emblem on the chest plate. A massive tower shield with a holy sigil rests on his back, and a golden-hilted consecrated warhammer hangs at his side. Soft divine radiance emanates from behind him. Righteous, compassionate yet battle-hardened expression. Semi-realistic digital art, airbrushed shading, muted warm pastels, no black outlines, warm holy light from above with violet and gold tones, heavenly background with light rays through stained glass patterns. Character portrait, upper body composition, fantasy game character art.`
  },
];

async function generateHeroes() {
  const zai = await ZAI.create();
  
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  for (let i = 0; i < HEROES.length; i++) {
    const hero = HEROES[i];
    const filename = `hero_${hero.class.toLowerCase()}.png`;
    const outputPath = path.join(outputDir, filename);
    
    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`⏩ Skipping ${hero.name} (already exists)`);
      continue;
    }

    console.log(`🎨 Generating ${hero.name} - ${hero.class}...`);
    
    try {
      const response = await zai.images.generations.create({
        prompt: hero.prompt,
        size: '768x1344'
      });

      const imageBase64 = response.data[0].base64;
      const buffer = Buffer.from(imageBase64, 'base64');
      
      fs.writeFileSync(outputPath, buffer);
      // Also copy to public dir
      fs.writeFileSync(path.join(publicDir, filename), buffer);
      
      console.log(`✅ Saved ${hero.name} (${(buffer.length / 1024).toFixed(0)} KB)`);
    } catch (error: any) {
      console.error(`❌ Failed ${hero.name}: ${error.message}`);
    }
  }

  console.log('\n🎮 Hero generation complete!');
}

generateHeroes().catch(console.error);