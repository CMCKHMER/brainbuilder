'use client';

import { useGameStore } from '@/lib/game-store';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PlayerPanel() {
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const phase = useGameStore(s => s.phase);
  const battleLog = useGameStore(s => s.battleLog);
  const territories = useGameStore(s => s.territories);
  const winner = useGameStore(s => s.winner);

  if (phase === 'setup') return null;

  const totalArmies = (playerId: string) =>
    Object.values(territories)
      .filter(t => t.ownerId === playerId)
      .reduce((sum, t) => sum + t.armies, 0);

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
        {players.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center gap-2 p-2 rounded-md transition-all"
            style={{
              background: index === currentPlayerIndex && phase !== 'gameover'
                ? `${player.color}15`
                : 'rgba(255,255,255,0.03)',
              borderLeft: `3px solid ${player.color}`,
              opacity: player.eliminated ? 0.35 : 1,
            }}
          >
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
                {player.eliminated ? ' • Eliminated' : ` • ${player.territories.length} lands • ${totalArmies(player.id)} troops`}
              </div>
            </div>
          </div>
        ))}
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
          {[...battleLog].reverse().map((entry) => (
            <div
              key={entry.id}
              className="text-[11px] py-1 px-2 rounded"
              style={{
                background: entry.type === 'conquer' ? 'rgba(212,160,23,0.1)' :
                  entry.type === 'attack' ? 'rgba(220,38,38,0.08)' :
                  'rgba(255,255,255,0.02)',
                borderLeft: entry.type === 'conquer' ? '2px solid #D4A017' :
                  entry.type === 'attack' ? '2px solid #DC262644' :
                  '2px solid transparent',
                color: entry.type === 'conquer' ? '#D4A017' :
                  entry.type === 'attack' ? '#FCA5A5' :
                  entry.type === 'turn' ? '#D4A017' :
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