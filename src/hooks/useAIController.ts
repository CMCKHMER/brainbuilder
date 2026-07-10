'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '@/lib/game-store';
import { getAIDecisions, type AIDecision } from '@/lib/ai-player';

/**
 * Hook that watches the game state and automatically executes AI turns
 * with visual delays so the player can see what the AI is doing.
 */
export function useAIController() {
  const isRunning = useRef(false);

  const executeDecision = useCallback(async (decision: AIDecision): Promise<boolean> => {
    const store = useGameStore;

    switch (decision.type) {
      case 'deploy': {
        // Handle tactic activation (rally cry etc.)
        if (decision.tacticId) {
          const s = store.getState();
          const available = s.getAvailableTactics();
          if (available.includes(decision.tacticId)) {
            store.getState().activateTactic(decision.tacticId);
            await delay(400);
          }
        }
        // Deploy unit
        if (decision.territoryId && decision.unitType) {
          const s = store.getState();
          const territory = s.territories[decision.territoryId];
          const player = s.players[s.currentPlayerIndex];
          const cost = s.reinforcementsLeft; // will be checked by store
          if (territory && territory.ownerId === player.id) {
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
            store.getState().activateTactic(decision.tacticId);
            await delay(500);
          }
          return true; // Tactic-only decision, don't try to attack
        }
        // Execute attack
        if (decision.territoryId && decision.targetId && decision.diceCount) {
          const s = store.getState();
          // Select source
          store.getState().selectTerritory(decision.territoryId);
          await delay(350);
          // Select target
          store.getState().selectTerritory(decision.targetId);
          await delay(350);
          // Set dice and attack
          store.getState().setAttackerDiceCount(decision.diceCount);
          await delay(300);
          store.getState().executeAttack();
          await delay(600);
          return true;
        }
        return false;
      }

      case 'fortify': {
        if (decision.territoryId && decision.targetId && decision.fortifyCount) {
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
        useGameStore.getState().endAttackPhase();
        await delay(300);
        return true;
      }

      case 'end_fortify': {
        useGameStore.getState().endTurn();
        await delay(300);
        return true;
      }

      default:
        return false;
    }
  }, []);

  useEffect(() => {
    const runAITurn = async () => {
      if (isRunning.current) return;

      const state = useGameStore.getState();
      const currentPlayer = state.players[state.currentPlayerIndex];

      if (!currentPlayer || !currentPlayer.isAI || currentPlayer.eliminated) return;
      if (state.phase === 'gameover' || state.phase === 'title' || state.phase === 'setup') return;

      isRunning.current = true;

      try {
        // Loop through phases for this AI turn
        let phase = state.phase;

        while (phase === 'deploy' || phase === 'attack' || phase === 'fortify') {
          const currentState = useGameStore.getState();
          const currentNow = currentState.players[currentState.currentPlayerIndex];
          if (!currentNow || !currentNow.isAI || currentNow.eliminated) break;
          if (currentState.phase === 'gameover') break;

          phase = currentState.phase;

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

            const result = await executeDecision(decision);
            if (result) didAction = true;
            await delay(250);
          }

          // Auto-advance if AI didn't explicitly end the phase
          const afterState = useGameStore.getState();
          if (afterState.phase === phase) {
            // Still in same phase - need to manually advance
            if (phase === 'deploy') {
              useGameStore.getState().endDeployPhase();
              phase = 'attack';
              await delay(300);
            } else if (phase === 'attack') {
              useGameStore.getState().endAttackPhase();
              phase = 'fortify';
              await delay(300);
            } else if (phase === 'fortify') {
              useGameStore.getState().endTurn();
              phase = 'deploy'; // next player
              await delay(300);
            }
          } else {
            // Phase was changed by a decision (end_attack / end_fortify)
            phase = afterState.phase;
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
  }, [executeDecision]);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}