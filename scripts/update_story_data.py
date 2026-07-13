#!/usr/bin/env python3
"""Rewrite story-data.ts with Cambodian folklore theme."""

STORY_DATA = r'''// ========================================
// KHMER EMPIRE STORY SYSTEM
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
  title: 'THE SHATTERING OF THE CROWN',
  subtitle: 'A Chronicle of the Khmer Empire',
  bgStyle: 'dramatic',
  skippable: true,
  pages: [
    {
      text: 'In ages past, the Khmer Empire was unified beneath the Sacred Crown of Angkor — a divine regalia forged in the fire temples of Phnom Kulen, said to channel the spiritual essence of the land itself. For a thousand years, the Temple Guardians maintained harmony across the five provinces, and the people flourished under the Crown\'s golden radiance. The temples of Angkor Wat stood as beacons of celestial order, their spires reaching toward the heavens.',
    },
    {
      text: 'But the last Guardian, King Jayavarman the Unbroken, died without an heir. As his final breath faded beside the sacred lotus pool, the Crown cracked — then shattered into four fragments, each hurtling across the empire to bond with a different soul. The temple bells rang in mourning. The Mekong ran backwards for a single night. The age of harmony was over.',
    },
    {
      text: 'Now four warlords rise, each wielding a fragment of the Crown\'s ancient power. King Soryan the Iron Strategist, Queen Veasna of Shadows, Lord Chanreth the Stormcaller, and Emperor Kiriath the Eternal Flame wage war across the Frostlands, the Heartlands, the Southern Realms, the Eastern Shores, and the Western Reaches — each believing that only by reuniting the fragments can the Sacred Crown be reforged and the empire restored.',
    },
    {
      text: 'But the fragments twist their bearers. With every battle fought upon the land, the Khmer Empire itself suffers. The ancestral spirits grow restless, the naga serpents stir beneath the rivers, and the sacred temples lose their luminance with each drop of blood spilled upon the soil. The war must end — one way or another — before the Khmer Empire falls into darkness forever.',
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
          text: `${playerName} stands upon the ancient battlements near Angkor Wat, the monsoon wind whipping crimson banners against a sky heavy with rain clouds. The fragment of the Sacred Crown pulses warm against their chest — a constant reminder of the duty that fell upon them when the old world died. Born in the shadow of the great temple, trained from youth in the art of war and diplomacy, ${playerName} carved runes of wisdom into bronze armor that has never been pierced.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"There is no peace in hesitation," ${playerName} declares, gauntleted fist clenched around a curved jade blade that hums with fragment energy. "The people need order. They need the wisdom of the ancestors. They need someone willing to bear the weight of the crown — and the cost of war." Legends say ${playerName} can see ten moves ahead in any battle, guided by ancestral spirits whispering through the temple walls.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Strategist's fragment amplifies the strength of every soldier who marches under their banner. Swordsmen strike harder, their blades guided by the precision of Angkor's war scholars. Cavalry charges with devastating force, echoing the thunder of war elephants that once shook the earth. But the fragment feeds on conflict — the longer the war rages, the more it demands. ${playerName} knows this, and fights anyway, for the jade blade represents foresight and discipline — qualities the empire desperately needs.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    mage: {
      pages: [
        {
          text: `${playerName} stands atop a craggy peak as lightning splits the sky, the Sacred Crown fragment crackling with electrical energy in the palm of their hand. Born during the great monsoon, blessed by the storm gods themselves, the air around ${playerName} always carries the scent of ozone and rain. Villagers for a hundred leagues tell stories of a warrior who can calm storms with a whisper — or unleash them upon enemies with a single war cry that echoes like thunder.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The Crown was never meant to be one," ${playerName} murmurs, fingers tracing the fragment\u2019s storm-worn surface as electricity arcs between their fingertips. "It was four pillars holding up the sky itself. When it shattered, the rains came — and they have not stopped since. The monsoons grow wilder each year because the balance is broken."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Stormcaller's fragment grants dominion over the fury of the skies and reduces the cost of conjuring storm-born allies. Battle mages under ${playerName}'s command deploy in greater numbers, their spells weaving barriers of crackling lightning and howling wind. The legendary storm-spear channels divine wrath and untamed power, and armies under its banner march beneath black clouds that rain fire upon their enemies. But the fragment demands sacrifice — each storm summoned draws the monsoon closer to drowning the land itself.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    rogue: {
      pages: [
        {
          text: `${playerName} materializes from the mist of the Mekong delta, the Sacred Crown fragment concealed beneath a cloak woven from shadow and serpent scales. Daughter of a temple priestess, raised among the naga serpent rituals of the deep rivers, ${playerName} moves between worlds as easily as a river snake glides through water. The mist itself seems to lean toward them — coiling, whispering, as if the land recognizes the danger that walks among it.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The serpent crown sees all that is hidden," ${playerName} says with a knowing smile, producing a blade that seems to drink the light rather than reflect it. "I learned that in the temple rituals of my mother. Trust no one. Strike from the mist. And never — ever — let them see you coming." Tales claim ${playerName} can summon the spirits of fallen soldiers to fight again, and that the naga themselves serve as her unseen army.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Shadow Queen's fragment grants preternatural luck — dice fall in their favor, impossible shots find their mark, and defeats transform into narrow escapes through mist and shadow. Each battle, ${playerName} can reroll fate itself, guided by the serpent spirits that coil around the threads of destiny. But the fragment consumes its bearer's connection to the living world, and with every shadow-step, the boundary between this realm and the spirit world grows thinner.`,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    paladin: {
      pages: [
        {
          text: `${playerName} kneels in the sacred fire temple of Phnom Kulen, where the eternal flames have burned since the first kings were crowned. The Sacred Crown fragment rests in the heart of the ancient brazier, pulsing with a light that is almost painful to behold — the sun-disk crown, symbol of eternal fire and the cycle of rebirth. Raised in these very temples, trained in rituals of destruction and renewal, ${playerName} embodies both ruin and restoration.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The Shattering was not a tragedy — it was a purification," ${playerName} intones, rising to full height. A shield of pure flame materializes at their left arm, radiating warmth that makes the temple stones glow. "The old empire grew complacent. Now we must earn renewal through sacrifice and unwavering devotion to the sacred fire." Myths say ${playerName} can ignite flames with bare hands, and their armies carry torches into battle that burn away corruption and fear.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `The Eternal Flame's fragment creates unbreakable defenses — Shield Bearers and Paladins under ${playerName}'s command gain preternatural resilience, their armor sheathed in holy fire that turns aside blows that would fell lesser warriors. The sun-disk crown represents the eternal cycle: destruction and rebirth, death and renewal. But the fragment demands absolute faith, and doubt is punished with the extinguishing of its protective flames.`,
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
    subtitle: `The ${characterClass === 'knight' ? 'Iron Strategist' : characterClass === 'mage' ? 'Stormcaller' : characterClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame'} Rises`,
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
    knight: `${playerName}'s armies have been shattered. The crimson banners that once flew over the northern provinces now lie trampled in mud and monsoon water. ${playerName} kneels on a blood-soaked battlefield beside a shattered temple, the curved jade blade broken in two, fragment flickering weakly. "I... failed them," they whisper, watching the last of their soldiers fall. The ancestral spirits that once whispered guidance fall silent. The fragment dims — then goes dark. ${playerName} collapses beside the ruined temple walls, another casualty of the Khmer Empire's endless war.`,
    mage: `The sky above ${playerName}'s last stronghold goes eerily still — no wind, no rain, no lightning. For a Stormcaller, this silence is worse than any battlefield defeat. "The storms... they've abandoned me," ${playerName} murmurs as enemy forces breach the final walls. The storm-spear sputters, its lightning dying to a cold ember. ${playerName} reaches for the fragment, but it slips through rain-soaked fingers. The monsoon that once answered their call moves on without them, and ${playerName} fades — not dying, but simply becoming one with the rain.`,
    rogue: `${playerName} tries to step between worlds one last time, but the naga spirits reject them. The fragment — their passport through the mists — sputters and dies in their hands. "No. No, the serpent crown sees all. I ALWAYS have an exit—" But the mist closes in, and for the first time, ${playerName} has nowhere to hide. The final blow comes from the shadows — the way ${playerName} would have wanted it. At least, that's what the naga spirits tell themselves.`,
    paladin: `${playerName} stands alone in the ruins of the Phnom Kulen fire temple, shield cracked, armor scorched, but still on their feet. The eternal flames flicker and dim around them. "Even now... the fire does not die." The fragment's holy light pulses one final time — blinding, defiant, a sun-disk blazing against the encroaching dark. Then silence. The flames extinguish. ${playerName} falls to their knees, the last light of the sacred fire gone. The battlefield falls quiet. Even the enemy soldiers lower their weapons for a moment, honoring the fallen guardian of the eternal flame.`,
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
          text: `The final fortress falls. The last enemy banner is torn from its pole. Across all five provinces of the Khmer Empire, silence descends — the silence that follows the end of all things. ${playerName} stands at the summit of Angkor Wat, four fragments now fused into a single, blazing Sacred Crown of crimson gold. The temple spires, dark for so long, ignite with divine light that can be seen from every corner of the empire.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"I told you," ${playerName} says quietly, placing the Sacred Crown upon their brow. The land shudders — then stabilizes, the rivers flowing true once more, the monsoons finding their rhythm. "Order. Discipline. Wisdom. That is what the Khmer Empire needed. Not storms. Not shadows. Not fire. The teachings of the ancestors, carved in stone and carried in blood."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `And so ${playerName} takes the throne of Angkor, ruling as the first of a new dynasty of Temple Guardians. The armies disband. The people rebuild. The sacred temples glow once more with the light of a united empire. But in the darkest hours of the night, the Crown whispers to its new bearer — and ${playerName} listens, and is afraid. For the ancestral spirits speak of a truth the jade blade already revealed: power gained through war can only be maintained through war.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    mage: {
      pages: [
        {
          text: `The last enemy army dissolves as ${playerName} unleashes the combined might of all four Sacred Crown fragments in a single, devastating storm. The sky tears open, revealing the raw spiritual substrate beneath reality — and for one terrifying moment, everyone in the Khmer Empire sees the truth of the world: that the storms, the monsoons, the very weather itself is alive, and it has been watching.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"Now I understand," ${playerName} breathes, eyes wide with revelation as lightning courses through their body without harm. "The Crown was never a weapon. It was a lightning rod. A conduit to something far greater than any of us imagined." The four fragments spiral upward, fusing not into a crown, but into a vortex of storm energy that opens a doorway to the sky itself.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} ascends into the storm, and the Sacred Crown hovers behind, waiting. Whether the Stormcaller returns is a question only the monsoon can answer. But in their absence, the Khmer Empire enters an age of peace — guided not by a ruler, but by the perfect storms that bring rain to the fields and protection to the temples. The people say that when lightning strikes the spires of Angkor Wat, it is ${playerName}, still watching over the land from above.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    rogue: {
      pages: [
        {
          text: `Nobody sees ${playerName} when it happens. The last enemy warlord simply... falls, in the middle of their own throne room, with no witnesses and no explanation. The naga spirits retreat into the rivers, and ${playerName} emerges from the mist with four Sacred Crown fragments in hand and a smile that holds the secrets of a hundred lifetimes.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"The serpent crown taught me something the others never understood," ${playerName} says to the empty throne room, letting the fragments dissolve into mist that coils around them like living serpents. "True power is not taken by force. It is woven — thread by thread, shadow by shadow — until the world simply... rearranges itself around you."`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} vanishes the same day, leaving no trace, no throne, no crown. Some say the Shadow Queen became the mist itself — a guardian who watches from the fog of the Mekong delta, striking only when the balance of the world is threatened. Others say ${playerName} simply returned to the spirit world from which the naga first taught them. Either way, the empire is at peace. And in every mist that rises from the river, some say they see a serpentine shape, watching.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
      ],
    },
    paladin: {
      pages: [
        {
          text: `The final battle is not won with strength or cunning, but with sacred fire. ${playerName} walks unarmed through the enemy gates, the four Sacred Crown fragments orbiting like suns, and every soldier who raises a weapon against them finds their arms too heavy to lift. Not by magic — by faith. The eternal flames of Phnom Kulen burn in ${playerName}'s eyes, and no mortal darkness can withstand that light.`,
          portrait,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `"Lay down your arms," ${playerName} commands, and the voice carries not just sound but heat — the warmth of absolute conviction. "The war is over. Not because I have defeated you, but because the sacred fire burns in every heart, and it knows — this was never the answer." One by one, weapons clatter to the ground. One by one, soldiers kneel. The flames do not consume. They purify.`,
          speaker: playerName,
          speakerColor: color,
        },
        {
          text: `${playerName} reforges the Sacred Crown not as a symbol of power, but as a relic of remembrance. It is placed in the heart of Angkor Wat's central shrine — not to be worn, but to be contemplated. "The Crown does not choose a ruler," ${playerName} declares. "It chooses a guardian. And I will be the last." The Khmer Empire enters an age of peace, protected by the Eternal Flame whose devotion never wavered — and never will. The sacred fires of Phnom Kulen burn on, eternal as promised.`,
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
    subtitle: `${playerName} Has United the Khmer Empire`,
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
    id: 'spirit_storm',
    title: 'ANCESTRAL SPIRIT STORM',
    text: 'The fragmented Crown energy surges across the empire, manifesting as ghostly apparitions of ancient Khmer kings marching through the mist. Soldiers on all sides report hearing the ancient temple bells ringing in the distance — the voices of the Guardian spirits, warning of the darkness rising from below the earth.',
    effect: 'The spirit storm passes, but the land groans. All warlords feel the ancient temples pulse with uneasy energy.',
    triggerChance: 0.12,
    minTurn: 3,
  },
  {
    id: 'merchant_caravan',
    title: 'MEKONG TRADING FLEET',
    text: 'A fleet of river traders braves the war-torn waterways, offering supplies to any warlord willing to pay in sacred jade. Their boats are laden with weapons forged in Angkor's foundries, armor tempered in Phnom Kulen's fires, and provisions blessed by temple priests.',
    effect: 'Reinforcements are plentiful this turn.',
    triggerChance: 0.15,
    minTurn: 2,
  },
  {
    id: 'ancient_ruins',
    title: 'RUINS AWAKEN',
    text: 'Deep within Misthollow, ancient temple ruins pulse with forgotten power. Stone apsara dancers carved into the walls seem to move in the flickering light, and the air smells of lotus blossoms and old incense. Something stirs beneath the crumbling foundations — something that has slept since before the Crown was shattered.',
    effect: 'The awakening energy grants additional tactical options.',
    triggerChance: 0.08,
    minTurn: 4,
  },
  {
    id: 'naga_sighting',
    title: 'NAGA SERPENTS IN THE RIVERS',
    text: 'Fishermen along the great rivers report seeing vast serpentine shapes moving beneath the muddy waters. Scales glint like jade in the monsoon light. The rivers themselves seem to shift course. It has been centuries since the naga were last seen in the Khmer Empire — the last time was when the Crown was whole.',
    effect: 'The naga presence unsettles all forces. Attacks near rivers are more cautious this turn.',
    triggerChance: 0.06,
    minTurn: 5,
  },
  {
    id: 'plague_outbreak',
    title: 'RIVER FEVER',
    text: 'A mysterious illness sweeps through the Southern Realms, carried by the flooded rivers after the latest monsoon. Temple healers are overwhelmed, and soldiers fall sick in their camps. The sacred pools at Moonhaven are filled with the dying, and even the strongest warriors weaken beneath the fever's grip.',
    effect: 'Units across the Southern Realms are weakened by the fever.',
    triggerChance: 0.07,
    minTurn: 6,
  },
  {
    id: 'rebel_uprising',
    title: 'VILLAGE UPRISING',
    text: 'The common people have had enough. Rice farmers and temple craftsmen take up farming tools and torches, marching against the nearest garrison. "We feed your armies! We die in your wars! We will be silent no more!" their leader shouts, standing atop a water buffalo. The spirit of the old empire stirs in the hearts of the oppressed.',
    effect: 'Fortifications in the Heartlands are temporarily weakened by the uprising.',
    triggerChance: 0.08,
    minTurn: 4,
  },
  {
    id: 'eclipse',
    title: 'THE DARKENING',
    text: 'Without warning, the sun dims. Not slowly — instantly, as if the great naga of the sky has coiled around it. For three heartbeats, absolute darkness. Then the light returns, but everything feels... different. The Sacred Crown fragments all pulse in unison, and across the empire, temple bells ring on their own.',
    effect: 'The Darkening\'s aftermath leaves all forces disoriented. No tactical advantage can be gained this turn.',
    triggerChance: 0.05,
    minTurn: 8,
  },
  {
    id: 'monsoon_frenzy',
    title: 'MONSOON FRENZY',
    text: 'A supernatural monsoon rolls across the battlefield, far more violent than any natural storm. Soldiers on all sides feel an inexplicable surge of fury carried on the wind. Reason flees. Commands go unheeded. Warriors charge with reckless abandon, howling like the naga spirits of old.',
    effect: 'Attack power surges, but defenses crumble in the frenzy.',
    triggerChance: 0.09,
    minTurn: 3,
  },
  {
    id: 'sacred_fire',
    title: 'DIVINE FIRE FROM PHNOM KULEN',
    text: 'A column of brilliant golden fire descends from the heavens, illuminating a random territory with blinding radiance straight from the sacred fire temples. Those within it feel their wounds close and their spirits lift. The fire is warm, protective, and absolutely undeniable — a gift from the ancient fire rituals of the first Khmer kings.',
    effect: 'The blessed territory\'s defenders gain extraordinary protection this turn.',
    triggerChance: 0.06,
    minTurn: 5,
  },
  {
    id: 'crown_whisper',
    title: 'THE CROWN WHISPERS',
    text: 'Every fragment-bearing warlord hears the same voice at the same moment: a voice like grinding stone and flowing water, ancient and impossibly vast — the voice of the first Guardian. "You fight for unity, but you bring only division. The Crown cannot be reforged in blood. It was forged in fire, yes — but the fire of creation, not destruction." Then — silence. The voice does not come again.',
    effect: 'The whisper shakes all warlords\' confidence. Reinforcements are reduced this turn.',
    triggerChance: 0.04,
    minTurn: 10,
  },
];

// ========================================
// REGION LORE
// ========================================

export const REGION_LORE: Record<string, string> = {
  'The Frostlands': 'The northernmost province of the Khmer Empire, where the ancient mountain fortresses guard the frontier against whatever dangers lurk beyond. Ironhold, the greatest fortress ever built, anchors the north — its walls carved with the teachings of Angkor\'s war scholars. The Frostlands breed hard people — soldiers, miners, and warriors who laugh at the cold and draw strength from the ancestral spirits that dwell in the mountain caves.',
  'The Heartlands': 'The fertile center of the Khmer Empire, where the majority of the population lives and farms the rich soil watered by tributaries of the great Mekong. Goldshire\'s bustling markets, Silverdale\'s lotus fields, Thornwall\'s war academy, and Ashenvale\'s ancient spirit groves form the economic and cultural heart of the empire. Control the Heartlands, and you control the rice that feeds the nation.',
  'The Southern Realms': 'A land of extremes — the scorching fire temples of Sunforge, the mist-shrouded ruins of Misthollow, the storm-wracked towers of Ravencrest, and the sacred meditation temples of Moonhaven. The Southern Realms are where old magic still lingers in the temple stones, and the naga serpents do not always sleep beneath the rivers.',
  'The Eastern Shores': 'The Khmer Empire\'s gateway to the sea and the distant lands beyond. Port Brighthelm handles all maritime trade, while Crystal Lake\'s shimmering waters are said to hold prophetic visions granted by the water spirits. The Eastern Shores are wealthy, exposed, and perpetually contested by those who seek control of the empire\'s trade routes.',
  'The Western Reaches': 'Dark, wild, and shrouded in perpetual mist. The ancient forest of Darkwood has never been fully mapped, and Misthollow\'s fog-shrouded valleys hide temple ruins from before the first Khmer kings. Only the desperate or the foolhardy venture deep into the Western Reaches, where the boundary between the living world and the spirit realm is thinnest.',
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
    description: 'The fragments have chosen their bearers. Four warlords gather their forces as the empire descends into war for the first time since the age of the Temple Guardians.',
    bgStyle: 'dramatic',
  },
  {
    id: 'ch2_first_blood',
    number: 2,
    title: 'FIRST BLOOD',
    subtitle: 'The Price of Ambition',
    description: 'Provincial borders are tested. The first battles are fought, and the true cost of war becomes clear as the first territory falls beneath foreign banners.',
    bgStyle: 'battle',
  },
  {
    id: 'ch3_escalation',
    number: 3,
    title: 'THE ESCALATION',
    subtitle: 'Alliances Shatter, Empires Rise',
    description: 'The war intensifies. One warlord falls, their fragment dimming like a dying ember. The remaining three eye each other with growing hunger.',
    bgStyle: 'dark',
  },
  {
    id: 'ch4_turning_tide',
    number: 4,
    title: 'THE TURNING TIDE',
    subtitle: 'When Hope Flickers',
    description: 'A dominant power emerges. The land groans under the weight of endless battle. Ancient naga spirits stir in response to the Crown\'s imbalance.',
    bgStyle: 'dramatic',
  },
  {
    id: 'ch5_final_stand',
    number: 5,
    title: 'THE FINAL STAND',
    subtitle: 'Two Fragments, One Crown',
    description: 'Only two warlords remain. The fate of the Khmer Empire hangs in the balance as the final war for the Sacred Crown begins.',
    bgStyle: 'battle',
  },
];

// ========================================
// CHAPTER TRANSITION TITLE CARDS
// ========================================

const CHAPTER_DRAMATIC_LINES: Record<string, string> = {
  ch1_assembly: 'The fragments have chosen. The die is cast. The Khmer Empire will never be the same.',
  ch2_first_blood: 'The first blade has been drawn. The temple bells mourn. There is no turning back.',
  ch3_escalation: 'One warlord has fallen. The fragments grow heavier. The naga stir beneath the rivers.',
  ch4_turning_tide: 'The balance of power tilts. Ancient forces stir beneath the shattered Crown.',
  ch5_final_stand: 'Two remain. The ancestral spirits watch. The Crown waits for its sovereign.',
};

export function getChapterTitleBeat(chapter: Chapter): StoryBeat {
  const dramaticLine = CHAPTER_DRAMATIC_LINES[chapter.id]
    || 'The war for the Khmer Empire continues.';

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
  const classTitle = attackerClass === 'knight' ? 'Strategist' : attackerClass === 'mage' ? 'Stormcaller' : attackerClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame';

  return {
    id: 'trigger-first-blood',
    title: 'FIRST BLOOD',
    subtitle: `${attackerName} Strikes the Opening Blow`,
    bgStyle: 'battle',
    skippable: false,
    pages: [
      {
        text: `The first clash of the war for the Sacred Crown has begun. Across the Khmer Empire, the very air seems to hold its breath as the four warlords' fragments pulse in eerie unison — sensing, perhaps, that the age of peace has truly ended. Somewhere in the spirit world, the ghost of the last Guardian looks down upon the shattered Crown and weeps tears that fall as rain upon the earth.`,
      },
      {
        text: `${attackerName} the ${classTitle} has drawn first blood, seizing ${territoryName} from ${defenderName} in a battle that will echo through the ages. The ground still smolders where the Sacred Crown fragment's power was unleashed, and the defenders who survived speak of a force that felt less like an army and more like a monsoon given purpose. The other warlords take note. The game has begun in earnest.`,
        speaker: attackerName,
        speakerColor: attackerColor,
        portrait: attackerPortrait,
      },
      {
        text: `But the land pays the price. Where ${territoryName}'s soil was once rich with rice paddies and lotus ponds, thin cracks of golden light now spider across the surface — the Crown's energy bleeding out from the violence done upon it. Old temple scholars knew this sign. They called it the Crown's Sorrow, and they said it meant the empire's spiritual foundation was weakening. The naga grow restless. The monsoons grow wilder.`,
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
  const classTitle = characterClass === 'knight' ? 'Strategist' : characterClass === 'mage' ? 'Stormcaller' : characterClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame';

  const keyTerritories: Record<string, { title: string; subtitle: string; pages: StoryPage[] }> = {
    ironhold: {
      title: 'THE GREATEST FORTRESS',
      subtitle: `${playerName} Claims Ironhold`,
      pages: [
        {
          text: `Ironhold — the unconquerable mountain fortress, the northern bulwark that has stood since the first Temple Guardians raised its walls from living stone. For a thousand years, no army has breached its gates. Its walls are carved with the war teachings of Angkor, and its garrison fights with the discipline of a thousand ancestors standing behind them.`,
        },
        {
          text: `${playerName} the ${classTitle} stands atop Ironhold's highest tower, the Sacred Crown fragment blazing at their chest like a second sun. The fortress stretches below in all directions — curtain walls, watchtowers, killing grounds, and the vast armories that have supplied a thousand campaigns. "This is what power looks like," ${playerName} says, voice carried on the northern wind. "Not a throne. Not a crown. Walls."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `But within Ironhold's deepest vault, sealed behind stone doors carved with naga serpents, something stirs. Old mechanisms grind. Sacred conduits buried in the mountain's roots flicker with golden light. Whatever the first Guardian hid beneath the fortress is awakening — and it is responding to the fragment's call. The fortress was never just a fortress. It was a lock. And ${playerName} may have just turned the key.`,
        },
      ],
    },
    dragonspine: {
      title: 'THE NAGA AWAKENS',
      subtitle: `${playerName} Ascends Dragonspine`,
      pages: [
        {
          text: `The mountain called Dragonspine has always been sacred ground — a place where the boundary between the mortal world and the spirit realm grows thin. Temple priests avoid its upper reaches, telling stories of vast serpentine shapes moving through the clouds and eyes the color of jade watching from caverns too deep for human light. The Sacred Crown was forged with the blessing of the naga, the old texts say — and the serpent spirits never forgave the Guardians for shattering it.`,
        },
        {
          text: `${playerName} the ${classTitle} has claimed the mountain, planting their banner at the summit where the air is thin and the spirit world is close enough to touch. The fragment howls at the altitude, resonating with something ancient that sleeps beneath the stone. ${playerName} can feel it — a heartbeat, slow and vast, like the pulse of a mountain-sized dream. Or perhaps, the pulse of a naga.`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `And then the ground shakes. Not with the tremor of battle, but with something far older. A crack opens in the mountainside, and from within pours a breath of heat so intense it melts the snow for a mile in every direction. Somewhere in the depths, a naga opens one enormous eye — jade-green and ancient beyond reckoning. It has been sleeping since before the Shattering. But the fragment has woken it. And it is hungry.`,
        },
      ],
    },
    goldshire: {
      title: 'HEART OF THE HEARTLANDS',
      subtitle: `${playerName} Seizes Goldshire`,
      pages: [
        {
          text: `Goldshire is the beating heart of the Khmer Empire — not because of its armies or its magic, but because of its wealth. The great markets of Goldshire supply every warlord on the continent with the jade and rice needed to fund campaigns, hire mercenaries, and feed soldiers. Its fall is never merely a military event; it is an economic earthquake that reshapes the war itself.`,
        },
        {
          text: `${playerName} the ${classTitle} rides through Goldshire's gilded gates as merchants scatter and the great trading houses lower their flags. The fragment hums with something almost like satisfaction. "Wealth is not power," ${playerName} declares, surveying the captured treasury. "But it is the shadow of power. And where the shadow falls, the substance follows."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `The fall of Goldshire sends shockwaves across all five provinces. Supply lines falter. Rice shipments are diverted. The three remaining warlords must now reckon with a ${classTitle} who controls the purse strings of the empire. The Heartlands have a new master, and the price of everything — from rice to blood — has just changed.`,
        },
      ],
    },
    misthollow: {
      title: 'SECRETS OF THE MIST',
      subtitle: `${playerName} Dares the Misthollow`,
      pages: [
        {
          text: `Misthollow is not a place that welcomes conquerors. The perpetual fog that gives the valley its name is not natural — it is the exhalation of a great naga that lies beneath the earth, breathing in slow, geologic rhythms. Those who enter the mist speak of voices in the old Khmer tongue, of visions of ancient temples, of memories that are not their own. Many do not return at all.`,
        },
        {
          text: `${playerName} the ${classTitle} pushes through the fog, the fragment blazing like a temple lantern against the unnatural darkness. The mist recoils from the fragment's light — but only for a moment. Then it closes in again, thicker, hungrier, as if it recognizes a kindred power. "The Crown was built on secrets," ${playerName} whispers, eyes straining into the white void. "Let us see what the naga were trying to hide."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `Deep within the hollow, the fog clears to reveal temple ruins that predate Angkor Wat by millennia. Stone pillars covered in Naga carvings and writing that no living scholar can read. A pit that descends into absolute darkness, from which a cold wind rises endlessly — the breath of the earth serpent. And at the center, a pedestal where a fifth fragment-shaped depression sits empty — as if the Crown was never meant to have only four pieces. ${playerName} has found something that changes everything.`,
        },
      ],
    },
    port_brighthelm: {
      title: 'THE GATEWAY OPENS',
      subtitle: `${playerName} Takes Port Brighthelm`,
      pages: [
        {
          text: `Port Brighthelm is the Khmer Empire's window to the world beyond — the only harbor capable of receiving ships from distant kingdoms across the sea, and the lifeline through which exotic weapons, rare jade, and foreign mercenaries flow. Control the port, and you control the flow of the outside world into the war.`,
        },
        {
          text: `${playerName} the ${classTitle} watches the foreign merchant fleet from Brighthelm's lighthouse, the fragment casting long shadows across the harbor below. The captured ships bring news: the kingdoms across the sea have felt the Shattering too. The spiritual shockwave rippled through reality itself, and distant lands are sending envoys — some to help, some to conquer, all to claim a piece of the Sacred Crown's legacy.`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `With Brighthelm under their control, ${playerName} can now choose which foreign powers gain access to the Khmer Empire — and which are turned away. It is a different kind of power than the fragment provides: the power of connection, of trade, of a world that is suddenly much larger than four warlords and their private war. The Eastern Shores have a new admiral, and the tides of the conflict are about to shift.`,
        },
      ],
    },
    darkwood: {
      title: 'THE UNCHARTED DEPTHS',
      subtitle: `${playerName} Claims Darkwood`,
      pages: [
        {
          text: `Darkwood has never been fully mapped. The ancient forest stretches across the Western Reaches like a living wall, its canopy so thick that noon looks like midnight beneath the boughs. Paths appear and vanish. Trees move when no one is watching. The forest spirits who once dwelt here vanished centuries ago, and no one knows where they went — though some say they never left, and that the forest itself is their body, grown vast and strange with age.`,
        },
        {
          text: `${playerName} the ${classTitle} presses deeper into Darkwood than any army has dared before, the fragment pulsing in rhythm with the forest's heartbeat. The trees lean in, curious. The shadows lengthen, watchful. "The Crown's power came from the land itself," ${playerName} realizes, hand resting on the bark of a tree older than Angkor Wat. "And the land remembers."`,
          speaker: playerName,
          speakerColor: color,
          portrait,
        },
        {
          text: `At the forest's heart, ${playerName} finds a clearing that should not exist — a perfect circle of moss and wild orchids, lit by a sunbeam that has no source. In the center grows a single banyan tree, white as bone, its roots intertwined with veins of pure jade crystal. This is the Worldtree, the oldest living thing in the Khmer Empire, the source from which the first Guardian drew the power to forge the Sacred Crown. And it is still alive. Still growing. Still waiting.`,
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
        text: `The last banner of resistance in ${regionName} has fallen. Every territory, every fortress, every village now answers to a single warlord — and that warlord is ${playerName}. The Sacred Crown fragment blazes with fierce approval, drinking deep of the region's concentrated spiritual energy. For a moment, the very sky above ${regionName} turns the color of ${playerName}'s banner.`,
      },
      {
        text: `${regionLore}`,
      },
      {
        text: `But dominion is a double-edged sword. With total control of ${regionName} comes total responsibility — and total vulnerability. Every rival warlord now sees ${playerName} as the threat to be destroyed, and the fragment's surge of power has not gone unnoticed. The other bearers feel it in their blood, a primal alarm that says: one of us has grown too strong. The naga sense it in the rivers. The hunt begins.`,
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
  const attackerTitle = `${attackerName} the ${attackerClass === 'knight' ? 'Strategist' : attackerClass === 'mage' ? 'Stormcaller' : attackerClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame'}`;
  const defenderTitle = `${defenderName} the ${defenderClass === 'knight' ? 'Strategist' : defenderClass === 'mage' ? 'Stormcaller' : defenderClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame'}`;

  return {
    id: `trigger-rival-clash-${attackerName}-${defenderName}`,
    title: 'THE RIVALS CLASH',
    subtitle: `${attackerName} vs. ${defenderName}`,
    bgStyle: 'battle',
    skippable: false,
    pages: [
      {
        text: `There are wars of convenience, and then there are wars of destiny. When ${attackerTitle} first turned their armies toward ${defenderTitle}'s territory, every temple oracle and spirit speaker in the Khmer Empire felt the shift — two Sacred Crown fragments resonating in violent harmony, their frequencies clashing like the grinding of tectonic plates. The air between their territories crackled with golden lightning, and soldiers on both sides reported the same vision: two thrones of Angkor Wat, side by side, one of them empty.`,
        speaker: attackerName,
        speakerColor: attackerColor,
        portrait: attackerPortrait,
      },
      {
        text: `"So we finally meet on the field of honor," ${defenderName} says, ${defenderClass === 'paladin' || defenderClass === 'knight' ? 'sacred blade raised and resolve unbroken' : defenderClass === 'mage' ? 'storm energy already crackling between their fingers' : 'materializing from the mist with a serpent\'s grace'}. "I have watched you grow stronger from a distance. Let us see if your strength is matched by your wisdom." The fragment at ${defenderName}'s chest flares — not in attack, but in acknowledgment. A worthy foe, at last.`,
        speaker: defenderName,
        speakerColor: defenderColor,
        portrait: defenderPortrait,
      },
      {
        text: `The battle that follows is unlike any other in the war. Two fragments of the Sacred Crown, each amplifying their bearer's will, collide with a force that reshapes the terrain itself. Hills flatten. Rivers change course. The sky tears open, and for one brief, terrifying instant, both warlords catch a glimpse of the completed Crown — whole, radiant, crowned with the sun-disk of Phnom Kulen — before the vision shatters and the war continues. The Khmer Empire shudders. The naga beneath the rivers stir uneasily.`,
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
  const classTitle = characterClass === 'knight' ? 'Strategist' : characterClass === 'mage' ? 'Stormcaller' : characterClass === 'rogue' ? 'Shadow Queen' : 'Eternal Flame';

  const classSpecificPages: Record<string, StoryPage[]> = {
    knight: [
      {
        text: `${playerName} surveys the war map with the cold precision of a general who has studied Angkor's military treatises since childhood. ${territoryCount} territories. That is all that remains of the northern empire. The great mountain fortresses have fallen, the armies are scattered, and the crimson banners that once flew from every watchtower now gather dust in abandoned armories.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `But a strategist does not surrender. Not when the walls are breached. Not when the odds are impossible. ${playerName} rallies the last loyal soldiers — barely a company, scarred and weary, but still standing. "A fortress can be rebuilt," ${playerName} declares, jade blade drawn. "An army can be raised again. But the will to fight? That either lives in you or it doesn't. And mine burns like the sacred fire of Phnom Kulen."`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The fragment flickers uncertainly at ${playerName}'s chest, its light guttering like a temple flame in a storm. It senses the desperation of its bearer — and responds in the only way it knows how. It burns brighter, feeding on ${playerName}'s defiance, transforming desperation into something harder and sharper than jade. The war is not over. Not while the ${classTitle} still draws breath.`,
      },
    ],
    mage: [
      {
        text: `The sky above ${playerName}'s last stronghold has gone eerily still — no rain, no lightning, no wind. ${territoryCount} territories remain — barely enough to sustain the fragment's connection to the land, and nowhere near enough to fuel the storms that once bent the weather to ${playerName}'s will. A Stormcaller without storms is merely a mortal standing in the rain.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"The monsoon taught me something," ${playerName} murmurs, gazing at a sky that refuses to respond. "The storm always returns. It may be delayed, diverted, diminished — but it always comes back." The Stormcaller's fingers trace the fragment's surface, seeking the patterns, the rhythms, the hidden currents. There must be something. Some storm that has not yet been summoned.`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `And then ${playerName} finds it — a single thunderhead forming on the horizon, impossibly far away, impossibly small. But it is there. The fragment responds, flooding ${playerName}'s mind with the memory of the great monsoon that birthed them — a storm so vast it covered the entire empire. The cost will be enormous. But a Stormcaller has never been afraid of the storm, no matter how dark its clouds.`,
      },
    ],
    rogue: [
      {
        text: `${playerName} crouches in the mist of a ruined river temple, the last of the fog offering what little concealment remains. ${territoryCount} territories. The shadows are shrinking — fewer places to hide, fewer paths through the spirit world, fewer naga willing to harbor a warlord on the run. The game that was supposed to be won through cunning and serpent magic has become a desperate scramble for survival.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"Everyone runs out of mist eventually," ${playerName} says to no one, testing the edge of a blade that has lost its naga-blessed sheen. "But they always forget — the mist doesn't just hide you. It shows you things. And I have seen things in the fog that would make the other warlords weep."`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The fragment stirs — not with power, but with something older and more dangerous. It whispers of the spaces between raindrops, the moments when reality blurs like a reflection in disturbed water, the instants when a shadow-walker can step between the living world and the spirit realm. ${playerName} has never used this ability before. The cost is steep: a piece of the bearer's soul for every step between worlds. But with ${territoryCount} territories remaining, the Shadow Queen is running out of options — and running out of soul is better than running out of time.`,
      },
    ],
    paladin: [
      {
        text: `${playerName} kneels in the rubble of a Phnom Kulen fire temple, hands clasped in prayer, fragment casting its fading sacred light across broken stone altars and shattered ceremonial braziers. ${territoryCount} territories. The faithful are scattered, the fire temples desecrated, and the eternal flame that once guided ${playerName}'s armies has dimmed to a flicker. The land groans under the weight of war.`,
        portrait,
        speaker: playerName,
        speakerColor: color,
      },
      {
        text: `"You test me," ${playerName} whispers to the fragment, to the sky, to whatever force shaped the Sacred Crown and then shattered it. "You test my faith when everything I built lies in ashes. But faith is not a temple — it does not crumble when the wind blows. Faith is the fire itself." The fragment hears. And for the first time since the war began, it does not demand — it gives.`,
        speaker: playerName,
        speakerColor: color,
        portrait,
      },
      {
        text: `The light swells. Not the crackling energy of the Stormcaller's lightning, nor the hungry crimson of the Strategist's fragment, but something warmer — something that feels like absolution, like the first fire that was lit on Phnom Kulen's sacred peak. The Eternal Flame rises, shield reforming from pure golden fire, and the last ${territoryCount} territories pulse with renewed sacred energy. ${playerName} will not win through strength or cunning. ${playerName} will win because the fire refuses to go out.`,
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
        text: `The map of the Khmer Empire has been redrawn. Where once four warlords held roughly equal sway, a single power now dominates — and that power is ${playerName}. With ${territoryCount} territories under their banner and ${remainingRivals} rival${remainingRivals !== 1 ? 's' : ''} left to challenge them, the war for the Sacred Crown is approaching its endgame.`,
      },
      {
        text: `The Sacred Crown fragment responds to this dominance with terrifying enthusiasm. It burns hotter, pulses stronger, and whispers more insistently — urging its bearer onward, promising ultimate power, unity, the reforged Crown. The land itself seems to lean toward ${playerName}'s territories, spiritual currents flowing like rivers toward a dominant gravitational center. The other fragments grow dimmer in comparison, their bearers weakened by the imbalance. The naga sense the shift and grow agitated.`,
      },
      {
        text: `But ${remainingRivals > 1 ? 'the remaining warlords' : 'the last rival'} will not surrender quietly. Desperation is a potent fuel, and those who fight with nothing to lose are often the most dangerous. Across the empire, alliances of convenience form, last-ditch strategies are hatched, and ancient weapons are dragged from vaults sealed since before the Shattering. The end of the war is near — but the bloodiest chapter may yet be unwritten.`,
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
  // Knight / Strategist dialogue lines
  { id: 'knight_turn_early', speakerClass: 'knight', context: 'turn_start', minTurn: 1, lines: [
    'My armies stand ready. The teachings of Angkor do not wait for the hesitant.',
    'The jade blade sees ten moves ahead. The ancestors guide my hand.',
    'The fragment pulses. It hungers for the order of the old empire.',
  ]},
  { id: 'knight_attacking', speakerClass: 'knight', context: 'attacking', minTurn: 1, lines: [
    'Charge! Let them feel the discipline of a thousand ancestors!',
    'For Angkor! For order! Break their lines!',
    'No retreat. No surrender. Forward, as the war temples taught us!',
  ]},
  { id: 'knight_defending', speakerClass: 'knight', context: 'defending', minTurn: 1, lines: [
    'Hold the line! Not one step back!',
    'Let them come. These walls were built by the first Guardians.',
    'A shield wall does not break. It only grows stronger, like the roots of the banyan.',
  ]},
  // Mage / Stormcaller dialogue lines
  { id: 'mage_turn_early', speakerClass: 'mage', context: 'turn_start', minTurn: 1, lines: [
    'The monsoon winds shift... interesting. The spirits are restless.',
    'I was born in the greatest storm the empire has ever seen. This war is merely a drizzle.',
    'The lightning knows no allegiance. But it knows me.',
  ]},
  { id: 'mage_attacking', speakerClass: 'mage', context: 'attacking', minTurn: 1, lines: [
    'Let the storm break upon them! Lightning cares nothing for armor.',
    'The sky obeys my command. Your armies will not.',
    'Witness the power that the monsoon gods blessed me with!',
  ]},
  { id: 'mage_defending', speakerClass: 'mage', context: 'defending', minTurn: 1, lines: [
    'My storms are unbreakable. Try and see.',
    'The wind speaks to me of your movements. You cannot outmaneuver the sky.',
    'The lightning shields its own. Your armies will be scattered like leaves.',
  ]},
  // Rogue / Shadow Queen dialogue lines
  { id: 'rogue_turn_early', speakerClass: 'rogue', context: 'turn_start', minTurn: 1, lines: [
    'They think they see me coming. The mist says otherwise.',
    'The naga whisper your secrets to me. I know all of them.',
    'Every warlord here has a weakness. The serpent crown sees them all.',
  ]},
  { id: 'rogue_attacking', speakerClass: 'rogue', context: 'attacking', minTurn: 1, lines: [
    'You never saw it coming. The naga never do either.',
    'From the mist, swift and certain, like a serpent strike.',
    'Why fight in the light when the shadows serve me?',
  ]},
  { id: 'rogue_defending', speakerClass: 'rogue', context: 'defending', minTurn: 1, lines: [
    'You think you have cornered me? I am exactly where the mist wants me to be.',
    'The naga protect their own. And I am their queen.',
    'Catch me if you can. But beware — the fog bites.',
  ]},
  // Paladin / Eternal Flame dialogue lines
  { id: 'paladin_turn_early', speakerClass: 'paladin', context: 'turn_start', minTurn: 1, lines: [
    'The sacred fire guides my path. Even in this darkness, I do not waver.',
    'Faith is not a weapon. It is the eternal flame. And mine will never die.',
    'The Khmer Empire will be purified — not by conquest, but by sacred fire.',
  ]},
  { id: 'paladin_attacking', speakerClass: 'paladin', context: 'attacking', minTurn: 1, lines: [
    'By the eternal flame of Phnom Kulen, I strike!',
    'Your darkness ends here. The sacred fire consumes all shadow.',
    'Holy fire cleanses all corruption. Even the battlefield.',
  ]},
  { id: 'paladin_defending', speakerClass: 'paladin', context: 'defending', minTurn: 1, lines: [
    'The eternal flame shall not be extinguished!',
    'My faith is my fortress, forged in the sacred fire temples. You cannot breach it.',
    'Even in defeat, I do not yield. The fire of Phnom Kulen is eternal.',
  ]},
  // Losing dialogue (any class)
  { id: 'knight_losing', speakerClass: 'knight', context: 'losing', minTurn: 5, lines: [
    'The fortress walls crumble... but a strategist always has another plan.',
    'The jade blade chips... but it does not break.',
  ]},
  { id: 'mage_losing', speakerClass: 'mage', context: 'losing', minTurn: 5, lines: [
    'The storms fade... but the sky always darkens again.',
    'Even a dying monsoon carries enough rain to drown an army.',
  ]},
  { id: 'rogue_losing', speakerClass: 'rogue', context: 'losing', minTurn: 5, lines: [
    'Everyone runs out of mist eventually. But the naga remember.',
    'I always have an exit... the spirits promised me that.',
  ]},
  { id: 'paladin_losing', speakerClass: 'paladin', context: 'losing', minTurn: 5, lines: [
    'Even now, the sacred fire does not die. It only waits to be rekindled.',
    'A guardian falls... but the eternal flame endures beyond mortal flesh.',
  ]},
  // Winning dialogue (any class)
  { id: 'knight_winning', speakerClass: 'knight', context: 'winning', minTurn: 5, lines: [
    'The jade blade sees the end. The Khmer Empire will know order once more.',
    'One by one, the banners fall. Soon, only mine will remain.',
  ]},
  { id: 'mage_winning', speakerClass: 'mage', context: 'winning', minTurn: 5, lines: [
    'The storm gathers. Victory is simply the next thunderclap.',
    'I have summoned every wind. The outcome is no longer in doubt.',
  ]},
  { id: 'rogue_winning', speakerClass: 'rogue', context: 'winning', minTurn: 5, lines: [
    'The game is almost over. And they never even saw the serpent coming.',
    'The mist closes in. Checkmate.',
  ]},
  { id: 'paladin_winning', speakerClass: 'paladin', context: 'winning', minTurn: 5, lines: [
    'The sacred fire grows stronger with every territory freed from darkness.',
    'Soon, this war will end. And the eternal flame will purify all.',
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
'''

with open('/home/z/my-project/src/lib/story-data.ts', 'w') as f:
    f.write(STORY_DATA)

print("story-data.ts rewritten successfully with Cambodian folklore theme")