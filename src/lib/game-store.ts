import { create } from 'zustand';
import { TERRITORIES, PLAYER_CONFIGS, type PlayerConfig } from './game-data';
import {
  type GamePhase,
  type Player,
  type TerritoryState,
  type BattleResult,
  type BattleLogEntry,
  calculateReinforcements,
  getMaxAttackerDice,
  getMaxDefenderDice,
  resolveBattle,
  rollDice,
} from './game-logic';

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

  // Setup
  setupGame: (playerConfigs: { name: string; color: string; colorLight: string; characterClass: string; icon: string }[]) => void;

  // Deploy
  deployArmy: (territoryId: string) => void;

  // Attack
  selectTerritory: (territoryId: string) => void;
  clearSelection: () => void;
  setAttackerDiceCount: (count: number) => void;
  executeAttack: () => void;

  // Fortify
  setFortifyArmies: (count: number) => void;
  executeFortify: (fromId: string, toId: string) => void;

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

  // Each territory gets 1 army initially, distributed evenly among players
  for (let i = 0; i < territoryIds.length; i++) {
    const def = TERRITORIES.find(t => t.id === territoryIds[i])!;
    const playerIndex = i % playerCount;
    territories[territoryIds[i]] = {
      ...def,
      ownerId: players[playerIndex].id,
      armies: 1,
    };
  }

  // Give each player bonus armies to reach minimum 3 armies per territory on average
  const territoriesPerPlayer = Math.floor(16 / playerCount);
  for (const player of players) {
    const playerTerritories = Object.values(territories).filter(t => t.ownerId === player.id);
    const bonusArmies = Math.max(0, Math.ceil(territoriesPerPlayer / 2));
    for (let i = 0; i < bonusArmies; i++) {
      const randomTerritory = playerTerritories[Math.floor(Math.random() * playerTerritories.length)];
      territories[randomTerritory.id].armies += 1;
    }
  }

  return territories;
}

export const useGameStore = create<GameState>((set, get) => ({
  phase: 'setup',
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
      reinforcementsLeft: calculateReinforcements(
        players[0].territories.length,
        players[0].characterClass
      ),
      attackerDiceCount: 0,
      defenderDiceCount: 0,
      fortifyArmies: 0,
    });
  },

  deployArmy: (territoryId) => {
    const state = get();
    if (state.phase !== 'deploy' || state.reinforcementsLeft <= 0) return;

    const territory = state.territories[territoryId];
    if (!territory || territory.ownerId !== state.players[state.currentPlayerIndex].id) return;

    const newTerritories = { ...state.territories };
    newTerritories[territoryId] = {
      ...territory,
      armies: territory.armies + 1,
    };

    const newReinforcements = state.reinforcementsLeft - 1;
    const newLog = [...state.battleLog, addLog(state, `${territory.name}: +1 army deployed`, 'deploy')];

    set({
      territories: newTerritories,
      reinforcementsLeft: newReinforcements,
      battleLog: newLog,
      selectedTerritory: null,
    });
  },

  selectTerritory: (territoryId) => {
    const state = get();
    const territory = state.territories[territoryId];
    if (!territory) return;
    const currentPlayer = state.players[state.currentPlayerIndex];

    if (state.phase === 'attack') {
      if (state.selectedTerritory === null) {
        // Select own territory to attack from
        if (territory.ownerId === currentPlayer.id && territory.armies > 1) {
          set({
            selectedTerritory: territoryId,
            targetTerritory: null,
            attackerDiceCount: 0,
            battleResult: null,
          });
        }
      } else if (state.selectedTerritory === territoryId) {
        // Deselect
        set({ selectedTerritory: null, targetTerritory: null, attackerDiceCount: 0, battleResult: null });
      } else if (territory.ownerId !== currentPlayer.id) {
        // Check if adjacent to selected
        const selectedTerritory = state.territories[state.selectedTerritory];
        if (selectedTerritory.adjacentTo.includes(territoryId)) {
          set({
            targetTerritory: territoryId,
            defenderDiceCount: getMaxDefenderDice(territory.armies),
          });
        }
      } else if (territory.ownerId === currentPlayer.id && territory.armies > 1) {
        // Switch to different attacking territory
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
        if (territory.ownerId === currentPlayer.id && territory.armies > 1) {
          set({
            selectedTerritory: territoryId,
            targetTerritory: null,
            fortifyArmies: territory.armies - 1,
          });
        }
      } else if (state.selectedTerritory === territoryId) {
        set({ selectedTerritory: null, targetTerritory: null, fortifyArmies: 0 });
      } else if (territory.ownerId === currentPlayer.id) {
        const selectedTerritory = state.territories[state.selectedTerritory];
        if (selectedTerritory.adjacentTo.includes(territoryId)) {
          set({
            targetTerritory: territoryId,
            fortifyArmies: Math.min(state.fortifyArmies, selectedTerritory.armies - 1),
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
    const isPaladinDefender = defender.characterClass === 'paladin';

    const result = resolveBattle(
      state.attackerDiceCount,
      state.defenderDiceCount,
      attacker.characterClass,
      defender.characterClass,
      isPaladinDefender
    );

    const newTerritories = { ...state.territories };
    const newPlayers = state.players.map(p => ({ ...p, territories: [...p.territories] }));

    // Apply losses
    newTerritories[state.selectedTerritory] = {
      ...fromTerritory,
      armies: fromTerritory.armies - result.attackerLosses,
    };
    newTerritories[state.targetTerritory] = {
      ...toTerritory,
      armies: toTerritory.armies - result.defenderLosses,
    };

    let newLog = [...state.battleLog];
    let conquered = false;

    if (newTerritories[state.targetTerritory].armies <= 0) {
      // Territory conquered!
      conquered = true;
      const movingArmies = state.attackerDiceCount;

      // Transfer ownership
      const oldOwner = newTerritories[state.targetTerritory].ownerId;
      const newOwner = newTerritories[state.selectedTerritory].ownerId;

      newTerritories[state.targetTerritory] = {
        ...newTerritories[state.targetTerritory],
        ownerId: newOwner,
        armies: movingArmies,
      };
      newTerritories[state.selectedTerritory] = {
        ...newTerritories[state.selectedTerritory],
        armies: newTerritories[state.selectedTerritory].armies - movingArmies,
      };

      // Update player territory lists
      if (oldOwner) {
        const oldPlayer = newPlayers.find(p => p.id === oldOwner)!;
        oldPlayer.territories = oldPlayer.territories.filter(id => id !== state.targetTerritory);
        // Check elimination
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
        `⚔️ ${attacker.name} → ${defender.name}: Attacker lost ${result.attackerLosses}, Defender lost ${result.defenderLosses}`,
        'attack'
      ));
    }

    const battleResult: BattleResult = {
      ...result,
      conquered,
      fromTerritory: state.selectedTerritory,
      toTerritory: state.targetTerritory,
    };

    // Check win condition
    const winner = newPlayers.find(p => !p.eliminated && p.territories.length === 16) || null;

    // Update selected territory army count for next potential attack
    const maxAttack = getMaxAttackerDice(newTerritories[state.selectedTerritory].armies);
    const maxDefend = getMaxDefenderDice(newTerritories[state.targetTerritory].armies);

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
    });
  },

  setFortifyArmies: (count) => set({ fortifyArmies: count }),

  executeFortify: (fromId, toId) => {
    const state = get();
    if (state.fortifyArmies <= 0) return;

    const newTerritories = { ...state.territories };
    newTerritories[fromId] = {
      ...newTerritories[fromId],
      armies: newTerritories[fromId].armies - state.fortifyArmies,
    };
    newTerritories[toId] = {
      ...newTerritories[toId],
      armies: newTerritories[toId].armies + state.fortifyArmies,
    };

    const fromName = newTerritories[fromId].name;
    const toName = newTerritories[toId].name;
    const newLog = [...state.battleLog, addLog(state, `🛡️ ${state.fortifyArmies} armies moved: ${fromName} → ${toName}`, 'fortify')];

    set({
      territories: newTerritories,
      battleLog: newLog,
      selectedTerritory: null,
      targetTerritory: null,
      fortifyArmies: 0,
    });
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

    // Skip eliminated players
    while (state.players[actualNext].eliminated && safety < 10) {
      actualNext = (actualNext + 1) % state.players.length;
      safety++;
    }

    const nextPlayer = state.players[actualNext];
    const reinforcements = calculateReinforcements(
      nextPlayer.territories.length,
      nextPlayer.characterClass
    );

    const newLog = [...state.battleLog, addLog(state, `--- ${nextPlayer.name}'s turn ---`, 'turn')];

    set({
      phase: 'deploy',
      currentPlayerIndex: actualNext,
      reinforcementsLeft: reinforcements,
      selectedTerritory: null,
      targetTerritory: null,
      attackerDiceCount: 0,
      defenderDiceCount: 0,
      battleResult: null,
      battleLog: newLog,
      fortifyArmies: 0,
    });
  },

  resetGame: () => {
    set({
      phase: 'setup',
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