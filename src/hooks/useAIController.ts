'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/lib/game-store';
import { getAIDecisions, type AIDecision } from '@/lib/ai-player';
import { getRivalDialogue } from '@/lib/story-data';
import { PLAYER_CONFIGS } from '@/lib/game-data';
import {
  playDiceRoll, playSwordClash, playBattleWin, playBattleLose,
  playConquest, playElimination, playTacticActivate, playSelect,
  playDeploy, playPhaseChange,
} from '@/lib/audio-engine';

/**
 * Hook that watches the game state and automatically executes AI turns
 * with visual delays so the player can see what the AI is doing.
 * Also triggers rival dialogue lines and audio effects.
 */
export function useAIController() {
  const isRunning = useRef(false);
  const dialogueShownThisTurn = useRef(false);

  // Trigger AI dialogue for the current AI player
  const triggerDialogue = useCallback((context: 'turn_start' | 'attacking' | 'defending' | 'losing' | 'winning', playerId: string) => {
    const state = useGameStore.getState();
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAI) return;

    const dialogue = getRivalDialogue(player.characterClass, context, state.turnNumber);
    if (!dialogue) return;

    // Don't spam — only show one per turn for turn_start
    if (context === 'turn_start' && dialogueShownThisTurn.current) return;
    if (context === 'turn_start') dialogueShownThisTurn.current = true;

    const config = PLAYER_CONFIGS.find(p => p.characterClass.toLowerCase() === player.characterClass.toLowerCase()) || PLAYER_CONFIGS[0];
    useGameStore.getState().showAIDialogue(
      player.name,
      dialogue.text,
      player.color,
      player.characterClass,
      player.icon,
      config.image,
    );
  }, []);

  const executeDecision = useCallback(async (decision: AIDecision, playerId: string): Promise<boolean> => {
    const store = useGameStore;

    switch (decision.type) {
      case 'deploy': {
        // Handle tactic activation (rally cry etc.)
        if (decision.tacticId) {
          const s = store.getState();
          const available = s.getAvailableTactics();
          if (available.includes(decision.tacticId)) {
            playTacticActivate();
            store.getState().activateTactic(decision.tacticId);
            await delay(400);
          }
        }
        // Deploy unit
        if (decision.territoryId && decision.unitType) {
          const s = store.getState();
          const territory = s.territories[decision.territoryId];
          const player = s.players[s.currentPlayerIndex];
          if (territory && territory.ownerId === player.id) {
            playDeploy();
            store.getState().setDeployUnitType(decision.unitType);
            store.getState().deployArmy(decision.territoryId, decision.unitType);
            return true;
          }
        }
        return false;
      }

      case 'attack': {
        // Handle tactic activation (for attack-phase tactics)
        if (decision.tacticId) {
          const s = store.getState();
          const available = s.getAvailableTactics();
          if (available.includes(decision.tacticId)) {
            playTacticActivate();
            store.getState().activateTactic(decision.tacticId);
            await delay(500);
          }
          return true; // Tactic-only decision, don't try to attack
        }
        // Execute attack
        if (decision.territoryId && decision.targetId && decision.diceCount) {
          const s = store.getState();

          // Show attacking dialogue before the attack
          triggerDialogue('attacking', playerId);

          // Select source
          playSelect();
          store.getState().selectTerritory(decision.territoryId);
          await delay(350);
          // Select target
          store.getState().selectTerritory(decision.targetId);
          await delay(350);
          // Set dice and attack
          store.getState().setAttackerDiceCount(decision.diceCount);
          await delay(300);

          // Play dice roll and sword clash
          playDiceRoll();
          await delay(400);
          playSwordClash();
          store.getState().executeAttack();
          await delay(600);

          // Check result for audio feedback
          const afterState = useGameStore.getState();
          const result = afterState.battleResult;
          if (result) {
            if (result.conquered) {
              playConquest();
              // Check if defender was eliminated
              const defenderTerritory = afterState.territories[decision.targetId];
              const defenderPlayer = afterState.players.find(p =>
                p.id !== playerId && p.eliminated && !s.players.find(pp => pp.id === p.id && !pp.eliminated)
              );
              if (defenderPlayer) {
                await delay(300);
                playElimination();
              }
            } else {
              // Check who "won" the exchange
              const attackerLostMore = result.attackerLosses > result.defenderLosses;
              if (attackerLostMore) {
                playBattleLose();
                // The defender is being attacked — show defending dialogue for the defender
                const defender = afterState.players.find(p => p.id !== playerId && !p.eliminated);
                if (defender && defender.isAI) {
                  triggerDialogue('defending', defender.id);
                }
              } else {
                playBattleWin();
              }
            }
          }

          return true;
        }
        return false;
      }

      case 'fortify': {
        if (decision.territoryId && decision.targetId && decision.fortifyCount) {
          playSelect();
          // Select source
          useGameStore.getState().selectTerritory(decision.territoryId);
          await delay(350);
          // Select target
          useGameStore.getState().selectTerritory(decision.targetId);
          await delay(300);
          // Set count and execute
          useGameStore.getState().setFortifyArmies(decision.fortifyCount);
          await delay(300);
          useGameStore.getState().executeFortify(decision.territoryId, decision.targetId);
          await delay(400);
          return true;
        }
        return false;
      }

      case 'end_attack': {
        playPhaseChange();
        useGameStore.getState().endAttackPhase();
        await delay(300);
        return true;
      }

      case 'end_fortify': {
        playPhaseChange();
        useGameStore.getState().endTurn();
        await delay(300);
        return true;
      }

      default:
        return false;
    }
  }, [triggerDialogue]);

  useEffect(() => {
    const runAITurn = async () => {
      if (isRunning.current) return;

      const state = useGameStore.getState();
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (!currentPlayer || !currentPlayer.isAI || currentPlayer.eliminated) return;
      if (state.phase === 'gameover' || state.phase === 'title' || state.phase === 'setup') return;

      isRunning.current = true;
      dialogueShownThisTurn.current = false;

      try {
        // Show turn_start dialogue
        triggerDialogue('turn_start', currentPlayer.id);

        // Check for losing/winning contextual dialogue
        const allTerritories = Object.values(state.territories);
        const playerTerritoryCount = allTerritories.filter(t => t.ownerId === currentPlayer.id).length;
        const maxTerritoryCount = Math.max(...state.players.filter(p => !p.eliminated).map(p =>
          allTerritories.filter(t => t.ownerId === p.id).length
        ));

        if (state.turnNumber >= 5) {
          if (playerTerritoryCount <= 3) {
            // AI is losing
            setTimeout(() => triggerDialogue('losing', currentPlayer.id), 1500);
          } else if (playerTerritoryCount === maxTerritoryCount && playerTerritoryCount >= 8) {
            // AI is winning
            setTimeout(() => triggerDialogue('winning', currentPlayer.id), 1500);
          }
        }

        // Play phase change sound
        playPhaseChange();
        await delay(300);

        // Loop through phases for this AI turn
        let phase = state.phase;

        while (phase === 'deploy' || phase === 'attack' || phase === 'fortify') {
          const currentState = useGameStore.getState();
          const currentNow = currentState.players[currentState.currentPlayerIndex];
          if (!currentNow || !currentNow.isAI || currentNow.eliminated) break;
          if (currentState.phase === 'gameover') break;

          phase = currentState.phase as 'deploy' | 'attack' | 'fortify';

          // Get decisions for this phase
          const decisions = getAIDecisions(currentState, currentNow.id);

          let didAction = false;
          for (const decision of decisions) {
            // Re-check phase
            const checkState = useGameStore.getState();
            if (checkState.phase === 'gameover') break;
            if (checkState.phase !== phase) break;
            const checkPlayer = checkState.players[checkState.currentPlayerIndex];
            if (!checkPlayer || !checkPlayer.isAI) break;

            const result = await executeDecision(decision, currentNow.id);
            if (result) didAction = true;
            await delay(250);
          }

          // Auto-advance if AI didn't explicitly end the phase
          const afterState = useGameStore.getState();
          if (afterState.phase === phase) {
            // Still in same phase - need to manually advance
            if (phase === 'deploy') {
              playPhaseChange();
              useGameStore.getState().endDeployPhase();
              phase = 'attack';
              await delay(300);
            } else if (phase === 'attack') {
              playPhaseChange();
              useGameStore.getState().endAttackPhase();
              phase = 'fortify';
              await delay(300);
            } else if (phase === 'fortify') {
              playPhaseChange();
              useGameStore.getState().endTurn();
              phase = 'deploy'; // next player
              await delay(300);
            }
          } else {
            // Phase was changed by a decision (end_attack / end_fortify)
            phase = afterState.phase as 'deploy' | 'attack' | 'fortify';
            await delay(200);
          }
        }
      } catch (e) {
        console.error('AI turn error:', e);
      } finally {
        isRunning.current = false;
      }
    };

    // Subscribe to state changes and trigger AI when needed
    const unsub = useGameStore.subscribe((state) => {
      const currentPlayer = state.players[state.currentPlayerIndex];
      if (
        currentPlayer &&
        currentPlayer.isAI &&
        !currentPlayer.eliminated &&
        state.phase !== 'gameover' &&
        state.phase !== 'title' &&
        state.phase !== 'setup'
      ) {
        if (!isRunning.current) {
          setTimeout(runAITurn, 400);
        }
      }
    });

    // Also trigger on mount in case AI goes first
    const initialState = useGameStore.getState();
    const initialPlayer = initialState.players[initialState.currentPlayerIndex];
    if (
      initialPlayer?.isAI &&
      !initialPlayer.eliminated &&
      initialState.phase !== 'gameover' &&
      initialState.phase !== 'title' &&
      initialState.phase !== 'setup'
    ) {
      setTimeout(runAITurn, 800);
    }

    return unsub;
  }, [executeDecision, triggerDialogue]);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}