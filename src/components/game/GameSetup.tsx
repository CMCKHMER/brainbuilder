'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/game-store';
import { PLAYER_CONFIGS, CHARACTER_CLASSES, UNIT_TYPE_LIST, UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { UnitCard, UnitPortrait } from './UnitCards';

export default function GameSetup() {
  const setupGame = useGameStore(s => s.setupGame);
  const [playerCount, setPlayerCount] = useState(2);
  const [configs, setConfigs] = useState(
    PLAYER_CONFIGS.slice(0, 4).map((p, i) => ({
      name: p.name,
      color: p.color,
      colorLight: p.colorLight,
      characterClass: p.characterClass.toLowerCase(),
      icon: p.icon,
      active: i < 2,
    }))
  );
  const [showUnits, setShowUnits] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitTypeId | null>(null);

  const handleStart = () => {
    const activeConfigs = configs
      .filter(c => c.active)
      .map(c => ({
        name: c.name,
        color: c.color,
        colorLight: c.colorLight,
        characterClass: c.characterClass,
        icon: c.icon,
      }));
    if (activeConfigs.length >= 2) {
      setupGame(activeConfigs);
    }
  };

  const updateConfig = (index: number, field: string, value: string | boolean) => {
    setConfigs(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  };

  const selUnit = selectedUnit ? UNIT_TYPES[selectedUnit] : null;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1a0f00 0%, #2D1F10 30%, #1a2a1a 70%, #0a1520 100%)',
      }}
    >
      <div className="w-full max-w-4xl">
        {/* Title */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⚔️</div>
          <h1
            className="text-4xl md:text-5xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: '#D4A017',
              textShadow: '0 2px 10px rgba(212,160,23,0.3)',
            }}
          >
            REALM OF AETHERMOOR
          </h1>
          <p className="text-sm mt-2 opacity-40 tracking-widest uppercase" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
            A Medieval Strategy Board Game
          </p>
          <div className="w-48 h-0.5 mx-auto mt-3" style={{ background: 'linear-gradient(90deg, transparent, #D4A01766, transparent)' }} />
        </div>

        {/* Player Count Selector */}
        <div className="flex justify-center gap-3 mb-6">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => {
                setPlayerCount(n);
                setConfigs(prev => prev.map((c, i) => ({ ...c, active: i < n })));
              }}
              className="w-12 h-12 rounded-lg font-bold text-lg transition-all"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                background: playerCount === n ? 'linear-gradient(135deg, #D4A017, #92700C)' : 'rgba(255,255,255,0.05)',
                color: playerCount === n ? '#1a0f00' : '#8B7355',
                border: `2px solid ${playerCount === n ? '#D4A017' : 'rgba(139,115,85,0.2)'}`,
                boxShadow: playerCount === n ? '0 0 15px rgba(212,160,23,0.3)' : 'none',
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="text-center text-xs opacity-40 mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
          Number of Warlords
        </div>

        {/* Player Config Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {configs.map((config, index) => (
            <div
              key={index}
              className="p-4 rounded-lg transition-all"
              style={{
                background: config.active
                  ? `linear-gradient(135deg, ${config.color}15, ${config.color}08)`
                  : 'rgba(255,255,255,0.02)',
                border: `2px solid ${config.active ? config.color + '66' : 'rgba(255,255,255,0.05)'}`,
                opacity: config.active ? 1 : 0.35,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{config.icon}</span>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig(index, 'name', e.target.value)}
                  className="flex-1 bg-transparent border-b border-white/10 text-sm font-bold outline-none py-1 px-1"
                  style={{ color: config.color, fontFamily: 'var(--font-cinzel), serif' }}
                  disabled={!config.active}
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CHARACTER_CLASSES.map(cc => (
                  <button
                    key={cc.id}
                    onClick={() => updateConfig(index, 'characterClass', cc.id)}
                    className="px-2 py-1 rounded text-[10px] transition-all"
                    style={{
                      background: config.characterClass === cc.id
                        ? `${config.color}33`
                        : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${config.characterClass === cc.id ? config.color + '66' : 'rgba(255,255,255,0.05)'}`,
                      color: config.characterClass === cc.id ? config.color : '#666',
                    }}
                    disabled={!config.active}
                  >
                    {cc.icon} {cc.name}
                  </button>
                ))}
              </div>
              <div className="text-[10px] opacity-40 mt-2">
                {CHARACTER_CLASSES.find(cc => cc.id === config.characterClass)?.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Unit Showcase Toggle */}
        <div className="text-center mb-4">
          <button
            onClick={() => setShowUnits(!showUnits)}
            className="text-xs px-4 py-2 rounded-lg transition-all"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              background: showUnits ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${showUnits ? '#D4A01766' : 'rgba(139,115,85,0.2)'}`,
              color: showUnits ? '#D4A017' : '#8B7355',
            }}
          >
            {showUnits ? '▲ Hide Unit Guide' : '▼ View Unit Guide & Type Advantages'}
          </button>
        </div>

        {/* Unit Cards Showcase with Portraits */}
        {showUnits && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(139,115,85,0.2)',
            }}
          >
            <div className="text-center mb-4">
              <h2
                className="text-sm font-bold tracking-wider"
                style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017' }}
              >
                UNITS OF AETHERMOOR
              </h2>
              <p className="text-[10px] opacity-40 mt-1">
                Each unit has unique ATK, DEF, HP stats and type advantages. Click a unit for details.
              </p>
            </div>

            {/* Unit cards grid with portraits */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
              {UNIT_TYPE_LIST.map(unit => (
                <button
                  key={unit.id}
                  onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                  className="p-2 rounded-lg flex flex-col items-center gap-1.5 transition-all"
                  style={{
                    background: selectedUnit === unit.id
                      ? `linear-gradient(135deg, ${unit.color}33, ${unit.color}11)`
                      : unit.gradient,
                    border: `1.5px solid ${selectedUnit === unit.id ? unit.color : unit.color + '44'}`,
                    boxShadow: selectedUnit === unit.id ? `0 0 12px ${unit.color}44` : 'none',
                    transform: selectedUnit === unit.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <UnitPortrait unitType={unit.id} size={48} />
                  <span className="text-[10px] font-bold" style={{
                    color: unit.color,
                    fontFamily: 'var(--font-cinzel), serif',
                  }}>
                    {unit.name}
                  </span>
                  <div className="flex gap-2 text-[9px]">
                    <span style={{ color: '#EF4444' }}>A{unit.attack}</span>
                    <span style={{ color: '#60A5FA' }}>D{unit.defense}</span>
                    <span style={{ color: '#22C55E' }}>H{unit.health}</span>
                    <span style={{ color: '#FBBF24' }}>S{unit.speed}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded" style={{
                    background: `${unit.color}22`,
                    color: unit.color,
                    border: `1px solid ${unit.color}33`,
                  }}>
                    {unit.role}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected unit detail panel */}
            {selUnit && (
              <div
                className="p-4 rounded-lg flex gap-4 items-start"
                style={{
                  background: `${selUnit.color}11`,
                  border: `1.5px solid ${selUnit.color}44`,
                }}
              >
                <UnitPortrait unitType={selUnit.id} size={80} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{selUnit.icon}</span>
                    <span className="text-base font-bold" style={{
                      color: selUnit.color,
                      fontFamily: 'var(--font-cinzel), serif',
                    }}>
                      {selUnit.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{
                      background: `${selUnit.color}22`,
                      color: selUnit.color,
                      border: `1px solid ${selUnit.color}44`,
                    }}>
                      {selUnit.role}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                      background: 'rgba(212,160,23,0.2)',
                      color: '#D4A017',
                    }}>
                      Cost: {selUnit.cost === 1 ? '★' : '★★'}
                    </span>
                  </div>

                  <p className="text-[11px] opacity-60 mb-2 leading-relaxed">{selUnit.description}</p>

                  {/* Stat bars */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold w-6" style={{ color: '#EF4444', fontFamily: 'var(--font-cinzel), serif' }}>ATK</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(selUnit.attack / 7) * 100}%`, background: '#EF4444' }} />
                      </div>
                      <span className="text-[10px] font-bold w-4 text-right" style={{ color: '#EF4444' }}>{selUnit.attack}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold w-6" style={{ color: '#60A5FA', fontFamily: 'var(--font-cinzel), serif' }}>DEF</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(selUnit.defense / 7) * 100}%`, background: '#60A5FA' }} />
                      </div>
                      <span className="text-[10px] font-bold w-4 text-right" style={{ color: '#60A5FA' }}>{selUnit.defense}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold w-6" style={{ color: '#22C55E', fontFamily: 'var(--font-cinzel), serif' }}>HP</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(selUnit.health / 7) * 100}%`, background: '#22C55E' }} />
                      </div>
                      <span className="text-[10px] font-bold w-4 text-right" style={{ color: '#22C55E' }}>{selUnit.health}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold w-6" style={{ color: '#FBBF24', fontFamily: 'var(--font-cinzel), serif' }}>SPD</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(selUnit.speed / 5) * 100}%`, background: '#FBBF24' }} />
                      </div>
                      <span className="text-[10px] font-bold w-4 text-right" style={{ color: '#FBBF24' }}>{selUnit.speed}</span>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="flex gap-4">
                    <div>
                      <span className="text-[9px] font-bold" style={{ color: '#22C55E' }}>▲ Strong vs: </span>
                      <span className="text-[9px] opacity-60">
                        {selUnit.strongVs.map(t => UNIT_TYPES[t].name).join(', ') || 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold" style={{ color: '#EF4444' }}>▼ Weak vs: </span>
                      <span className="text-[9px] opacity-60">
                        {selUnit.weakVs.map(t => UNIT_TYPES[t].name).join(', ') || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Type advantage chart */}
            <div className="text-center mt-4">
              <div className="text-[10px] uppercase tracking-wider opacity-50 mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Type Advantage Web
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px]">
                <span className="px-2 py-1 rounded" style={{ background: '#A1887F22', color: '#A1887F' }}>🔱 Spearman</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#D4A01722', color: '#D4A017' }}>🐎 Cavalry</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#A1887F22', color: '#A1887F' }}>🔱 Spearman</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] mt-1">
                <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#22C55E22', color: '#22C55E' }}>🏹 Archer</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#F472B622', color: '#F472B6' }}>🗡️ Assassin</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#A855F722', color: '#A855F7' }}>🔮 Mage</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] mt-1">
                <span className="px-2 py-1 rounded" style={{ background: '#60A5FA22', color: '#60A5FA' }}>🛡️ Shield</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#F472B622', color: '#F472B6' }}>🗡️ Assassin</span>
                <span className="opacity-30">|</span>
                <span className="px-2 py-1 rounded" style={{ background: '#FBBF2422', color: '#FBBF24' }}>✨ Paladin</span>
                <span className="opacity-30">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#A855F722', color: '#A855F7' }}>🔮 Mage</span>
              </div>
            </div>
          </div>
        )}

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            size="lg"
            className="px-12 py-6 text-lg"
            style={{
              background: 'linear-gradient(135deg, #D4A017, #8B6914)',
              color: '#1a0f00',
              fontFamily: 'var(--font-cinzel), serif',
              fontWeight: 700,
              letterSpacing: '2px',
              border: '2px solid #FDE68A44',
              boxShadow: '0 4px 20px rgba(212,160,23,0.3)',
            }}
          >
            ⚔️ BEGIN CONQUEST ⚔️
          </Button>
        </div>
      </div>
    </div>
  );
}