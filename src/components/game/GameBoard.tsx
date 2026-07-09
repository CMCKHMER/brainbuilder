'use client';

import GameSetup from '@/components/game/GameSetup';
import PlayerPanel from '@/components/game/PlayerPanel';
import ActionPanel from '@/components/game/ActionPanel';
import { useGameStore } from '@/lib/game-store';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { UnitPortrait } from './UnitCards';
import dynamic from 'next/dynamic';

const GameMap3D = dynamic(() => import('./GameMap3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#060810' }}>
      <span style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017', fontSize: '13px', letterSpacing: '3px', opacity: 0.6 }}>
        LOADING AETHERMOOR...
      </span>
    </div>
  ),
});

// Territory detail overlay on hover - enhanced with unit portraits
function TerritoryTooltip({ territoryId }: { territoryId: string | null }) {
  const territories = useGameStore(s => s.territories);
  const players = useGameStore(s => s.players);

  if (!territoryId) return null;
  const territory = territories[territoryId];
  if (!territory) return null;
  const owner = territory.ownerId ? players.find(p => p.id === territory.ownerId) : null;

  // Count units by type
  const counts: Record<string, number> = {};
  for (const u of territory.units) counts[u] = (counts[u] || 0) + 1;
  const entries = Object.entries(counts) as [UnitTypeId, number][];

  return (
    <div
      className="absolute top-3 left-3 p-3 rounded-lg z-10 pointer-events-none"
      style={{
        background: 'rgba(20,15,8,0.92)',
        border: `1.5px solid ${owner ? owner.color + '66' : 'rgba(139,115,85,0.3)'}`,
        backdropFilter: 'blur(8px)',
        maxWidth: 220,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold" style={{
          color: owner ? owner.color : '#8B7355',
          fontFamily: 'var(--font-cinzel), serif',
        }}>
          {territory.name}
        </span>
        <span className="text-[9px] opacity-40">{territory.region}</span>
      </div>

      {owner && (
        <div className="text-[10px] opacity-50 mb-1.5">
          {owner.icon} {owner.name} • {territory.units.length} units
        </div>
      )}

      {/* Unit list with mini portraits */}
      <div className="flex flex-wrap gap-1.5">
        {entries.map(([type, count]) => (
          <div
            key={type}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded"
            style={{
              background: `${UNIT_TYPES[type].color}22`,
              border: `1px solid ${UNIT_TYPES[type].color}33`,
            }}
          >
            <UnitPortrait unitType={type} size={16} />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold leading-tight" style={{ color: UNIT_TYPES[type].color }}>
                {UNIT_TYPES[type].name}
              </span>
              <span className="text-[8px] opacity-40 leading-tight">
                x{count} • A{UNIT_TYPES[type].attack} D{UNIT_TYPES[type].defense}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameBoard() {
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const resetGame = useGameStore(s => s.resetGame);
  const winner = useGameStore(s => s.winner);
  const turnNumber = useGameStore(s => s.turnNumber);
  const territories = useGameStore(s => s.territories);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);

  // Handle territory hover from 3D map
  const handleTerritoryHover = useCallback((id: string | null) => {
    setHoveredTerritory(id);
  }, []);

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
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
            background: 'rgba(212,160,23,0.15)',
            color: '#D4A017',
            fontFamily: 'var(--font-cinzel), serif',
          }}>
            Turn {turnNumber}
          </span>
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
          <div className="w-full h-full rounded-lg overflow-hidden relative" style={{ border: '2px solid rgba(139,115,85,0.2)' }}>
            <div className="w-full h-full">
              <GameMap3D onTerritoryHover={handleTerritoryHover} />
            </div>
            {/* Territory tooltip */}
            <TerritoryTooltip territoryId={hoveredTerritory || selectedTerritory} />
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
          className="hidden md:flex flex-col w-72 p-3"
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