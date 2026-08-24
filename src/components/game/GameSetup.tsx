'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/game-store';
import { PLAYER_CONFIGS, CHARACTER_CLASSES, UNIT_TYPE_LIST, UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { UnitPortrait } from './UnitCards';
import Image from 'next/image';

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
      isAI: i >= 1,
      active: i < 2,
    }))
  );
  const [showUnits, setShowUnits] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitTypeId | null>(null);
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleStart = () => {
    const activeConfigs = configs
      .filter(c => c.active)
      .map(c => ({
        name: c.name,
        color: c.color,
        colorLight: c.colorLight,
        characterClass: c.characterClass,
        icon: c.icon,
        isAI: c.isAI,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/game/selectscreen_bg.png"
          alt="Realm of the Khmer Empire"
          fill
          className="object-cover object-center"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
        }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          {/* Title */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-3" style={{
              filter: 'drop-shadow(0 0 12px rgba(212,160,23,0.6))',
            }}>⚔️</div>
            <h1
              className="text-4xl md:text-5xl font-bold tracking-wider"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: '#D4A017',
                textShadow: '0 0 20px rgba(212,160,23,0.5), 0 2px 4px rgba(0,0,0,0.8), 0 4px 10px rgba(0,0,0,0.5)',
                letterSpacing: '0.1em',
              }}
            >
              REALM OF THE KHMER EMPIRE
            </h1>
            <p className="text-sm mt-2 opacity-50 tracking-widest uppercase" style={{
              fontFamily: 'var(--font-cinzel), serif',
              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
            }}>
              A Medieval Strategy Board Game
            </p>
            <div className="w-48 h-0.5 mx-auto mt-3" style={{
              background: 'linear-gradient(90deg, transparent, #D4A01788, transparent)',
              boxShadow: '0 0 8px rgba(212,160,23,0.3)',
            }} />
          </div>

          {/* Faction Characters Showcase */}
          <div className="mb-8">
            <div className="text-center mb-4">
              <div className="text-[10px] uppercase tracking-[4px] opacity-40" style={{
                fontFamily: 'var(--font-cinzel), serif',
                textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              }}>
                Choose Your Kingdom
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PLAYER_CONFIGS.map((p, i) => {
                const charClass = CHARACTER_CLASSES.find(cc => cc.id === p.characterClass.toLowerCase());
                const isHovered = hoveredChar === i;
                const k = p.kingdom;
                return (
                  <div
                    key={i}
                    className="relative rounded-2xl text-center transition-all duration-500 ease-out cursor-pointer overflow-hidden"
                    style={{
                      background: isHovered
                        ? `linear-gradient(180deg, ${p.color}30 0%, ${p.color}15 40%, rgba(0,0,0,0.7) 100%)`
                        : `linear-gradient(180deg, ${p.color}18 0%, ${p.color}06 50%, rgba(0,0,0,0.3) 100%)`,
                      border: `2px solid ${isHovered ? p.color + 'aa' : p.color + '33'}`,
                      boxShadow: isHovered
                        ? `0 8px 32px ${p.color}44, 0 0 60px ${p.color}22, inset 0 1px 0 rgba(255,255,255,0.1)`
                        : `0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
                      transform: isHovered
                        ? 'translateY(-8px) scale(1.03)'
                        : 'translateY(0) scale(1)',
                      perspective: '800px',
                    }}
                    onMouseEnter={() => setHoveredChar(i)}
                    onMouseLeave={() => setHoveredChar(null)}
                  >
                    <div
                      className="absolute inset-0 rounded-2xl transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(ellipse at 50% 20%, ${p.color}${isHovered ? '25' : '08'} 0%, transparent 70%)`,
                      }}
                    />
                    <div
                      className="absolute top-0 left-4 right-4 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${p.color}${isHovered ? '66' : '22'}, transparent)`,
                      }}
                    />
                    <div className="relative z-10 p-4 pb-2">
                      <div className="text-2xl mb-2" style={{
                        filter: `drop-shadow(0 0 8px ${p.color}66)`,
                      }}>
                        {p.icon}
                      </div>
                      <div
                        className="w-16 h-22 mx-auto mb-2 rounded-lg overflow-hidden transition-all duration-500"
                        style={{
                          border: `2px solid ${isHovered ? p.color + 'cc' : p.color + '44'}`,
                          boxShadow: isHovered
                            ? `0 0 24px ${p.color}44, 0 4px 16px rgba(0,0,0,0.6)`
                            : `0 0 16px ${p.color}22, 0 4px 12px rgba(0,0,0,0.4)`,
                        }}
                      >
                        <Image
                          src={p.image}
                          alt={p.name}
                          width={64}
                          height={88}
                          className="w-full h-full object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div
                        className="text-[10px] tracking-widest uppercase mb-0.5 font-bold transition-all duration-300"
                        style={{
                          color: p.color,
                          fontFamily: 'var(--font-cinzel), serif',
                          textShadow: `0 0 12px ${p.color}44`,
                        }}
                      >
                        {k?.name}
                      </div>
                      <div
                        className="text-[9px] tracking-wide mb-1 transition-all duration-300"
                        style={{
                          color: p.colorLight,
                          opacity: isHovered ? 0.8 : 0.5,
                          fontFamily: 'var(--font-cinzel), serif',
                        }}
                      >
                        {p.fullName || p.name}
                      </div>
                      <div className="flex items-center justify-center gap-1.5 mb-1.5 flex-wrap">
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded"
                          style={{
                            background: `${p.color}15`,
                            border: `1px solid ${p.color}22`,
                            color: p.colorLight,
                            opacity: 0.7,
                          }}
                        >
                          🏰 {k?.capital}
                        </span>
                        <span
                          className="text-[8px] px-1.5 py-0.5 rounded"
                          style={{
                            background: `${p.color}15`,
                            border: `1px solid ${p.color}22`,
                            color: p.colorLight,
                            opacity: 0.7,
                          }}
                        >
                          ⚔️ {charClass?.name}
                        </span>
                      </div>

                      {/* HOVER EXPANDED KINGDOM DETAILS */}
                      <div
                        className="transition-all duration-500 ease-out overflow-hidden"
                        style={{
                          maxHeight: isHovered ? '400px' : '0px',
                          opacity: isHovered ? 1 : 0,
                        }}
                      >
                        <div className="w-12 h-px mx-auto my-2" style={{
                          background: `linear-gradient(90deg, transparent, ${p.color}55, transparent)`,
                        }} />
                        <div className="text-left mb-1.5 px-0.5">
                          <div className="text-[7px] uppercase tracking-widest font-bold mb-0.5" style={{ color: p.color, fontFamily: 'var(--font-cinzel), serif' }}>Terrain</div>
                          <div className="text-[8px] leading-relaxed" style={{ color: p.colorLight, opacity: 0.7 }}>{k?.terrain}</div>
                        </div>
                        <div className="text-left mb-1.5 px-0.5">
                          <div className="text-[7px] uppercase tracking-widest font-bold mb-0.5" style={{ color: p.color, fontFamily: 'var(--font-cinzel), serif' }}>Culture</div>
                          <div className="text-[8px] leading-relaxed" style={{ color: p.colorLight, opacity: 0.7 }}>{k?.culture}</div>
                        </div>
                        <div className="text-left mb-1.5 px-0.5">
                          <div className="text-[7px] uppercase tracking-widest font-bold mb-0.5" style={{ color: p.color, fontFamily: 'var(--font-cinzel), serif' }}>Military Doctrine</div>
                          <div className="text-[8px] leading-relaxed" style={{ color: p.colorLight, opacity: 0.7 }}>{k?.militaryDoctrine}</div>
                        </div>
                        <div className="text-left mb-1.5 px-0.5">
                          <div className="text-[7px] uppercase tracking-widest font-bold mb-0.5" style={{ color: p.color, fontFamily: 'var(--font-cinzel), serif' }}>Symbol</div>
                          <div className="text-[8px]" style={{ color: p.colorLight, opacity: 0.7 }}>
                            <span className="font-bold">{k?.symbol}</span> — {k?.symbolMeaning}
                          </div>
                        </div>
                        <div
                          className="text-[9px] font-bold italic mt-2 py-1.5 px-2 rounded-lg"
                          style={{
                            color: p.color,
                            fontFamily: 'var(--font-cinzel), serif',
                            background: `linear-gradient(90deg, transparent, ${p.color}15, transparent)`,
                            borderLeft: `2px solid ${p.color}66`,
                            textShadow: `0 0 8px ${p.color}33`,
                          }}
                        >
                          {k?.motto}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-3">
              <span className="text-[9px] opacity-30 tracking-wider" style={{
                fontFamily: 'var(--font-cinzel), serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
              }}>
                HOVER OVER A KINGDOM TO REVEAL ITS LORE
              </span>
            </div>
          </div>

          {/* World Map & Lore Toggle */}
          <div className="text-center mb-6">
            <button
              onClick={() => { setShowMap(!showMap); setShowUnits(false); }}
              className="relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                background: showMap
                  ? 'linear-gradient(180deg, rgba(212,160,23,0.25), rgba(212,160,23,0.1))'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                border: `2px solid ${showMap ? '#D4A01788' : 'rgba(139,115,85,0.2)'}`,
                color: showMap ? '#D4A017' : '#8B7355',
                boxShadow: showMap
                  ? '0 3px 0 #92700C44, 0 6px 20px rgba(212,160,23,0.3), 0 0 30px rgba(212,160,23,0.1)'
                  : '0 3px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.3)',
                transform: showMap ? 'translateY(-2px)' : 'translateY(0)',
                textShadow: showMap ? '0 0 8px rgba(212,160,23,0.3)' : 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; if (!showMap) { e.currentTarget.style.borderColor = 'rgba(139,115,85,0.4)'; e.currentTarget.style.boxShadow = '0 5px 0 rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.4)'; } }}
              onMouseLeave={(e) => { if (!showMap) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(139,115,85,0.2)'; e.currentTarget.style.boxShadow = '0 3px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.3)'; } }}
            >
              {showMap ? '▲ Hide World Map' : '🌍 View World Map & Lore'}
            </button>
          </div>

          {/* World Map & Lore Panel */}
          {showMap && (
            <div className="mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(139,115,85,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="relative w-full" style={{ maxHeight: '400px' }}>
                <Image src="/game/worldmap.png" alt="World Map of the Khmer Empire" width={1200} height={650} className="w-full h-auto object-contain" unoptimized style={{ maxHeight: '400px' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
              </div>
              <div className="p-5">
                <h2 className="text-base font-bold tracking-wider text-center mb-3" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017', textShadow: '0 0 16px rgba(212,160,23,0.3)' }}>THE WAR OF THE BROKEN CROWN</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.08), rgba(220,38,38,0.02))', border: '1px solid rgba(220,38,38,0.2)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">🗡️</span>
                      <span className="text-[11px] font-bold tracking-wide" style={{ color: '#DC2626', fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 8px rgba(220,38,38,0.3)' }}>THE STRATEGIST&apos;S BETRAYAL</span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-60">King Soryan sought to preserve order through reason and discipline. He forged alliances and built fortresses, but his ambition to control the Crown&apos;s wisdom led him to betray the council of unity. His armies marched under banners of jade and bronze, believing intellect could rule destiny.</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(22,101,52,0.08), rgba(22,101,52,0.02))', border: '1px solid rgba(22,101,52,0.2)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">🐍</span>
                      <span className="text-[11px] font-bold tracking-wide" style={{ color: '#166534', fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 8px rgba(22,101,52,0.3)' }}>THE SHADOW&apos;S REBELLION</span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-60">Queen Veasna saw the Crown&apos;s fading light as divine punishment. She turned to forbidden naga rituals, summoning spirits to reclaim the gods&apos; favor. Her rebellion spread through the jungles like mist — unseen, unstoppable, and whispered in fear.</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.08), rgba(212,160,23,0.02))', border: '1px solid rgba(212,160,23,0.2)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">⚡</span>
                      <span className="text-[11px] font-bold tracking-wide" style={{ color: '#D4A017', fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 8px rgba(212,160,23,0.3)' }}>THE STORM&apos;S WRATH</span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-60">Lord Chanreth declared that the gods had abandoned the weak. He struck first, unleashing storms upon both allies and foes. His lightning armies shattered temples and flooded valleys, believing chaos would cleanse the land for rebirth.</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(126,34,206,0.08), rgba(126,34,206,0.02))', border: '1px solid rgba(126,34,206,0.2)' }}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-base">🔥</span>
                      <span className="text-[11px] font-bold tracking-wide" style={{ color: '#7E22CE', fontFamily: 'var(--font-cinzel), serif', textShadow: '0 0 8px rgba(126,34,206,0.3)' }}>THE FLAME&apos;S ASCENSION</span>
                    </div>
                    <p className="text-[10px] leading-relaxed opacity-60">Emperor Kiriath saw destruction as salvation. He burned the sacred archives and forged the Sunfire Citadel from molten stone. His followers called him the Phoenix King — the one who would ignite the world to start anew.</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg text-center" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.06), transparent)', borderLeft: '2px solid rgba(212,160,23,0.3)', borderRight: '2px solid rgba(212,160,23,0.3)' }}>
                  <p className="text-[10px] leading-relaxed opacity-70 italic" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017' }}>
                    The Golden Crown shattered into four fragments, each infused with the essence of its claimant — wisdom, shadow, storm, and flame. The land divided, temples fell silent, and the gods withdrew. Now, centuries later, the fragments stir again, calling warriors from every realm to reclaim the legacy of Angkor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Player Count Selector — 3D Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            {[2, 3, 4].map(n => {
              const isSelected = playerCount === n;
              return (
                <button
                  key={n}
                  onClick={() => { setPlayerCount(n); setConfigs(prev => prev.map((c, i) => ({ ...c, active: i < n }))); }}
                  className="relative px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    background: isSelected ? 'linear-gradient(180deg, #F0C850 0%, #D4A017 40%, #92700C 100%)' : 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                    color: isSelected ? '#1a0f00' : '#8B7355',
                    border: isSelected ? '2px solid #FDE68A' : '2px solid rgba(139,115,85,0.15)',
                    boxShadow: isSelected ? '0 6px 0 #6B4F08, 0 8px 24px rgba(212,160,23,0.4), 0 0 40px rgba(212,160,23,0.15), inset 0 1px 0 rgba(255,255,255,0.3)' : '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.3)',
                    transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                    textShadow: isSelected ? '0 1px 0 rgba(255,255,255,0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 0 rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(139,115,85,0.3)'; } }}
                  onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.3), 0 6px 12px rgba(0,0,0,0.3)'; e.currentTarget.style.borderColor = 'rgba(139,115,85,0.15)'; } }}
                  onMouseDown={(e) => { if (isSelected) { e.currentTarget.style.transform = 'translateY(1px)'; e.currentTarget.style.boxShadow = '0 2px 0 #6B4F08, 0 4px 12px rgba(212,160,23,0.3)'; } }}
                  onMouseUp={(e) => { if (isSelected) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 6px 0 #6B4F08, 0 8px 24px rgba(212,160,23,0.4), 0 0 40px rgba(212,160,23,0.15), inset 0 1px 0 rgba(255,255,255,0.3)'; } }}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <div className="text-center text-xs opacity-50 mb-6" style={{ fontFamily: 'var(--font-cinzel), serif', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
            Number of Warlords
          </div>

          {/* Player Config Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {configs.map((config, index) => (
              <div key={index} className="rounded-xl p-4 transition-all duration-300" style={{ background: config.active ? `linear-gradient(135deg, ${config.color}18, ${config.color}08)` : 'rgba(0,0,0,0.3)', border: `2px solid ${config.active ? config.color + '66' : 'rgba(255,255,255,0.05)'}`, boxShadow: config.active ? '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 2px 8px rgba(0,0,0,0.3)', opacity: config.active ? 1 : 0.3 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{config.icon}</span>
                  <input type="text" value={config.name} onChange={(e) => updateConfig(index, 'name', e.target.value)} className="flex-1 bg-transparent border-b border-white/10 text-sm font-bold outline-none py-1 px-1" style={{ color: config.color, fontFamily: 'var(--font-cinzel), serif' }} disabled={!config.active} />
                  <button onClick={() => updateConfig(index, 'isAI', !config.isAI)} className="relative px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 flex-shrink-0 cursor-pointer" style={{ background: config.isAI ? `linear-gradient(180deg, ${config.color}55, ${config.color}33)` : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: `1.5px solid ${config.isAI ? config.color + '99' : 'rgba(255,255,255,0.08)'}`, color: config.isAI ? config.color : '#666', fontFamily: 'var(--font-cinzel), serif', letterSpacing: '1px', boxShadow: config.isAI ? `0 3px 0 ${config.color}22, 0 4px 12px ${config.color}33` : '0 3px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)' }} disabled={!config.active || index === 0} title={index === 0 ? 'Player 1 is always human' : undefined}>
                    {config.isAI ? '🤖 AI' : '👤 HUMAN'}
                  </button>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {CHARACTER_CLASSES.map(cc => {
                    const isClassSelected = config.characterClass === cc.id;
                    return (
                      <button key={cc.id} onClick={() => updateConfig(index, 'characterClass', cc.id)} className="relative px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer" style={{ background: isClassSelected ? `linear-gradient(180deg, ${config.color}44, ${config.color}22)` : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))', border: `1.5px solid ${isClassSelected ? config.color + '88' : 'rgba(255,255,255,0.06)'}`, color: isClassSelected ? config.color : '#666', boxShadow: isClassSelected ? `0 3px 0 ${config.color}33, 0 4px 12px ${config.color}33, 0 0 20px ${config.color}11` : '0 2px 0 rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.2)', transform: isClassSelected ? 'translateY(-1px)' : 'translateY(0)', textShadow: isClassSelected ? `0 0 8px ${config.color}44` : 'none' }} disabled={!config.active}>
                        {cc.icon} {cc.name}
                      </button>
                    );
                  })}
                </div>
                <div className="text-[10px] opacity-40 mt-2">
                  {CHARACTER_CLASSES.find(cc => cc.id === config.characterClass)?.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Unit Showcase Toggle */}
          <div className="text-center mb-4">
            <button onClick={() => { setShowUnits(!showUnits); setShowMap(false); }} className="relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer" style={{ fontFamily: 'var(--font-cinzel), serif', background: showUnits ? 'linear-gradient(180deg, rgba(212,160,23,0.25), rgba(212,160,23,0.1))' : 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border: `2px solid ${showUnits ? '#D4A01788' : 'rgba(139,115,85,0.2)'}`, color: showUnits ? '#D4A017' : '#8B7355', boxShadow: showUnits ? '0 3px 0 #92700C44, 0 6px 20px rgba(212,160,23,0.3), 0 0 30px rgba(212,160,23,0.1)' : '0 3px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.3)', transform: showUnits ? 'translateY(-2px)' : 'translateY(0)', textShadow: showUnits ? '0 0 8px rgba(212,160,23,0.3)' : 'none' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; if (!showUnits) { e.currentTarget.style.borderColor = 'rgba(139,115,85,0.4)'; e.currentTarget.style.boxShadow = '0 5px 0 rgba(0,0,0,0.2), 0 8px 20px rgba(0,0,0,0.4)'; } }} onMouseLeave={(e) => { if (!showUnits) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(139,115,85,0.2)'; e.currentTarget.style.boxShadow = '0 3px 0 rgba(0,0,0,0.2), 0 6px 12px rgba(0,0,0,0.3)'; } }}>
              {showUnits ? '▲ Hide Unit Guide' : '▼ View Unit Guide & Type Advantages'}
            </button>
          </div>

          {/* Unit Cards Showcase */}
          {showUnits && (
            <div className="mb-6 p-4 rounded-xl" style={{ background: 'rgba(0,0,0,0.5)', border: '1.5px solid rgba(139,115,85,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
              <div className="text-center mb-4">
                <h2 className="text-sm font-bold tracking-wider" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017', textShadow: '0 0 12px rgba(212,160,23,0.3)' }}>UNITS OF THE KHMER EMPIRE</h2>
                <p className="text-[10px] opacity-40 mt-1">Each unit has unique ATK, DEF, HP stats and type advantages. Click a unit for details.</p>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                {UNIT_TYPE_LIST.map(unit => {
                  const isUnitSelected = selectedUnit === unit.id;
                  return (
                    <button key={unit.id} onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)} className="p-2 rounded-xl flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer" style={{ background: isUnitSelected ? `linear-gradient(180deg, ${unit.color}33, ${unit.color}11)` : unit.gradient, border: `2px solid ${isUnitSelected ? unit.color : unit.color + '33'}`, boxShadow: isUnitSelected ? `0 4px 0 ${unit.color}44, 0 6px 20px ${unit.color}44, 0 0 30px ${unit.color}22` : '0 3px 0 rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.3)', transform: isUnitSelected ? 'translateY(-4px) scale(1.05)' : 'translateY(0)' }} onMouseEnter={(e) => { if (!isUnitSelected) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 5px 0 rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.4)`; } }} onMouseLeave={(e) => { if (!isUnitSelected) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 0 rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.3)'; } }}>
                      <UnitPortrait unitType={unit.id} size={48} />
                      <span className="text-[10px] font-bold" style={{ color: unit.color, fontFamily: 'var(--font-cinzel), serif' }}>{unit.name}</span>
                      <div className="flex gap-2 text-[9px]">
                        <span style={{ color: '#EF4444' }}>A{unit.attack}</span>
                        <span style={{ color: '#60A5FA' }}>D{unit.defense}</span>
                        <span style={{ color: '#22C55E' }}>H{unit.health}</span>
                        <span style={{ color: '#FBBF24' }}>S{unit.speed}</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: `${unit.color}22`, color: unit.color, border: `1px solid ${unit.color}33` }}>{unit.role}</span>
                    </button>
                  );
                })}
              </div>
              {selUnit && (
                <div className="p-4 rounded-xl flex gap-4 items-start" style={{ background: `${selUnit.color}11`, border: `2px solid ${selUnit.color}44`, boxShadow: `0 4px 20px ${selUnit.color}11, inset 0 1px 0 rgba(255,255,255,0.05)`, backdropFilter: 'blur(4px)' }}>
                  <UnitPortrait unitType={selUnit.id} size={80} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-lg">{selUnit.icon}</span>
                      <span className="text-base font-bold" style={{ color: selUnit.color, fontFamily: 'var(--font-cinzel), serif' }}>{selUnit.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: `${selUnit.color}22`, color: selUnit.color, border: `1px solid ${selUnit.color}44` }}>{selUnit.role}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,160,23,0.2)', color: '#D4A017' }}>Cost: {selUnit.cost === 1 ? '★' : '★★'}</span>
                    </div>
                    <p className="text-[11px] opacity-60 mb-2 leading-relaxed">{selUnit.description}</p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-2">
                      {[
                        { label: 'ATK', value: selUnit.attack, max: 7, color: '#EF4444' },
                        { label: 'DEF', value: selUnit.defense, max: 7, color: '#60A5FA' },
                        { label: 'HP', value: selUnit.health, max: 7, color: '#22C55E' },
                        { label: 'SPD', value: selUnit.speed, max: 5, color: '#FBBF24' },
                      ].map(stat => (
                        <div key={stat.label} className="flex items-center gap-2">
                          <span className="text-[9px] font-bold w-6" style={{ color: stat.color, fontFamily: 'var(--font-cinzel), serif' }}>{stat.label}</span>
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(stat.value / stat.max) * 100}%`, background: stat.color, boxShadow: `0 0 6px ${stat.color}44` }} />
                          </div>
                          <span className="text-[10px] font-bold w-4 text-right" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <div><span className="text-[9px] font-bold" style={{ color: '#22C55E' }}>▲ Strong vs: </span><span className="text-[9px] opacity-60">{selUnit.strongVs.map(t => UNIT_TYPES[t].name).join(', ') || 'None'}</span></div>
                      <div><span className="text-[9px] font-bold" style={{ color: '#EF4444' }}>▼ Weak vs: </span><span className="text-[9px] opacity-60">{selUnit.weakVs.map(t => UNIT_TYPES[t].name).join(', ') || 'None'}</span></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="text-center mt-4">
                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-2" style={{ fontFamily: 'var(--font-cinzel), serif' }}>Type Advantage Web</div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px]">
                  <span className="px-2 py-1 rounded" style={{ background: '#A1887F22', color: '#A1887F' }}>🔱 Spearman</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#D4A01722', color: '#D4A017' }}>🐎 Cavalry</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#A1887F22', color: '#A1887F' }}>🔱 Spearman</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] mt-1">
                  <span className="px-2 py-1 rounded" style={{ background: '#C0C0C022', color: '#C0C0C0' }}>⚔️ Swordsman</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#22C55E22', color: '#22C55E' }}>🏹 Archer</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#F472B622', color: '#F472B6' }}>🗡️ Assassin</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#A855F722', color: '#A855F7' }}>🔮 Mage</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] mt-1">
                  <span className="px-2 py-1 rounded" style={{ background: '#60A5FA22', color: '#60A5FA' }}>🛡️ Shield</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#F472B622', color: '#F472B6' }}>🗡️ Assassin</span><span className="opacity-30">|</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#FBBF2422', color: '#FBBF24' }}>✨ Paladin</span><span className="opacity-30">beats</span>
                  <span className="px-2 py-1 rounded" style={{ background: '#A855F722', color: '#A855F7' }}>🔮 Mage</span>
                </div>
              </div>
            </div>
          )}

          {/* START BUTTON */}
          <div className="text-center">
            <button
              onClick={handleStart}
              className="relative px-14 py-5 text-lg font-bold rounded-2xl transition-all duration-300 ease-out cursor-pointer overflow-hidden"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontWeight: 700,
                letterSpacing: '3px',
                background: 'linear-gradient(180deg, #F5D060 0%, #D4A017 30%, #A67C00 70%, #8B6914 100%)',
                color: '#1a0f00',
                border: '2.5px solid #FDE68A66',
                boxShadow: '0 8px 0 #5C4A0A, 0 10px 30px rgba(212,160,23,0.4), 0 0 60px rgba(212,160,23,0.15), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
                transform: 'translateY(0)',
                textShadow: '0 1px 0 rgba(255,255,255,0.3)',
                animation: 'btn-golden-pulse 2.5s ease-in-out infinite',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 0 #5C4A0A, 0 14px 40px rgba(212,160,23,0.5), 0 0 80px rgba(212,160,23,0.25), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)'; e.currentTarget.style.animation = 'none'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; e.currentTarget.style.boxShadow = '0 8px 0 #5C4A0A, 0 10px 30px rgba(212,160,23,0.4), 0 0 60px rgba(212,160,23,0.15), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)'; e.currentTarget.style.animation = 'btn-golden-pulse 2.5s ease-in-out infinite'; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = '0 3px 0 #5C4A0A, 0 5px 15px rgba(212,160,23,0.3), inset 0 2px 4px rgba(0,0,0,0.2)'; e.currentTarget.style.animation = 'none'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 0 #5C4A0A, 0 14px 40px rgba(212,160,23,0.5), 0 0 80px rgba(212,160,23,0.25), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)'; }}
            >
              <div className="absolute top-0 bottom-0 w-1/3 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)', animation: 'btn-shimmer 3s ease-in-out infinite' }} />
              <div className="absolute top-0 left-3 right-3 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }} />
              <span className="relative z-10" style={{ display: 'inline-block', filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.4))' }}>
                ⚔️ BEGIN CONQUEST ⚔️
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}