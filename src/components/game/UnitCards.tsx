'use client';

import { UNIT_TYPES, UNIT_TYPE_LIST, type UnitTypeId, type UnitType } from '@/lib/game-data';
import { getDominantUnit, getTypeAdvantage } from '@/lib/game-data';
import { getUnitCost } from '@/lib/game-logic';

// SVG figure art for each unit type - simple medieval figures
const UNIT_FIGURES: Record<UnitTypeId, (color: string, size?: number) => React.ReactNode> = {
  swordsman: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Body */}
      <rect x="16" y="14" width="8" height="12" rx="1" fill={color} opacity="0.9" />
      {/* Head */}
      <circle cx="20" cy="10" r="4" fill={color} opacity="0.85" />
      {/* Helmet crest */}
      <path d="M17 7 L20 4 L23 7" stroke={color} strokeWidth="1.5" fill="none" />
      {/* Sword */}
      <line x1="26" y1="12" x2="34" y2="4" stroke="#D4D4D4" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="14" x2="30" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Shield arm */}
      <ellipse cx="13" cy="20" rx="4" ry="5" fill={color} opacity="0.6" stroke={color} strokeWidth="0.5" />
      {/* Legs */}
      <line x1="18" y1="26" x2="17" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="26" x2="23" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  archer: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Body */}
      <rect x="16" y="14" width="8" height="12" rx="1" fill={color} opacity="0.9" />
      {/* Head */}
      <circle cx="20" cy="10" r="4" fill={color} opacity="0.85" />
      {/* Hood */}
      <path d="M16 8 Q20 3 24 8" fill={color} opacity="0.7" />
      {/* Bow */}
      <path d="M28 6 Q34 16 28 30" stroke="#8B6914" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Bowstring */}
      <line x1="28" y1="6" x2="28" y2="30" stroke="#D4A017" strokeWidth="0.8" />
      {/* Arrow */}
      <line x1="28" y1="16" x2="10" y2="16" stroke="#D4D4D4" strokeWidth="1" />
      <polygon points="8,16 12,14 12,18" fill="#D4D4D4" />
      {/* Legs */}
      <line x1="18" y1="26" x2="17" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="22" y1="26" x2="23" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  cavalry: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Horse body */}
      <ellipse cx="20" cy="24" rx="10" ry="6" fill={color} opacity="0.7" />
      {/* Horse head */}
      <path d="M30 20 L36 14 L34 20 Z" fill={color} opacity="0.8" />
      {/* Horse legs */}
      <line x1="14" y1="30" x2="12" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="30" x2="16" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="30" x2="26" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="29" x2="30" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
      {/* Rider body */}
      <rect x="17" y="8" width="6" height="10" rx="1" fill={color} opacity="0.9" />
      {/* Rider head */}
      <circle cx="20" cy="5" r="3.5" fill={color} opacity="0.85" />
      {/* Lance */}
      <line x1="24" y1="10" x2="38" y2="3" stroke="#D4D4D4" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="38,3 35,1 36,5" fill="#D4D4D4" />
    </svg>
  ),
  mage: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Robe body (triangle) */}
      <path d="M14 14 L20 36 L26 14 Z" fill={color} opacity="0.85" />
      {/* Head */}
      <circle cx="20" cy="10" r="4" fill={color} opacity="0.85" />
      {/* Wizard hat */}
      <path d="M14 10 L20 1 L26 10 Z" fill={color} opacity="0.9" />
      <circle cx="20" cy="1" r="1.5" fill="#FFD700" />
      {/* Staff */}
      <line x1="10" y1="12" x2="8" y2="36" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
      {/* Orb */}
      <circle cx="8" cy="11" r="2.5" fill={color} opacity="0.8" stroke="#FFD700" strokeWidth="0.5" />
      {/* Magic sparkles */}
      <circle cx="28" cy="8" r="1" fill="#FFD700" opacity="0.8" />
      <circle cx="32" cy="14" r="0.8" fill="#FFD700" opacity="0.6" />
      <circle cx="26" cy="16" r="0.6" fill="#FFD700" opacity="0.5" />
    </svg>
  ),
  shield_bearer: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Body */}
      <rect x="15" y="14" width="10" height="12" rx="1" fill={color} opacity="0.9" />
      {/* Head */}
      <circle cx="20" cy="10" r="4" fill={color} opacity="0.85" />
      {/* Great helm */}
      <rect x="16" y="6" width="8" height="6" rx="2" fill={color} opacity="0.7" />
      <line x1="18" y1="8" x2="22" y2="8" stroke="#333" strokeWidth="0.8" />
      {/* Large shield */}
      <path d="M6 12 L6 26 Q6 34 12 36 L12 12 Z" fill={color} opacity="0.8" stroke={color} strokeWidth="1" />
      <line x1="9" y1="14" x2="9" y2="34" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
      {/* Mace */}
      <line x1="26" y1="14" x2="32" y2="28" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <circle cx="33" cy="30" r="2.5" fill="#666" />
      {/* Legs */}
      <line x1="17" y1="26" x2="16" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="23" y1="26" x2="24" y2="36" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  siege: (color, size = 40) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Base frame */}
      <rect x="4" y="26" width="32" height="4" rx="1" fill={color} opacity="0.7" />
      {/* Wheels */}
      <circle cx="10" cy="32" r="3" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="30" cy="32" r="3" fill="none" stroke={color} strokeWidth="1.5" />
      {/* Arm */}
      <line x1="10" y1="26" x2="30" y2="8" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Counterweight */}
      <circle cx="30" cy="10" r="3" fill={color} opacity="0.8" />
      {/* Sling/cup */}
      <path d="M7 24 Q4 20 8 18" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Stone projectile */}
      <circle cx="6" cy="18" r="2" fill="#999" opacity="0.8" />
      {/* Support beam */}
      <line x1="20" y1="26" x2="20" y2="20" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
};

export function getUnitFigure(unitType: UnitTypeId, color: string, size?: number) {
  const Figure = UNIT_FIGURES[unitType];
  return Figure ? Figure(color, size) : null;
}

// ========================================
// UNIT CARD - Full stat card for unit reference
// ========================================

interface UnitCardProps {
  unitType: UnitType;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showCost?: boolean;
  characterClass?: string;
  dimmed?: boolean;
}

export function UnitCard({ unitType, size = 'md', selected, onClick, disabled, showCost, characterClass, dimmed }: UnitCardProps) {
  const sizes = {
    sm: 'w-20 p-1.5',
    md: 'w-28 p-2.5',
    lg: 'w-36 p-3',
  };

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 44,
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
      {/* Unit figure */}
      <div className="relative">
        {getUnitFigure(unitType.id, unitType.color, iconSizes[size])}
      </div>

      {/* Name */}
      <div
        className="text-[10px] font-bold text-center leading-tight"
        style={{ color: unitType.color, fontFamily: 'var(--font-cinzel), serif' }}
      >
        {unitType.name}
      </div>

      {/* Stats bar - only for md and lg */}
      {(size === 'md' || size === 'lg') && (
        <div className="flex gap-2 text-[9px] w-full justify-center">
          <span style={{ color: '#EF4444' }}>⚔{unitType.attack}</span>
          <span style={{ color: '#60A5FA' }}>🛡{unitType.defense}</span>
          <span style={{ color: '#22C55E' }}>♥{unitType.health}</span>
          {showCost && (
            <span style={{ color: '#D4A017' }}>★{cost}</span>
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
    // Show just icons in a row
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
      <span className="text-lg">{atkUnit.icon}</span>
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold" style={{
          color: advantage === 'strong' ? '#22C55E' : advantage === 'weak' ? '#EF4444' : '#8B7355',
          fontFamily: 'var(--font-cinzel), serif',
        }}>
          {advantage === 'strong' ? 'STRONG' : advantage === 'weak' ? 'WEAK' : 'EVEN'}
        </span>
      </div>
      <span className="text-lg">{defUnit.icon}</span>
    </div>
  );
}

// ========================================
// ALL UNIT CARDS REFERENCE (for setup showcase)
// ========================================

export function AllUnitCards({ characterClass }: { characterClass?: string }) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {UNIT_TYPE_LIST.map(unit => (
        <UnitCard
          key={unit.id}
          unitType={unit}
          size="md"
          showCost
          characterClass={characterClass}
        />
      ))}
    </div>
  );
}