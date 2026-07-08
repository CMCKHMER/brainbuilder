'use client';

import { useGameStore } from '@/lib/game-store';
import { UNIT_TYPE_LIST, type UnitTypeId } from '@/lib/game-data';
import { getUnitCost } from '@/lib/game-logic';
import { UnitCard, UnitComposition } from './UnitCards';

export default function UnitDeployer() {
  const phase = useGameStore(s => s.phase);
  const territories = useGameStore(s => s.territories);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const reinforcementsLeft = useGameStore(s => s.reinforcementsLeft);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const deployUnitType = useGameStore(s => s.deployUnitType);
  const setDeployUnitType = useGameStore(s => s.setDeployUnitType);
  const deployArmy = useGameStore(s => s.deployArmy);

  if (phase !== 'deploy') return null;

  const currentPlayer = players[currentPlayerIndex];
  const selectedTerr = selectedTerritory ? territories[selectedTerritory] : null;
  const isOwnTerritory = selectedTerr?.ownerId === currentPlayer.id;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Unit type selector */}
      <div className="flex items-center gap-1.5">
        {UNIT_TYPE_LIST.map(unit => {
          const cost = getUnitCost(unit.id, currentPlayer.characterClass);
          const canAfford = cost <= reinforcementsLeft;
          const isSelected = deployUnitType === unit.id;

          return (
            <button
              key={unit.id}
              onClick={() => setDeployUnitType(unit.id)}
              disabled={!canAfford}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-md transition-all"
              style={{
                background: isSelected ? `${unit.color}22` : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${isSelected ? unit.color : 'rgba(255,255,255,0.08)'}`,
                opacity: canAfford ? 1 : 0.3,
                cursor: canAfford ? 'pointer' : 'not-allowed',
                boxShadow: isSelected ? `0 0 8px ${unit.color}33` : 'none',
              }}
              title={`${unit.name} - ATK:${unit.attack} DEF:${unit.defense} HP:${unit.health} Cost:${cost}\nStrong vs: ${unit.strongVs.map(t => UNIT_TYPE_LIST.find(u => u.id === t)?.name).join(', ')}\nWeak vs: ${unit.weakVs.map(t => UNIT_TYPE_LIST.find(u => u.id === t)?.name).join(', ')}`}
            >
              <span className="text-lg leading-none">{unit.icon}</span>
              <span className="text-[8px] font-bold" style={{
                color: isSelected ? unit.color : '#8B7355',
                fontFamily: 'var(--font-cinzel), serif',
              }}>
                {unit.name}
              </span>
              <span className="text-[9px] font-bold" style={{
                color: canAfford ? '#D4A017' : '#EF4444',
              }}>
                {cost === 1 ? '★' : '★★'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-white/10 hidden md:block" />

      {/* Selected territory info */}
      {selectedTerr && isOwnTerritory && (
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md" style={{
          background: `${currentPlayer.color}11`,
          border: `1px solid ${currentPlayer.color}33`,
        }}>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold" style={{
              color: currentPlayer.color,
              fontFamily: 'var(--font-cinzel), serif',
            }}>
              {selectedTerr.name}
            </span>
            <UnitComposition units={selectedTerr.units} compact />
          </div>
        </div>
      )}
    </div>
  );
}