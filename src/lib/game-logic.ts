import { type UnitTypeId, UNIT_TYPES, getTypeAdvantage } from './game-data';

export type GamePhase = 'title' | 'setup' | 'deploy' | 'attack' | 'fortify' | 'gameover';

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

// Each territory now has a list of unit types instead of a plain army count
export interface TerritoryState {
  id: string;
  name: string;
  region: string;
  ownerId: string | null;
  units: UnitTypeId[];       // Array of unit type IDs, e.g. ['swordsman','swordsman','archer']
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
  attackerType: UnitTypeId | null;
  defenderType: UnitTypeId | null;
  typeAdvantage: 'strong' | 'weak' | 'neutral';
  tacticUsed: string | null;
}

export interface BattleLogEntry {
  id: string;
  message: string;
  type: 'attack' | 'conquer' | 'deploy' | 'fortify' | 'info' | 'turn' | 'tactic';
  timestamp: number;
}

// Get the dominant unit type in an array (most numerous)
export function getDominantUnit(units: UnitTypeId[]): UnitTypeId | null {
  if (units.length === 0) return null;
  const counts: Record<string, number> = {};
  for (const u of units) {
    counts[u] = (counts[u] || 0) + 1;
  }
  let maxCount = 0;
  let dominant: UnitTypeId = units[0];
  for (const [type, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = type as UnitTypeId;
    }
  }
  return dominant;
}

// Get unit count summary
export function getUnitComposition(units: UnitTypeId[]): Record<UnitTypeId, number> {
  const comp: Record<string, number> = {};
  for (const u of units) {
    comp[u] = (comp[u] || 0) + 1;
  }
  return comp as Record<UnitTypeId, number>;
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

export interface CombatModifiers {
  attackDiceBonus: number;    // Extra dice for attacker
  attackDieBonus: number;     // +N to each attacker die
  defenseDiceBonus: number;   // Extra dice for defender
  defenseDieBonus: number;    // +N to each defender die
  defenderDiceReduction: number; // Reduce defender dice count
}

export function resolveBattle(
  attackerDiceCount: number,
  defenderDiceCount: number,
  attackerUnits: UnitTypeId[],
  defenderUnits: UnitTypeId[],
  attackerClass?: string,
  defenderClass?: string,
  modifiers?: CombatModifiers,
  tacticUsed?: string | null,
): {
  attackerRolls: number[];
  defenderRolls: number[];
  attackerLosses: number;
  defenderLosses: number;
  attackerType: UnitTypeId | null;
  defenderType: UnitTypeId | null;
  typeAdvantage: 'strong' | 'weak' | 'neutral';
} {
  const attackerType = getDominantUnit(attackerUnits);
  const defenderType = getDominantUnit(defenderUnits);
  const typeAdvantage = attackerType && defenderType
    ? getTypeAdvantage(attackerType, defenderType)
    : 'neutral';

  // Apply modifiers
  let atkDiceCount = attackerDiceCount + (modifiers?.attackDiceBonus || 0);
  let defDiceCount = defenderDiceCount + (modifiers?.defenseDiceBonus || 0) - (modifiers?.defenderDiceReduction || 0);
  defDiceCount = Math.max(0, defDiceCount);

  const attackerRolls = sortDiceDescending(rollDice(atkDiceCount));
  const defenderRolls = sortDiceDescending(rollDice(defDiceCount));

  // Apply die bonuses
  let atkBonus = modifiers?.attackDieBonus || 0;
  let defBonus = modifiers?.defenseDieBonus || 0;

  // Type advantage: +1 or -1 to attacker's highest die
  if (typeAdvantage === 'strong') {
    atkBonus += 1;
  } else if (typeAdvantage === 'weak') {
    atkBonus -= 1;
  }

  // Character class bonuses
  if (attackerClass === 'knight' && (attackerType === 'swordsman' || attackerType === 'cavalry')) {
    atkBonus += 1; // Knights: Swordsmen & Cavalry gain +1 ATK
  }
  if (defenderClass === 'paladin' && (defenderType === 'shield_bearer' || defenderType === 'paladin')) {
    defBonus += 1; // Paladins: Shield Bearers & Paladins gain +1 DEF
  }

  // Rogue reroll: handled at store level (simplification - we just give +1 to one die)
  if (attackerClass === 'rogue' && attackerRolls.length > 0) {
    // Reroll the lowest die, keep if better
    const lowestIdx = attackerRolls.length - 1;
    const newRoll = rollDie();
    if (newRoll > attackerRolls[lowestIdx]) {
      attackerRolls[lowestIdx] = newRoll;
      attackerRolls.sort((a, b) => b - a);
    }
  }

  // Apply bonuses (cap dice at 6)
  const modAttackerRolls = attackerRolls.map((r, i) => {
    // Apply bonus to top dice
    const bonus = i === 0 ? atkBonus : 0;
    return Math.min(6, Math.max(1, r + bonus));
  });

  const modDefenderRolls = defenderRolls.map((r, i) => {
    const bonus = i === 0 ? defBonus : 0;
    return Math.min(6, Math.max(1, r + bonus));
  });

  const rounds = Math.min(modAttackerRolls.length, modDefenderRolls.length);
  let attackerLosses = 0;
  let defenderLosses = 0;

  for (let i = 0; i < rounds; i++) {
    if (modAttackerRolls[i] > modDefenderRolls[i]) {
      defenderLosses++;
    } else {
      attackerLosses++;
    }
  }

  return {
    attackerRolls: modAttackerRolls,
    defenderRolls: modDefenderRolls,
    attackerLosses,
    defenderLosses,
    attackerType,
    defenderType,
    typeAdvantage,
  };
}

export function calculateReinforcements(territoryCount: number, characterClass: string, rallyCryActive?: boolean): number {
  let base = Math.max(3, Math.floor(territoryCount / 3));
  // Mage bonus: +1 reinforcement per turn
  if (characterClass === 'mage') {
    base += 1;
  }
  // Rally Cry tactic: +2 reinforcements
  if (rallyCryActive) {
    base += 2;
  }
  return base;
}

export function getMaxAttackerDice(armyCount: number): number {
  if (armyCount <= 1) return 0;
  if (armyCount === 2) return 1;
  if (armyCount === 3) return 2;
  return 3;
}

export function getMaxDefenderDice(armyCount: number): number {
  if (armyCount <= 1) return 0;
  return 2;
}

// Calculate the cost to deploy a specific unit type for a given character class
export function getUnitCost(unitType: UnitTypeId, characterClass: string): number {
  const baseCost = UNIT_TYPES[unitType].cost;
  // Mage discount: mages cost 1 fewer to deploy (min 1)
  if (characterClass === 'mage' && unitType === 'mage') {
    return Math.max(1, baseCost - 1);
  }
  return baseCost;
}

// Remove N units from a territory, prioritizing weakest (lowest HP) first
export function removeUnits(units: UnitTypeId[], count: number, removeFromFront?: boolean): UnitTypeId[] {
  if (count >= units.length) return [];
  const remaining = [...units];
  if (removeFromFront) {
    // Remove from the front (attacker sends best units)
    return remaining.slice(count);
  }
  // Remove from back (lose weakest units first)
  for (let i = 0; i < count; i++) {
    // Find the unit with lowest HP
    let weakestIdx = remaining.length - 1;
    let weakestHP = UNIT_TYPES[remaining[weakestIdx]].health;
    for (let j = remaining.length - 2; j >= 0; j--) {
      const hp = UNIT_TYPES[remaining[j]].health;
      if (hp < weakestHP) {
        weakestHP = hp;
        weakestIdx = j;
      }
    }
    remaining.splice(weakestIdx, 1);
  }
  return remaining;
}