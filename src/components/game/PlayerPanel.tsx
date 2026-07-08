'use client';

import { useGameStore } from '@/lib/game-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UnitComposition } from './UnitCards';
import TacticsPanel from './TacticsPanel';
import { UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';

export default function PlayerPanel() {
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const phase = useGameStore(s => s.phase);
  const battleLog = useGameStore(s => s.battleLog);
  const territories = useGameStore(s => s.territories);
  const winner = useGameStore(s => s.winner);

  if (phase === 'setup') return null;

  const totalUnits = (playerId: string) =>
    Object.values(territories)
      .filter(t => t.ownerId === playerId)
      .reduce((sum, t) => sum + t.units.length, 0);

  const getPlayerUnitSummary = (playerId: string) => {
    const allUnits = Object.values(territories)
      .filter(t => t.ownerId === playerId)
      .flatMap(t => t.units);
    const counts: Record<string, number> = {};
    for (const u of allUnits) counts[u] = (counts[u] || 0) + 1;
    return Object.entries(counts) as [UnitTypeId, number][];
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Current Turn Banner */}
      {phase !== 'gameover' && players[currentPlayerIndex] && (
        <div
          className="p-3 rounded-lg text-center"
          style={{
            background: `linear-gradient(135deg, ${players[currentPlayerIndex].color}33, ${players[currentPlayerIndex].color}11)`,
            border: `2px solid ${players[currentPlayerIndex].color}`,
          }}
        >
          <div className="text-xs uppercase tracking-wider opacity-70" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Current Turn
          </div>
          <div className="text-lg font-bold mt-1" style={{ color: players[currentPlayerIndex].color, fontFamily: 'var(--font-cinzel), serif' }}>
            {players[currentPlayerIndex].icon} {players[currentPlayerIndex].name}
          </div>
        </div>
      )}

      {/* Winner Banner */}
      {phase === 'gameover' && winner && (
        <div
          className="p-4 rounded-lg text-center"
          style={{
            background: `linear-gradient(135deg, ${winner.color}44, ${winner.color}22)`,
            border: `3px solid ${winner.color}`,
            boxShadow: `0 0 20px ${winner.color}44`,
          }}
        >
          <div className="text-2xl mb-1">👑</div>
          <div className="text-sm uppercase tracking-wider opacity-80" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            Victory!
          </div>
          <div className="text-xl font-bold mt-1" style={{ color: winner.color, fontFamily: 'var(--font-cinzel), serif' }}>
            {winner.name}
          </div>
          <div className="text-xs opacity-60 mt-1">has conquered Aethermoor!</div>
        </div>
      )}

      {/* Player Stats */}
      <div className="text-xs uppercase tracking-wider opacity-60 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Warlords
      </div>
      <div className="flex flex-col gap-2">
        {players.map((player, index) => {
          const unitSummary = getPlayerUnitSummary(player.id);
          return (
            <div
              key={player.id}
              className="flex flex-col gap-1 p-2 rounded-md transition-all"
              style={{
                background: index === currentPlayerIndex && phase !== 'gameover'
                  ? `${player.color}15`
                  : 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${player.color}`,
                opacity: player.eliminated ? 0.35 : 1,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{player.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: player.eliminated ? '#666' : player.color }}>
                    {player.name}
                    {index === currentPlayerIndex && phase !== 'gameover' && (
                      <span className="ml-1 opacity-60">◀</span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-50">
                    {player.characterClass}
                    {player.eliminated ? ' • Eliminated' : ` • ${player.territories.length} lands • ${totalUnits(player.id)} units`}
                  </div>
                </div>
              </div>
              {/* Unit composition summary */}
              {!player.eliminated && unitSummary.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pl-7">
                  {unitSummary.map(([type, count]) => (
                    <span key={type} className="text-[10px] flex items-center gap-0.5" style={{ color: UNIT_TYPES[type].color }}>
                      {UNIT_TYPES[type].icon}{count}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tactics (shown in sidebar for non-lg screens too) */}
      <div className="lg:hidden">
        <TacticsPanel />
      </div>

      {/* Battle Log */}
      <div className="text-xs uppercase tracking-wider opacity-60 mt-3 mb-1" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
        Battle Chronicle
      </div>
      <ScrollArea className="flex-1 min-h-0 game-scroll">
        <div className="flex flex-col gap-1 pr-2">
          {battleLog.length === 0 && (
            <div className="text-xs opacity-30 italic text-center py-4">No battles yet...</div>
          )}
          {[...battleLog].reverse().slice(0, 50).map((entry) => (
            <div
              key={entry.id}
              className="text-[11px] py-1 px-2 rounded"
              style={{
                background: entry.type === 'conquer' ? 'rgba(212,160,23,0.1)' :
                  entry.type === 'attack' ? 'rgba(220,38,38,0.08)' :
                  entry.type === 'tactic' ? 'rgba(168,85,247,0.1)' :
                  'rgba(255,255,255,0.02)',
                borderLeft: entry.type === 'conquer' ? '2px solid #D4A017' :
                  entry.type === 'attack' ? '2px solid #DC262644' :
                  entry.type === 'tactic' ? '2px solid #A855F744' :
                  '2px solid transparent',
                color: entry.type === 'conquer' ? '#D4A017' :
                  entry.type === 'attack' ? '#FCA5A5' :
                  entry.type === 'turn' ? '#D4A017' :
                  entry.type === 'tactic' ? '#D8B4FE' :
                  'rgba(255,255,255,0.5)',
              }}
            >
              {entry.message}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}