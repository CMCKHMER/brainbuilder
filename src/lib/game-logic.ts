export type GamePhase = 'setup' | 'deploy' | 'attack' | 'fortify' | 'gameover';

export interface Player {
  id: string;
  name: string;
  color: string;
  colorLight: string;
  characterClass: string;
  icon: string;
  territories: string[];
  eliminated: boolean;
}

export interface TerritoryState {
  id: string;
  name: string;
  region: string;
  ownerId: string | null;
  armies: number;
  adjacentTo: string[];
  path: string;
  labelX: number;
  labelY: number;
}

export interface BattleResult {
  attackerRolls: number[];
  defenderRolls: number[];
  attackerLosses: number;
  defenderLosses: number;
  conquered: boolean;
  fromTerritory: string;
  toTerritory: string;
}

export interface BattleLogEntry {
  id: string;
  message: string;
  type: 'attack' | 'conquer' | 'deploy' | 'fortify' | 'info' | 'turn';
  timestamp: number;
}

function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

function sortDiceDescending(dice: number[]): number[] {
  return [...dice].sort((a, b) => b - a);
}

export function rollDice(count: number): number[] {
  return Array.from({ length: count }, () => rollDie());
}

export function resolveBattle(
  attackerDiceCount: number,
  defenderDiceCount: number,
  _attackerClass?: string,
  _defenderClass?: string,
  isPaladinDefender?: boolean
): { attackerRolls: number[]; defenderRolls: number[]; attackerLosses: number; defenderLosses: number } {
  const attackerRolls = sortDiceDescending(rollDice(attackerDiceCount));
  const defenderRolls = sortDiceDescending(rollDice(defenderDiceCount));

  const rounds = Math.min(attackerRolls.length, defenderRolls.length);
  let attackerLosses = 0;
  let defenderLosses = 0;

  for (let i = 0; i < rounds; i++) {
    if (attackerRolls[i] > defenderRolls[i]) {
      defenderLosses++;
    } else {
      // Defender wins ties (standard Risk)
      // Paladin bonus: defender always wins ties (already default in Risk)
      attackerLosses++;
    }
  }

  return { attackerRolls, defenderRolls, attackerLosses, defenderLosses };
}

export function calculateReinforcements(territoryCount: number, characterClass: string): number {
  let base = Math.max(3, Math.floor(territoryCount / 3));
  // Mage bonus: +1 reinforcement per turn
  if (characterClass === 'mage') {
    base += 1;
  }
  return base;
}

export function getMaxAttackerDice(armies: number): number {
  // Need at least 2 armies (1 stays behind), max 3 dice
  if (armies <= 1) return 0;
  if (armies === 2) return 1;
  if (armies === 3) return 2;
  return 3;
}

export function getMaxDefenderDice(armies: number): number {
  if (armies <= 1) return 0;
  return 2;
}