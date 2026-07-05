'use client';

import { useGameStore } from '@/lib/game-store';
import { useMemo } from 'react';

const OCEAN_COLOR = '#1a3a4a';
const UNOWNED_COLOR = '#4a4a3a';
const BORDER_COLOR = '#2D1F10';
const SELECTED_GLOW = '#FFD700';
const ATTACK_TARGET_COLOR = '#FF0000';

export default function GameMap() {
  const territories = useGameStore(s => s.territories);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const targetTerritory = useGameStore(s => s.targetTerritory);
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const selectTerritory = useGameStore(s => s.selectTerritory);
  const deployArmy = useGameStore(s => s.deployArmy);
  const reinforcementsLeft = useGameStore(s => s.reinforcementsLeft);

  const playerColorMap = useMemo(() => {
    const map: Record<string, { color: string; colorLight: string }> = {};
    players.forEach(p => {
      map[p.id] = { color: p.color, colorLight: p.colorLight };
    });
    return map;
  }, [players]);

  const currentPlayerId = phase !== 'setup' && phase !== 'gameover'
    ? players[useGameStore.getState().currentPlayerIndex]?.id
    : null;

  const handleTerritoryClick = (territoryId: string) => {
    if (phase === 'deploy') {
      const territory = territories[territoryId];
      if (territory.ownerId === currentPlayerId && reinforcementsLeft > 0) {
        deployArmy(territoryId);
      }
    } else if (phase === 'attack' || phase === 'fortify') {
      selectTerritory(territoryId);
    }
  };

  const getTerritoryFill = (territoryId: string): string => {
    const territory = territories[territoryId];
    if (!territory || !territory.ownerId) return UNOWNED_COLOR;
    return playerColorMap[territory.ownerId]?.colorLight || UNOWNED_COLOR;
  };

  const getTerritoryStroke = (territoryId: string): string => {
    if (territoryId === selectedTerritory) return SELECTED_GLOW;
    if (territoryId === targetTerritory) return ATTACK_TARGET_COLOR;
    return BORDER_COLOR;
  };

  const getTerritoryStrokeWidth = (territoryId: string): number => {
    if (territoryId === selectedTerritory || territoryId === targetTerritory) return 3;
    return 1.5;
  };

  const isSelectable = (territoryId: string): boolean => {
    if (phase === 'deploy') {
      const t = territories[territoryId];
      return t.ownerId === currentPlayerId && reinforcementsLeft > 0;
    }
    if (phase === 'attack') {
      const t = territories[territoryId];
      if (selectedTerritory === null) {
        return t.ownerId === currentPlayerId && t.armies > 1;
      }
      if (territoryId === selectedTerritory) return true;
      if (t.ownerId !== currentPlayerId) {
        return territories[selectedTerritory].adjacentTo.includes(territoryId);
      }
      return t.ownerId === currentPlayerId && t.armies > 1;
    }
    if (phase === 'fortify') {
      const t = territories[territoryId];
      if (selectedTerritory === null) {
        return t.ownerId === currentPlayerId && t.armies > 1;
      }
      if (territoryId === selectedTerritory) return true;
      if (t.ownerId === currentPlayerId && selectedTerritory !== null) {
        return territories[selectedTerritory].adjacentTo.includes(territoryId);
      }
      return false;
    }
    return false;
  };

  // Draw connection lines between adjacent territories (subtle dotted lines)
  const connectionLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
    const drawn = new Set<string>();
    for (const t of Object.values(territories)) {
      for (const adjId of t.adjacentTo) {
        const key = [t.id, adjId].sort().join('-');
        if (!drawn.has(key)) {
          drawn.add(key);
          const adj = territories[adjId];
          if (adj) {
            lines.push({ x1: t.labelX, y1: t.labelY, x2: adj.labelX, y2: adj.labelY });
          }
        }
      }
    }
    return lines;
  }, [territories]);

  return (
    <svg
      viewBox="0 0 1000 650"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
    >
      {/* Ocean background */}
      <path d="M 0 0 L 1000 0 L 1000 650 L 0 650 Z" fill={OCEAN_COLOR} />

      {/* Ocean texture lines */}
      {[50, 120, 200, 300, 400, 500, 600].map((y, i) => (
        <path
          key={`wave-${i}`}
          d={`M 0 ${y} Q 100 ${y + 8} 200 ${y} Q 300 ${y - 8} 400 ${y} Q 500 ${y + 8} 600 ${y} Q 700 ${y - 8} 800 ${y} Q 900 ${y + 8} 1000 ${y}`}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Connection lines between territories */}
      {connectionLines.map((line, i) => (
        <line
          key={`conn-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="rgba(139,115,85,0.25)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Territory polygons */}
      {Object.values(territories).map(territory => {
        const fill = getTerritoryFill(territory.id);
        const stroke = getTerritoryStroke(territory.id);
        const strokeWidth = getTerritoryStrokeWidth(territory.id);
        const selectable = isSelectable(territory.id);
        const ownerColor = territory.ownerId ? playerColorMap[territory.ownerId]?.color : null;

        return (
          <g key={territory.id}>
            <path
              d={territory.path}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              className={selectable ? 'cursor-pointer' : ''}
              style={{
                transition: 'all 0.2s ease',
                opacity: selectable ? 1 : phase === 'attack' || phase === 'fortify' ? 0.7 : 1,
              }}
              onClick={() => handleTerritoryClick(territory.id)}
              onMouseEnter={(e) => {
                if (selectable) {
                  (e.currentTarget as SVGPathElement).style.filter = 'brightness(1.15)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as SVGPathElement).style.filter = '';
              }}
            />
            {/* Selected glow effect */}
            {territory.id === selectedTerritory && (
              <path
                d={territory.path}
                fill="none"
                stroke={SELECTED_GLOW}
                strokeWidth="5"
                strokeLinejoin="round"
                opacity="0.5"
                style={{ animation: 'pulse-red 1.5s ease-in-out infinite' }}
              />
            )}
            {/* Attack target pulse */}
            {territory.id === targetTerritory && (
              <path
                d={territory.path}
                fill="none"
                stroke={ATTACK_TARGET_COLOR}
                strokeWidth="5"
                strokeLinejoin="round"
                opacity="0.5"
                style={{ animation: 'pulse-red 1s ease-in-out infinite' }}
              />
            )}

            {/* Territory name */}
            <text
              x={territory.labelX}
              y={territory.labelY - 8}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--font-cinzel), serif"
              fill="rgba(255,255,255,0.9)"
              style={{ pointerEvents: 'none', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
            >
              {territory.name}
            </text>

            {/* Army count circle */}
            <circle
              cx={territory.labelX}
              cy={territory.labelY + 10}
              r="12"
              fill={ownerColor || '#666'}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="1.5"
              style={{ pointerEvents: 'none' }}
            />
            <text
              x={territory.labelX}
              y={territory.labelY + 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="bold"
              fill="white"
              style={{ pointerEvents: 'none', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
            >
              {territory.armies}
            </text>
          </g>
        );
      })}

      {/* Compass Rose */}
      <g transform="translate(920, 560)">
        <circle cx="0" cy="0" r="30" fill="rgba(0,0,0,0.3)" stroke="#8B7355" strokeWidth="1" />
        <text x="0" y="-18" textAnchor="middle" fontSize="10" fontFamily="var(--font-cinzel), serif" fill="#D4A017">N</text>
        <text x="0" y="25" textAnchor="middle" fontSize="8" fontFamily="var(--font-cinzel), serif" fill="#8B7355">S</text>
        <text x="20" y="4" textAnchor="middle" fontSize="8" fontFamily="var(--font-cinzel), serif" fill="#8B7355">E</text>
        <text x="-20" y="4" textAnchor="middle" fontSize="8" fontFamily="var(--font-cinzel), serif" fill="#8B7355">W</text>
        <line x1="0" y1="-14" x2="0" y2="14" stroke="#D4A017" strokeWidth="1" opacity="0.6" />
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Map Title */}
      <text
        x="500"
        y="640"
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--font-cinzel), serif"
        fill="rgba(212,160,23,0.5)"
        letterSpacing="4"
      >
        THE CONTINENT OF AETHERMOOR
      </text>
    </svg>
  );
}