'use client';

import { useMemo } from 'react';
import type { BattleResult } from '@/lib/game-logic';

interface DiceDisplayProps {
  result: BattleResult | null;
  attackerColor: string;
  defenderColor: string;
  attackerName: string;
  defenderName: string;
}

function DieFace({ value, color, size = 56 }: { value: number; color: string; size?: number }) {
  const pipPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
  };

  const pips = pipPositions[value] || [];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md">
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="12"
        ry="12"
        fill="#FDF8EF"
        stroke={color}
        strokeWidth="4"
      />
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="10"
        ry="10"
        fill="none"
        stroke={`${color}33`}
        strokeWidth="1"
      />
      {pips.map(([px, py], i) => (
        <circle
          key={i}
          cx={px}
          cy={py}
          r="10"
          fill={color}
          opacity="0.9"
        />
      ))}
    </svg>
  );
}

export default function DiceDisplay({
  result,
  attackerColor,
  defenderColor,
  attackerName,
  defenderName,
}: DiceDisplayProps) {
  const comparisons = useMemo(() => {
    if (!result) return [];
    const count = Math.min(result.attackerRolls.length, result.defenderRolls.length);
    return Array.from({ length: count }, (_, i) => ({
      attacker: result.attackerRolls[i],
      defender: result.defenderRolls[i],
      attackerWins: result.attackerRolls[i] > result.defenderRolls[i],
    }));
  }, [result]);

  if (!result) return null;

  const extraAttackerDice = result.attackerRolls.length - comparisons.length;

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Dice comparison rows */}
      {comparisons.map((comp, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <DieFace value={comp.attacker} color={attackerColor} size={48} />
          </div>

          <div
            className="text-xl font-bold w-10 text-center"
            style={{ color: comp.attackerWins ? '#22C55E' : '#EF4444' }}
          >
            {comp.attackerWins ? '✓' : '✗'}
          </div>

          <div className="flex items-center gap-2">
            <DieFace value={comp.defender} color={defenderColor} size={48} />
          </div>
        </div>
      ))}

      {/* Extra attacker dice (not compared) */}
      {extraAttackerDice > 0 && (
        <div className="flex items-center gap-4 opacity-50">
          <div className="flex items-center gap-2">
            <DieFace
              value={result.attackerRolls[comparisons.length]}
              color={attackerColor}
              size={48}
            />
          </div>
          <div className="w-10" />
          <div className="w-12 h-12" />
        </div>
      )}

      {/* Result summary */}
      <div className="flex gap-6 mt-1 text-sm font-semibold">
        <span style={{ color: attackerColor }}>
          -{result.attackerLosses} army{result.attackerLosses !== 1 ? 'ies' : 'y'}
        </span>
        {result.conquered && (
          <span style={{ color: '#D4A017' }} className="text-base font-bold">
            🏰 CONQUERED!
          </span>
        )}
        <span style={{ color: defenderColor }}>
          -{result.defenderLosses} army{result.defenderLosses !== 1 ? 'ies' : 'y'}
        </span>
      </div>
    </div>
  );
}