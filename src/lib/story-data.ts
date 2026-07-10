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

// ========================================
// CHAPTER SYSTEM
// ========================================

export interface Chapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;        // Short preview text for chapter select
  bgStyle: StoryBeat['bgStyle'];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1_assembly',
    number: 1,
    title: 'THE ASSEMBLY',
    subtitle: 'Where Four Become Warlords',
    description: 'The fragments have chosen their bearers. Four warlords gather their forces as the continent descends into war for the first time in a thousand years.',
    bgStyle: 'dramatic',
  },
  {
    id: 'ch2_first_blood',
    number: 2,
    title: 'FIRST BLOOD',
    subtitle: 'The Price of Ambition',
    description: 'Borders are tested. The first battles are fought, and the true cost of the war becomes clear as the first territory falls.',
    bgStyle: 'battle',
  },
  {
    id: 'ch3_escalation',
    number: 3,
    title: 'THE ESCALATION',
    subtitle: 'Alliances Shatter, Empires Rise',
    description: 'The war intensifies. One warlord falls, their fragment dimming forever. The remaining three eye each other with growing hunger.',
    bgStyle: 'dark',
  },
  {
    id: 'ch4_turning_tide',
    number: 4,
    title: 'THE TURNING TIDE',
    subtitle: 'When Hope Flickers',
    description: 'A dominant power emerges. The continent groans under the weight of endless battle. Ancient powers stir in response to the Aetheric imbalance.',
    bgStyle: 'dramatic',
  },
  {
    id: 'ch5_final_stand',
    number: 5,
    title: 'THE FINAL STAND',
    subtitle: 'Two Fragments, One Crown',
    description: 'Only two warlords remain. The fate of Aethermoor hangs in the balance as the final war for the Aetheric Crown begins.',
    bgStyle: 'battle',
  },
];

// ========================================
// CHAPTER TRANSITION TITLE CARDS
// ========================================

const CHAPTER_DRAMATIC_LINES: Record<string, string> = {
  ch1_assembly: 'The fragments have chosen. The die is cast. Aethermoor will never be the same.',
  ch2_first_blood: 'The first blade has been drawn. There is no turning back now.',
  ch3_escalation: 'One warlord has fallen. The fragments grow heavier. The hunger deepens.',
  ch4_turning_tide: 'The balance of power tilts. Ancient forces stir beneath the shattered Throne.',
  ch5_final_stand: 'Two remain. The abyss watches. The Crown waits for its sovereign.',
};

export function getChapterTitleBeat(chapter: Chapter): StoryBeat {
  const dramaticLine = CHAPTER_DRAMATIC_LINES[chapter.id]
    || 'The war for Aethermoor continues.';

  return {
    id: `chapter-title-${chapter.id}`,
    title: chapter.title,
    subtitle: chapter.subtitle,
    bgStyle: chapter.bgStyle,
    skippable: true,
    pages: [
      {
        text: `Chapter ${chapter.number}`,
      },
      {
        text: chapter.title,
      },
      {
        text: chapter.subtitle,
      },
      {
        text: dramaticLine,
      },
    ],
  };
}

// ========================================
// MID-GAME STORY TRIGGERS
// ========================================

export interface StoryTrigger {
  id: string;
  type: 'first_blood' | 'territory_capture' | 'region_dominance' | 'rival_clash' | 'desperate_hour' | 'dominant_force' | 'chapter_transition';
  condition: string; // descriptive
  minTurn: number;
  oneTime: boolean;
}

export function getFirstBloodBeat(
  attackerName: string,
  attackerClass: string,
  attackerColor: string,
  attackerColorLight: string,
  attackerPortrait: string,
  defenderName: string,
  territoryName: string,
): StoryBeat {
  const classTitle = attackerClass.charAt(0).toUpperCase() + attackerClass.slice(1);

  return {
    id: 'trigger-first-blood',
    title: 'FIRST BLOOD',
    subtitle: `${attackerName} Strikes the Opening Blow`,
    bgStyle: 'battle',
    skippable: false,
    pages: [
      {
        text: `The first clash of the war for the Aetheric Crown has begun. Across Aethermoor, the very air seems to hold its breath as the four warlords' fragments pulse in eerie unison — sensing, perhaps, that the age of peace has truly ended. Somewhere in the heavens above the floating continent, the ghost of Aldric the Unbroken looks down upon his shattered legacy and weeps.`,
      },
      {
        text: `${attackerName} the ${classTitle} has drawn first blood, seizing ${territoryName} from ${defenderName} in a battle that will echo through the ages. The ground still smolders where the Aetheric fragment's power was unleashed, and the defenders who survived speak of a force that felt less like an army and more like an avalanche given purpose. The other warlords take note. The game has begun in earnest.`,
        speaker: attackerName,
        speakerColor: attackerColor,
        portrait: attackerPortrait,
      },
      {
        text: `But the land pays the price. Where ${territoryName}'s soil was once rich and verdant, thin cracks of golden light now spider across the surface — the aether bleeding out from the violence done upon it. Old scholars knew this sign. They called it the Throne's Sorrow, and they said it meant the continent was sinking. Closer to the Endless Abyss. Closer to the dark.`,
      },
    ],
  };
}

export function getTerritoryCaptureBeat(
  territoryId: string,
  territoryName: string,
  playerName: string,
  characterClass: string,
  color: string,
  colorLight: string,
  portrait: string,
): StoryBeat | null {
  const classTitle = characterClass.charAt(0).toUpperCase() + characterClass.slice(1);

  const keyTerritories: Record<string, { title: string; subtitle: string; pages: StoryPage[] }> = {
    ironhold: {
      title: 'THE GREATEST FORTRESS',
      subtitle: `${playerName} Claims Ironhold`,
      pages: [
        {
          text: `Ironhold — the unconquerable fortress, the northern bulwark that has stood since the first Warden raised its walls from living granite. For a thousand years, no army has breached its gates. No siege has lasted more than a fortnight against its layered defenses and the fanatical resolve of its garrison. It is a monument to military perfection, and now it has a new master.`,
        },
        {
          text: `${playerName} the ${classTitle} stands atop Ironhold's highest tower, the Aetheric fragment blazing at their chest like a second sun. The fortress stretches below in all directions — curtain walls, watchtowers, killing grounds, and the vast armories that have supplied a thousand campaigns. "This is what power looks like," ${playerName} says, voice carried on the northern wind. "Not a throne. Not a crown. Walls."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `But within Ironhold's deepest vault, sealed behind doors that have not opened since Aldric's reign, something stirs. Old mechanisms grind. Aetheric conduits buried in the mountain's roots flicker with golden light. Whatever the first Warden hid beneath the fortress is awakening — and it is responding to the fragment's call. The fortress was never just a fortress. It was a lock. And ${playerName} may have just turned the key.`,
        },
      ],
    },
    dragonspine: {
      title: 'THE DRAGON WAKES',
      subtitle: `${playerName} Ascends Dragonspine`,
      pages: [
        {
          text: `The mountain called Dragonspine has always been sacred ground. Shepherds and miners avoid its upper reaches, telling stories of vast shapes moving through the clouds and eyes the color of molten copper watching from caverns too deep for human light. The fragments of the Aetheric Throne were forged in dragonfire, the old texts say — and the dragons never forgave the Wardens for taking their gift.`,
        },
        {
          text: `${playerName} the ${classTitle} has claimed the mountain, planting their banner at the summit where the air is thin and the sky is close enough to touch. The Aetheric fragment howls at the altitude, resonating with something ancient that sleeps beneath the stone. ${playerName} can feel it — a heartbeat, slow and vast, like the pulse of a mountain-sized dream.`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `And then the ground shakes. Not with the tremor of battle, but with something far older. A crack opens in the mountainside, and from within pours a breath of heat so intense it melts the snow for a mile in every direction. Somewhere in the depths, a dragon opens one enormous eye. It has been sleeping since before the Shattering. But the fragment has woken it. And it is hungry.`,
        },
      ],
    },
    goldshire: {
      title: 'HEART OF THE HEARTLANDS',
      subtitle: `${playerName} Seizes Goldshire`,
      pages: [
        {
          text: `Goldshire is the beating heart of Aethermoor — not because of its armies or its magic, but because of its gold. The markets of Goldshire supply every warlord on the continent with the coin needed to fund campaigns, hire mercenaries, and bribe officials. Its fall is never merely a military event; it is an economic earthquake that reshapes the war itself.`,
        },
        {
          text: `${playerName} the ${classTitle} rides through Goldshire's gilded gates as merchants scatter and the great trading houses lower their flags. The Aetheric fragment hums with something almost like satisfaction — the Throne understood the value of gold, once. "Wealth is not power," ${playerName} declares, surveying the captured treasury. "But it is the shadow of power. And where the shadow falls, the substance follows."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `The fall of Goldshire sends shockwaves across all five realms. Supply lines falter. Mercenary contracts are renegotiated. The three remaining warlords must now reckon with a ${classTitle.toLowerCase()} who controls the purse strings of the continent. The Heartlands have a new master, and the price of everything — from bread to blood — has just changed.`,
        },
      ],
    },
    misthollow: {
      title: 'SECRETS OF THE MIST',
      subtitle: `${playerName} Dares the Misthollow`,
      pages: [
        {
          text: `Misthollow is not a place that welcomes conquerors. The perpetual fog that gives the valley its name is not natural — it is the exhalation of something vast and ancient that lies beneath the earth, breathing in slow, geologic rhythms. Those who enter the mist speak of voices, of visions, of memories that are not their own. Many do not return at all.`,
        },
        {
          text: `${playerName} the ${classTitle} pushes through the fog, the Aetheric fragment blazing like a lantern against the unnatural darkness. The mist recoils from the fragment's light — but only for a moment. Then it closes in again, thicker, hungrier, as if it recognizes a kindred power. "The Throne was built on secrets," ${playerName} whispers, eyes straining into the white void. "Let us see what it was trying to hide."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `Deep within the hollow, the fog clears to reveal ruins that predate the Aetheric Wardens by millennia. Stone pillars covered in writing that no living scholar can read. A pit that descends into absolute darkness, from which a cold wind rises endlessly. And at the center, a pedestal where a fifth fragment-shaped depression sits empty — as if the Throne was never meant to have only four pieces. ${playerName} has found something that changes everything.`,
        },
      ],
    },
    port_brighthelm: {
      title: 'THE GATEWAY OPENS',
      subtitle: `${playerName} Takes Port Brighthelm`,
      pages: [
        {
          text: `Port Brighthelm is Aethermoor's window to the world beyond the Endless Abyss — the only harbor capable of receiving ships from distant continents, and the lifeline through which exotic weapons, rare reagents, and foreign mercenaries flow. Control the port, and you control the flow of the outside world into the war.`,
        },
        {
          text: `${playerName} the ${classTitle} watches the foreign merchant fleet from Brighthelm's lighthouse, the Aetheric fragment casting long shadows across the harbor below. The captured ships bring news: the continents across the Abyss have felt the Shattering too. The magical shockwave rippled through reality itself, and distant kingdoms are sending envoys — some to help, some to conquer, all to claim a piece of the Aetheric Throne's legacy.`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `With Brighthelm under their control, ${playerName} can now choose which foreign powers gain access to Aethermoor — and which are turned away. It is a different kind of power than the fragment provides: the power of connection, of trade, of a world that is suddenly much larger than four warlords and their private war. The Eastern Shores have a new admiral, and the tides of the conflict are about to shift.`,
        },
      ],
    },
    darkwood: {
      title: 'THE UNCHARTED DEPTHS',
      subtitle: `${playerName} Claims Darkwood`,
      pages: [
        {
          text: `Darkwood has never been fully mapped. The ancient forest stretches across the Western Reaches like a living wall, its canopy so thick that noon looks like midnight beneath the boughs. Paths appear and vanish. Trees move when no one is watching. The wood elves who once lived here vanished centuries ago, and no one knows where they went — though some say they never left, and that the forest itself is their body, grown vast and strange with age.`,
        },
        {
          text: `${playerName} the ${classTitle} presses deeper into Darkwood than any army has dared before, the Aetheric fragment pulsing in rhythm with the forest's heartbeat. The trees lean in, curious. The shadows lengthen, watchful. "The Throne's power came from the land itself," ${playerName} realizes, hand resting on the bark of a tree older than human civilization. "And the land remembers."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `At the forest's heart, ${playerName} finds a clearing that should not exist — a perfect circle of grass and wildflowers, lit by a sunbeam that has no source. In the center grows a single tree, white as bone, its roots intertwined with veins of pure aetheric crystal. This is the Worldtree, the oldest living thing on Aethermoor, the source from which the first Warden drew the power to create the Throne. And it is still alive. Still growing. Still waiting.`,
        },
      ],
    },
  };

  const beat = keyTerritories[territoryId];
  if (!beat) return null;

  return {
    id: `trigger-capture-${territoryId}`,
    title: beat.title,
    subtitle: beat.subtitle,
    bgStyle: 'battle',
    skippable: false,
    pages: beat.pages,
  };
}

export function getRegionDominanceBeat(
  regionName: string,
  playerName: string,
  color: string,
  regionLore: string,
): StoryBeat {
  return {
    id: `trigger-dominance-${regionName.replace(/\s+/g, '_').toLowerCase()}`,
    title: 'REGION DOMINANCE',
    subtitle: `${playerName} Controls ${regionName}`,
    bgStyle: 'dramatic',
    skippable: false,
    pages: [
      {
        text: `The last banner of resistance in ${regionName} has fallen. Every territory, every fortress, every village now answers to a single warlord — and that warlord is ${playerName}. The Aetheric fragment blazes with fierce approval, drinking deep of the region's concentrated aetheric energy. For a moment, the very sky above ${regionName} turns the color of ${playerName}'s banner.`,
      },
      {
        text: `${regionLore}`,
      },
      {
        text: `But dominion is a double-edged sword. With total control of ${regionName} comes total responsibility — and total vulnerability. Every rival warlord now sees ${playerName} as the threat to be destroyed, and the fragment's surge of power has not gone unnoticed. The other bearers feel it in their blood, a primal alarm that says: one of us has grown too strong. The hunt begins.`,
      },
    ],
  };
}

export function getRivalClashBeat(
  attackerName: string,
  attackerClass: string,
  attackerColor: string,
  attackerPortrait: string,
  defenderName: string,
  defenderClass: string,
  defenderColor: string,
  defenderPortrait: string,
): StoryBeat {
  const attackerTitle = `${attackerName} the ${attackerClass.charAt(0).toUpperCase() + attackerClass.slice(1)}`;
  const defenderTitle = `${defenderName} the ${defenderClass.charAt(0).toUpperCase() + defenderClass.slice(1)}`;

  return {
    id: `trigger-rival-clash-${attackerName}-${defenderName}`,
    title: 'THE RIVALS CLASH',
    subtitle: `${attackerName} vs. ${defenderName}`,
    bgStyle: 'battle',
    skippable: false,
    pages: [
      {
        text: `There are wars of convenience, and then there are wars of destiny. When ${attackerTitle} first turned their armies toward ${defenderTitle}'s territory, every oracle and seer on Aethermoor felt the shift — two Aetheric fragments resonating in violent harmony, their frequencies clashing like the grinding of tectonic plates. The air between their territories crackled with golden lightning, and soldiers on both sides reported the same vision: two thrones, side by side, one of them empty.`,
        speaker: attackerName,
        speakerColor: attackerColor,
        portrait: attackerPortrait,
      },
      {
        text: `"So we finally meet on the field of honor," ${defenderName} says, ${defenderClass === 'paladin' || defenderClass === 'knight' ? 'shield raised and resolve unbroken' : defenderClass === 'mage' ? 'fingers already weaving defensive wards' : 'materializing from shadows with a predator\'s grace'}. "I have watched you grow stronger from a distance. Let us see if your strength is matched by your wisdom." The fragment at ${defenderName}'s chest flares — not in attack, but in acknowledgment. A worthy foe, at last.`,
        speaker: defenderName,
        speakerColor: defenderColor,
        portrait: defenderPortrait,
      },
      {
        text: `The battle that follows is unlike any other in the war. Two fragments of the Aetheric Throne, each amplifying their bearer's will, collide with a force that reshapes the terrain itself. Hills flatten. Rivers change course. The sky tears open, and for one brief, terrifying instant, both warlords catch a glimpse of the completed Crown — whole, radiant, impossibly beautiful — before the vision shatters and the war continues. Aethermoor shudders. The abyss below grows a little closer.`,
      },
    ],
  };
}

export function getDesperateHourBeat(
  playerName: string,
  characterClass: string,
  color: string,
  colorLight: string,
  portrait: string,
  territoryCount: number,
): StoryBeat {
  const classTitle = characterClass.charAt(0).toUpperCase() + characterClass.slice(1);

  const classSpecificPages: Record<string, StoryPage[]> = {
    knight: [
      {
        text: `${playerName} surveys the map with the cold precision of a general who has lost too many battles to indulge in hope. ${territoryCount} territories. That is all that remains of the northern empire. The great fortresses have fallen, the armies are scattered, and the crimson banners that once flew from every watchtower now gather dust in abandoned armories.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `But a knight does not surrender. Not when the walls are breached. Not when the odds are impossible. ${playerName} rallies the last loyal soldiers — barely a company, scarred and weary, but still standing. "A fortress can be rebuilt," ${playerName} declares, sword drawn. "An army can be raised again. But the will to fight? That either lives in you or it doesn't. And mine is burning."`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The fragment flickers uncertainly at ${playerName}'s chest, its light guttering like a candle in a storm. It senses the desperation of its bearer — and responds in the only way it knows how. It burns brighter, feeding on ${playerName}'s defiance, transforming desperation into something harder and sharper than steel. The war is not over. Not while the ${classTitle.toLowerCase()} still draws breath.`,
      },
    ],
    mage: [
      {
        text: `The arcana chambers are dark. The floating glyphs that once illuminated ${playerName}'s sanctum have dimmed to barely visible embers, starved of the aetheric energy that ${playerName} can no longer spare. ${territoryCount} territories remain — barely enough to sustain the fragment's connection to the land, and nowhere near enough to fuel the spells that once bent reality to ${playerName}'s will.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"Seventeen futures," ${playerName} murmurs, gazing into a scrying pool that shows nothing but static. "I once saw seventeen futures. Now I see only one — and it ends in darkness." The Mage's fingers trace the fragment's surface, seeking the patterns, the equations, the hidden variables. There must be something. Some possibility unaccounted for. Some thread of fate that has not yet been pulled.`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `And then ${playerName} finds it — a sliver of probability so thin it almost doesn't exist. A path through seventeen billion possible outcomes that leads not to survival, but to victory. The fragment responds, flooding ${playerName}'s mind with forbidden knowledge and terrible clarity. The cost will be enormous. But the Mage has never been afraid of knowledge, no matter how dark its source.`,
      },
    ],
    rogue: [
      {
        text: `${playerName} crouches in the ruins of a watchtower, the last of the shadows offering what little concealment remains. ${territoryCount} territories. The shadows are shrinking — fewer places to hide, fewer paths to escape, fewer allies willing to harbor a warlord on the run. The game that was supposed to be won through cunning and stealth has become a desperate scramble for survival.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"Everyone runs out of shadows eventually," ${playerName} says to no one, testing the edge of a blade that has lost its fragment-enhanced sheen. "But they always forget — the shadow doesn't just hide you. It shows you things. And I have seen things in the dark that would make the other warlords weep."`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The fragment stirs — not with power, but with something older and more dangerous. It whispers of the spaces between heartbeats, the moments when reality blinks, the instants when a shadow-walker can step between worlds. ${playerName} has never used this ability before. The cost is steep: a piece of the bearer's soul for every shadow-step. But with ${territoryCount} territories remaining, the Rogue is running out of options — and running out of soul is better than running out of time.`,
      },
    ],
    paladin: [
      {
        text: `${playerName} kneels in the rubble of what was once a temple, hands clasped in prayer, fragment casting its fading holy light across broken pews and shattered stained glass. ${territoryCount} territories. The faithful are scattered, the temples desecrated, and the light that once guided ${playerName}'s armies has dimmed to a flicker. The continent groans under the weight of war, and the abyss below grows ever closer.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"You test me," ${playerName} whispers to the fragment, to the sky, to whatever force shaped the Aetheric Throne and then shattered it. "You test my faith when everything I built lies in ruins. But faith is not a tower — it does not crumble when the wind blows. Faith is the wind itself." The fragment hears. And for the first time since the war began, it does not demand — it gives.`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The light swells. Not the cold, analytical glow of the Mage's aether, nor the hungry crimson of the Knight's fragment, but something warmer — something that feels like absolution. The Paladin rises, shield reforming from pure light, and the last ${territoryCount} territories pulse with renewed holy energy. ${playerName} will not win through strength or cunning. ${playerName} will win because the light refuses to go out.`,
      },
    ],
  };

  const pages = classSpecificPages[characterClass] || classSpecificPages.knight;

  return {
    id: `trigger-desperate-${playerName}`,
    title: 'THE DESPERATE HOUR',
    subtitle: `${playerName}'s Back Against the Wall`,
    bgStyle: 'dark',
    skippable: false,
    pages,
  };
}

export function getDominantForceBeat(
  playerName: string,
  color: string,
  territoryCount: number,
  totalPlayers: number,
): StoryBeat {
  const remainingRivals = totalPlayers - 1;

  return {
    id: `trigger-dominant-${playerName}`,
    title: 'THE TIDE OF WAR',
    subtitle: `${playerName} Controls ${territoryCount} Territories`,
    bgStyle: 'victory',
    skippable: false,
    pages: [
      {
        text: `The map of Aethermoor has been redrawn. Where once four warlords held roughly equal sway, a single power now dominates — and that power is ${playerName}. With ${territoryCount} territories under their banner and ${remainingRivals} rival${remainingRivals !== 1 ? 's' : ''} left to challenge them, the war for the Aetheric Crown is approaching its endgame.`,
      },
      {
        text: `The Aetheric fragment responds to this dominance with terrifying enthusiasm. It burns hotter, pulses stronger, and whispers more insistently — urging its bearer onward, promising ultimate power, unity, the reforged Crown. The land itself seems to lean toward ${playerName}'s territories, aetheric currents flowing like rivers toward a dominant gravitational center. The other fragments grow dimmer in comparison, their bearers weakened by the imbalance.`,
      },
      {
        text: `But ${remainingRivals > 1 ? 'the remaining warlords' : 'the last rival'} will not surrender quietly. Desperation is a potent fuel, and those who fight with nothing to lose are often the most dangerous. Across the continent, alliances of convenience form, last-ditch strategies are hatched, and ancient weapons are dragged from vaults sealed since before the Shattering. The end of the war is near — but the bloodiest chapter may yet be unwritten.`,
      },
    ],
  };
}

// ========================================
// RIVAL DIALOGUE SYSTEM
// ========================================

export interface RivalDialogue {
  id: string;
  speakerClass: string;   // Which class speaks this
  context: 'turn_start' | 'attacking' | 'defending' | 'losing' | 'winning';
  minTurn: number;
  lines: string[];
}

export const RIVAL_DIALOGUES: RivalDialogue[] = [
  // Knight dialogue lines
  { id: 'knight_turn_early', speakerClass: 'knight', context: 'turn_start', minTurn: 1, lines: [
    'My armies stand ready. The north does not wait for the hesitant.',
    'Steel and discipline. That is all Aethermoor needs now.',
    'The fragment pulses. It hungers for order.',
  ]},
  { id: 'knight_attacking', speakerClass: 'knight', context: 'attacking', minTurn: 1, lines: [
    'Charge! Let them feel the weight of true resolve!',
    'For the north! For order! Break their lines!',
    'No retreat. No surrender. Forward!',
  ]},
  { id: 'knight_defending', speakerClass: 'knight', context: 'defending', minTurn: 1, lines: [
    'Hold the line! Not one step back!',
    'Let them come. Our walls have never fallen.',
    'A shield wall does not break. It only grows stronger.',
  ]},
  // Mage dialogue lines
  { id: 'mage_turn_early', speakerClass: 'mage', context: 'turn_start', minTurn: 1, lines: [
    'The aetheric currents shift... interesting. The threads of fate are tangled.',
    'I have seen seventeen possible futures today. In twelve of them, I win.',
    'Knowledge is the sharpest blade. And I have an entire library.',
  ]},
  { id: 'mage_attacking', speakerClass: 'mage', context: 'attacking', minTurn: 1, lines: [
    'Let them burn. Arcane fire cares nothing for armor.',
    'The equations of war are simple. I have already solved them.',
    'Witness the power that shattered a throne!',
  ]},
  { id: 'mage_defending', speakerClass: 'mage', context: 'defending', minTurn: 1, lines: [
    'My wards are unbreakable. Try and see.',
    'Every spell I cast is a calculation. They cannot outthink the inevitable.',
    'The aether bends to my will. Your armies will not.',
  ]},
  // Rogue dialogue lines
  { id: 'rogue_turn_early', speakerClass: 'rogue', context: 'turn_start', minTurn: 1, lines: [
    'They think they see me coming. They are wrong.',
    'The shadows are full of secrets. I know all of them.',
    'Every warlord here has a weakness. I intend to find them all.',
  ]},
  { id: 'rogue_attacking', speakerClass: 'rogue', context: 'attacking', minTurn: 1, lines: [
    'You never saw it coming. None of them ever do.',
    'From the darkness, swift and certain.',
    'Why fight fair when you can fight smart?',
  ]},
  { id: 'rogue_defending', speakerClass: 'rogue', context: 'defending', minTurn: 1, lines: [
    'You think you have me cornered? I am exactly where I want to be.',
    'The shadows protect their own.',
    'Catch me if you can.',
  ]},
  // Paladin dialogue lines
  { id: 'paladin_turn_early', speakerClass: 'paladin', context: 'turn_start', minTurn: 1, lines: [
    'The light guides my path. Even in this darkness, I do not waver.',
    'Faith is not a weapon. It is a shield. And mine is unbreakable.',
    'Aethermoor will be saved — not by conquest, but by conviction.',
  ]},
  { id: 'paladin_attacking', speakerClass: 'paladin', context: 'attacking', minTurn: 1, lines: [
    'In the name of the light, I strike!',
    'Your darkness ends here. Justice comes for all.',
    'Holy fire cleanses all. Even the battlefield.',
  ]},
  { id: 'paladin_defending', speakerClass: 'paladin', context: 'defending', minTurn: 1, lines: [
    'The light shall not be extinguished!',
    'My faith is my fortress. You cannot breach it.',
    'Even in defeat, I do not yield. For I know the truth.',
  ]},
  // Losing dialogue (any class)
  { id: 'knight_losing', speakerClass: 'knight', context: 'losing', minTurn: 5, lines: [
    'The walls are crumbling... but I will fight from the rubble.',
    'A knight does not beg. But I admit... the situation is dire.',
  ]},
  { id: 'mage_losing', speakerClass: 'mage', context: 'losing', minTurn: 5, lines: [
    'This outcome was... not in my calculations. Fascinating.',
    'The aether... is draining. I must conserve what remains.',
  ]},
  { id: 'rogue_losing', speakerClass: 'rogue', context: 'losing', minTurn: 5, lines: [
    'Everyone runs out of shadows eventually.',
    'I always have an exit strategy. ...I think.',
  ]},
  { id: 'paladin_losing', speakerClass: 'paladin', context: 'losing', minTurn: 5, lines: [
    'Even now, I do not doubt. The light tests those who are worthy.',
    'A guardian falls... but the light endures.',
  ]},
  // Winning dialogue (any class)
  { id: 'knight_winning', speakerClass: 'knight', context: 'winning', minTurn: 5, lines: [
    'The pieces are in place. Aethermoor will know order once more.',
    'One by one, the banners fall. Soon, only mine will remain.',
  ]},
  { id: 'mage_winning', speakerClass: 'mage', context: 'winning', minTurn: 5, lines: [
    'The pattern is becoming clear. Victory is simply the next logical step.',
    'I have calculated every variable. The outcome is no longer in doubt.',
  ]},
  { id: 'rogue_winning', speakerClass: 'rogue', context: 'winning', minTurn: 5, lines: [
    'The game is almost over. And they never even saw me playing.',
    'Checkmate. Though I prefer the term... shadow-check.',
  ]},
  { id: 'paladin_winning', speakerClass: 'paladin', context: 'winning', minTurn: 5, lines: [
    'The light grows stronger with every territory freed from darkness.',
    'Soon, this war will end. And peace will finally reign.',
  ]},
];

export function getRivalDialogue(characterClass: string, context: RivalDialogue['context'], turnNumber: number): { text: string } | null {
  const cls = characterClass.toLowerCase();
  const eligible = RIVAL_DIALOGUES.filter(d => {
    if (d.speakerClass !== cls) return false;
    if (d.context !== context) return false;
    if (turnNumber < d.minTurn) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  const dialogue = eligible[Math.floor(Math.random() * eligible.length)];
  const line = dialogue.lines[Math.floor(Math.random() * dialogue.lines.length)];
  return { text: line };
}

// ========================================
// CAMPAIGN PROGRESS STATE
// ========================================

export interface CampaignProgress {
  currentChapter: number;       // 1-5
  totalConquests: number;        // territories captured by human player
  firstBloodFired: boolean;
  firedTriggers: Set<string>;    // IDs of one-time triggers that have fired
  rivalClashes: Set<string>;     // "playerA-playerB" pairs that have clashed
  regionDominanceFired: Set<string>; // region names already triggered
  turnStoryFired: Set<number>;   // turn numbers where story already fired
}