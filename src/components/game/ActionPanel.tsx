'use client';

import { useGameStore } from '@/lib/game-store';
import { getMaxAttackerDice, getMaxDefenderDice, getDominantUnit } from '@/lib/game-logic';
import { PHASE_INFO, UNIT_TYPES, getTypeAdvantage, type UnitTypeId } from '@/lib/game-data';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useMemo } from 'react';
import UnitDeployer from './UnitDeployer';
import { TypeAdvantageIndicator, UnitComposition, BattleUnitDisplay, UnitPortrait } from './UnitCards';
import TacticsPanel from './TacticsPanel';
import { TACTICS } from '@/lib/game-data';
import {
  playDiceRoll, playSwordClash, playClick, playPhaseChange,
} from '@/lib/audio-engine';

// Dice face SVG component
function DieFace({ value, size = 36, color = '#F5F0E8', rolling = false }: { value: number; size?: number; color?: string; rolling?: boolean }) {
  const dotPositions: Record<number, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.28, 0.28], [0.5, 0.5], [0.72, 0.72]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.5], [0.72, 0.5], [0.28, 0.72], [0.72, 0.72]],
  };

  const dots = dotPositions[value] || dotPositions[1];
  const r = size * 0.1;
  const dotR = size * 0.07;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={rolling ? 'animate-bounce' : ''}>
      <rect x={r} y={r} width={size - 2 * r} height={size - 2 * r} rx={size * 0.12}
        fill={color} stroke="#2D1F10" strokeWidth="1.5" />
      {dots.map(([dx, dy], i) => (
        <circle key={i} cx={size * dx} cy={size * dy} r={dotR} fill="#2D1F10" />
      ))}
    </svg>
  );
}

export default function ActionPanel() {
  const phase = useGameStore(s => s.phase);
  const reinforcementsLeft = useGameStore(s => s.reinforcementsLeft);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const targetTerritory = useGameStore(s => s.targetTerritory);
  const territories = useGameStore(s => s.territories);
  const attackerDiceCount = useGameStore(s => s.attackerDiceCount);
  const defenderDiceCount = useGameStore(s => s.defenderDiceCount);
  const battleResult = useGameStore(s => s.battleResult);
  const fortifyArmies = useGameStore(s => s.fortifyArmies);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const selectedTactic = useGameStore(s => s.selectedTactic);
  const endDeployPhase = useGameStore(s => s.endDeployPhase);
  const endAttackPhase = useGameStore(s => s.endAttackPhase);
  const endTurn = useGameStore(s => s.endTurn);
  const executeAttack = useGameStore(s => s.executeAttack);
  const setAttackerDiceCount = useGameStore(s => s.setAttackerDiceCount);
  const executeFortify = useGameStore(s => s.executeFortify);
  const setFortifyArmies = useGameStore(s => s.setFortifyArmies);
  const clearSelection = useGameStore(s => s.clearSelection);
  const [isRolling, setIsRolling] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const isAI = currentPlayer?.isAI && !currentPlayer?.eliminated;
  const selectedTerr = selectedTerritory ? territories[selectedTerritory] : null;
  const targetTerr = targetTerritory ? territories[targetTerritory] : null;
  const maxAttackerDice = selectedTerr ? getMaxAttackerDice(selectedTerr.units.length) : 0;
  const maxDefenderDice = targetTerr ? getMaxDefenderDice(targetTerr.units.length) : 0;

  // Pre-compute type advantage for the current attack pairing
  const { attackDominantType, defendDominantType, typeAdvResult } = useMemo(() => {
    if (!selectedTerr || !targetTerr) return { attackDominantType: null as UnitTypeId | null, defendDominantType: null as UnitTypeId | null, typeAdvResult: 'neutral' as const };
    const atkDom = getDominantUnit(selectedTerr.units);
    const defDom = getDominantUnit(targetTerr.units);
    const adv = atkDom && defDom ? getTypeAdvantage(atkDom, defDom) : 'neutral' as const;
    return { attackDominantType: atkDom, defendDominantType: defDom, typeAdvResult: adv };
  }, [selectedTerr, targetTerr]);

  const handleAttack = useCallback(() => {
    if (attackerDiceCount === 0 || !selectedTerritory || !targetTerritory) return;
    setIsRolling(true);
    playDiceRoll();
    setTimeout(() => {
      playSwordClash();
      executeAttack();
      setTimeout(() => setIsRolling(false), 200);
    }, 600);
  }, [attackerDiceCount, selectedTerritory, targetTerritory, executeAttack]);

  const handleFortify = useCallback(() => {
    if (fortifyArmies <= 0 || !selectedTerritory || !targetTerritory) return;
    playClick();
    executeFortify(selectedTerritory, targetTerritory);
  }, [fortifyArmies, selectedTerritory, targetTerritory, executeFortify]);

  if (phase === 'setup' || phase === 'gameover') return null;

  // Show a simple AI status bar instead of interactive controls
  if (isAI) {
    return (
      <div
        className="flex-shrink-0 px-4 py-3 flex items-center justify-center gap-3"
        style={{
          background: 'linear-gradient(180deg, rgba(30,20,40,0.95), rgba(20,10,30,0.98))',
          borderTop: '2px solid rgba(139,115,85,0.2)',
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#A855F7' }} />
        <span className="text-xs tracking-widest" style={{ fontFamily: 'var(--font-cinzel), serif', color: currentPlayer?.color || '#A855F7' }}>
          {currentPlayer?.icon} {currentPlayer?.name} (AI) is {phase === 'deploy' ? 'deploying reinforcements' : phase === 'attack' ? 'planning attacks' : 'fortifying positions'}...
        </span>
      </div>
    );
  }

  const phaseInfo = PHASE_INFO[phase];
  const activeTacticObj = selectedTactic ? TACTICS[selectedTactic] : null;

  return (
    <div
      className="flex-shrink-0 px-4 py-3 flex flex-col gap-2"
      style={{
        background: 'linear-gradient(180deg, rgba(45,31,16,0.95), rgba(30,20,10,0.98))',
        borderTop: '2px solid rgba(139,115,85,0.3)',
      }}
    >
      {/* Row 1: Phase info + Tactics */}
      <div className="flex items-start gap-4">
        {/* Phase Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017' }}>
            {phaseInfo.title}
            {activeTacticObj && (
              <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{
                background: `${activeTacticObj.color}22`,
                color: activeTacticObj.color,
                border: `1px solid ${activeTacticObj.color}44`,
              }}>
                {activeTacticObj.icon} {activeTacticObj.name}
              </span>
            )}
          </div>
          <div className="text-xs opacity-60 mt-0.5">
            {phase === 'deploy' && (
              <span>{phaseInfo.description} <strong className="text-amber-400">{reinforcementsLeft}</strong></span>
            )}
            {phase === 'attack' && !selectedTerritory && (
              <span>{phaseInfo.description}</span>
            )}
            {phase === 'attack' && selectedTerritory && !targetTerritory && (
              <div className="flex items-center gap-2">
                <UnitPortrait unitType={getDominantUnit(selectedTerr.units) || 'swordsman'} size={18} />
                <span>Selected <strong className="text-amber-300">{selectedTerr.name}</strong></span>
                <UnitComposition units={selectedTerr.units} compact />
                <span className="opacity-50">({selectedTerr.units.length} units). Click adjacent enemy.</span>
              </div>
            )}
            {phase === 'attack' && selectedTerritory && targetTerritory && !battleResult && (
              <div className="flex items-center gap-2 flex-wrap">
                <UnitPortrait unitType={attackDominantType || 'swordsman'} size={18} />
                <span className="text-amber-300">{selectedTerr.name}</span>
                <UnitComposition units={selectedTerr.units} compact />
                <span className="opacity-40">→</span>
                <UnitPortrait unitType={defendDominantType || 'swordsman'} size={18} />
                <span className="text-red-400">{targetTerr.name}</span>
                <UnitComposition units={targetTerr.units} compact />
              </div>
            )}
            {phase === 'fortify' && !selectedTerritory && (
              <span>{phaseInfo.description}</span>
            )}
            {phase === 'fortify' && selectedTerritory && !targetTerritory && (
              <span>From <strong className="text-amber-300">{selectedTerr.name}</strong> ({selectedTerr.units.length}). Click adjacent owned territory.</span>
            )}
            {phase === 'fortify' && selectedTerritory && targetTerritory && (
              <span>
                <strong className="text-amber-300">{selectedTerr.name}</strong> → <strong className="text-green-400">{targetTerr.name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Tactics panel on the right */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <TacticsPanel />
        </div>
      </div>

      {/* Row 2: Deploy unit selector */}
      {phase === 'deploy' && <UnitDeployer />}

      {/* Row 2: Attack controls */}
      {phase === 'attack' && (
        <div className="flex items-center gap-3 flex-wrap">
          {/* Battle result display with unit portraits */}
          {battleResult && (
            <div className="flex items-center gap-4 px-3 py-1 rounded-lg" style={{
              background: battleResult.conquered ? 'rgba(212,160,23,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${battleResult.conquered ? '#D4A01744' : 'rgba(255,255,255,0.06)'}`,
            }}>
              {battleResult.attackerType && (
                <BattleUnitDisplay unitType={battleResult.attackerType} side="attacker" losses={battleResult.attackerLosses} />
              )}
              <div className="flex flex-col items-center gap-1">
                {/* Dice */}
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-amber-400 mr-0.5" style={{ fontFamily: 'var(--font-cinzel), serif' }}>ATK</span>
                  {battleResult.attackerRolls.map((val, i) => (
                    <DieFace key={`a-${i}`} value={val} size={30} color="#FDE68A" />
                  ))}
                </div>
                <span className="text-sm opacity-40">⚔️</span>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] text-red-400 mr-0.5" style={{ fontFamily: 'var(--font-cinzel), serif' }}>DEF</span>
                  {battleResult.defenderRolls.map((val, i) => (
                    <DieFace key={`d-${i}`} value={val} size={30} color="#FECACA" />
                  ))}
                </div>
                {battleResult.tacticUsed && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded" style={{
                    background: `${TACTICS[battleResult.tacticUsed as keyof typeof TACTICS]?.color}22`,
                    color: TACTICS[battleResult.tacticUsed as keyof typeof TACTICS]?.color,
                  }}>
                    {TACTICS[battleResult.tacticUsed as keyof typeof TACTICS]?.icon} {TACTICS[battleResult.tacticUsed as keyof typeof TACTICS]?.name}
                  </span>
                )}
              </div>
              {battleResult.defenderType && (
                <BattleUnitDisplay unitType={battleResult.defenderType} side="defender" losses={battleResult.defenderLosses} />
              )}
            </div>
          )}

          {/* Type advantage indicator before battle */}
          {selectedTerritory && targetTerritory && !battleResult && (
            <TypeAdvantageIndicator
              attackerType={attackDominantType}
              defenderType={defendDominantType}
              advantage={typeAdvResult}
            />
          )}

          {/* Dice Selector */}
          {selectedTerritory && targetTerritory && !battleResult && (
            <div className="flex items-center gap-2">
              <span className="text-xs opacity-50">Dice:</span>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setAttackerDiceCount(n)}
                  disabled={n > maxAttackerDice}
                  className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: attackerDiceCount === n ? '#D4A017' : 'rgba(255,255,255,0.05)',
                    color: attackerDiceCount === n ? '#1a0f00' : n > maxAttackerDice ? '#333' : '#8B7355',
                    border: `1.5px solid ${attackerDiceCount === n ? '#D4A017' : '#5C4A3244'}`,
                    opacity: n > maxAttackerDice ? 0.3 : 1,
                    cursor: n <= maxAttackerDice ? 'pointer' : 'not-allowed',
                  }}
                >
                  {n}
                </button>
              ))}

              <Button
                onClick={handleAttack}
                disabled={attackerDiceCount === 0 || isRolling}
                size="sm"
                className="ml-2 px-4"
                style={{
                  background: isRolling ? '#5C4A32' : 'linear-gradient(135deg, #DC2626, #991B1B)',
                  border: '1.5px solid #FCA5A544',
                  color: '#fff',
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '12px',
                }}
              >
                {isRolling ? '⚔️ Rolling...' : '🗡️ Attack!'}
              </Button>
            </div>
          )}

          {/* Continue/End buttons after battle */}
          {battleResult && (
            <div className="flex items-center gap-2">
              {selectedTerritory && territories[selectedTerritory].units.length > 1 && (
                <Button
                  onClick={clearSelection}
                  size="sm"
                  className="px-3"
                  style={{
                    background: 'rgba(212,160,23,0.15)',
                    border: '1.5px solid #D4A01744',
                    color: '#D4A017',
                    fontFamily: 'var(--font-cinzel), serif',
                    fontSize: '11px',
                  }}
                >
                  Continue
                </Button>
              )}
              <Button
                onClick={() => { playClick(); endAttackPhase(); }}
                size="sm"
                className="px-3"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  color: '#8B7355',
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: '11px',
                }}
              >
                End Attacks
              </Button>
            </div>
          )}

          {/* End Attack Phase (no attacks made) */}
          {!selectedTerritory && !battleResult && (
            <Button
              onClick={() => { playClick(); endAttackPhase(); }}
              size="sm"
              className="px-3"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#8B7355',
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: '11px',
              }}
            >
              Skip Attacks →
            </Button>
          )}
        </div>
      )}

      {/* Row 2: Deploy End button */}
      {phase === 'deploy' && (
        <Button
          onClick={() => { playClick(); endDeployPhase(); }}
          disabled={reinforcementsLeft > 0}
          size="sm"
          className="px-4 self-end"
          style={{
            background: 'linear-gradient(135deg, #D4A017, #92700C)',
            border: '1.5px solid #FDE68A44',
            color: '#1a0f00',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '12px',
            opacity: reinforcementsLeft > 0 ? 0.5 : 1,
          }}
        >
          ⚔️ Begin Attacks
        </Button>
      )}

      {/* Row 2: Fortify controls */}
      {phase === 'fortify' && selectedTerritory && targetTerritory && (
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={1}
            max={Math.min(fortifyArmies, selectedTerr.units.length - 1)}
            value={fortifyArmies}
            onChange={(e) => setFortifyArmies(parseInt(e.target.value))}
            className="w-24"
          />
          <span className="text-sm font-bold text-amber-400 w-6 text-center">{fortifyArmies}</span>
          <Button
            onClick={handleFortify}
            size="sm"
            className="px-3"
            style={{
              background: 'linear-gradient(135deg, #166534, #14532D)',
              border: '1.5px solid #86EFAC44',
              color: '#fff',
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '12px',
            }}
          >
            🛡️ Fortify
          </Button>
        </div>
      )}

      {/* Fortify: End Turn */}
      {phase === 'fortify' && !targetTerritory && (
        <Button
          onClick={() => { playClick(); endTurn(); }}
          size="sm"
          className="px-4 self-end"
          style={{
            background: 'linear-gradient(135deg, #D4A017, #92700C)',
            border: '1.5px solid #FDE68A44',
            color: '#1a0f00',
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '12px',
          }}
        >
          🏰 End Turn
        </Button>
      )}
    </div>
  );
}