// ========================================
// AI OPPONENT - Strategic Decision Engine
// ========================================
// The AI evaluates board state and makes decisions for deploy, attack, and fortify phases.
// Strategy: Prioritize frontline territories (border with enemies), attack weak targets,
// use type advantages, and consolidate forces after attacking.

import {
  type UnitTypeId,
  UNIT_TYPES,
  TACTICS,
  type TacticId,
  getTypeAdvantage,
} from './game-data';
import {
  type Player,
  type TerritoryState,
  getMaxAttackerDice,
  getMaxDefenderDice,
  getUnitCost,
} from './game-logic';

// Minimal state shape the AI needs (matches Zustand store subset)
export interface AIBoardState {
  phase: string;
  players: Player[];
  currentPlayerIndex: number;
  territories: Record<string, TerritoryState>;
  reinforcementsLeft: number;
  getAvailableTactics: () => TacticId[];
}

// ---- Types ----

export interface AIDecision {
  type: 'deploy' | 'attack' | 'fortify' | 'end_attack' | 'end_fortify';
  territoryId?: string;
  targetId?: string;
  unitType?: UnitTypeId;
  diceCount?: number;
  fortifyCount?: number;
  tacticId?: TacticId;
}

// ---- Helpers ----

function myTerritories(state: AIBoardState, playerId: string): TerritoryState[] {
  return Object.values(state.territories).filter(t => t.ownerId === playerId);
}

function enemyNeighbors(state: AIBoardState, territory: TerritoryState, playerId: string): TerritoryState[] {
  return territory.adjacentTo
    .map(id => state.territories[id])
    .filter(t => t && t.ownerId !== playerId);
}

function friendlyNeighbors(state: AIBoardState, territory: TerritoryState, playerId: string): TerritoryState[] {
  return territory.adjacentTo
    .map(id => state.territories[id])
    .filter(t => t && t.ownerId === playerId);
}

function isFrontline(state: AIBoardState, territory: TerritoryState, playerId: string): boolean {
  return territory.adjacentTo.some(id => {
    const t = state.territories[id];
    return t && t.ownerId !== playerId;
  });
}

// Score how valuable a territory is (more neighbors = more strategic)
function territoryStrategicValue(state: AIBoardState, territoryId: string): number {
  const t = state.territories[territoryId];
  if (!t) return 0;
  // Count unique connections (more = more central/valuable)
  return t.adjacentTo.length + (isFrontline(state, t, t.ownerId || '') ? 2 : 0);
}

// Count total units a player has
function totalUnits(state: AIBoardState, playerId: string): number {
  return myTerritories(state, playerId).reduce((sum, t) => sum + t.units.length, 0);
}

// ---- DEPLOY PHASE ----

function chooseBestUnitType(
  state: AIBoardState,
  playerId: string,
  territory: TerritoryState,
): UnitTypeId {
  const player = state.players.find(p => p.id === playerId);
  const charClass = player?.characterClass || '';

  // Look at adjacent enemy territories and pick a unit that counters them
  const enemies = enemyNeighbors(state, territory, playerId);
  if (enemies.length > 0) {
    // Find most common enemy unit type
    const enemyUnitCounts: Record<string, number> = {};
    for (const e of enemies) {
      for (const u of e.units) {
        enemyUnitCounts[u] = (enemyUnitCounts[u] || 0) + 1;
      }
    }
    // Find the best counter
    let bestUnit: UnitTypeId = 'swordsman';
    let bestScore = -Infinity;
    for (const [enemyType, count] of Object.entries(enemyUnitCounts)) {
      for (const [unitId, unitDef] of Object.entries(UNIT_TYPES)) {
        if (unitDef.cost > state.reinforcementsLeft) continue;
        const advantage = getTypeAdvantage(unitId as UnitTypeId, enemyType as UnitTypeId);
        const score = (advantage === 'strong' ? 3 : advantage === 'weak' ? -2 : 0)
          + unitDef.attack * 0.5
          + unitDef.health * 0.3
          + count * 0.5; // Weight by how common the enemy unit is
        if (score > bestScore) {
          bestScore = score;
          bestUnit = unitId as UnitTypeId;
        }
      }
    }
    return bestUnit;
  }

  // Default: balanced army composition
  const myUnits = territory.units;
  const hasTank = myUnits.some(u => UNIT_TYPES[u].defense >= 5);
  const hasDPS = myUnits.some(u => UNIT_TYPES[u].attack >= 5);

  if (!hasTank && state.reinforcementsLeft >= 1) return charClass === 'paladin' ? 'paladin' : 'shield_bearer';
  if (!hasDPS && state.reinforcementsLeft >= 1) return charClass === 'rogue' ? 'assassin' : 'cavalry';
  return charClass === 'mage' ? 'mage' : 'swordsman';
}

export function aiDeploy(state: AIBoardState, playerId: string): AIDecision[] {
  const decisions: AIDecision[] = [];
  let reinforcements = state.reinforcementsLeft;

  if (reinforcements <= 0) return [{ type: 'end_attack' }]; // skip to end deploy

  const territories = myTerritories(state, playerId);
  if (territories.length === 0) return [{ type: 'end_attack' }];

  // Sort territories: frontline first, then by fewest units (need reinforcement most)
  const sorted = [...territories].sort((a, b) => {
    const aFront = isFrontline(state, a, playerId) ? 1 : 0;
    const bFront = isFrontline(state, b, playerId) ? 1 : 0;
    if (aFront !== bFront) return bFront - aFront;
    return a.units.length - b.units.length; // Fewer units first
  });

  while (reinforcements > 0) {
    let deployed = false;
    for (const territory of sorted) {
      const unitType = chooseBestUnitType(state, playerId, territory);
      const cost = getUnitCost(unitType, state.players.find(p => p.id === playerId)?.characterClass || '');
      if (cost <= reinforcements) {
        decisions.push({ type: 'deploy', territoryId: territory.id, unitType });
        reinforcements -= cost;
        deployed = true;
        break; // Re-evaluate after each deploy since state conceptually changes
      }
    }
    if (!deployed) break; // Can't afford anything
  }

  return decisions;
}

// ---- ATTACK PHASE ----

interface AttackCandidate {
  fromId: string;
  toId: string;
  score: number;
  atkUnits: number;
  defUnits: number;
  diceCount: number;
}

function evaluateAttack(
  state: AIBoardState,
  playerId: string,
  fromTerritory: TerritoryState,
  toTerritory: TerritoryState,
  tacticId: TacticId | null,
): AttackCandidate | null {
  if (fromTerritory.units.length <= 1) return null;

  const diceCount = getMaxAttackerDice(fromTerritory.units.length);
  if (diceCount === 0) return null;

  const atkType = fromTerritory.units[0]; // Dominant unit (front of array = strongest)
  const defType = toTerritory.units[0];

  const advantage = getTypeAdvantage(atkType, defType);
  const atkUnitDef = UNIT_TYPES[atkType];
  const defUnitDef = UNIT_TYPES[defType];

  // Calculate expected outcome score
  let score = 0;

  // Force ratio bonus
  const forceRatio = fromTerritory.units.length / Math.max(1, toTerritory.units.length);
  score += (forceRatio - 1) * 3;

  // Type advantage
  if (advantage === 'strong') score += 4;
  if (advantage === 'weak') score -= 3;

  // Dice advantage (more attacker dice = better)
  const defDice = getMaxDefenderDice(toTerritory.units.length);
  score += (diceCount - defDice) * 1.5;

  // Tactic bonus
  if (tacticId) {
    const tactic = TACTICS[tacticId];
    if (tactic.phase === 'attack') {
      score += 2.5;
    }
  }

  // Target priority: territories that complete regions or are strategic
  score += territoryStrategicValue(state, toTerritory.id) * 0.5;

  // Avoid attacking very strong positions (high risk)
  if (toTerritory.units.length >= fromTerritory.units.length) {
    score -= 3;
  }

  // Small random factor for unpredictability
  score += (Math.random() - 0.5) * 2;

  return {
    fromId: fromTerritory.id,
    toId: toTerritory.id,
    score,
    atkUnits: fromTerritory.units.length,
    defUnits: toTerritory.units.length,
    diceCount,
  };
}

export function aiAttack(state: AIBoardState, playerId: string): AIDecision[] {
  const decisions: AIDecision[] = [];
  const territories = myTerritories(state, playerId);

  // Check if there's a good tactic to activate
  const availableTactics = state.getAvailableTactics();
  let bestTactic: TacticId | null = null;
  let bestTacticScore = 2; // Minimum threshold to use a tactic

  for (const tacticId of availableTactics) {
    const tactic = TACTICS[tacticId];
    if (tactic.phase === 'attack') {
      // Score the tactic based on how many attacks we could benefit from
      let tacticValue = 0;
      if (tacticId === 'cavalry_charge') {
        // Good if we have cavalry and enemy territory adjacent
        const hasCavalryAttack = territories.some(t =>
          t.units.includes('cavalry') && t.units.length > 1 &&
          enemyNeighbors(state, t, playerId).length > 0
        );
        if (hasCavalryAttack) tacticValue = 3;
      } else if (tacticId === 'volley_fire') {
        const hasArcherAttack = territories.some(t =>
          t.units.includes('archer') && t.units.length > 1 &&
          enemyNeighbors(state, t, playerId).length > 0
        );
        if (hasArcherAttack) tacticValue = 3.5;
      } else if (tacticId === 'assassinate') {
        const hasAssassinAttack = territories.some(t =>
          t.units.includes('assassin') && t.units.length > 1 &&
          enemyNeighbors(state, t, playerId).length > 0
        );
        if (hasAssassinAttack) tacticValue = 4;
      } else if (tacticId === 'arcane_surge') {
        const hasMageAttack = territories.some(t =>
          t.units.includes('mage') && t.units.length > 1 &&
          enemyNeighbors(state, t, playerId).length > 0
        );
        if (hasMageAttack) tacticValue = 3;
      } else if (tacticId === 'siege_prep') {
        const hasSiegeAttack = territories.some(t =>
          t.units.includes('siege') && t.units.length > 1 &&
          enemyNeighbors(state, t, playerId).length > 0
        );
        if (hasSiegeAttack) tacticValue = 3;
      }

      if (tacticValue > bestTacticScore) {
        bestTacticScore = tacticValue;
        bestTactic = tacticId;
      }
    } else if (tactic.phase === 'deploy') {
      // Rally cry handled in deploy - skip here
    }
  }

  // Activate tactic if worthwhile
  if (bestTactic) {
    decisions.push({ type: 'attack', tacticId: bestTactic });
  }

  // Evaluate all possible attacks
  const candidates: AttackCandidate[] = [];
  for (const territory of territories) {
    if (territory.units.length <= 1) continue;
    for (const enemyId of territory.adjacentTo) {
      const enemy = state.territories[enemyId];
      if (!enemy || enemy.ownerId === playerId) continue;
      const candidate = evaluateAttack(state, playerId, territory, enemy, bestTactic);
      if (candidate && candidate.score > 1) {
        candidates.push(candidate);
      }
    }
  }

  // Sort by score, attack the best targets first
  candidates.sort((a, b) => b.score - a.score);

  // Attack up to 3 targets per turn (don't overextend)
  const maxAttacks = 3;
  const attackedFrom = new Set<string>(); // Don't attack from same territory twice in a row

  for (const candidate of candidates) {
    if (decisions.filter(d => d.type === 'attack' && !d.tacticId).length >= maxAttacks) break;
    if (attackedFrom.has(candidate.fromId)) continue;
    if (candidate.score < 1.5) break; // Don't attack if not advantageous enough

    decisions.push({
      type: 'attack',
      territoryId: candidate.fromId,
      targetId: candidate.toId,
      diceCount: candidate.diceCount,
    });
    attackedFrom.add(candidate.fromId);
  }

  if (decisions.length === 0 || decisions.every(d => d.tacticId)) {
    decisions.push({ type: 'end_attack' });
  }

  return decisions;
}

// ---- FORTIFY PHASE ----

export function aiFortify(state: AIBoardState, playerId: string): AIDecision[] {
  const territories = myTerritories(state, playerId);
  if (territories.length <= 1) return [{ type: 'end_fortify' }];

  // Find territory with most units that has a frontline neighbor
  const donors = territories
    .filter(t => t.units.length > 1)
    .sort((a, b) => b.units.length - a.units.length);

  for (const donor of donors) {
    const frontNeighbors = friendlyNeighbors(state, donor, playerId)
      .filter(fn => isFrontline(state, fn, playerId) && fn.units.length < donor.units.length);

    if (frontNeighbors.length > 0) {
      // Pick the weakest frontline neighbor
      frontNeighbors.sort((a, b) => a.units.length - b.units.length);
      const target = frontNeighbors[0];
      const moveCount = Math.max(1, Math.floor(donor.units.length / 2));

      return [{
        type: 'fortify',
        territoryId: donor.id,
        targetId: target.id,
        fortifyCount: moveCount,
      }];
    }
  }

  return [{ type: 'end_fortify' }];
}

// ---- MAIN AI TURN ORCHESTRATOR ----

export function getAIDecisions(state: AIBoardState, playerId: string): AIDecision[] {
  switch (state.phase) {
    case 'deploy': {
      // Check for rally cry tactic first
      const availableTactics = state.getAvailableTactics();
      const rallyCry = availableTactics.find(t => TACTICS[t].phase === 'deploy');
      const decisions: AIDecision[] = [];
      if (rallyCry) {
        decisions.push({ type: 'deploy', tacticId: rallyCry });
      }
      decisions.push(...aiDeploy(state, playerId));
      return decisions;
    }
    case 'attack':
      return aiAttack(state, playerId);
    case 'fortify':
      return aiFortify(state, playerId);
    default:
      return [];
  }
}