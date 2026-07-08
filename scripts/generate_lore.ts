import {
  Document, Packer, Paragraph, TextRun, Header, Footer,
  AlignmentType, HeadingLevel, PageNumber, PageOrientation,
  Table, TableRow, TableCell, WidthType, TableLayoutType,
  BorderStyle, ShadingType, ImageRun, SectionType, NumberFormat,
} from "docx";
import * as fs from "fs";

// ── Fantasy-themed palette (custom, based on IG-1 Ink Gold for that medieval manuscript feel) ──
const P = {
  bg: "1A1A1A",
  primary: "D4AF37",
  body: "2C2418",
  secondary: "7A6E5A",
  accent: "C9A84C",
  surface: "FBF8F0",
  cover: { titleColor: "D4AF37", subtitleColor: "B0A080", metaColor: "908878", footerColor: "605848" },
  table: { headerBg: "C9A84C", headerText: "1A1A1A", accentLine: "C9A84C", innerLine: "DDD5C0", surface: "F5F2E8" },
};

const c = (hex: string) => hex.replace("#", "");
const allNoBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

// ── Helper functions ──
function heading1(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 240 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 36,
        color: c(P.primary),
        font: { ascii: "Times New Roman", eastAsia: "SimHei" },
      }),
    ],
  });
}

function heading2(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 180 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 30,
        color: c(P.body),
        font: { ascii: "Times New Roman", eastAsia: "SimHei" },
      }),
    ],
  });
}

function heading3(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 140 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 26,
        color: c(P.secondary),
        font: { ascii: "Times New Roman", eastAsia: "SimHei" },
      }),
    ],
  });
}

function body(text: string) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
    spacing: { line: 312, after: 120 },
    children: [
      new TextRun({
        text,
        size: 24,
        color: c(P.body),
        font: { ascii: "Times New Roman", eastAsia: "SimSun" },
      }),
    ],
  });
}

function bodyNoIndent(text: string) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 312, after: 120 },
    children: [
      new TextRun({
        text,
        size: 24,
        color: c(P.body),
        font: { ascii: "Times New Roman", eastAsia: "SimSun" },
      }),
    ],
  });
}

function quote(text: string) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 300, after: 300, line: 312 },
    indent: { left: 1200, right: 1200 },
    border: {
      left: { style: BorderStyle.SINGLE, size: 12, color: c(P.accent), space: 10 },
    },
    children: [
      new TextRun({
        text,
        italics: true,
        size: 22,
        color: c(P.secondary),
        font: { ascii: "Times New Roman", eastAsia: "SimSun" },
      }),
    ],
  });
}

function divider() {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 6, color: c(P.accent), space: 1 },
    },
    children: [],
  });
}

// ── Cover section (R3 variant - dark fantasy) ──
function buildCover() {
  const cardIndent = 2200;
  const bTop = { style: BorderStyle.SINGLE, size: 24, color: c(P.accent), space: 16 };
  const bBot = { style: BorderStyle.SINGLE, size: 24, color: c(P.accent), space: 16 };
  const bL = { style: BorderStyle.SINGLE, size: 2, color: c(P.accent), space: 16 };
  const bR = { style: BorderStyle.SINGLE, size: 2, color: c(P.accent), space: 16 };
  const sides = { left: bL, right: bR };

  const children: Paragraph[] = [];

  // Pre-card whitespace
  children.push(new Paragraph({ spacing: { before: 3200 } }));

  // Card top edge
  children.push(new Paragraph({
    indent: { left: cardIndent, right: cardIndent }, spacing: { after: 600 },
    border: { top: bTop, left: bL, right: bR }, children: [],
  }));

  // English label
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { left: cardIndent, right: cardIndent },
    spacing: { after: 400 }, border: sides,
    children: [new TextRun({ text: "R E A L M   O F   A E T H E R M O O R E",
      size: 16, color: c(P.accent), font: { ascii: "Calibri" }, characterSpacing: 30 })],
  }));

  // Title line 1
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { left: cardIndent, right: cardIndent },
    spacing: { after: 60, line: 828, lineRule: "atLeast" }, border: sides,
    children: [new TextRun({ text: "The Shattered Lands",
      size: 72, bold: true, color: c(P.cover.titleColor), font: { ascii: "Times New Roman" } })],
  }));

  // Title line 2
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { left: cardIndent, right: cardIndent },
    spacing: { after: 300, line: 690, lineRule: "atLeast" }, border: sides,
    children: [new TextRun({ text: "Lore & Chronicles",
      size: 48, bold: true, color: c(P.cover.titleColor), font: { ascii: "Times New Roman" } })],
  }));

  // Subtitle
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER, indent: { left: cardIndent, right: cardIndent },
    spacing: { after: 400 }, border: sides,
    children: [new TextRun({ text: "A Complete History of Alliances, Foes, and the War for Aethermoor",
      size: 22, color: c(P.cover.subtitleColor), font: { ascii: "Times New Roman" } })],
  }));

  // Spacer
  children.push(new Paragraph({
    indent: { left: cardIndent, right: cardIndent }, spacing: { before: 400 },
    border: sides, children: [],
  }));

  // Meta lines
  const metaLines = [
    "Comprising the Five Great Regions",
    "Sixteen Sovereign Territories",
    "Four Warring Factions",
  ];
  for (let i = 0; i < metaLines.length; i++) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER, indent: { left: cardIndent, right: cardIndent },
      spacing: { after: i === metaLines.length - 1 ? 400 : 80 }, border: sides,
      children: [new TextRun({ text: metaLines[i], size: 24, color: c(P.cover.metaColor),
        font: { ascii: "Times New Roman" } })],
    }));
  }

  // Card bottom edge
  children.push(new Paragraph({
    indent: { left: cardIndent, right: cardIndent }, spacing: { after: 0 },
    border: { bottom: bBot, left: bL, right: bR }, children: [],
  }));

  // Post-card whitespace + footer
  children.push(new Paragraph({ spacing: { before: 2000 } }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "As recorded by the Sages of the Crystal Lake Archive",
      size: 16, color: c(P.cover.footerColor), font: { ascii: "Times New Roman", eastAsia: "SimSun" } })],
  }));

  return [new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: allNoBorders,
    rows: [new TableRow({
      height: { value: 16838, rule: "exact" },
      children: [new TableCell({
        shading: { type: ShadingType.CLEAR, fill: P.bg }, borders: noBorders,
        children,
      })],
    })],
  })];
}

// ── Body content ──
function buildBody() {
  const content: Paragraph[] = [];

  // ════════════════════════════════════════
  // PROLOGUE
  // ════════════════════════════════════════
  content.push(heading1("Prologue: The Sundering"));
  content.push(quote(
    `"Before the Shattering, Aethermoor was one. One sky, one king, one people. The Aether that flowed beneath the land bound every soul to every other. When the Veil was torn, that bond became a chain — and every realm has been pulling in its own direction ever since."`
  ));
  content.push(quote("— Archivist Meren of Crystal Lake, Year 942 Post-Sundering"));

  content.push(body(
    "In the age before memory, the continent of Aethermoor was ruled by a single sovereign dynasty known as the Aethernote, whose power derived from the subterranean veins of raw Aether that crisscrossed the land like a web of liquid starlight. The Aethernote maintained peace through a delicate balance: each region sent tributes of refined Aether to the capital at Goldshire, and in return, the Crown distributed enchanted wards that protected the realm's borders from the monstrous entities that lurked beyond the edges of the known world. This arrangement, known as the Aether Compact, held for over eight hundred years and gave rise to an era of unprecedented prosperity, architectural marvels, and arcane scholarship."
  ));
  content.push(body(
    "The peace shattered in the year 0 PS (Post-Sundering), when the last Aethernote king, Aldric the Undecided, attempted to tap into the deepest vein of Aether — the Heartroot — against the counsel of every archmage in the land. The Heartroot was not merely a source of power; it was the anchor that held the continent's tectonic plates together, and more importantly, it was the seal that kept the Veil between the mortal world and the Void intact. When Aldric's extraction channeled too deeply, the Heartroot ruptured, the Veil tore open, and a shockwave of uncontrolled Aether swept across the continent. Mountains cracked. Rivers reversed. The sky turned violet for forty days. When the chaos subsided, Aethermoor was no longer one kingdom — it was sixteen fractured territories, each warping under the influence of the raw Aether that now pooled unpredictably across the land."
  ));
  content.push(body(
    "King Aldric vanished in the catastrophe. Some say he was consumed by the Void. Others whisper that he was transformed into something far worse — the first of the Hollow King's spectral generals. Whatever the truth, the Aether Compact dissolved overnight, and the sixteen territories fell into a desperate scramble for survival, resources, and dominance. The Shattered Lands, as they came to be known, have been at war ever since — not merely for territory, but for control of the remaining Aether veins, for without them, no realm can power its wards, its forges, or its magic."
  ));

  content.push(divider());

  // ════════════════════════════════════════
  // THE FIVE REGIONS
  // ════════════════════════════════════════
  content.push(heading1("The Five Regions of Aethermoor"));
  content.push(body(
    "The continent is broadly divided into five geographic and cultural regions, each shaped by the type of Aether that saturated the land after the Shattering. Though these regions share no formal government, their geography, resources, and cultural identities have naturally aligned the territories within them — and set them against the territories beyond."
  ));

  // THE FROSTLANDS
  content.push(heading2("The Frostlands (North)"));
  content.push(body(
    "The northernmost region of Aethermoor is a brutal, windswept expanse of frozen tundra, jagged mountain peaks, and ancient glacial lakes. When the Shattering tore through the north, the Aether that flooded the land was of a cryogenic variety — cold magic that froze everything it touched, turning fertile valleys into ice fields and transforming the native wildlife into hardy, frost-resistant creatures. The four territories of the Frostlands — Ironhold, Wintermere, Frostpeak, and Dragonspine — are among the most defensible in Aethermoor, their natural mountain barriers and frozen passes making invasion nearly impossible for southern armies unaccustomed to the killing cold."
  ));
  content.push(body(
    "Ironhold is the fortress capital of the north, a city carved directly into the side of a volcanic mountain whose geothermal heat provides the only reliable warmth for hundreds of miles. Its forges are legendary, producing weapons and armor of extraordinary quality from ore mined in the deep tunnels. Wintermere, situated on the shores of a vast frozen lake, serves as the region's breadbasket — or rather, its icehouse — where hardy farmers cultivate frost-tolerant crops beneath enchanted greenhouses. Frostpeak is the spiritual center of the north, home to the Order of the Pale Watch, an ancient monastic order that guards the most dangerous of the northern Aether fissures. Dragonspine, the easternmost territory, takes its name from the ridge of black mountains that resemble the spine of some colossal serpent; it is here that the largest deposits of Aether-infused dragonstone are found, making it the most resource-rich — and most contested — territory in the Frostlands."
  ));
  content.push(body(
    "The people of the Frostlands are stoic, insular, and deeply suspicious of outsiders. They worship the Cold Pantheon — a circle of deities representing ice, endurance, and the unyielding law of survival. Their military traditions emphasize heavy infantry, shield walls, and siege warfare, and their warriors are widely considered the toughest in Aethermoor, if not the fastest."
  ));

  // THE HEARTLANDS
  content.push(heading2("The Heartlands (Central)"));
  content.push(body(
    "The Heartlands are the geographic and cultural center of Aethermoor — a patchwork of rolling green hills, ancient forests, fertile river valleys, and crumbling castles that once belonged to the Aethernote dynasty. When the Shattering struck the center of the continent, the Aether that flooded the region was balanced in its elemental nature, creating a land of unusual fertility and mild climate. This made the Heartlands the most desirable territory in the post-Sundering world, and consequently the most fought over. The four Heartland territories — Goldshire, Silverdale, Thornwall, and Ashenvale — have changed hands more times than any scholar can accurately count."
  ));
  content.push(body(
    "Goldshire was once the capital of the entire continent, and even in its diminished state, it remains the largest and wealthiest city in Aethermoor. Its walls, though cracked and patched with crude Aether-welding, still enclose a bustling metropolis of traders, artisans, spies, and mercenaries. The ruins of the Aethernote palace dominate the city's center, a haunting monument to lost unity that no faction has been willing to either restore or demolish. Silverdale, to the west, is a territory of gentle rivers and silver mines, known for its skilled archers and its tradition of diplomatic neutrality — though in practice, Silverdale has sided with whoever seemed most likely to win. Thornwall, to the east, is a fortified military territory bounded by thick bramble forests that have been magically enhanced to form living walls; it is the natural home of defensive warfare and fortification specialists. Ashenvale, the southern Heartland territory, was once a beautiful forest realm but was partially scorched by the Shattering's fallout; its charred groves and ash-covered plains give it a grim, haunted beauty, and it has become a haven for rogues, outlaws, and those who prefer shadow to sunlight."
  ));
  content.push(body(
    "The Heartlands are home to the most diverse population in Aethermoor. Every race, creed, and profession can be found in Goldshire's crowded streets, and the region's central location makes it the crossroads of all continental trade and diplomacy. However, this diversity also means the Heartlands are the most politically unstable region — alliances shift weekly, and a territory that is friendly today may be hostile tomorrow."
  ));

  // THE SOUTHERN REALMS
  content.push(heading2("The Southern Realms (South)"));
  content.push(body(
    "The Southern Realms are a land of golden grasslands, ancient ruins, and scorching summers. The Aether that saturated the south after the Shattering was fire-aligned, infusing the land with warmth and energy but also rendering it prone to drought, wildfire, and spontaneous arcane eruptions. The four southern territories — Sunforge, Ravencrest, Stormhold, and Moonhaven — are culturally distinct from the north, favoring speed, cavalry, and arcane engineering over the heavy infantry traditions of the Frostlands."
  ));
  content.push(body(
    "Sunforge is the industrial heart of the south, a territory built around a massive Aether-fueled foundry that burns day and night, producing weapons, tools, and arcane devices of exceptional quality. The foundry's flame is said to have burned continuously since the Shattering, fed by a vein of fire Aether that runs directly beneath it. Ravencrest, named for the thousands of ravens that nest in its ancient towers, is a territory of scholars, spies, and assassins; its people are known for their cunning and their willingness to use any means necessary to achieve their goals. Stormhold, on the southeastern coast, is a territory of violent weather patterns and crackling Aether storms; its warriors have learned to channel lightning and wind into their combat techniques, making them devastating on open battlefields. Moonhaven, the southernmost territory, is a land of mystery and ancient power, home to the Moonwell — a crater lake that glows with pale silver light during full moons and is said to be the closest point on the mortal plane to the spirit realm."
  ));
  content.push(body(
    "The people of the Southern Realms value cunning, speed, and innovation over brute strength. Their cavalry is the finest in Aethermoor, and their mages are among the most creative, having developed unique arcane disciplines that harness fire, lightning, and spirit magic in ways the northern scholars never imagined."
  ));

  // THE EASTERN SHORES
  content.push(heading2("The Eastern Shores"));
  content.push(body(
    "The Eastern Shores are the smallest and wealthiest region of Aethermoor, comprising only two territories: Port Brighthelm and Crystal Lake. Despite their small size, these territories exert an influence far beyond their borders, for the Eastern Shores control the continent's only deep-water ports and most of its trade routes. The Aether that saturated the east was water-aligned, creating crystal-clear harbors, abundant fisheries, and — most importantly — the Crystal Lake itself, a vast body of water so saturated with purified Aether that its waters shimmer with an inner light and possess healing properties."
  ));
  content.push(body(
    "Port Brighthelm is the largest and busiest port in Aethermoor, a cosmopolitan city where goods, information, and coin flow as freely as the tides. Its docks are lined with ships from every territory, and its markets sell everything from Frostland steel to Southern fire-opals. The port's strategic value has made it a target in every major war, but its natural harbor defenses and the wealth it generates have allowed it to maintain a precarious independence. Crystal Lake, inland from the port, is the spiritual and scholarly counterpart to Brighthelm's commercial energy. The Academy of Crystal Waters, the continent's most prestigious institution of arcane learning, sits on the lake's northern shore, and the Great Archive beneath it contains the most complete record of pre-Sundering history in existence. Scholars from every territory make pilgrimages to Crystal Lake, and the territory's rulers have historically leveraged this academic prestige — and the knowledge monopoly it provides — as a form of soft power."
  ));
  content.push(body(
    "The Eastern Shores' military strength lies not in large armies but in their economic power, their naval supremacy, and the arcane knowledge stored at Crystal Lake. In wartime, they hire mercenaries, fund proxy conflicts, and use their control of trade routes to strangle enemy supply lines. They are, in essence, the bankers and scholars of Aethermoor — feared not for their swords, but for their gold and their secrets."
  ));

  // THE WESTERN REACHES
  content.push(heading2("The Western Reaches"));
  content.push(body(
    "The Western Reaches are Aethermoor's frontier — a vast, sparsely populated wilderness of ancient enchanted forests, creeping fog, and half-forgotten ruins that predate even the Aethernote dynasty. The Aether that flooded the west was shadow-aligned, infusing the land with a pervasive, eerie atmosphere that unnerves outsiders and empowers those who learn to navigate it. The two western territories, Darkwood and Misthollow, are the least populated and most mysterious in all of Aethermoor."
  ));
  content.push(body(
    "Darkwood is a territory almost entirely covered by an ancient forest whose trees are so massive and so densely packed that sunlight rarely reaches the forest floor. The forest is alive in a very real sense — the trees are connected by a network of Aether-infused roots that allow them to communicate and even move slowly over the course of decades. The people of Darkwood have learned to live in harmony with the forest, building their homes in the canopy and using the trees' root-network for travel and communication. They are the finest scouts, rangers, and ambush fighters in Aethermoor, capable of moving through the forest in total silence and striking without warning. Misthollow, south of Darkwood, is a territory of perpetual fog and mist, where the boundary between the mortal world and the spirit realm is thin. The mists of Misthollow are not merely weather phenomena — they are semi-sentient extensions of the spirit realm that can disorient, deceive, and even transport those who wander into them. The people of Misthollow are spirit-walkers who have learned to navigate the mists safely, and they possess knowledge of spirit magic that no other territory can match."
  ));
  content.push(body(
    "The Western Reaches are Aethermoor's wild card. They are difficult to invade, nearly impossible to hold, and home to the most unconventional warriors on the continent. No faction has ever successfully conquered and held both Darkwood and Misthollow for more than a few months, and the region's reputation as a graveyard of armies has earned it a grudging respect — and wide berth — from the other regions."
  ));

  content.push(divider());

  // ════════════════════════════════════════
  // THE FOUR FACTIONS
  // ════════════════════════════════════════
  content.push(heading1("The Four Factions"));
  content.push(body(
    "In the centuries since the Shattering, dozens of warlords, kings, and would-be emperors have risen and fallen. But in the current era, four major factions have emerged as the dominant powers vying for control of Aethermoor. Each is led by a charismatic ruler with a unique military philosophy, and each commands the loyalty of multiple territories. Their alliances and rivalries form the central political landscape of the Shattered Lands."
  ));

  // LORD ASHFORD
  content.push(heading2("The Crimson Banner — Lord Ashford"));
  content.push(quote(
    `"I did not choose the sword. The sword chose me. And now, by the Old Compact, every blade in the Frostlands answers to my call."`
  ));
  content.push(quote("— Lord Ashford, address to the Ironhold War Council"));

  content.push(body(
    "Lord Ashford is the supreme military commander of the Frostlands and the most powerful warlord in northern Aethermoor. A towering figure clad in crimson-armored plate, Ashford rose to power through a combination of raw martial skill, political cunning, and an unshakeable belief in his own divine right to rule. He claims direct descent from the Aethernote line — a claim that no scholar has been able to definitively prove or disprove — and he has used this claim to justify a campaign of conquest that has united the four Frostland territories under his banner for the first time since the Shattering."
  ));
  content.push(body(
    "Ashford's military philosophy is straightforward: overwhelming force applied at the decisive point. He favors heavy infantry formations — swordsmen, shield bearers, and paladins — supported by cavalry charges that shatter enemy lines. His knights are the most heavily armored in Aethermoor, and his shield wall tactic, known as the Iron Formation, is virtually impenetrable to frontal assault. Ashford himself leads from the front, wielding an enchanted greatsword called Winter's Edge that freezes anything it cuts, making his personal combat ability as terrifying as his strategic acumen."
  ));
  content.push(body(
    "Despite his reputation as a brute, Ashford is a shrewd politician. He understands that the Frostlands alone cannot conquer all of Aethermoor, and he has sought alliances with the Eastern Shores, offering Ironhold's steel in exchange for Brighthelm's gold and Crystal Lake's arcane knowledge. His primary foe is Shadow Vex, whose guerrilla tactics and assassination attempts have cost Ashford dearly. Ashford's weakness is his pride — he cannot resist a direct challenge, and clever enemies have exploited this by baiting him into unfavorable engagements."
  ));

  // LADY ELARA
  content.push(heading2("The Golden Circle — Lady Elara"));
  content.push(quote(
    `"Strength without knowledge is a blade without a hand to guide it. I do not seek to conquer with fire — I conquer with understanding."`
  ));
  content.push(quote("— Lady Elara, address to the Crystal Lake Academy"));

  content.push(body(
    "Lady Elara is the Archmagister of the Crystal Lake Academy and the de facto ruler of the Eastern Shores. Unlike the other faction leaders, Elara did not seize power through military conquest; she acquired it through intellectual supremacy, economic leverage, and the careful accumulation of arcane knowledge that no other faction can match. She is a master battle mage whose understanding of Aether theory is unmatched in the post-Sundering world, and she has used this understanding to develop military applications of magic that other factions can only dream of — Arcane Surge tactics that amplify her mages' destructive output, enchanted siege engines that can breach any wall, and a network of scrying orbs that provides her with real-time intelligence on enemy movements across the continent."
  ));
  content.push(body(
    "Elara's military doctrine emphasizes arcane superiority and economic warfare. Her armies are smaller than those of Lord Ashford or Shadow Vex, but they are disproportionately powerful due to the magical enhancements her mages provide. Battle Mages serve as her elite units, capable of devastating enemy formations with concentrated blasts of Aether energy, while her archers — trained at the Silverdale archery academies she funds — provide reliable ranged support. Elara's control of Port Brighthelm gives her the economic resources to hire mercenaries and purchase loyalty, and her control of Crystal Lake gives her a monopoly on arcane education, ensuring that the next generation of mages is loyal to her cause."
  ));
  content.push(body(
    "Elara's primary alliance is with Lord Ashford, though it is an uneasy partnership born of mutual convenience rather than genuine trust. She views Ashford as a useful blunt instrument — his armies absorb the brunt of enemy attacks while she consolidates her real power in the east. Her primary foe is Shadow Vex, whose assassins have repeatedly targeted her scholars and whose rogue agents have stolen arcane secrets from the Academy. Elara's weakness is her reliance on Aether; if her supply lines are cut or her mages are neutralized, her military advantage evaporates rapidly."
  ));

  // SHADOW VEX
  content.push(heading2("The Verdant Fang — Shadow Vex"));
  content.push(quote(
    `"Crowns and banners mean nothing in the dark. I own the shadows, the whispers, and the knife you never see coming. That is power."`
  ));
  content.push(quote("— Shadow Vex, intercepted message to an Ashenvale operative"));

  content.push(body(
    "Shadow Vex is the most enigmatic and feared faction leader in Aethermoor — a figure whose true name, face, and even species are subjects of speculation and rumor. What is known is this: Shadow Vex controls the Western Reaches and much of the southern Heartlands through a vast network of spies, assassins, and covert operatives that makes the intelligence services of other factions look like children playing at soldiers. Vex's base of operations is believed to be somewhere in Darkwood, but no agent sent to locate it has ever returned."
  ));
  content.push(body(
    "Vex's military philosophy is the antithesis of Ashford's: instead of overwhelming force, Vex relies on stealth, deception, and precision strikes. Assassins are Vex's signature unit — elite killers who can infiltrate any fortress, eliminate any target, and vanish without a trace. Rogues serve as scouts, saboteurs, and skirmishers, harassing enemy supply lines and spreading disinformation. Vex has also perfected the Shadow Strike tactic, a coordinated assault where multiple assassination teams strike simultaneously across a wide area, decimating enemy command structures in a single night. When forced into open battle, Vex's forces use hit-and-run tactics, ambushes, and the terrain of Darkwood and Misthollow to negate the numerical superiority of their enemies."
  ));
  content.push(body(
    "Vex's relationship with the other factions is purely adversarial. Vex views Ashford as a tyrant, Elara as a manipulative intellectual, and Sir Gideon as a dangerous fanatic. Vex has no permanent allies, only temporary arrangements of convenience, and has been known to betray former partners without hesitation when circumstances change. Vex's weakness is the inability to hold territory in open combat; while Vex's forces excel at infiltration and ambush, they cannot stand against a well-fortified position defended by heavy infantry. This limitation has prevented Vex from converting tactical victories into strategic dominance."
  ));

  // SIR GIDEON
  content.push(heading2("The Sanctified Order — Sir Gideon"));
  content.push(quote(
    `"The Shattering was not a disaster — it was a purification. The old world was corrupt, and the Veil tore because the Aethernote had forgotten the gods. I will not make the same mistake."`
  ));
  content.push(quote("— Sir Gideon, sermon at the Sunforge Cathedral"));

  content.push(body(
    "Sir Gideon is the Grand Paladin of the Sanctified Order, a religious military organization that believes the Shattering was a divine punishment for the Aethernote's hubris and that the only path to Aethermoor's salvation lies in strict adherence to sacred law and the complete elimination of 'impure' magic — meaning any magic not sanctioned by the Order's theologians. Gideon is a massive warrior in gleaming white-and-gold armor, carrying a shield embossed with the sun emblem of his faith and a warhammer that glows with holy light. He is the least politically flexible of the four faction leaders, driven by genuine religious conviction rather than ambition, and this makes him both the most trustworthy and the most dangerous of the four."
  ));
  content.push(body(
    "Gideon's military doctrine centers on paladins and defensive warfare. His paladins are the most heavily armored and defensively capable units in Aethermoor, trained in the Divine Shield tactic — an impenetrable defensive formation that can withstand any assault. Shield Bearers form the core of his infantry, and his armies are nearly impossible to dislodge from fortified positions. Gideon's forces also include a corps of warrior-priests who can heal wounds, purify corrupted Aether, and smite undead or Void-touched creatures. This gives Gideon a unique advantage in battles against the monstrous entities that occasionally emerge from the Veil tears, making his territories the safest from supernatural threats."
  ));
  content.push(body(
    "Gideon's primary alliance is a fragile non-aggression pact with Lady Elara, brokered by mutual opposition to Shadow Vex's assassins. However, Gideon profoundly distrusts Elara's reliance on 'impure' magic and has publicly denounced her battle mages as heretics. His primary foe is Shadow Vex, whose very existence as a master of shadow magic offends Gideon's religious sensibilities, and whose assassins represent everything the Order stands against. Gideon also views Lord Ashford with suspicion, seeing in Ashford's imperial ambitions a dangerous echo of the Aethernote's hubris. Gideon's weakness is his inflexibility — his refusal to use stealth, deception, or unconventional tactics means that enemies who can outmaneuver him strategically will eventually overcome his tactical advantages."
  ));

  content.push(divider());

  // ════════════════════════════════════════
  // ALLIANCES AND RIVALRIES
  // ════════════════════════════════════════
  content.push(heading1("Web of Alliances and Rivalries"));
  content.push(body(
    "The political landscape of Aethermoor is a complex tapestry of alliances, betrayals, and uneasy truces that shifts with every battle, every treaty, and every whispered secret. The four major factions are not monolithic blocs; each contains internal factions, dissenting voices, and potential traitors. The following account describes the major alliance structures and rivalry dynamics as they stand in the current era."
  ));

  content.push(heading2("The Iron-Gold Compact"));
  content.push(body(
    "The most significant alliance in contemporary Aethermoor is the Iron-Gold Compact, a formal treaty between Lord Ashford's Crimson Banner and Lady Elara's Golden Circle. The Compact is fundamentally a marriage of convenience: Ashford provides the military muscle to hold and conquer territory, while Elara provides the economic resources and arcane support to sustain a prolonged campaign. Under the terms of the Compact, Ironhold supplies the Eastern Shores with weapons and raw materials at preferential rates, while Port Brighthelm provides the Frostlands with access to maritime trade and Crystal Lake provides arcane education for Frostland officers."
  ));
  content.push(body(
    "However, the Compact is riddled with tensions. Ashford's commanders resent what they see as Elara's 'puppet-master' approach — she provides gold and mages but rarely commits her own troops to the front lines. Elara's scholars, for their part, view the Frostlanders as uncultured barbarians who waste Aether on crude weapons rather than pursuing genuine arcane understanding. Both sides maintain extensive espionage networks against each other, and numerous incidents — including the infamous 'Wintermere Incident' where Ashford's troops seized a Crystal Lake research outpost — have brought the Compact to the brink of collapse. What holds it together is the shared threat of Shadow Vex, whose assassins target both factions with equal enthusiasm."
  ));

  content.push(heading2("The Shadow War"));
  content.push(body(
    "Shadow Vex operates in a state of undeclared war against all three other factions simultaneously, though the intensity of hostilities varies. Vex's relationship with Ashford is the most openly hostile — Vex's assassins have made repeated attempts on Ashford's life, and Ashford has responded by sending punitive expeditions into Darkwood that have accomplished nothing except the destruction of a few outer villages. The conflict between Vex and Elara is more subtle but no less deadly; it is a war of secrets, with Vex's agents stealing arcane knowledge and Elara's mages attempting to develop counter-espionage magic. The conflict between Vex and Gideon is the most ideological; Gideon has declared Vex an 'enemy of the divine order' and has launched multiple crusades into the Western Reaches, each of which has bogged down in the terrain and been forced to retreat."
  ));
  content.push(body(
    "What makes the Shadow War so dangerous is Vex's ability to exploit the tensions between the other three factions. Vex's agents have been implicated in incidents designed to provoke conflict between Ashford and Elara, between Elara and Gideon, and between Ashford and Gideon. Whether these provocations represent Vex's grand strategy or simply opportunistic chaos is a matter of heated debate among the scholars of Crystal Lake."
  ));

  content.push(heading2("The Holy Suspicion"));
  content.push(body(
    "Sir Gideon's Sanctified Order is technically allied with both the Iron-Gold Compact (through Elara's non-aggression pact) and at war with Shadow Vex, but in practice, Gideon trusts neither side and prepares for the day when he may have to fight both. The Order's theologians have classified Ashford's use of frost magic in warfare as 'tolerated but impure' and Elara's battle mages as 'dangerous heretics.' Gideon's public sermons increasingly frame the Shattered Lands' conflicts not as political struggles but as a spiritual battle between faith and hubris, and his inner circle has begun discussing the possibility of a 'Great Purification' — a crusade against all factions that rely on unsanctioned magic."
  ));
  content.push(body(
    "This ideological rigidity has isolated Gideon diplomatically. His territories in the Southern Realms are prosperous and well-defended, but he has no reliable allies and faces potential enemies on all sides. The only thing preventing a three-front war is the mutual fear that Gideon's paladins inspire — no faction wants to commit the forces necessary to breach the Divine Shield, knowing the cost in lives would be catastrophic."
  ));

  content.push(divider());

  // ════════════════════════════════════════
  // TERRITORY GUIDE
  // ════════════════════════════════════════
  content.push(heading1("Territory Guide"));
  content.push(body(
    "The following guide provides a brief summary of each of the sixteen territories of Aethermoor, including their geographic characteristics, strategic value, and typical affiliation. Note that in the ever-shifting political landscape of the Shattered Lands, no territory's loyalty is permanent."
  ));

  const territories = [
    { name: "Ironhold", region: "The Frostlands", desc: "Fortress city carved into a volcanic mountain. Legendary weapon forges. Home to Lord Ashford. Produces the finest heavy infantry and siege weapons." },
    { name: "Wintermere", region: "The Frostlands", desc: "Frozen lake territory with enchanted greenhouses. The breadbasket of the north. Critical for sustaining Frostland military campaigns through long winters." },
    { name: "Frostpeak", region: "The Frostlands", desc: "Mountain monastery territory. Home to the Order of the Pale Watch. Guards the most dangerous Aether fissures. Provides spiritual leadership and defensive magic." },
    { name: "Dragonspine", region: "The Frostlands", desc: "Black mountain ridge rich in Aether-infused dragonstone. The most resource-rich territory in the north and the most frequently contested." },
    { name: "Goldshire", region: "The Heartlands", desc: "Former capital of Aethermoor. Largest and wealthiest city on the continent. Home to the ruined Aethernote palace. The ultimate strategic prize." },
    { name: "Silverdale", region: "The Heartlands", desc: "River territory with silver mines. Known for skilled archers and diplomatic tradition. A key trade hub connecting north, center, and west." },
    { name: "Thornwall", region: "The Heartlands", desc: "Fortified territory bounded by living bramble walls. Natural fortress. Home to defensive warfare specialists and fortification engineers." },
    { name: "Ashenvale", region: "The Heartlands", desc: "Partially scorched forest territory. Haunted, grim beauty. Haven for rogues, outlaws, and shadow operatives. Shadow Vex's primary stronghold outside the west." },
    { name: "Sunforge", region: "The Southern Realms", desc: "Industrial territory built around an eternal Aether foundry. Produces arcane devices and fire-infused weapons. Sir Gideon's primary seat of power." },
    { name: "Ravencrest", region: "The Southern Realms", desc: "Tower city of scholars, spies, and assassins. Intelligence hub. Raven messengers provide the fastest communication network in the south." },
    { name: "Stormhold", region: "The Southern Realms", desc: "Coastal territory of violent Aether storms. Warriors channel lightning in combat. Devastating on open battlefields but vulnerable to siege." },
    { name: "Moonhaven", region: "The Southern Realms", desc: "Mysterious territory home to the Moonwell. Gateway to the spirit realm. Spirit-walkers and healers. Strategically isolated but spiritually powerful." },
    { name: "Port Brighthelm", region: "The Eastern Shores", desc: "Largest deep-water port in Aethermoor. Controls continental trade. Cosmopolitan and wealthy. Lady Elara's economic engine." },
    { name: "Crystal Lake", region: "The Eastern Shores", desc: "Sacred Aether-saturated lake. Home to the Academy and the Great Archive. Center of arcane scholarship. Lady Elara's intellectual stronghold." },
    { name: "Darkwood", region: "The Western Reaches", desc: "Vast sentient forest. Inhabited by canopy-dwelling rangers. Finest scouts and ambush fighters. Nearly impossible to invade successfully." },
    { name: "Misthollow", region: "The Western Reaches", desc: "Fog-shrouded territory where the spirit realm bleeds through. Spirit-walkers and illusionists. Disorients and destroys invading armies." },
  ];

  // Create territory table
  const headerCells = ["Territory", "Region", "Strategic Notes"].map(
    (h) =>
      new TableCell({
        width: { size: h === "Strategic Notes" ? 50 : 25, type: WidthType.PERCENTAGE },
        shading: { type: ShadingType.CLEAR, fill: P.table.headerBg },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
          bottom: { style: BorderStyle.SINGLE, size: 4, color: c(P.table.accentLine) },
          left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
          right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: h, bold: true, size: 20, color: c(P.table.headerText), font: { ascii: "Times New Roman" } })],
          }),
        ],
      })
  );

  const dataRows = territories.map(
    (t) =>
      new TableRow({
        tableHeader: false,
        children: [
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t.name, bold: true, size: 20, color: c(P.body), font: { ascii: "Times New Roman" } })] })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t.region, size: 20, color: c(P.secondary), font: { ascii: "Times New Roman" } })] })],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: c(P.table.innerLine) },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: t.desc, size: 20, color: c(P.body), font: { ascii: "Times New Roman" } })] })],
          }),
        ],
      })
  );

  content.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      layout: TableLayoutType.FIXED,
      borders: allNoBorders,
      rows: [
        new TableRow({ tableHeader: true, children: headerCells }),
        ...dataRows,
      ],
    })
  );

  content.push(divider());

  // ════════════════════════════════════════
  // EPILOGUE
  // ════════════════════════════════════════
  content.push(heading1("Epilogue: The Coming Storm"));
  content.push(quote(
    `"The Veil is thinning again. The Hollow King stirs in the Void. And the four warlords of Aethermoor are too busy fighting each other to notice that the true enemy is not across the battlefield — it is beneath their feet."`
  ));
  content.push(quote("— Last known entry of Archivist Meren, Crystal Lake Archive"));

  content.push(body(
    "And so the Shattered Lands endure — fractured, bleeding, and beautiful. Sixteen territories, four factions, and countless lives hang in the balance as the war for Aethermoor continues. But there are whispers in the deep places of the world — in the roots of Darkwood's ancient trees, in the mists of Misthollow, in the frozen depths of the Heartroot caverns — that a greater threat stirs. The Hollow King, the spectral entity believed to be the transformed remnant of King Aldric, has begun to gather power in the Void beyond the Veil. His generals — the Hollowed — have been sighted near the largest Veil tears, and the Aether disturbances they cause grow more frequent and more violent with each passing season."
  ));
  content.push(body(
    "None of the four faction leaders have taken these reports seriously, each dismissing them as enemy propaganda or scholarly alarmism. Lord Ashford is focused on his campaign against Shadow Vex. Lady Elara is consumed by her research into Aether manipulation. Shadow Vex is too busy surviving to plan for existential threats. And Sir Gideon believes the Hollow King is merely a test of faith. But the scholars of Crystal Lake know the truth: if the factions do not unite, the war for Aethermoor will end not with a conqueror's crown, but with silence — the eternal silence of a world consumed by the Void."
  ));
  content.push(body(
    "The question is not whether the storm will come, but whether anyone will be left standing when it does."
  ));

  return content;
}

// ── Assemble document ──
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "SimSun" },
          size: 24,
          color: c(P.body),
        },
        paragraph: { spacing: { line: 312 } },
      },
    },
  },
  sections: [
    // Cover section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      },
      children: buildCover(),
    },
    // Body section
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
          pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "The Shattered Lands: Lore & Chronicles of Aethermoor",
                  size: 16,
                  color: c(P.secondary),
                  font: { ascii: "Times New Roman", eastAsia: "SimSun" },
                  italics: true,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  size: 18,
                  color: c(P.secondary),
                  font: { ascii: "Times New Roman" },
                }),
              ],
            }),
          ],
        }),
      },
      children: buildBody(),
    },
  ],
});

// ── Write file ──
const OUTPUT = "/home/z/my-project/download/Aethermoore_Lore_and_Chronicles.docx";
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Document saved to ${OUTPUT}`);
});