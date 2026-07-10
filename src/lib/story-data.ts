// ========================================
// AETHERMOOR STORY SYSTEM
// ========================================

export interface StoryPage {
  text: string;
  speaker?: string;       // Character name speaking
  speakerColor?: string;  // Speaker's faction color
  portrait?: string;      // Hero image path
}

export interface StoryBeat {
  id: string;
  title: string;
  subtitle?: string;
  pages: StoryPage[];
  bgStyle: 'dark' | 'battle' | 'victory' | 'defeat' | 'dramatic';
  skippable?: boolean;
}

// ========================================
// PROLOGUE — Why the war began
// ========================================

export const PROLOGUE: StoryBeat = {
  id: 'prologue',
  title: 'THE SHATTERING',
  subtitle: 'A History of Aethermoor',
  bgStyle: 'dramatic',
  skippable: true,
  pages: [
    {
      text: 'In ages past, the continent of Aethermoor was unified beneath the Aetheric Throne — a seat of power that channeled the raw magical essence of the land itself. For a thousand years, the Aetheric Wardens maintained peace across the five realms, and the people flourished under the Throne\'s golden light.',
    },
    {
      text: 'But the last Warden, Aldric the Unbroken, died without an heir. As his final breath faded, the Aetheric Throne cracked — then shattered into four fragments, each hurtling across the continent to bond with a different soul. The land groaned. The skies darkened. The age of peace was over.',
    },
    {
      text: 'Now four warlords rise, each wielding a fragment of the Throne\'s ancient power. They wage war across the Frostlands, the Heartlands, the Southern Realms, the Eastern Shores, and the Western Reaches — each believing that only by reuniting the fragments can the Aetheric Crown be reforged.',
    },
    {
      text: 'But the fragments twist their bearers. With every battle fought upon the land, Aethermoor itself suffers. The floating continent drifts lower toward the Endless Abyss with each drop of blood spilled upon its soil. The war must end — one way or another — before Aethermoor falls into darkness forever.',
    },
  ],
};

// ========================================
// CHARACTER INTRODUCTIONS
// ========================================

export function getCharacterIntro(characterClass: string, playerName: string, color: string, colorLight: string, portrait: string): StoryBeat {
  const intros: Record<string, { pages: StoryPage[] }> = {
    knight: {
      pages: [
        {
          text: `${playerName} stands upon the battlements of Ironhold, the northern wind whipping crimson banners against a sky the color of old iron. The fragment of the Aetheric Throne pulses warm against their chest — a constant reminder of the duty that fell upon them when the old world died.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"There is no peace in hesitation," ${playerName} declares, gauntleted fist clenched around a sword that hums with fragment energy. "The people need order. They need walls. They need someone willing to bear the weight of command \u2014 and the cost of war."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Knight's fragment amplifies the strength of every soldier who marches under their banner. Swordsmen strike harder. Cavalry charges with devastating force. But the fragment feeds on conflict — the longer the war rages, the more it demands. ${playerName} knows this, and fights anyway.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    mage: {
      pages: [
        {
          text: `${playerName} sits cross-legged in the Sunforge arcana chamber, surrounded by floating glyphs that spiral in slow, golden orbits. The Aetheric fragment hovers before them, rotating, whispering secrets in a language that predates the written word.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The Throne was never meant to be one," ${playerName} murmurs, fingers tracing the fragment\u2019s crystalline surface. "It was four pillars holding up reality itself. When it shattered, the pillars scattered \u2014 and the weight of the world fell on us all."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Mage's fragment grants boundless arcane insight and reduces the cost of conjuring magical allies. Mages under ${playerName}'s command deploy in greater numbers, their spells weaving barriers of raw aether. But the fragment whispers forbidden knowledge — secrets that could unmake the world if spoken aloud.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    rogue: {
      pages: [
        {
          text: `${playerName} materializes from the shadows of Darkwood's ancient canopy, the Aetheric fragment concealed beneath a cloak woven from living darkness. The forest itself seems to lean away — trees creaking, roots shifting, as if the land recognizes the danger that walks among it.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"Honor is a luxury the strong afford themselves," ${playerName} says with a thin smile, producing a blade that seems to absorb light rather than reflect it. "I learned that in the shadows of the old court. Trust no one. Strike first. And never \u2014 ever \u2014 fight fair."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Rogue's fragment grants preternatural luck — dice fall in their favor, impossible shots find their mark, and defeats transform into narrow escapes. Each battle, ${playerName} can reroll fate itself. But the fragment consumes its bearer's humanity, and the shadows grow longer with every use.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    paladin: {
      pages: [
        {
          text: `${playerName} kneels in the ruins of what was once Aethermoor's grandest cathedral, now little more than shattered columns and moss-covered stone. The Aetheric fragment rests in the center of a broken altar, pulsing with a light that is almost painful to behold.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The Shattering was not a tragedy \u2014 it was a judgment," ${playerName} intones, rising to full height. A shield of pure light materializes at their left arm, radiating warmth. "We sinned in our complacency. Now we must earn salvation through sacrifice and unwavering faith."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Paladin's fragment creates unbreakable defenses — Shield Bearers and Paladins under ${playerName}'s command gain preternatural resilience, turning aside blows that would fell lesser warriors. But the fragment demands absolute faith, and doubt is punished with crushing weakness.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
  };

  const intro = intros[characterClass] || intros.knight;

  return {
    id: `intro-${characterClass}`,
    title: `${playerName.toUpperCase()}`,
    subtitle: `The ${characterClass.charAt(0).toUpperCase() + characterClass.slice(1)} Rises`,
    bgStyle: 'dramatic',
    skippable: true,
    pages: intro.pages,
  };
}

// ========================================
// ELIMINATION NARRATIVES
// ========================================

export function getEliminationBeat(playerName: string, characterClass: string, color: string): StoryBeat {
  const narratives: Record<string, string> = {
    knight: `${playerName}'s armies have been shattered. The crimson banners that once flew over the Frostlands now lie trampled in mud and ash. ${playerName} kneels on a blood-soaked battlefield, sword broken, fragment flickering weakly. "I... failed them," they whisper, watching the last of their soldiers fall. The fragment dims — then goes dark. ${playerName} collapses, another casualty of Aethermoor's endless war.`,
    mage: `The arcana chamber crumbles around ${playerName} as enemy forces breach the final wards. Glyphs shatter like glass, and the floating tomes of Sunforge erupt into arcane fire. "The knowledge... it's all burning..." ${playerName} reaches for the fragment, but it slips through fingers turned translucent with magical exhaustion. The aether that sustained them drains away, and ${playerName} fades — not dying, but simply... ceasing, like a spell that has run its course.`,
    rogue: `${playerName} tries to shadow-walk one last time, but the darkness rejects them. The fragment — their passport through the shadows — sputters and dies. "No. No, I always have an exit. I ALWAYS have an exit—" But the shadows close in, and for the first time, ${playerName} has nowhere to hide. The final blow comes from behind, the way ${playerName} would have wanted it. At least, that's what they tell themselves.`,
    paladin: `${playerName} stands alone in the ruins of their last stronghold, shield cracked, armor dented, but still on their feet. "Even now... I do not waver." The fragment's holy light pulses one final time — blinding, defiant, magnificent. Then silence. ${playerName} falls to their knees, the last light of faith extinguished. The battlefield falls quiet. Even the enemy soldiers lower their weapons for a moment, honoring the fallen guardian.`,
  };

  const text = narratives[characterClass] || narratives.knight;

  return {
    id: `elimination-${playerName}`,
    title: 'FALLEN',
    subtitle: `${playerName} Has Been Defeated`,
    bgStyle: 'defeat',
    skippable: false,
    pages: [{ text }],
  };
}

// ========================================
// VICTORY EPILOGUES
// ========================================

export function getVictoryBeat(playerName: string, characterClass: string, color: string, colorLight: string, portrait: string): StoryBeat {
  const epilogues: Record<string, { pages: StoryPage[] }> = {
    knight: {
      pages: [
        {
          text: `The final fortress falls. The last enemy banner is torn from its pole. Across all five realms of Aethermoor, silence descends — the silence that follows the end of all things. ${playerName} stands at the summit of the Aetheric Spire, four fragments now fused into a single, blazing crown of crimson gold.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"I told you," ${playerName} says quietly, placing the Aetheric Crown upon their brow. The continent shudders — then stabilizes, rising slightly from the abyss. "Order. Discipline. Strength. That is what Aethermoor needed. Not magic. Not shadows. Not faith. Steel."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `And so ${playerName} takes the Aetheric Throne, ruling as the first of a new line of Wardens. The armies disband. The people rebuild. The continent heals. But in the darkest hours of the night, the Crown whispers to its new bearer — and ${playerName} listens, and is afraid.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    mage: {
      pages: [
        {
          text: `The last enemy army dissolves as ${playerName} unleashes the combined might of all four Aetheric fragments in a single, devastating spell. The sky tears open, revealing the raw aetheric substrate beneath reality — and for one terrifying moment, everyone on Aethermoor sees the truth of the world.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"Now I understand," ${playerName} breathes, eyes wide with revelation. "The Throne was never a weapon. It was a key. A key to something far greater than any of us imagined." The four fragments spiral upward, fusing not into a crown, but into a doorway — a portal to something beyond the veil of stars.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} steps through the portal, and the Aetheric Crown hovers behind, waiting. Whether the Mage returns is a question only time will answer. But in their absence, Aethermoor enters an age of peace — guided not by a ruler, but by the arcane wisdom ${playerName} left behind in every stone, every river, every whispering wind.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    rogue: {
      pages: [
        {
          text: `Nobody sees ${playerName} when it happens. The last enemy warlord simply... falls, in the middle of their own throne room, with no witnesses and no explanation. The fragment-shadows retreat into the corners, and ${playerName} emerges from the darkness with four Aetheric fragments in hand and a smile that doesn't reach their eyes.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The smart ones never fight the last battle themselves," ${playerName} says to no one, letting the fragments dissolve into motes of shadow-light that sink into their skin. "You find the moment. You take it. You don't announce it with trumpets and banners."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} vanishes the same day, leaving no trace, no throne, no crown. Some say the Rogue became the shadow of Aethermoor itself — a guardian who watches from the darkness, striking only when necessary. Others say ${playerName} simply grew tired of winning. Either way, the continent is at peace. And somewhere, in a shadow that has no source, someone is smiling.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    paladin: {
      pages: [
        {
          text: `The final battle is not won with strength or cunning, but with faith. ${playerName} walks unarmed through the enemy gates, the four Aetheric fragments orbiting like holy satellites, and every soldier who raises a weapon against them finds their arms too heavy to lift. Not by magic — by conviction.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"Lay down your arms," ${playerName} commands, and the voice carries not just sound but weight — the weight of absolute certainty. "The war is over. Not because I have defeated you, but because you know — in your hearts — that this was never the answer." One by one, weapons clatter to the ground.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} reforges the Aetheric Crown not as a symbol of power, but as a relic of remembrance. It is placed in the center of a new temple — not to be worn, but to be contemplated. "The Crown does not choose a ruler," ${playerName} declares. "It chooses a guardian. And I will be the last." Aethermoor enters an age of peace, protected by a Paladin whose faith never wavered — and never will.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
  };

  const epilogue = epilogues[characterClass] || epilogues.knight;

  return {
    id: `victory-${playerName}`,
    title: 'THE CROWN REFORGED',
    subtitle: `${playerName} Has Conquered Aethermoor`,
    bgStyle: 'victory',
    skippable: false,
    pages: epilogue.pages,
  };
}

// ========================================
// TURN NARRATIVE EVENTS — Random events that fire during gameplay
// ========================================

export interface CampaignEvent {
  id: string;
  title: string;
  text: string;
  effect?: string;  // Description of any mechanical effect
  triggerChance: number; // 0-1, chance per turn
  minTurn: number;   // Minimum turn number to trigger
  maxTurn?: number;  // Maximum turn number (optional)
}

export const CAMPAIGN_EVENTS: CampaignEvent[] = [
  {
    id: 'aether_storm',
    title: 'AETHER STORM',
    text: 'The fragmented Aetheric energy surges across the continent, crackling through the air like golden lightning. Soldiers on both sides report hearing whispers — the voices of the ancient Wardens, warning of the abyss below.',
    effect: 'The storm passes, but the land groans. All warlords feel the continent sink slightly lower.',
    triggerChance: 0.12,
    minTurn: 3,
  },
  {
    id: 'merchant_caravan',
    title: 'TRAVELING MERCHANTS',
    text: 'A caravan of neutral merchants braves the war-torn roads, offering supplies to any warlord willing to pay in aether-shards. Their wagons are laden with weapons, armor, and provisions.',
    effect: 'Reinforcements are plentiful this turn.',
    triggerChance: 0.15,
    minTurn: 2,
  },
  {
    id: 'ancient_ruins',
    title: 'RUINS AWAKEN',
    text: 'Deep within Misthollow, ancient ruins pulse with forgotten power. The stone walls glow with faded runes, and the air smells of ozone and old magic. Something stirs beneath the rubble — something that has slept since before the Shattering.',
    effect: 'The awakening energy grants additional tactical options.',
    triggerChance: 0.08,
    minTurn: 4,
  },
  {
    id: 'dragon_sighting',
    title: 'DRAGON IN THE FROSTLANDS',
    text: 'Shepherds in the northern Frostlands report seeing a vast shape moving through the clouds above Dragonspine. Scales glint in the pale light. The mountain itself seems to tremble. It has been centuries since a dragon was last sighted in Aethermoor.',
    effect: 'The dragon\'s presence unsettles all forces. Attacks in the Frostlands are more cautious this turn.',
    triggerChance: 0.06,
    minTurn: 5,
  },
  {
    id: 'plague_outbreak',
    title: 'BLOOD FEVER',
    text: 'A mysterious illness sweeps through the Southern Realms. Healers are overwhelmed, and soldiers fall sick in their camps. Moonhaven\'s temples are filled with the dying, and even the strongest warriors weaken.',
    effect: 'Units across the Southern Realms are weakened by the fever.',
    triggerChance: 0.07,
    minTurn: 6,
  },
  {
    id: 'rebel_uprising',
    title: 'PEASANT REVOLT',
    text: 'The common people have had enough. Farmers and craftsmen take up pitchforks and torches, marching against the nearest garrison. "We feed your armies! We die in your wars! We will be silent no more!" their leader shouts.',
    effect: 'Fortifications in the Heartlands are temporarily weakened by the uprising.',
    triggerChance: 0.08,
    minTurn: 4,
  },
  {
    id: 'eclipse',
    title: 'THE DARKENING',
    text: 'Without warning, the sun dims. Not slowly — instantly, as if something vast has passed between Aethermoor and the light. For three heartbeats, absolute darkness. Then the light returns, but everything feels... different. The Aetheric fragments all pulse in unison.',
    effect: 'The Darkening\'s aftermath leaves all forces disoriented. No tactical advantage can be gained this turn.',
    triggerChance: 0.05,
    minTurn: 8,
  },
  {
    id: 'berserker_rage',
    title: 'BLOOD FRENZY',
    text: 'A strange red mist rolls across the battlefield, and soldiers on all sides feel an inexplicable surge of fury. Reason flees. Commands go unheeded. Warriors charge with reckless abandon, howling like beasts.',
    effect: 'Attack power surges, but defenses crumble in the frenzy.',
    triggerChance: 0.09,
    minTurn: 3,
  },
  {
    id: 'holy_light',
    title: 'DIVINE INTERVENTION',
    text: 'A column of brilliant white light descends from the heavens, illuminating a random territory with blinding radiance. Those within it feel their wounds close and their spirits lift. The light is warm, protective, and absolutely undeniable.',
    effect: 'The blessed territory\'s defenders gain extraordinary protection this turn.',
    triggerChance: 0.06,
    minTurn: 5,
  },
  {
    id: 'fragment_whisper',
    title: 'THE THRONE WHISPERS',
    text: 'Every Aetheric fragment-bearing warlord hears the same voice at the same moment: a voice like grinding stone and flowing water, ancient and impossibly vast. "You fight for unity, but you bring only division. The Crown cannot be reforged in blood." Then — silence. The voice does not come again.',
    effect: 'The whisper shakes all warlords\' confidence. Reinforcements are reduced this turn.',
    triggerChance: 0.04,
    minTurn: 10,
  },
];

// ========================================
// REGION LORE — for potential future use
// ========================================

export const REGION_LORE: Record<string, string> = {
  'The Frostlands': 'The northernmost region of Aethermoor, where eternal winter grips the mountains and ancient fortresses guard the frontier. Ironhold, the greatest fortress in the known world, anchors the north against whatever horrors lurk beyond the ice. The Frostlands breed hard people — soldiers, miners, and dragon hunters who laugh at the cold.',
  'The Heartlands': 'The fertile center of Aethermoor, where the majority of the population lives and farms. Goldshire\'s markets, Silverdale\'s vineyards, Thornwall\'s military academy, and Ashenvale\'s ancient forests form the economic and cultural heart of the continent. Control the Heartlands, and you control Aethermoor.',
  'The Southern Realms': 'A land of extremes — the scorching forges of Sunforge, the haunted ruins of Misthollow, the storm-wracked towers of Ravencrest, and the sacred temples of Moonhaven. The Southern Realms are where old magic still lingers in the stones, and the dead do not always stay buried.',
  'The Eastern Shores': 'Aethermoor\'s gateway to the sea. Port Brighthelm handles all trade with distant continents, while Crystal Lake\'s shimmering waters are said to hold prophetic visions. The Eastern Shores are wealthy, exposed, and perpetually contested.',
  'The Western Reaches': 'Dark, wild, and largely unexplored. The ancient forest of Darkwood has never been fully mapped, and Misthollow\'s perpetually fog-shrouded valleys hide secrets from before the Shattering. Only the desperate or the foolhardy venture deep into the Western Reaches.',
};