'use client';

import { UNIT_TYPES, UNIT_TYPE_LIST, type UnitTypeId, type UnitType } from '@/lib/game-data';
import { getUnitCost } from '@/lib/game-logic';
import Image from 'next/image';

// ========================================
// UNIT PORTRAIT - Shows the generated unit image
// ========================================

interface UnitPortraitProps {
  unitType: UnitTypeId;
  size?: number;
  className?: string;
  showFallback?: boolean;
}

export function UnitPortrait({ unitType, size = 40, className = '', showFallback = true }: UnitPortraitProps) {
  const unit = UNIT_TYPES[unitType];

  if (unit.image) {
    return (
      <div
        className={`relative rounded-md overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={unit.image}
          alt={unit.name}
          width={size}
          height={size}
          className="object-cover"
          unoptimized
        />
        <div
          className="absolute inset-0 rounded-md"
          style={{
            boxShadow: `inset 0 0 ${size/4}px rgba(0,0,0,0.3)`,
          }}
        />
      </div>
    );
  }

  // Fallback to emoji icon
  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center rounded-md ${className}`}
        style={{
          width: size,
          height: size,
          background: unit.gradient,
          fontSize: size * 0.5,
        }}
      >
        {unit.icon}
      </div>
    );
  }

  return null;
}

// ========================================
// STAT BAR - Visual stat bar component
// ========================================

function StatBar({ label, value, maxValue, color }: { label: string; value: number; maxValue: number; color: string }) {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] w-5 text-right font-bold" style={{ color, fontFamily: 'var(--font-cinzel), serif' }}>
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: color, boxShadow: `0 0 4px ${color}66` }}
        />
      </div>
      <span className="text-[9px] font-bold w-3" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

// ========================================
// UNIT CARD - Full stat card with portrait for unit reference
// ========================================

interface UnitCardProps {
  unitType: UnitType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showCost?: boolean;
  characterClass?: string;
  dimmed?: boolean;
}

export function UnitCard({ unitType, size = 'md', selected, onClick, disabled, showCost, characterClass, dimmed }: UnitCardProps) {
  const sizes = {
    sm: 'w-16 p-1',
    md: 'w-24 p-2',
    lg: 'w-32 p-2.5',
    xl: 'w-40 p-3',
  };

  const portraitSizes = {
    sm: 32,
    md: 44,
    lg: 56,
    xl: 72,
  };

  const cost = characterClass ? getUnitCost(unitType.id, characterClass) : unitType.cost;

  return (
    <div
      className={`${sizes[size]} rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center gap-1`}
      style={{
        background: selected
          ? `linear-gradient(135deg, ${unitType.color}44, ${unitType.color}22)`
          : dimmed
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(255,255,255,0.06)',
        border: selected
          ? `2px solid ${unitType.color}`
          : `1.5px solid rgba(255,255,255,0.1)`,
        opacity: disabled ? 0.35 : dimmed ? 0.5 : 1,
        boxShadow: selected ? `0 0 12px ${unitType.color}44` : 'none',
        transform: selected ? 'scale(1.05)' : 'none',
      }}
      onClick={disabled ? undefined : onClick}
    >
      {/* Unit portrait */}
      <div className="relative">
        <UnitPortrait unitType={unitType.id} size={portraitSizes[size]} />
        {/* Role tag */}
        {size !== 'sm' && (
          <div
            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 px-1 rounded text-[7px] font-bold whitespace-nowrap"
            style={{
              background: unitType.color + 'CC',
              color: '#fff',
              fontFamily: 'var(--font-cinzel), serif',
              textShadow: '0 1px 1px rgba(0,0,0,0.5)',
            }}
          >
            {unitType.role}
          </div>
        )}
      </div>

      {/* Name */}
      <div
        className="text-[10px] font-bold text-center leading-tight mt-0.5"
        style={{ color: unitType.color, fontFamily: 'var(--font-cinzel), serif' }}
      >
        {unitType.name}
      </div>

      {/* Stats - for md and above */}
      {(size === 'md' || size === 'lg' || size === 'xl') && (
        <div className="flex gap-1.5 text-[9px] w-full justify-center">
          <span style={{ color: '#EF4444' }}>⚔{unitType.attack}</span>
          <span style={{ color: '#60A5FA' }}>🛡{unitType.defense}</span>
          <span style={{ color: '#22C55E' }}>♥{unitType.health}</span>
          {showCost && (
            <span style={{ color: '#D4A017' }}>★{cost}</span>
          )}
        </div>
      )}

      {/* Full stat bars for xl */}
      {size === 'xl' && (
        <div className="w-full flex flex-col gap-0.5">
          <StatBar label="ATK" value={unitType.attack} maxValue={7} color="#EF4444" />
          <StatBar label="DEF" value={unitType.defense} maxValue={7} color="#60A5FA" />
          <StatBar label="HP" value={unitType.health} maxValue={7} color="#22C55E" />
          <StatBar label="SPD" value={unitType.speed} maxValue={5} color="#FBBF24" />
          {showCost && (
            <div className="text-center mt-1">
              <span className="text-[10px] font-bold" style={{ color: '#D4A017' }}>
                Cost: {cost === 1 ? '★' : '★★'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ========================================
// UNIT BADGE - Small inline unit icon for map/territory
// ========================================

interface UnitBadgeProps {
  unitType: UnitTypeId;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export function UnitBadge({ unitType, count = 1, size = 16, showCount = true }: UnitBadgeProps) {
  const unit = UNIT_TYPES[unitType];
  return (
    <div className="flex items-center gap-0.5" title={`${unit.name}${count > 1 ? ` x${count}` : ''}`}>
      <span style={{ fontSize: size }} className="leading-none">{unit.icon}</span>
      {showCount && count > 1 && (
        <span className="text-[8px] font-bold" style={{ color: unit.color }}>{count}</span>
      )}
    </div>
  );
}

// ========================================
// UNIT COMPOSITION DISPLAY - Shows units in a territory
// ========================================

interface UnitCompositionProps {
  units: UnitTypeId[];
  maxSize?: number;
  compact?: boolean;
}

export function UnitComposition({ units, maxSize = 6, compact = false }: UnitCompositionProps) {
  if (units.length === 0) return null;

  // Count units by type
  const counts: Record<string, number> = {};
  for (const u of units) {
    counts[u] = (counts[u] || 0) + 1;
  }

  const entries = Object.entries(counts) as [UnitTypeId, number][];

  if (compact) {
    return (
      <div className="flex items-center gap-0.5 flex-wrap justify-center">
        {entries.slice(0, maxSize).map(([type, count]) => (
          <UnitBadge key={type} unitType={type} count={count} size={12} />
        ))}
        {entries.length > maxSize && (
          <span className="text-[8px] opacity-50">+{entries.length - maxSize}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 flex-wrap justify-center">
      {entries.slice(0, maxSize).map(([type, count]) => (
        <div
          key={type}
          className="flex items-center gap-0.5 px-1.5 py-0.5 rounded"
          style={{ background: `${UNIT_TYPES[type].color}22`, border: `1px solid ${UNIT_TYPES[type].color}44` }}
        >
          <span className="text-sm leading-none">{UNIT_TYPES[type].icon}</span>
          <span className="text-[10px] font-bold" style={{ color: UNIT_TYPES[type].color }}>{count}</span>
        </div>
      ))}
      {entries.length > maxSize && (
        <span className="text-[10px] opacity-50">+{entries.length - maxSize} more</span>
      )}
    </div>
  );
}

// ========================================
// TYPE ADVANTAGE INDICATOR
// ========================================

interface TypeAdvantageIndicatorProps {
  attackerType: UnitTypeId | null;
  defenderType: UnitTypeId | null;
  advantage: 'strong' | 'weak' | 'neutral';
}

export function TypeAdvantageIndicator({ attackerType, defenderType, advantage }: TypeAdvantageIndicatorProps) {
  if (!attackerType || !defenderType) return null;

  const atkUnit = UNIT_TYPES[attackerType];
  const defUnit = UNIT_TYPES[defenderType];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{
      background: advantage === 'strong' ? 'rgba(34,197,94,0.1)' : advantage === 'weak' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${advantage === 'strong' ? '#22C55E44' : advantage === 'weak' ? '#EF444444' : 'rgba(255,255,255,0.05)'}`,
    }}>
      <UnitPortrait unitType={attackerType} size={24} />
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold" style={{
          color: advantage === 'strong' ? '#22C55E' : advantage === 'weak' ? '#EF4444' : '#8B7355',
          fontFamily: 'var(--font-cinzel), serif',
        }}>
          {advantage === 'strong' ? 'STRONG' : advantage === 'weak' ? 'WEAK' : 'EVEN'}
        </span>
      </div>
      <UnitPortrait unitType={defenderType} size={24} />
    </div>
  );
}

// ========================================
// BATTLE UNIT DISPLAY - Shows attacker vs defender with portraits
// ========================================

interface BattleUnitDisplayProps {
  unitType: UnitTypeId;
  side: 'attacker' | 'defender';
  losses?: number;
}

export function BattleUnitDisplay({ unitType, side, losses = 0 }: BattleUnitDisplayProps) {
  const unit = UNIT_TYPES[unitType];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <UnitPortrait unitType={unitType} size={48} />
        {losses > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: '#EF4444', color: '#fff', border: '1px solid #7F1D1D' }}>
            -{losses}
          </div>
        )}
      </div>
      <span className="text-[10px] font-bold" style={{
        color: side === 'attacker' ? '#FDE68A' : '#FCA5A5',
        fontFamily: 'var(--font-cinzel), serif',
      }}>
        {unit.name}
      </span>
    </div>
  );
}

// ========================================
// ALL UNIT CARDS REFERENCE (for setup showcase)
// ========================================

export function AllUnitCards({ characterClass }: { characterClass?: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {UNIT_TYPE_LIST.map(unit => (
        <UnitCard
          key={unit.id}
          unitType={unit}
          size="xl"
          showCost
          characterClass={characterClass}
        />
      ))}
    </div>
  );
}

// ========================================
// LEGACY COMPAT - getUnitFigure (returns portrait)
// ========================================

export function getUnitFigure(unitType: UnitTypeId, _color: string, size?: number) {
  return <UnitPortrait unitType={unitType} size={size || 40} />;
}