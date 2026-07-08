'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/game-store';
import { PLAYER_CONFIGS, CHARACTER_CLASSES, UNIT_TYPE_LIST, UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { getUnitFigure, UnitCard } from './UnitCards';
import { getUnitCost } from '@/lib/game-logic';

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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #1a0f00 0%, #2D1F10 30%, #1a2a1a 70%, #0a1520 100%)',
      }}
    >
      <div className="w-full max-w-3xl">
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

        {/* Unit Cards Showcase */}
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
                Each unit has unique ATK, DEF, HP stats and type advantages. Cost shows reinforcement points needed.
              </p>
            </div>

            {/* Unit cards grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {UNIT_TYPE_LIST.map(unit => (
                <div
                  key={unit.id}
                  className="p-3 rounded-lg flex gap-3 items-start"
                  style={{
                    background: unit.gradient,
                    border: `1.5px solid ${unit.color}44`,
                  }}
                >
                  <div className="flex-shrink-0">
                    {getUnitFigure(unit.id, unit.color, 44)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{unit.icon}</span>
                      <span className="text-xs font-bold" style={{
                        color: unit.color,
                        fontFamily: 'var(--font-cinzel), serif',
                      }}>
                        {unit.name}
                      </span>
                      <span className="text-[9px] px-1 rounded" style={{
                        background: 'rgba(212,160,23,0.2)',
                        color: '#D4A017',
                      }}>
                        ★{unit.cost}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-1 text-[10px]">
                      <span style={{ color: '#EF4444' }}>ATK {unit.attack}</span>
                      <span style={{ color: '#60A5FA' }}>DEF {unit.defense}</span>
                      <span style={{ color: '#22C55E' }}>HP {unit.health}</span>
                    </div>
                    <p className="text-[9px] opacity-60 mt-1 leading-tight">{unit.description}</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[9px]" style={{ color: '#22C55E' }}>
                        ▲ {unit.strongVs.map(t => UNIT_TYPES[t].name).join(', ')}
                      </span>
                      <span className="text-[9px]" style={{ color: '#EF4444' }}>
                        ▼ {unit.weakVs.map(t => UNIT_TYPES[t].name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Type advantage chart */}
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider opacity-50 mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                Type Advantage Cycle
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
                <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span>
                <span className="opacity-40">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#22C55E22', color: '#22C55E' }}>🏹 Archer</span>
                <span className="opacity-40">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#D4A01722', color: '#D4A017' }}>🐎 Cavalry</span>
                <span className="opacity-40">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span>
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap text-xs mt-1.5">
                <span className="px-2 py-1 rounded" style={{ background: '#A855F722', color: '#A855F7' }}>🔮 Mage</span>
                <span className="opacity-40">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#60A5FA22', color: '#60A5FA' }}>🛡️ Shield</span>
                <span className="opacity-40">|</span>
                <span className="px-2 py-1 rounded" style={{ background: '#F9731622', color: '#F97316' }}>🏰 Siege</span>
                <span className="opacity-40">beats</span>
                <span className="px-2 py-1 rounded" style={{ background: '#60A5FA22', color: '#60A5FA' }}>🛡️ Shield</span>
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