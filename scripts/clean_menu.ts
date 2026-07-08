import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function main() {
  const zai = await ZAI.create();
  const imageBuffer = fs.readFileSync('/home/z/my-project/upload/pasted_image_1783529822610.png');
  const base64Image = imageBuffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;

  const response = await zai.images.generations.edit({
    prompt: 'Fantasy medieval game menu scene with dark atmospheric background, wooden table, parchment map with colorful regions, medieval castle, stormy sky, magical blue-purple portal glow, torches, miniature figurines. Remove ALL text, words, letters, menu labels, and any readable writing completely. Keep only the visual artwork, scenery, and atmosphere. No text whatsoever.',
    images: [{ url: dataUrl }],
    size: '1344x768'
  });

  const resultBase64 = response.data[0].base64;
  const buffer = Buffer.from(resultBase64, 'base64');
  fs.writeFileSync('/home/z/my-project/download/game_menu_clean.png', buffer);
  console.log('Clean menu image saved!');
}

main().catch(console.error);