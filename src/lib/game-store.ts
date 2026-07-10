import { create } from 'zustand';
import { TERRITORIES, PLAYER_CONFIGS, type PlayerConfig, type UnitTypeId, type TacticId, UNIT_TYPES, TACTICS, CHARACTER_CLASSES } from './game-data';
import { stopMusic } from './audio-engine';
import {
  type StoryBeat, type CampaignProgress,
  PROLOGUE, getCharacterIntro, getEliminationBeat, getVictoryBeat,
  CAMPAIGN_EVENTS, type CampaignEvent,
  CHAPTERS, getChapterTitleBeat,
  getFirstBloodBeat, getTerritoryCaptureBeat, getRegionDominanceBeat,
  getRivalClashBeat, getDesperateHourBeat, getDominantForceBeat,
  REGION_LORE,
} from './story-data';
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
  setupGame: (playerConfigs: { name: string; color: string; colorLight: string; characterClass: string; icon: string; isAI?: boolean }[]) => void;

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

  // Story system
  storyBeat: StoryBeat | null;
  storyQueue: StoryBeat[];
  currentEvent: CampaignEvent | null;
  showStory: (beat: StoryBeat) => void;
  queueStory: (beat: StoryBeat) => void;
  dismissStory: () => void;
  rollCampaignEvent: () => void;
  dismissEvent: () => void;
  storySeen: Set<string>;

  // AI Dialogue system
  aiDialogue: {
    speaker: string;
    text: string;
    color: string;
    characterClass: string;
    icon: string;
    portrait: string;
    timestamp: number;
  } | null;
  showAIDialogue: (speaker: string, text: string, color: string, characterClass: string, icon: string, portrait: string) => void;
  dismissAIDialogue: () => void;

  // Campaign mode
  isCampaignMode: boolean;
  campaignProgress: CampaignProgress;
  startCampaign: () => void;
  startSkirmish: () => void;
  checkStoryTriggers: (conqueredTerritoryId?: string | null, attackerId?: string | null, defenderId?: string | null) => void;
  advanceChapter: () => void;
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
  storyBeat: null,
  storyQueue: [],
  currentEvent: null,
  storySeen: new Set(),
  aiDialogue: null,
  isCampaignMode: false,
  campaignProgress: {
    currentChapter: 1,
    totalConquests: 0,
    firstBloodFired: false,
    firedTriggers: new Set(),
    rivalClashes: new Set(),
    regionDominanceFired: new Set(),
    turnStoryFired: new Set(),
  },

  setupGame: (playerConfigs) => {
    const players: Player[] = playerConfigs.map((config, index) => ({
      id: `player-${index}`,
      ...config,
      isAI: config.isAI ?? false,
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

    // Queue story beats: prologue → character intro for player 1
    const humanPlayer = players.find(p => !p.isAI) || players[0];
    const charClass = humanPlayer.characterClass.toLowerCase();
    const playerConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === charClass) || PLAYER_CONFIGS[0];

    const introBeat = getCharacterIntro(
      charClass,
      humanPlayer.name,
      humanPlayer.color,
      humanPlayer.colorLight,
      playerConfig.image
    );

    // Queue story beats: prologue → chapter 1 title → character intro for player 1
    get().showStory(PROLOGUE);

    if (get().isCampaignMode) {
      const chapter1 = CHAPTERS[0];
      const chapterBeat = getChapterTitleBeat(chapter1);
      get().queueStory(chapterBeat);
    }

    get().queueStory(introBeat);
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

          // Queue elimination story for AI players
          if (oldPlayer.isAI) {
            const elimClass = oldPlayer.characterClass.toLowerCase();
            const elimConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === elimClass) || PLAYER_CONFIGS[0];
            const elimBeat = getEliminationBeat(oldPlayer.name, elimClass, oldPlayer.color);
            get().queueStory(elimBeat);
          }
        }
      }
      const newOwnerPlayer = newPlayers.find(p => p.id === newOwner)!;
      newOwnerPlayer.territories.push(state.targetTerritory);

      newLog.push(addLog(state, `🏆 ${attacker.name} conquered ${toTerritory.name} from ${defender.name}!`, 'conquer'));

      // Campaign story triggers on conquest
      if (get().isCampaignMode) {
        get().checkStoryTriggers(state.targetTerritory, fromTerritory.ownerId, toTerritory.ownerId);
      }
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

    // Queue victory story if game ends
    if (winner) {
      const winClass = winner.characterClass.toLowerCase();
      const winConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === winClass) || PLAYER_CONFIGS[0];
      const victoryBeat = getVictoryBeat(winner.name, winClass, winner.color, winner.colorLight, winConfig.image);
      get().queueStory(victoryBeat);
    }

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

    // Roll for campaign event on new turn cycle (only for human player's turn)
    if (newTurnNumber > state.turnNumber && !nextPlayer.isAI) {
      get().rollCampaignEvent();

      // Campaign: check chapter advancement and turn-based triggers
      if (get().isCampaignMode) {
        get().advanceChapter();
      }
    }
  },

  startGame: () => set({ phase: 'setup' }),

  resetGame: () => {
    stopMusic();
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
      storyBeat: null,
      storyQueue: [],
      currentEvent: null,
      storySeen: new Set(),
      aiDialogue: null,
      isCampaignMode: false,
      campaignProgress: {
        currentChapter: 1,
        totalConquests: 0,
        firstBloodFired: false,
        firedTriggers: new Set(),
        rivalClashes: new Set(),
        regionDominanceFired: new Set(),
        turnStoryFired: new Set(),
      },
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

  // Story system
  showStory: (beat) => {
    const state = get();
    if (!state.storyBeat) {
      set({ storyBeat: beat });
    } else {
      set({ storyQueue: [...state.storyQueue, beat] });
    }
  },

  queueStory: (beat) => {
    const state = get();
    set({ storyQueue: [...state.storyQueue, beat] });
  },

  dismissStory: () => {
    const state = get();
    const queue = [...state.storyQueue];
    const seen = new Set(state.storySeen);
    if (state.storyBeat) {
      seen.add(state.storyBeat.id);
    }
    if (queue.length > 0) {
      const next = queue.shift()!;
      // Don't replay seen beats
      if (seen.has(next.id)) {
        // Skip this one and try the next
        set({ storyBeat: queue.length > 0 ? queue.shift()! : null, storyQueue: queue, storySeen: seen });
      } else {
        set({ storyBeat: next, storyQueue: queue, storySeen: seen });
      }
    } else {
      set({ storyBeat: null, storyQueue: queue, storySeen: seen });
    }
  },

  rollCampaignEvent: () => {
    const state = get();
    if (state.phase === 'gameover' || state.storyBeat) return;

    const eligible = CAMPAIGN_EVENTS.filter(e => {
      if (state.turnNumber < e.minTurn) return false;
      if (e.maxTurn && state.turnNumber > e.maxTurn) return false;
      if (state.storySeen.has(e.id)) return false;
      return Math.random() < e.triggerChance;
    });

    if (eligible.length > 0) {
      const event = eligible[Math.floor(Math.random() * eligible.length)];
      const seen = new Set(state.storySeen);
      seen.add(event.id);
      set({ currentEvent: event, storySeen: seen });
    }
  },

  dismissEvent: () => {
    set({ currentEvent: null });
  },

  // Campaign mode functions
  startCampaign: () => {
    set({
      isCampaignMode: true,
      campaignProgress: {
        currentChapter: 1,
        totalConquests: 0,
        firstBloodFired: false,
        firedTriggers: new Set(),
        rivalClashes: new Set(),
        regionDominanceFired: new Set(),
        turnStoryFired: new Set(),
      },
    });
    get().startGame();
  },

  startSkirmish: () => {
    set({ isCampaignMode: false });
    get().startGame();
  },

  advanceChapter: () => {
    const state = get();
    if (!state.isCampaignMode || state.phase === 'gameover' || state.storyBeat) return;
    if (state.storyQueue.length > 0) return; // Don't advance while story is queued

    const progress = { ...state.campaignProgress };
    const humanPlayer = state.players.find(p => !p.isAI) || state.players[0];
    if (!humanPlayer) return;

    const territoryCount = humanPlayer.territories.length;
    const alivePlayers = state.players.filter(p => !p.eliminated).length;

    let newChapter = progress.currentChapter;

    // Chapter 2: First conquest happened
    if (newChapter === 1 && progress.totalConquests >= 1) {
      newChapter = 2;
    }
    // Chapter 3: A player has been eliminated OR turn 8+
    else if (newChapter === 2 && (alivePlayers < state.players.length || state.turnNumber >= 8)) {
      newChapter = 3;
    }
    // Chapter 4: Human has 8+ territories OR only 2 players remain
    else if (newChapter === 3 && (territoryCount >= 8 || alivePlayers <= 2)) {
      newChapter = 4;
    }
    // Chapter 5: Only 2 players remain
    else if (newChapter === 4 && alivePlayers <= 2) {
      newChapter = 5;
    }

    if (newChapter !== progress.currentChapter) {
      progress.currentChapter = newChapter;
      const chapter = CHAPTERS.find(c => c.number === newChapter);
      if (chapter) {
        const beat = getChapterTitleBeat(chapter);
        get().queueStory(beat);
      }
      set({ campaignProgress: progress });
    }
  },

  checkStoryTriggers: (conqueredTerritoryId, attackerId, defenderId) => {
    const state = get();
    if (!state.isCampaignMode || state.phase === 'gameover') return;

    const progress = { ...state.campaignProgress };
    const firedTriggers = new Set(progress.firedTriggers);
    const rivalClashes = new Set(progress.rivalClashes);
    const regionDominanceFired = new Set(progress.regionDominanceFired);

    // Increment conquest counter
    progress.totalConquests = (progress.totalConquests || 0) + 1;

    if (!conqueredTerritoryId || !attackerId || !defenderId) {
      set({ campaignProgress: progress });
      return;
    }

    const attacker = state.players.find(p => p.id === attackerId);
    const defender = state.players.find(p => p.id === defenderId);
    if (!attacker || !defender) return;

    const territory = state.territories[conqueredTerritoryId];
    if (!territory) return;

    // Get config for portrait lookups
    const atkConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === attacker.characterClass.toLowerCase()) || PLAYER_CONFIGS[0];
    const defConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === defender.characterClass.toLowerCase()) || PLAYER_CONFIGS[1];

    // --- FIRST BLOOD ---
    if (!progress.firstBloodFired) {
      progress.firstBloodFired = true;
      const beat = getFirstBloodBeat(
        attacker.name, attacker.characterClass, attacker.color, attacker.colorLight, atkConfig.image,
        defender.name, territory.name
      );
      get().queueStory(beat);
    }

    // --- KEY TERRITORY CAPTURE ---
    const keyTerritoryTriggerId = `territory-${conqueredTerritoryId}`;
    if (!firedTriggers.has(keyTerritoryTriggerId)) {
      const captureBeat = getTerritoryCaptureBeat(
        conqueredTerritoryId, territory.name, attacker.name, attacker.characterClass,
        attacker.color, attacker.colorLight, atkConfig.image
      );
      if (captureBeat) {
        firedTriggers.add(keyTerritoryTriggerId);
        get().queueStory(captureBeat);
      }
    }

    // --- RIVAL CLASH ---
    const clashKey = [attackerId, defenderId].sort().join('-');
    if (!rivalClashes.has(clashKey)) {
      rivalClashes.add(clashKey);
      const clashBeat = getRivalClashBeat(
        attacker.name, attacker.characterClass, attacker.color, atkConfig.image,
        defender.name, defender.characterClass, defender.color, defConfig.image
      );
      get().queueStory(clashBeat);
    }

    // --- REGION DOMINANCE ---
    const region = territory.region;
    if (!regionDominanceFired.has(region)) {
      // Check if attacker now controls all territories in this region
      const regionTerritories = TERRITORIES.filter(t => t.region === region);
      const ownsAll = regionTerritories.every(t => {
        const tState = state.territories[t.id];
        return tState && tState.ownerId === attackerId;
      });
      if (ownsAll && regionTerritories.length >= 2) {
        regionDominanceFired.add(region);
        const lore = REGION_LORE[region] || '';
        const dominanceBeat = getRegionDominanceBeat(region, attacker.name, attacker.color, lore);
        get().queueStory(dominanceBeat);
      }
    }

    // --- DESPERATE HOUR (check all human players) ---
    for (const player of state.players) {
      if (player.isAI || player.eliminated) continue;
      const pConfig = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === player.characterClass.toLowerCase()) || PLAYER_CONFIGS[0];
      const desperateId = `desperate-${player.id}`;
      if (!firedTriggers.has(desperateId) && player.territories.length <= 2 && state.turnNumber >= 3) {
        firedTriggers.add(desperateId);
        const desperateBeat = getDesperateHourBeat(
          player.name, player.characterClass, player.color, player.colorLight, pConfig.image,
          player.territories.length
        );
        get().queueStory(desperateBeat);
      }
    }

    // --- DOMINANT FORCE ---
    for (const player of state.players) {
      if (player.eliminated) continue;
      const dominantId = `dominant-${player.id}`;
      if (!firedTriggers.has(dominantId) && player.territories.length >= 10 && state.turnNumber >= 5) {
        firedTriggers.add(dominantId);
        const dominantBeat = getDominantForceBeat(
          player.name, player.color, player.territories.length, state.players.filter(p => !p.eliminated).length
        );
        get().queueStory(dominantBeat);
      }
    }

    progress.firedTriggers = firedTriggers;
    progress.rivalClashes = rivalClashes;
    progress.regionDominanceFired = regionDominanceFired;
    set({ campaignProgress: progress });
  },

  // AI Dialogue system
  showAIDialogue: (speaker, text, color, characterClass, icon, portrait) => {
    set({
      aiDialogue: {
        speaker,
        text,
        color,
        characterClass,
        icon,
        portrait,
        timestamp: Date.now(),
      },
    });
  },

  dismissAIDialogue: () => {
    set({ aiDialogue: null });
  },
}));