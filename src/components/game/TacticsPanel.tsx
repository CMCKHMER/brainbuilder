'use client';

import { useGameStore } from '@/lib/game-store';
import { TACTICS, TACTIC_LIST, type TacticId, UNIT_TYPES } from '@/lib/game-data';

export default function TacticsPanel() {
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const territories = useGameStore(s => s.territories);
  const activeTactics = useGameStore(s => s.activeTactics);
  const selectedTactic = useGameStore(s => s.selectedTactic);
  const activateTactic = useGameStore(s => s.activateTactic);
  const turnNumber = useGameStore(s => s.turnNumber);

  if (phase === 'setup' || phase === 'gameover') return null;

  const currentPlayer = players[currentPlayerIndex];
  const playerTerritories = Object.values(territories).filter(t => t.ownerId === currentPlayer.id);
  const playerUnits = playerTerritories.flatMap(t => t.units);

  const getPlayerUnitTypes = () => {
    const types = new Set(playerUnits);
    return types;
  };

  const playerUnitTypes = getPlayerUnitTypes();

  const getTacticStatus = (tacticId: TacticId): {
    available: boolean;
    onCooldown: boolean;
    cooldownLeft: number;
    active: boolean;
    hasRequiredUnit: boolean;
    reason?: string;
  } => {
    const tactic = TACTICS[tacticId];
    const existing = activeTactics.find(t => t.tacticId === tacticId && t.playerId === currentPlayer.id);
    const hasRequired = !tactic.requires || playerUnitTypes.has(tactic.requires);
    const isActive = selectedTactic === tacticId;

    if (existing) {
      const turnsSinceUse = turnNumber - existing.turnUsed;
      const onCooldown = turnsSinceUse < existing.turnsUntilAvailable;
      const cooldownLeft = onCooldown ? existing.turnsUntilAvailable - turnsSinceUse : 0;
      const usedThisTurn = existing.usedThisTurn;

      return {
        available: !onCooldown && !usedThisTurn && hasRequired,
        onCooldown,
        cooldownLeft,
        active: isActive,
        hasRequiredUnit: hasRequired,
        reason: !hasRequired ? `Requires ${UNIT_TYPES[tactic.requires!].name}` :
          usedThisTurn ? 'Already used this turn' :
          onCooldown ? `Cooldown: ${cooldownLeft} turn${cooldownLeft > 1 ? 's' : ''}` : undefined,
      };
    }

    return {
      available: hasRequired,
      onCooldown: false,
      cooldownLeft: 0,
      active: isActive,
      hasRequiredUnit: hasRequired,
      reason: !hasRequired ? `Requires ${UNIT_TYPES[tactic.requires!].name}` : undefined,
    };
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] uppercase tracking-wider" style={{
          fontFamily: 'var(--font-cinzel), serif',
          color: '#D4A017',
        }}>
          Military Tactics
        </span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(212,160,23,0.3), transparent)' }} />
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {TACTIC_LIST.map(tactic => {
          const status = getTacticStatus(tactic.id);
          const phaseMatch = (phase === 'deploy' && tactic.phase === 'deploy') ||
            (phase === 'attack' && tactic.phase === 'attack') ||
            tactic.phase === 'defense';

          return (
            <button
              key={tactic.id}
              onClick={() => status.available && activateTactic(tactic.id)}
              disabled={!status.available || !phaseMatch}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all text-left"
              style={{
                background: status.active
                  ? `${tactic.color}22`
                  : 'rgba(255,255,255,0.03)',
                border: status.active
                  ? `1.5px solid ${tactic.color}`
                  : `1px solid rgba(255,255,255,0.06)`,
                opacity: status.available && phaseMatch ? 1 : 0.3,
                cursor: status.available && phaseMatch ? 'pointer' : 'not-allowed',
                boxShadow: status.active ? `0 0 8px ${tactic.color}33` : 'none',
              }}
              title={`${tactic.name}\n${tactic.description}\n${status.reason || ''}\nCooldown: ${tactic.cooldown} turns`}
            >
              <span className="text-sm leading-none">{tactic.icon}</span>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold leading-tight" style={{
                  color: status.active ? tactic.color : '#8B7355',
                  fontFamily: 'var(--font-cinzel), serif',
                }}>
                  {tactic.name}
                </span>
                <span className="text-[8px] opacity-50 leading-tight">{tactic.effect}</span>
                {status.onCooldown && (
                  <span className="text-[8px] text-red-400 leading-tight">
                    CD: {status.cooldownLeft}T
                  </span>
                )}
                {!status.hasRequiredUnit && (
                  <span className="text-[8px] text-amber-400 leading-tight">
                    No {UNIT_TYPES[tactic.requires!].name}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}