export interface TerritoryDef {
  id: string;
  name: string;
  region: string;
  path: string;
  labelX: number;
  labelY: number;
  adjacentTo: string[];
}

export interface PlayerConfig {
  name: string;
  color: string;
  colorLight: string;
  characterClass: string;
  icon: string;
}

export const PLAYER_CONFIGS: PlayerConfig[] = [
  { name: "Lord Ashford", color: "#DC2626", colorLight: "#FCA5A5", characterClass: "Knight", icon: "⚔️" },
  { name: "Lady Elara", color: "#D4A017", colorLight: "#FDE68A", characterClass: "Mage", icon: "🔮" },
  { name: "Shadow Vex", color: "#166534", colorLight: "#86EFAC", characterClass: "Rogue", icon: "🗡️" },
  { name: "Sir Gideon", color: "#7E22CE", colorLight: "#D8B4FE", characterClass: "Paladin", icon: "🛡️" },
];

export const CHARACTER_CLASSES = [
  { id: "knight", name: "Knight", icon: "⚔️", desc: "Bonus armies on fortify" },
  { id: "mage", name: "Mage", icon: "🔮", desc: "+1 reinforcement per turn" },
  { id: "rogue", name: "Rogue", icon: "🗡️", desc: "Reroll one die per attack" },
  { id: "paladin", name: "Paladin", icon: "🛡️", desc: "Defender wins ties always" },
];

// Fantasy continent "Aethermoor" - 16 territories as SVG polygon paths
// viewBox: 0 0 1000 650
export const TERRITORIES: TerritoryDef[] = [
  // === THE FROSTLANDS (North) ===
  {
    id: "ironhold",
    name: "Ironhold",
    region: "The Frostlands",
    path: "M 180 40 L 280 30 L 340 60 L 350 120 L 320 160 L 250 170 L 200 140 L 170 90 Z",
    labelX: 260,
    labelY: 100,
    adjacentTo: ["wintermere", "frostpeak", "silverdale"],
  },
  {
    id: "wintermere",
    name: "Wintermere",
    region: "The Frostlands",
    path: "M 350 30 L 460 25 L 520 50 L 510 110 L 470 140 L 390 150 L 350 120 L 340 60 Z",
    labelX: 430,
    labelY: 85,
    adjacentTo: ["ironhold", "frostpeak", "dragonspine"],
  },
  {
    id: "frostpeak",
    name: "Frostpeak",
    region: "The Frostlands",
    path: "M 340 160 L 390 150 L 470 140 L 510 110 L 530 150 L 510 200 L 460 230 L 380 230 L 330 200 L 320 160 Z",
    labelX: 420,
    labelY: 185,
    adjacentTo: ["ironhold", "wintermere", "dragonspine", "goldshire"],
  },
  {
    id: "dragonspine",
    name: "Dragonspine",
    region: "The Frostlands",
    path: "M 510 110 L 520 50 L 630 40 L 720 70 L 730 130 L 700 180 L 640 200 L 570 200 L 530 150 Z",
    labelX: 620,
    labelY: 120,
    adjacentTo: ["wintermere", "frostpeak", "goldshire", "thornwall", "port_brighthelm"],
  },

  // === THE HEARTLANDS (Central) ===
  {
    id: "goldshire",
    name: "Goldshire",
    region: "The Heartlands",
    path: "M 330 200 L 380 230 L 460 230 L 510 200 L 570 200 L 580 260 L 540 310 L 460 330 L 380 320 L 320 280 L 300 240 Z",
    labelX: 440,
    labelY: 270,
    adjacentTo: ["frostpeak", "dragonspine", "thornwall", "silverdale", "ashenvale"],
  },
  {
    id: "silverdale",
    name: "Silverdale",
    region: "The Heartlands",
    path: "M 170 90 L 200 140 L 250 170 L 320 160 L 300 240 L 320 280 L 280 310 L 220 300 L 160 260 L 130 200 L 140 140 Z",
    labelX: 230,
    labelY: 210,
    adjacentTo: ["ironhold", "goldshire", "ashenvale", "darkwood"],
  },
  {
    id: "thornwall",
    name: "Thornwall",
    region: "The Heartlands",
    path: "M 580 260 L 570 200 L 640 200 L 700 180 L 750 220 L 760 290 L 720 340 L 660 350 L 600 330 L 540 310 Z",
    labelX: 660,
    labelY: 275,
    adjacentTo: ["dragonspine", "goldshire", "ashenvale", "crystal_lake", "port_brighthelm"],
  },
  {
    id: "ashenvale",
    name: "Ashenvale",
    region: "The Heartlands",
    path: "M 280 310 L 320 280 L 380 320 L 460 330 L 540 310 L 600 330 L 580 390 L 520 420 L 440 430 L 360 410 L 300 370 L 260 340 Z",
    labelX: 430,
    labelY: 370,
    adjacentTo: ["goldshire", "silverdale", "thornwall", "sunforge", "darkwood"],
  },

  // === THE SOUTHERN REALMS (South) ===
  {
    id: "sunforge",
    name: "Sunforge",
    region: "The Southern Realms",
    path: "M 260 340 L 300 370 L 360 410 L 350 470 L 300 510 L 230 510 L 180 470 L 170 410 L 200 370 Z",
    labelX: 270,
    labelY: 440,
    adjacentTo: ["ashenvale", "darkwood", "misthollow", "ravencrest"],
  },
  {
    id: "ravencrest",
    name: "Ravencrest",
    region: "The Southern Realms",
    path: "M 300 510 L 350 470 L 440 430 L 480 470 L 490 530 L 460 570 L 380 580 L 310 560 L 280 530 Z",
    labelX: 390,
    labelY: 520,
    adjacentTo: ["sunforge", "misthollow", "stormhold", "moonhaven"],
  },
  {
    id: "stormhold",
    name: "Stormhold",
    region: "The Southern Realms",
    path: "M 490 530 L 480 470 L 520 420 L 580 390 L 640 420 L 660 480 L 640 540 L 580 570 L 520 560 Z",
    labelX: 570,
    labelY: 490,
    adjacentTo: ["ravencrest", "moonhaven", "crystal_lake"],
  },
  {
    id: "moonhaven",
    name: "Moonhaven",
    region: "The Southern Realms",
    path: "M 280 530 L 310 560 L 380 580 L 460 570 L 490 530 L 520 560 L 490 610 L 400 630 L 310 620 L 250 580 Z",
    labelX: 390,
    labelY: 590,
    adjacentTo: ["ravencrest", "stormhold", "misthollow"],
  },

  // === THE EASTERN SHORES ===
  {
    id: "port_brighthelm",
    name: "Port Brighthelm",
    region: "The Eastern Shores",
    path: "M 720 130 L 730 70 L 820 60 L 880 100 L 890 170 L 860 230 L 790 250 L 740 230 L 750 220 L 730 130 Z",
    labelX: 810,
    labelY: 155,
    adjacentTo: ["dragonspine", "thornwall", "crystal_lake"],
  },
  {
    id: "crystal_lake",
    name: "Crystal Lake",
    region: "The Eastern Shores",
    path: "M 740 230 L 790 250 L 860 230 L 870 300 L 840 360 L 770 380 L 700 350 L 660 350 L 720 340 L 760 290 L 740 230 Z",
    labelX: 770,
    labelY: 310,
    adjacentTo: ["thornwall", "port_brighthelm", "stormhold"],
  },

  // === THE WESTERN REACHES ===
  {
    id: "darkwood",
    name: "Darkwood",
    region: "The Western Reaches",
    path: "M 130 200 L 160 260 L 220 300 L 200 370 L 170 410 L 110 430 L 60 380 L 40 310 L 60 240 L 100 200 Z",
    labelX: 130,
    labelY: 310,
    adjacentTo: ["silverdale", "ashenvale", "sunforge", "misthollow"],
  },
  {
    id: "misthollow",
    name: "Misthollow",
    region: "The Western Reaches",
    path: "M 170 410 L 180 470 L 230 510 L 280 530 L 250 580 L 190 600 L 120 570 L 80 510 L 90 450 L 110 430 Z",
    labelX: 180,
    labelY: 510,
    adjacentTo: ["darkwood", "sunforge", "ravencrest", "moonhaven"],
  },
];

export const OCEAN_PATH = "M 0 0 L 1000 0 L 1000 650 L 0 650 Z";

export const REGION_NAMES = ["The Frostlands", "The Heartlands", "The Southern Realms", "The Eastern Shores", "The Western Reaches"];

export const PHASE_INFO: Record<string, { title: string; description: string }> = {
  deploy: {
    title: "⚔️ Deploy Reinforcements",
    description: "Click your territories to place armies. Reinforcements left:",
  },
  attack: {
    title: "🗡️ Attack Phase",
    description: "Select your territory, then an adjacent enemy territory to attack.",
  },
  fortify: {
    title: "🛡️ Fortify Phase",
    description: "Move armies from one of your territories to an adjacent owned territory.",
  },
};