'use client';

import GameSetup from '@/components/game/GameSetup';
import GameMap from '@/components/game/GameMap';
import PlayerPanel from '@/components/game/PlayerPanel';
import ActionPanel from '@/components/game/ActionPanel';
import { useGameStore } from '@/lib/game-store';
import { Button } from '@/components/ui/button';

export default function GameBoard() {
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const resetGame = useGameStore(s => s.resetGame);
  const winner = useGameStore(s => s.winner);

  if (phase === 'setup') {
    return <GameSetup />;
  }

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #1a1510 0%, #0d1a12 50%, #0a1520 100%)',
      }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 py-2 flex items-center justify-between"
        style={{
          background: 'linear-gradient(180deg, rgba(45,31,16,0.95), rgba(45,31,16,0.8))',
          borderBottom: '2px solid rgba(139,115,85,0.3)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚔️</span>
          <h1
            className="text-lg md:text-xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: '#D4A017',
              textShadow: '0 1px 4px rgba(212,160,23,0.3)',
            }}
          >
            REALM OF AETHERMOOR
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {phase !== 'gameover' && currentPlayer && (
            <div className="hidden md:flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: currentPlayer.color, boxShadow: `0 0 8px ${currentPlayer.color}66` }}
              />
              <span className="text-xs" style={{ fontFamily: 'var(--font-cinzel), serif', color: currentPlayer.color }}>
                {currentPlayer.icon} {currentPlayer.name}&apos;s Turn
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetGame}
            className="text-xs opacity-50 hover:opacity-100"
            style={{ fontFamily: 'var(--font-cinzel), serif', color: '#8B7355' }}
          >
            🔄 New Game
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Map */}
        <div className="flex-1 relative p-2 md:p-4">
          <div className="w-full h-full rounded-lg overflow-hidden" style={{ border: '2px solid rgba(139,115,85,0.2)' }}>
            <GameMap />
          </div>
          {/* Game Over Overlay */}
          {phase === 'gameover' && winner && (
            <div className="absolute inset-2 md:inset-4 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">👑</div>
                <h2
                  className="text-3xl md:text-4xl font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    color: winner.color,
                    textShadow: `0 0 30px ${winner.color}66`,
                  }}
                >
                  {winner.name} Wins!
                </h2>
                <p className="text-sm opacity-50 mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  The continent of Aethermoor has been conquered
                </p>
                <Button
                  onClick={resetGame}
                  size="lg"
                  className="px-8 py-5"
                  style={{
                    background: 'linear-gradient(135deg, #D4A017, #8B6914)',
                    color: '#1a0f00',
                    fontFamily: 'var(--font-cinzel), serif',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    border: '2px solid #FDE68A44',
                  }}
                >
                  ⚔️ Play Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Player Panel */}
        <aside
          className="hidden md:flex flex-col w-64 p-3"
          style={{
            background: 'linear-gradient(180deg, rgba(30,20,10,0.9), rgba(20,15,8,0.95))',
            borderLeft: '2px solid rgba(139,115,85,0.2)',
          }}
        >
          <PlayerPanel />
        </aside>
      </div>

      {/* Action Panel (Bottom) */}
      <ActionPanel />
    </div>
  );
}