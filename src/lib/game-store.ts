import { create } from 'zustand';
import { TERRITORIES, PLAYER_CONFIGS, type PlayerConfig, type UnitTypeId, type TacticId, UNIT_TYPES, TACTICS } from './game-data';
import {
  type GamePhase,
  type Player,
  type TerritoryState,
  type BattleResult,
  type BattleLogEntry,
  type CombatModifiers,
  calculateReinforcements,
  getMaxAttackerDice,
  getMaxDefenderDice,
  resolveBattle,
  getUnitCost,
  getDominantUnit,
  removeUnits,
} from './game-logic';

interface ActiveTactic {
  tacticId: TacticId;
  playerId: string;
  turnUsed: number;
  turnsUntilAvailable: number;
  usedThisTurn: boolean;
}

interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  territories: Record<string, TerritoryState>;
  selectedTerritory: string | null;
  targetTerritory: string | null;
  reinforcementsLeft: number;
  attackerDiceCount: number;
  defenderDiceCount: number;
  battleResult: BattleResult | null;
  battleLog: BattleLogEntry[];
  winner: Player | null;
  fortifyArmies: number;
  turnNumber: number;

  // Unit system
  deployUnitType: UnitTypeId;       // Currently selected unit type for deployment
  activeTactics: ActiveTactic[];    // All active/cooling-down tactics
  selectedTactic: TacticId | null;  // Tactic selected for this turn

  // Title screen
  startGame: () => void;

  // Setup
  setupGame: (playerConfigs: { name: string; color: string; colorLight: string; characterClass: string; icon: string }[]) => void;

  // Deploy
  deployArmy: (territoryId: string, unitType: UnitTypeId) => void;
  setDeployUnitType: (unitType: UnitTypeId) => void;

  // Attack
  selectTerritory: (territoryId: string) => void;
  clearSelection: () => void;
  setAttackerDiceCount: (count: number) => void;
  executeAttack: () => void;

  // Fortify
  setFortifyArmies: (count: number) => void;
  executeFortify: (fromId: string, toId: string) => void;

  // Tactics
  activateTactic: (tacticId: TacticId) => void;
  getAvailableTactics: () => TacticId[];
  getActiveTacticEffect: () => CombatModifiers | null;
  isTacticActive: (tacticId: TacticId) => boolean;
  getActiveTactic: () => TacticId | null;

  // Phase management
  endDeployPhase: () => void;
  endAttackPhase: () => void;
  endTurn: () => void;
  resetGame: () => void;

  // Helpers
  getCurrentPlayer: () => Player;
  getTerritory: (id: string) => TerritoryState;
  getPlayerById: (id: string) => Player | undefined;
}

let logIdCounter = 0;

function addLog(state: GameState, message: string, type: BattleLogEntry['type']): BattleLogEntry {
  logIdCounter++;
  return {
    id: `log-${logIdCounter}`,
    message,
    type,
    timestamp: Date.now(),
  };
}

function randomlyAssignTerritories(playerCount: number, players: Player[]): Record<string, TerritoryState> {
  const territories: Record<string, TerritoryState> = {};
  const territoryIds = TERRITORIES.map(t => t.id);
  // Shuffle
  for (let i = territoryIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [territoryIds[i], territoryIds[j]] = [territoryIds[j], territoryIds[i]];
  }

  // Default unit types to distribute
  const defaultUnits: UnitTypeId[] = ['spearman', 'swordsman', 'swordsman', 'archer', 'cavalry', 'shield_bearer', 'mage', 'assassin'];

  for (let i = 0; i < territoryIds.length; i++) {
    const def = TERRITORIES.find(t => t.id === territoryIds[i])!;
    const playerIndex = i % playerCount;
    const unitType = defaultUnits[i % defaultUnits.length];
    territories[territoryIds[i]] = {
      ...def,
      ownerId: players[playerIndex].id,
      units: [unitType], // Start with 1 unit each
    };
  }

  // Give each player bonus units to reach minimum 2-3 units per territory on average
  const territoriesPerPlayer = Math.floor(16 / playerCount);
  for (const player of players) {
    const playerTerritories = Object.values(territories).filter(t => t.ownerId === player.id);
    const bonusUnits = Math.max(0, Math.ceil(territoriesPerPlayer / 2));
    for (let i = 0; i < bonusUnits; i++) {
      const randomTerritory = playerTerritories[Math.floor(Math.random() * playerTerritories.length)];
      const randomUnit = defaultUnits[Math.floor(Math.random() * defaultUnits.length)];
      territories[randomTerritory.id].units.push(randomUnit);
    }
  }

  return territories;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'title',
  players: [],
  currentPlayerIndex: 0,
  territories: {},
  selectedTerritory: null,
  targetTerritory: null,
  reinforcementsLeft: 0,
  attackerDiceCount: 0,
  defenderDiceCount: 0,
  battleResult: null,
  battleLog: [],
  winner: null,
  fortifyArmies: 0,
  turnNumber: 0,
  deployUnitType: 'swordsman',
  activeTactics: [],
  selectedTactic: null,

  setupGame: (playerConfigs) => {
    const players: Player[] = playerConfigs.map((config, index) => ({
      id: `player-${index}`,
      ...config,
      territories: [],
      eliminated: false,
    }));

    const territories = randomlyAssignTerritories(players.length, players);

    // Update player territory lists
    for (const player of players) {
      player.territories = Object.values(territories)
        .filter(t => t.ownerId === player.id)
        .map(t => t.id);
    }

    set({
      phase: 'deploy',
      players,
      currentPlayerIndex: 0,
      territories,
      selectedTerritory: null,
      targetTerritory: null,
      battleResult: null,
      battleLog: [],
      winner: null,
      turnNumber: 1,
      reinforcementsLeft: calculateReinforcements(
        players[0].territories.length,
        players[0].characterClass
      ),
      attackerDiceCount: 0,
      defenderDiceCount: 0,
      fortifyArmies: 0,
      deployUnitType: 'swordsman',
      activeTactics: [],
      selectedTactic: null,
    });
  },

  deployArmy: (territoryId, unitType) => {
    const state = get();
    if (state.phase !== 'deploy' || state.reinforcementsLeft <= 0) return;

    const territory = state.territories[territoryId];
    if (!territory || territory.ownerId !== state.players[state.currentPlayerIndex].id) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    const cost = getUnitCost(unitType, currentPlayer.characterClass);
    if (cost > state.reinforcementsLeft) return;

    const newTerritories = { ...state.territories };
    newTerritories[territoryId] = {
      ...territory,
      units: [...territory.units, unitType],
    };

    const newReinforcements = state.reinforcementsLeft - cost;
    const unitName = UNIT_TYPES[unitType].name;
    const newLog = [...state.battleLog, addLog(state, `${UNIT_TYPES[unitType].icon} ${territory.name}: +1 ${unitName} deployed`, 'deploy')];

    set({
      territories: newTerritories,
      reinforcementsLeft: newReinforcements,
      battleLog: newLog,
      selectedTerritory: null,
    });
  },

  setDeployUnitType: (unitType) => set({ deployUnitType: unitType }),

  selectTerritory: (territoryId) => {
    const state = get();
    const territory = state.territories[territoryId];
    if (!territory) return;
    const currentPlayer = state.players[state.currentPlayerIndex];

    if (state.phase === 'attack') {
      if (state.selectedTerritory === null) {
        if (territory.ownerId === currentPlayer.id && territory.units.length > 1) {
          set({
            selectedTerritory: territoryId,
            targetTerritory: null,
            attackerDiceCount: 0,
            battleResult: null,
          });
        }
      } else if (state.selectedTerritory === territoryId) {
        set({ selectedTerritory: null, targetTerritory: null, attackerDiceCount: 0, battleResult: null });
      } else if (territory.ownerId !== currentPlayer.id) {
        const selectedTerritory = state.territories[state.selectedTerritory];
        if (selectedTerritory.adjacentTo.includes(territoryId)) {
          set({
            targetTerritory: territoryId,
            defenderDiceCount: getMaxDefenderDice(territory.units.length),
          });
        }
      } else if (territory.ownerId === currentPlayer.id && territory.units.length > 1) {
        set({
          selectedTerritory: territoryId,
          targetTerritory: null,
          attackerDiceCount: 0,
          battleResult: null,
        });
      }
    }

    if (state.phase === 'fortify') {
      if (state.selectedTerritory === null) {
        if (territory.ownerId === currentPlayer.id && territory.units.length > 1) {
          set({
            selectedTerritory: territoryId,
            targetTerritory: null,
            fortifyArmies: territory.units.length - 1,
          });
        }
      } else if (state.selectedTerritory === territoryId) {
        set({ selectedTerritory: null, targetTerritory: null, fortifyArmies: 0 });
      } else if (territory.ownerId === currentPlayer.id) {
        const selectedTerritory = state.territories[state.selectedTerritory];
        if (selectedTerritory.adjacentTo.includes(territoryId)) {
          set({
            targetTerritory: territoryId,
            fortifyArmies: Math.min(state.fortifyArmies, selectedTerritory.units.length - 1),
          });
        }
      }
    }
  },

  clearSelection: () => {
    set({ selectedTerritory: null, targetTerritory: null, attackerDiceCount: 0, defenderDiceCount: 0, battleResult: null, fortifyArmies: 0 });
  },

  setAttackerDiceCount: (count) => set({ attackerDiceCount: count }),

  executeAttack: () => {
    const state = get();
    if (!state.selectedTerritory || !state.targetTerritory || state.attackerDiceCount === 0) return;

    const fromTerritory = state.territories[state.selectedTerritory];
    const toTerritory = state.territories[state.targetTerritory];
    if (!fromTerritory || !toTerritory) return;

    const attacker = state.players.find(p => p.id === fromTerritory.ownerId)!;
    const defender = state.players.find(p => p.id === toTerritory.ownerId)!;

    // Get tactic modifiers
    const modifiers = state.getActiveTacticEffect();
    const activeTactic = state.selectedTactic;

    const result = resolveBattle(
      state.attackerDiceCount,
      state.defenderDiceCount,
      fromTerritory.units,
      toTerritory.units,
      attacker.characterClass,
      defender.characterClass,
      modifiers || undefined,
      activeTactic,
    );

    const newTerritories = { ...state.territories };
    const newPlayers = state.players.map(p => ({ ...p, territories: [...p.territories] }));

    // Apply losses using unit system
    newTerritories[state.selectedTerritory] = {
      ...fromTerritory,
      units: removeUnits(fromTerritory.units, result.attackerLosses),
    };
    newTerritories[state.targetTerritory] = {
      ...toTerritory,
      units: removeUnits(toTerritory.units, result.defenderLosses),
    };

    let newLog = [...state.battleLog];
    let conquered = false;

    // Build advantage label
    const advantageLabel = result.typeAdvantage === 'strong' ? ' ⬆ADVANTAGE' : result.typeAdvantage === 'weak' ? ' ⬇DISADVANTAGE' : '';
    const atkTypeName = result.attackerType ? UNIT_TYPES[result.attackerType].name : 'Army';
    const defTypeName = result.defenderType ? UNIT_TYPES[result.defenderType].name : 'Army';

    if (newTerritories[state.targetTerritory].units.length === 0) {
      conquered = true;
      const movingUnits = Math.min(state.attackerDiceCount, newTerritories[state.selectedTerritory].units.length);

      const oldOwner = newTerritories[state.targetTerritory].ownerId;
      const newOwner = newTerritories[state.selectedTerritory].ownerId;

      // Move top units to conquered territory
      const remaining = newTerritories[state.selectedTerritory].units;
      const movedUnits = remaining.slice(0, movingUnits);
      const stayedUnits = remaining.slice(movingUnits);

      newTerritories[state.targetTerritory] = {
        ...newTerritories[state.targetTerritory],
        ownerId: newOwner,
        units: movedUnits,
      };
      newTerritories[state.selectedTerritory] = {
        ...newTerritories[state.selectedTerritory],
        units: stayedUnits,
      };

      if (oldOwner) {
        const oldPlayer = newPlayers.find(p => p.id === oldOwner)!;
        oldPlayer.territories = oldPlayer.territories.filter(id => id !== state.targetTerritory);
        if (oldPlayer.territories.length === 0) {
          oldPlayer.eliminated = true;
          newLog.push(addLog(state, `💀 ${oldPlayer.name} has been eliminated!`, 'info'));
        }
      }
      const newOwnerPlayer = newPlayers.find(p => p.id === newOwner)!;
      newOwnerPlayer.territories.push(state.targetTerritory);

      newLog.push(addLog(state, `🏆 ${attacker.name} conquered ${toTerritory.name} from ${defender.name}!`, 'conquer'));
    } else {
      newLog.push(addLog(state,
        `⚔️ ${atkTypeName}${advantageLabel} → ${defTypeName}: ATK lost ${result.attackerLosses}, DEF lost ${result.defenderLosses}`,
        'attack'
      ));
    }

    const battleResult: BattleResult = {
      ...result,
      conquered,
      fromTerritory: state.selectedTerritory,
      toTerritory: state.targetTerritory,
      tacticUsed: activeTactic,
    };

    // Check win condition
    const winner = newPlayers.find(p => !p.eliminated && p.territories.length === 16) || null;

    const maxAttack = getMaxAttackerDice(newTerritories[state.selectedTerritory].units.length);
    const maxDefend = getMaxDefenderDice(newTerritories[state.targetTerritory].units.length);

    // Mark tactic as used if it's an attack-phase tactic and battle happened
    let newActiveTactics = state.activeTactics;
    if (activeTactic) {
      const tactic = TACTICS[activeTactic];
      if (tactic.phase === 'attack') {
        newActiveTactics = newActiveTactics.map(t =>
          t.tacticId === activeTactic ? { ...t, usedThisTurn: true } : t
        );
      }
    }

    set({
      territories: newTerritories,
      players: newPlayers,
      battleResult,
      battleLog: newLog,
      attackerDiceCount: conquered ? 0 : Math.min(state.attackerDiceCount, maxAttack),
      defenderDiceCount: conquered ? 0 : maxDefend,
      targetTerritory: conquered ? null : state.targetTerritory,
      selectedTerritory: conquered ? null : state.selectedTerritory,
      winner: winner ? winner : null,
      phase: winner ? 'gameover' : state.phase,
      activeTactics: newActiveTactics,
    });
  },

  setFortifyArmies: (count) => set({ fortifyArmies: count }),

  executeFortify: (fromId, toId) => {
    const state = get();
    if (state.fortifyArmies <= 0) return;

    const newTerritories = { ...state.territories };
    const fromUnits = newTerritories[fromId].units;
    const toUnits = newTerritories[toId].units;

    // Move last N units (weakest) to destination
    const moved = fromUnits.slice(-state.fortifyArmies);
    const remaining = fromUnits.slice(0, fromUnits.length - state.fortifyArmies);

    newTerritories[fromId] = {
      ...newTerritories[fromId],
      units: remaining,
    };
    newTerritories[toId] = {
      ...newTerritories[toId],
      units: [...toUnits, ...moved],
    };

    const fromName = newTerritories[fromId].name;
    const toName = newTerritories[toId].name;
    const newLog = [...state.battleLog, addLog(state, `🛡️ ${state.fortifyArmies} units moved: ${fromName} → ${toName}`, 'fortify')];

    set({
      territories: newTerritories,
      battleLog: newLog,
      selectedTerritory: null,
      targetTerritory: null,
      fortifyArmies: 0,
    });
  },

  activateTactic: (tacticId) => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    const tactic = TACTICS[tacticId];

    // Check if already active or on cooldown
    const existing = state.activeTactics.find(t => t.tacticId === tacticId && t.playerId === currentPlayer.id);
    if (existing) return;

    // Check if player has the required unit type
    if (tactic.requires) {
      const hasUnit = Object.values(state.territories)
        .filter(t => t.ownerId === currentPlayer.id)
        .some(t => t.units.includes(tactic.requires!));
      if (!hasUnit) return;
    }

    const newActiveTactics = [...state.activeTactics, {
      tacticId,
      playerId: currentPlayer.id,
      turnUsed: state.turnNumber,
      turnsUntilAvailable: tactic.cooldown,
      usedThisTurn: false,
    }];

    const newLog = [...state.battleLog, addLog(state, `${tactic.icon} ${currentPlayer.name} activates ${tactic.name}!`, 'tactic')];

    set({
      activeTactics: newActiveTactics,
      selectedTactic: tacticId,
      battleLog: newLog,
    });
  },

  getAvailableTactics: () => {
    const state = get();
    const currentPlayer = state.players[state.currentPlayerIndex];
    const playerTactics = state.activeTactics.filter(t => t.playerId === currentPlayer.id);

    const available: TacticId[] = [];
    for (const tactic of Object.values(TACTICS)) {
      const existing = playerTactics.find(t => t.tacticId === tactic.id);
      // Available if not on cooldown (or cooldown expired) and not used this turn
      if (!existing || (state.turnNumber >= existing.turnUsed + existing.turnsUntilAvailable && !existing.usedThisTurn)) {
        // Check unit requirement
        if (tactic.requires) {
          const hasUnit = Object.values(state.territories)
            .filter(t => t.ownerId === currentPlayer.id)
            .some(t => t.units.includes(tactic.requires!));
          if (!hasUnit) continue;
        }
        available.push(tactic.id);
      }
    }
    return available;
  },

  getActiveTacticEffect: () => {
    const state = get();
    const activeTactic = state.selectedTactic;
    if (!activeTactic) return null;

    const tactic = TACTICS[activeTactic];
    const modifiers: CombatModifiers = {
      attackDiceBonus: 0,
      attackDieBonus: 0,
      defenseDiceBonus: 0,
      defenseDieBonus: 0,
      defenderDiceReduction: 0,
    };

    switch (activeTactic) {
      case 'cavalry_charge':
        modifiers.attackDieBonus = 2;
        break;
      case 'volley_fire':
        modifiers.attackDiceBonus = 1;
        break;
      case 'arcane_surge':
        // Handled in resolveBattle directly via typeAdvantage doubling
        modifiers.attackDieBonus = 1;
        break;
      case 'siege_prep':
        modifiers.defenderDiceReduction = 1;
        break;
      case 'phalanx':
        modifiers.defenseDieBonus = 1;
        break;
      case 'assassinate':
        modifiers.attackDieBonus = 3;
        break;
      case 'holy_shield':
        modifiers.defenseDieBonus = 1;
        break;
    }

    return modifiers;
  },

  isTacticActive: (tacticId) => {
    const state = get();
    return state.selectedTactic === tacticId;
  },

  getActiveTactic: () => {
    return get().selectedTactic;
  },

  endDeployPhase: () => {
    const state = get();
    set({
      phase: 'attack',
      selectedTerritory: null,
      targetTerritory: null,
      attackerDiceCount: 0,
      battleResult: null,
    });
  },

  endAttackPhase: () => {
    const state = get();
    set({
      phase: 'fortify',
      selectedTerritory: null,
      targetTerritory: null,
      attackerDiceCount: 0,
      battleResult: null,
      fortifyArmies: 0,
    });
  },

  endTurn: () => {
    const state = get();
    const nextPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    let actualNext = nextPlayerIndex;
    let safety = 0;

    while (state.players[actualNext].eliminated && safety < 10) {
      actualNext = (actualNext + 1) % state.players.length;
      safety++;
    }

    // If we looped back to the current player, it means only they remain
    const newTurnNumber = actualNext <= state.currentPlayerIndex ? state.turnNumber + 1 : state.turnNumber;

    const nextPlayer = state.players[actualNext];

    // Check if rally cry is active for next player
    const rallyCryActive = state.activeTactics.some(
      t => t.tacticId === 'rally_cry' && t.playerId === nextPlayer.id && t.turnUsed === newTurnNumber && !t.usedThisTurn
    );

    const reinforcements = calculateReinforcements(
      nextPlayer.territories.length,
      nextPlayer.characterClass,
      rallyCryActive,
    );

    // Mark rally cry as used if it was active
    let newActiveTactics = state.activeTactics;
    if (rallyCryActive) {
      newActiveTactics = newActiveTactics.map(t =>
        t.tacticId === 'rally_cry' && t.playerId === nextPlayer.id && t.turnUsed === newTurnNumber
          ? { ...t, usedThisTurn: true }
          : t
      );
    }

    const newLog = [...state.battleLog, addLog(state, `--- ${nextPlayer.name}'s turn ---`, 'turn')];

    set({
      phase: 'deploy',
      currentPlayerIndex: actualNext,
      turnNumber: newTurnNumber,
      reinforcementsLeft: reinforcements,
      selectedTerritory: null,
      targetTerritory: null,
      attackerDiceCount: 0,
      defenderDiceCount: 0,
      battleResult: null,
      battleLog: newLog,
      fortifyArmies: 0,
      selectedTactic: null,
      activeTactics: newActiveTactics,
      deployUnitType: 'swordsman',
    });
  },

  startGame: () => set({ phase: 'setup' }),

  resetGame: () => {
    set({
      phase: 'title',
      players: [],
      currentPlayerIndex: 0,
      territories: {},
      selectedTerritory: null,
      targetTerritory: null,
      reinforcementsLeft: 0,
      attackerDiceCount: 0,
      defenderDiceCount: 0,
      battleResult: null,
      battleLog: [],
      winner: null,
      fortifyArmies: 0,
      turnNumber: 0,
      deployUnitType: 'swordsman',
      activeTactics: [],
      selectedTactic: null,
    });
  },

  getCurrentPlayer: () => {
    const state = get();
    return state.players[state.currentPlayerIndex];
  },

  getTerritory: (id) => {
    const state = get();
    return state.territories[id];
  },

  getPlayerById: (id) => {
    const state = get();
    return state.players.find(p => p.id === id);
  },
}));