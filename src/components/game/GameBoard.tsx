'use client';

import GameSetup from '@/components/game/GameSetup';
import PlayerPanel from '@/components/game/PlayerPanel';
import ActionPanel from '@/components/game/ActionPanel';
import { useGameStore } from '@/lib/game-store';
import { Button } from '@/components/ui/button';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { UNIT_TYPES, type UnitTypeId } from '@/lib/game-data';
import { UnitPortrait } from './UnitCards';
import { useAIController } from '@/hooks/useAIController';
import StoryOverlay from './StoryOverlay';
import AIDialogueBubble from './AIDialogueBubble';
import CinematicIntro from './CinematicIntro';
import dynamic from 'next/dynamic';
import {
  initAudio, startMusic, resumeAudio,
  playSwordClash, playBattleWin, playBattleLose,
  playConquest, playElimination, playVictory,
} from '@/lib/audio-engine';

const GameMap3D = dynamic(() => import('./GameMap3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background: '#060810' }}>
      <span style={{ fontFamily: 'var(--font-cinzel), serif', color: '#D4A017', fontSize: '13px', letterSpacing: '3px', opacity: 0.6 }}>
        LOADING THE KHMER EMPIRE...
      </span>
    </div>
  ),
});

// Territory detail overlay on hover - enhanced with unit portraits
const TerritoryTooltip = React.memo(function TerritoryTooltip({ territoryId }: { territoryId: string | null }) {
  const territories = useGameStore(s => s.territories);
  const players = useGameStore(s => s.players);

  if (!territoryId) return null;
  const territory = territories[territoryId];
  if (!territory) return null;
  const owner = territory.ownerId ? players.find(p => p.id === territory.ownerId) : null;

  // Count units by type - memoized computation
  const entries = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const u of territory.units) counts[u] = (counts[u] || 0) + 1;
    return Object.entries(counts) as [UnitTypeId, number][];
  }, [territory.units]);

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
});

export default function GameBoard() {
  // Use shallow selection to prevent unnecessary re-renders
  const phase = useGameStore(s => s.phase);
  const players = useGameStore(s => s.players);
  const currentPlayerIndex = useGameStore(s => s.currentPlayerIndex);
  const resetGame = useGameStore(s => s.resetGame);
  const winner = useGameStore(s => s.winner);
  const turnNumber = useGameStore(s => s.turnNumber);
  const territories = useGameStore(s => s.territories);
  const selectedTerritory = useGameStore(s => s.selectedTerritory);
  const [hoveredTerritory, setHoveredTerritory] = useState<string | null>(null);

  // Story system - memoized selectors
  const storyBeat = useGameStore(s => s.storyBeat);
  const currentEvent = useGameStore(s => s.currentEvent);
  const dismissStory = useGameStore(s => s.dismissStory);
  const dismissEvent = useGameStore(s => s.dismissEvent);
  const isCampaignMode = useGameStore(s => s.isCampaignMode);
  const campaignProgress = useGameStore(s => s.campaignProgress);

  // Audio: initialize and start music when game begins
  const musicStartedRef = useRef(false);
  useEffect(() => {
    if (phase !== 'title' && phase !== 'setup' && !musicStartedRef.current) {
      initAudio();
      startMusic();
      musicStartedRef.current = true;
    }
    if (phase === 'title') {
      musicStartedRef.current = false;
    }
  }, [phase]);

  // Audio: play battle sounds when battleResult changes
  const battleResult = useGameStore(s => s.battleResult);
  const battleAnimation = useGameStore(s => s.battleAnimation);
  const [screenShake, setScreenShake] = useState(false);
  const prevBattleResultRef = useRef(battleResult);
  const prevBattleAnimRef = useRef(battleAnimation);

  // Screen shake on battle
  useEffect(() => {
    if (battleAnimation && battleAnimation !== prevBattleAnimRef.current) {
      setScreenShake(true);
      const timer = setTimeout(() => setScreenShake(false), 600);
      return () => clearTimeout(timer);
    }
    prevBattleAnimRef.current = battleAnimation;
  }, [battleAnimation]);

  useEffect(() => {
    if (battleResult && battleResult !== prevBattleResultRef.current) {
      // Only play audio for human player battles (AI handles its own audio)
      const currentPlayer = useGameStore.getState().players[useGameStore.getState().currentPlayerIndex];
      if (currentPlayer && !currentPlayer.isAI) {
        if (battleResult.conquered) {
          playConquest();
          // Check for elimination
          const state = useGameStore.getState();
          const eliminated = state.players.find(p => p.eliminated);
          if (eliminated && state.battleLog.some(l => l.message.includes(eliminated.name) && l.message.includes('eliminated'))) {
            setTimeout(() => playElimination(), 300);
          }
        } else {
          const attackerLostMore = battleResult.attackerLosses > battleResult.defenderLosses;
          if (attackerLostMore) {
            playBattleLose();
          } else {
            playBattleWin();
          }
        }
      }
    }
    prevBattleResultRef.current = battleResult;
  }, [battleResult]);

  // Audio: victory sound on game over
  const phaseRef = useRef(phase);
  useEffect(() => {
    if (phase === 'gameover' && phaseRef.current !== 'gameover') {
      playVictory();
    }
    phaseRef.current = phase;
  }, [phase]);

  // Resume audio on any click (browser autoplay policy)
  useEffect(() => {
    const handler = () => resumeAudio();
    window.addEventListener('click', handler, { once: false });
    return () => window.removeEventListener('click', handler);
  }, []);

  // AI turn controller
  useAIController();

  // Handle territory hover from 3D map - memoized callback
  const handleTerritoryHover = useCallback((id: string | null) => {
    setHoveredTerritory(id);
  }, []);

  if (phase === 'setup') {
    return <GameSetup />;
  }

  // Memoize computed values
  const currentPlayer = useMemo(() => players[currentPlayerIndex], [players, currentPlayerIndex]);
  const isAITurn = useMemo(() => 
    currentPlayer?.isAI && !currentPlayer?.eliminated && phase !== 'gameover',
    [currentPlayer, phase]
  );

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
            REALM OF THE KHMER EMPIRE
          </h1>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
            background: 'rgba(212,160,23,0.15)',
            color: '#D4A017',
            fontFamily: 'var(--font-cinzel), serif',
          }}>
            Turn {turnNumber}
          </span>
          {isCampaignMode && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
              background: 'rgba(168,85,247,0.15)',
              color: '#A78BFA',
              fontFamily: 'var(--font-cinzel), serif',
            }}>
              Ch.{campaignProgress.currentChapter}
            </span>
          )}
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
          {isAITurn && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-md"
              style={{
                background: 'rgba(168,85,247,0.15)',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#A855F7' }} />
              <span className="text-[10px] font-bold" style={{ color: '#A855F7', fontFamily: 'var(--font-cinzel), serif' }}>
                AI THINKING
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Map */}
        <div className="flex-1 relative p-2 md:p-4">
          <div
            className="w-full h-full rounded-lg overflow-hidden relative"
            style={{
              border: '2px solid rgba(139,115,85,0.2)',
              animation: screenShake ? 'mapShake 0.15s ease-in-out 4' : 'none',
            }}
          >
            <div className="w-full h-full">
              <GameMap3D onTerritoryHover={handleTerritoryHover} />
            </div>
            {/* Territory tooltip */}
            <TerritoryTooltip territoryId={hoveredTerritory || selectedTerritory} />
            {/* AI thinking overlay - blocks interaction during AI turn */}
            {isAITurn && (
              <div
                className="absolute inset-0 flex items-center justify-center z-20"
                style={{ background: 'rgba(0,0,0,0.2)', cursor: 'wait' }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2" style={{ animation: 'aiPulse 1.5s ease-in-out infinite' }}>🤖</div>
                  <div
                    className="text-xs tracking-widest opacity-70"
                    style={{ fontFamily: 'var(--font-cinzel), serif', color: currentPlayer?.color || '#A855F7' }}
                  >
                    {currentPlayer?.name} is commanding...
                  </div>
                </div>
                <style>{`
                  @keyframes aiPulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.1); }
                  }
                `}</style>
              </div>
            )}
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
                  The Khmer Empire has been united
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

      {/* AI Dialogue Bubble */}
      <AIDialogueBubble />

      {/* Campaign Event Banner */}
      {currentEvent && !storyBeat && (
        <div
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[90%] p-4 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(20,15,8,0.95), rgba(15,10,5,0.98))',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 30px rgba(212,175,55,0.1), 0 8px 32px rgba(0,0,0,0.6)',
            animation: 'eventSlideIn 0.5s ease forwards',
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div
                className="text-xs font-bold tracking-widest mb-1.5"
                style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  color: '#D4A017',
                  textShadow: '0 0 8px rgba(212,160,23,0.3)',
                }}
              >
                {currentEvent.title}
              </div>
              <p
                className="text-[11px] leading-relaxed opacity-70"
                style={{ fontFamily: 'var(--font-cinzel), serif' }}
              >
                {currentEvent.text}
              </p>
              {currentEvent.effect && (
                <p className="text-[9px] mt-1.5 opacity-40 italic" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  {currentEvent.effect}
                </p>
              )}
            </div>
            <button
              onClick={dismissEvent}
              className="text-xs px-2 py-1 rounded flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: '#D4A017',
                border: '1px solid rgba(212,160,23,0.2)',
              }}
            >
              Dismiss
            </button>
          </div>
          <style jsx global>{`
            @keyframes eventSlideIn {
              0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
              100% { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
            @keyframes mapShake {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(-3px, 2px); }
              50% { transform: translate(3px, -2px); }
              75% { transform: translate(-2px, -1px); }
            }
          `}</style>
        </div>
      )}

      {/* Story Overlay */}
      {storyBeat && <StoryOverlay beat={storyBeat} onDismiss={dismissStory} />}

      {/* Cinematic Intro (plays before story on first game start) */}
      {!storyBeat && <CinematicIntro />}
    </div>
  );
}