'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '@/lib/game-store';
import { PLAYER_CONFIGS } from '@/lib/game-data';
import Image from 'next/image';

const INTRO_STAGES = [
  'black',        // 0: Pure black (500ms)
  'logo',         // 1: Title fade in with glow (2500ms)
  'portraits',    // 2: Character portraits slide in (3000ms)
  'fadeOut',      // 3: Everything fades out (800ms)
  'done',         // 4: Dismiss
] as const;

type Stage = (typeof INTRO_STAGES)[number];

export default function CinematicIntro() {
  const cinematicIntroActive = useGameStore(s => s.cinematicIntroActive);
  const dismissCinematicIntro = useGameStore(s => s.dismissCinematicIntro);
  const [stage, setStage] = useState<Stage>('black');
  const [opacity, setOpacity] = useState(0);

  // Stage progression
  useEffect(() => {
    if (!cinematicIntroActive) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Fade in from black
    timers.push(setTimeout(() => {
      setStage('logo');
      setOpacity(1);
    }, 600));

    // Show portraits
    timers.push(setTimeout(() => {
      setStage('portraits');
    }, 3000));

    // Fade out
    timers.push(setTimeout(() => {
      setStage('fadeOut');
      setOpacity(0);
    }, 6500));

    // Done
    timers.push(setTimeout(() => {
      setStage('done');
      // Trigger the pending story queue
      const store = useGameStore.getState() as any;
      if (store._pendingStoryQueue) {
        store._pendingStoryQueue();
        store._pendingStoryQueue = null;
      }
      dismissCinematicIntro();
    }, 7500));

    return () => timers.forEach(clearTimeout);
  }, [cinematicIntroActive, dismissCinematicIntro]);

  const handleSkip = useCallback(() => {
    const store = useGameStore.getState() as any;
    if (store._pendingStoryQueue) {
      store._pendingStoryQueue();
      store._pendingStoryQueue = null;
    }
    dismissCinematicIntro();
  }, [dismissCinematicIntro]);

  if (!cinematicIntroActive || stage === 'done') return null;

  const showTitle = stage === 'logo' || stage === 'portraits';
  const showPortraits = stage === 'portraits' || stage === 'fadeOut';

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center"
      style={{
        background: '#000',
        opacity: opacity,
        transition: 'opacity 0.8s ease',
      }}
      onClick={handleSkip}
    >
      {/* Atmospheric particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              background: '#D4AF37',
              opacity: 0.15 + Math.random() * 0.25,
              animation: `particleDrift ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow behind title */}
      {showTitle && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
            filter: 'blur(40px)',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Decorative line top */}
        {showTitle && (
          <div
            className="mb-6"
            style={{
              width: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #D4AF3766, transparent)',
              animation: 'lineExpand 1.5s ease forwards',
              animationDelay: '0.3s',
            }}
          />
        )}

        {/* Title */}
        {showTitle && (
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-[0.15em] mb-3"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: '#D4AF37',
              textShadow: '0 0 40px rgba(212,175,55,0.4), 0 0 80px rgba(212,175,55,0.15), 0 2px 8px rgba(0,0,0,0.9)',
              animation: 'titleReveal 2s ease forwards',
              opacity: 0,
            }}
          >
            REALM OF THE
          </h1>
        )}

        {showTitle && (
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-[0.2em] mb-4"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: '#FDE68A',
              textShadow: '0 0 60px rgba(212,175,55,0.5), 0 0 120px rgba(212,175,55,0.2), 0 3px 10px rgba(0,0,0,0.9)',
              animation: 'titleReveal 2s ease forwards',
              animationDelay: '0.4s',
              opacity: 0,
            }}
          >
            KHMER EMPIRE
          </h2>
        )}

        {/* Decorative line bottom */}
        {showTitle && (
          <div
            className="mb-4"
            style={{
              width: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #D4AF3766, transparent)',
              animation: 'lineExpand 1.5s ease forwards',
              animationDelay: '0.6s',
            }}
          />
        )}

        {/* Subtitle */}
        {showTitle && (
          <p
            className="text-xs md:text-sm tracking-[6px] uppercase mb-8"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: 'rgba(212,175,55,0.5)',
              textShadow: '0 0 12px rgba(212,175,55,0.2)',
              animation: 'titleReveal 1.5s ease forwards',
              animationDelay: '0.8s',
              opacity: 0,
            }}
          >
            The War of the Broken Crown
          </p>
        )}

        {/* Character portraits row */}
        {showPortraits && (
          <div
            className="flex items-end justify-center gap-3 md:gap-6"
            style={{
              animation: 'portraitsSlideIn 1.2s ease forwards',
              opacity: 0,
            }}
          >
            {PLAYER_CONFIGS.map((p, i) => (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{
                  animation: `portraitFadeIn 0.8s ease forwards`,
                  animationDelay: `${i * 0.15}s`,
                  opacity: 0,
                }}
              >
                <div
                  className="w-12 h-16 md:w-16 md:h-20 rounded-md overflow-hidden mb-1.5"
                  style={{
                    border: `1.5px solid ${p.color}88`,
                    boxShadow: `0 0 16px ${p.color}33, 0 4px 12px rgba(0,0,0,0.6)`,
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover object-top"
                    unoptimized
                  />
                </div>
                <span
                  className="text-[7px] md:text-[8px] tracking-wider font-bold"
                  style={{
                    color: p.color,
                    fontFamily: 'var(--font-cinzel), serif',
                    textShadow: `0 0 6px ${p.color}44`,
                    opacity: 0.8,
                  }}
                >
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skip button */}
      {stage !== 'fadeOut' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="absolute bottom-8 right-8 z-20 px-4 py-2 rounded text-[10px] tracking-widest uppercase transition-all hover:opacity-100 opacity-30"
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            color: '#D4AF37',
            border: '1px solid rgba(212,175,55,0.2)',
            background: 'rgba(0,0,0,0.4)',
            animation: 'titleReveal 1s ease forwards',
            animationDelay: '2s',
            opacity: 0,
          }}
        >
          Skip ▸▸
        </button>
      )}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes particleDrift {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.1; }
          25% { transform: translateY(-20px) translateX(5px); opacity: 0.3; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.15; }
          75% { transform: translateY(-30px) translateX(3px); opacity: 0.25; }
        }
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes titleReveal {
          0% { opacity: 0; transform: translateY(15px); letter-spacing: 0.3em; }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineExpand {
          0% { width: 0; opacity: 0; }
          100% { width: 200px; opacity: 1; }
        }
        @keyframes portraitsSlideIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes portraitFadeIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.9); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}