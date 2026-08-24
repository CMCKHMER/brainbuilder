'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/lib/game-store';

/* ─── particle system ─── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  life: number;
  maxLife: number;
  type: 'firefly' | 'ember' | 'mist';
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function TitleScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Fallback: ensure loading overlay dismisses even if image is cached
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [fadeToGame, setFadeToGame] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const startCampaign = useGameStore((s) => s.startCampaign);
  const startSkirmish = useGameStore((s) => s.startSkirmish);
  const startGame = useGameStore((s) => s.startGame);

  const menuItems = [
    { id: 'campaign', label: 'NEW CAMPAIGN', action: () => { setShowModeSelect(true); } },
    { id: 'skirmish', label: 'SKIRMISH MODE', action: () => handleModeSelect(false) },
    { id: 'multi', label: 'MULTIPLAYER', action: () => {} },
    { id: 'credits', label: 'CREDITS', action: () => {} },
  ];

  const handleModeSelect = useCallback((isCampaign: boolean) => {
    setShowModeSelect(false);
    setFadeToGame(true);
    setTimeout(() => {
      if (isCampaign) {
        startCampaign();
      } else {
        startSkirmish();
      }
    }, 1200);
  }, [startCampaign, startSkirmish]);

  const handleStart = useCallback(() => {
    setFadeToGame(true);
    setTimeout(() => startGame(), 1200);
  }, [startGame]);

  /* ─── canvas particle engine ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    // Seed initial particles
    const spawnParticle = (type: Particle['type'] = 'firefly'): Particle => {
      const w = canvas.width;
      const h = canvas.height;
      switch (type) {
        case 'firefly':
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: randomRange(-0.3, 0.3),
            vy: randomRange(-0.5, -0.1),
            size: randomRange(1.5, 3.5),
            opacity: 0,
            hue: randomRange(35, 55), // warm gold
            life: 0,
            maxLife: randomRange(180, 420),
            type: 'firefly',
          };
        case 'ember':
          return {
            x: Math.random() * w,
            y: h + 10,
            vx: randomRange(-0.5, 0.5),
            vy: randomRange(-1.5, -0.5),
            size: randomRange(1, 2.5),
            opacity: randomRange(0.5, 0.9),
            hue: randomRange(10, 35), // orange-red
            life: 0,
            maxLife: randomRange(120, 300),
            type: 'ember',
          };
        case 'mist':
          return {
            x: randomRange(-100, w + 100),
            y: h * randomRange(0.5, 0.95),
            vx: randomRange(0.1, 0.4),
            vy: randomRange(-0.05, 0.05),
            size: randomRange(80, 200),
            opacity: 0,
            hue: 220,
            life: 0,
            maxLife: randomRange(400, 800),
            type: 'mist',
          };
      }
    };

    // Initialize
    for (let i = 0; i < 60; i++) particles.current.push(spawnParticle('firefly'));
    for (let i = 0; i < 15; i++) particles.current.push(spawnParticle('ember'));
    for (let i = 0; i < 6; i++) particles.current.push(spawnParticle('mist'));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spawn new particles periodically
      if (frame % 8 === 0 && particles.current.filter(p => p.type === 'firefly').length < 80) {
        particles.current.push(spawnParticle('firefly'));
      }
      if (frame % 20 === 0 && particles.current.filter(p => p.type === 'ember').length < 25) {
        particles.current.push(spawnParticle('ember'));
      }
      if (frame % 60 === 0 && particles.current.filter(p => p.type === 'mist').length < 8) {
        particles.current.push(spawnParticle('mist'));
      }

      // Draw & update
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.life++;

        // Fade in/out lifecycle
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = lerp(0, p.type === 'mist' ? 0.06 : 0.8, lifeRatio / 0.15);
        } else if (lifeRatio > 0.75) {
          p.opacity = lerp(p.type === 'mist' ? 0.06 : 0.8, 0, (lifeRatio - 0.75) / 0.25);
        }

        // Gentle mouse repulsion for fireflies
        if (p.type === 'firefly') {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.15;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          // Dampen velocity
          p.vx *= 0.995;
          p.vy *= 0.995;
          // Wandering
          p.vx += Math.sin(frame * 0.01 + i) * 0.02;
          p.vy += Math.cos(frame * 0.013 + i) * 0.015;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Remove dead or off-screen
        if (p.life >= p.maxLife || p.x < -250 || p.x > w + 250 || p.y < -50 || p.y > h + 50) {
          particles.current.splice(i, 1);
          continue;
        }

        if (p.type === 'firefly') {
          // Pulsing glow
          const pulse = 0.6 + Math.sin(frame * 0.05 + i * 1.7) * 0.4;
          const alpha = p.opacity * pulse;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          glow.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha})`);
          glow.addColorStop(0.4, `hsla(${p.hue}, 70%, 55%, ${alpha * 0.4})`);
          glow.addColorStop(1, `hsla(${p.hue}, 60%, 40%, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fill();
          // Core
          ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ember') {
          const flicker = 0.7 + Math.sin(frame * 0.12 + i * 3.1) * 0.3;
          const alpha = p.opacity * flicker;
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          glow.addColorStop(0, `hsla(${p.hue}, 90%, 60%, ${alpha})`);
          glow.addColorStop(0.5, `hsla(${p.hue}, 80%, 45%, ${alpha * 0.3})`);
          glow.addColorStop(1, `hsla(${p.hue}, 70%, 30%, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'mist') {
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `hsla(${p.hue}, 30%, 40%, ${p.opacity})`);
          gradient.addColorStop(0.6, `hsla(${p.hue}, 25%, 30%, ${p.opacity * 0.4})`);
          gradient.addColorStop(1, `hsla(${p.hue}, 20%, 25%, 0)`);
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Subtle vignette
      const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.75);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.35)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ cursor: 'default' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-[8000ms] ease-in-out"
        style={{
          backgroundImage: 'url(/game_menu.png)',
          animation: 'kenBurns 20s ease-in-out infinite alternate',
          filter: 'brightness(0.75) saturate(1.15) contrast(1.05)',
        }}
      />

      {/* Dark gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Ambient light beams */}
      <div
        className="absolute z-[5] pointer-events-none"
        style={{
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '60%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(180,160,120,0.06) 0%, transparent 60%)',
          animation: 'lightBeam 8s ease-in-out infinite alternate',
        }}
      />

      {/* Portal glow pulse (top center area) */}
      <div
        className="absolute z-[6] pointer-events-none"
        style={{
          top: '0%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse at 50% 80%, rgba(100,80,200,0.12) 0%, rgba(60,100,200,0.06) 40%, transparent 70%)',
          animation: 'portalPulse 4s ease-in-out infinite',
        }}
      />

      {/* Title area */}
      <div
        className="absolute z-20 flex flex-col items-center pointer-events-none"
        style={{
          top: '6%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: '800px',
        }}
      >
        {/* Title glow backdrop */}
        <div
          className="absolute -inset-10 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 65%)',
            animation: 'titleGlow 3s ease-in-out infinite alternate',
          }}
        />
        <h1
          className="relative font-[var(--font-cinzel)] text-center select-none"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            color: '#D4AF37',
            textShadow: `
              0 0 20px rgba(212,175,55,0.6),
              0 0 40px rgba(212,175,55,0.3),
              0 0 80px rgba(212,175,55,0.15),
              0 2px 4px rgba(0,0,0,0.8)
            `,
            letterSpacing: '0.08em',
            animation: 'titleFloat 6s ease-in-out infinite',
          }}
        >
          REALM OF
        </h1>
        <h1
          className="relative font-[var(--font-cinzel)] text-center select-none mt-1"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            fontWeight: 900,
            color: '#F0D060',
            textShadow: `
              0 0 25px rgba(240,208,96,0.7),
              0 0 50px rgba(240,208,96,0.35),
              0 0 100px rgba(240,208,96,0.15),
              0 3px 6px rgba(0,0,0,0.9)
            `,
            letterSpacing: '0.12em',
            animation: 'titleFloat 6s ease-in-out infinite reverse',
          }}
        >
          THE KHMER EMPIRE
        </h1>

        {/* Decorative divider */}
        <div
          className="relative mt-4 mb-1"
          style={{
            width: 'clamp(200px, 40vw, 500px)',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #D4AF37, #F0D060, #D4AF37, transparent)',
            boxShadow: '0 0 12px rgba(212,175,55,0.5)',
            animation: 'dividerGlow 2.5s ease-in-out infinite alternate',
          }}
        />
        <p
          className="relative font-[var(--font-cinzel)] text-center select-none"
          style={{
            fontSize: 'clamp(0.7rem, 1.5vw, 1rem)',
            color: 'rgba(200,180,130,0.7)',
            letterSpacing: '0.3em',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            textTransform: 'uppercase',
          }}
        >
          Conquer the Shattered Lands
        </p>
      </div>

      {/* Mode Selection Overlay */}
      {showModeSelect && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', animation: 'modeFadeIn 0.3s ease forwards' }}
        >
          <div
            className="p-8 rounded-xl max-w-md w-[90%]"
            style={{
              background: 'linear-gradient(180deg, rgba(30,20,8,0.95), rgba(15,10,5,0.98))',
              border: '1.5px solid rgba(212,175,55,0.3)',
              boxShadow: '0 0 40px rgba(212,175,55,0.1), 0 16px 48px rgba(0,0,0,0.6)',
            }}
          >
            <h2
              className="text-xl font-bold tracking-widest text-center mb-2"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: '#D4AF37',
                textShadow: '0 0 12px rgba(212,175,55,0.4)',
              }}
            >
              CHOOSE YOUR PATH
            </h2>
            <p className="text-[11px] text-center opacity-40 mb-6" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
              How will you wage war for the Aetheric Crown?
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleModeSelect(true)}
                onMouseEnter={() => setHoveredItem('mode-campaign')}
                onMouseLeave={() => setHoveredItem(null)}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  background: hoveredItem === 'mode-campaign' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${hoveredItem === 'mode-campaign' ? 'rgba(212,175,55,0.5)' : 'rgba(139,115,85,0.2)'}`,
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">📜</span>
                  <span
                    className="text-base font-bold tracking-wider"
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      color: hoveredItem === 'mode-campaign' ? '#F5E6A3' : '#D4AF37',
                    }}
                  >
                    CAMPAIGN
                  </span>
                </div>
                <p className="text-[10px] opacity-50 ml-9" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Experience the full story of the War of the Broken Crown. Chapter transitions, narrative triggers on key territory captures, rival dialogues, and an epic 5-chapter saga from assembly to final stand.
                </p>
              </button>
              <button
                onClick={() => handleModeSelect(false)}
                onMouseEnter={() => setHoveredItem('mode-skirmish')}
                onMouseLeave={() => setHoveredItem(null)}
                className="p-4 rounded-lg text-left transition-all"
                style={{
                  background: hoveredItem === 'mode-skirmish' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${hoveredItem === 'mode-skirmish' ? 'rgba(212,175,55,0.5)' : 'rgba(139,115,85,0.2)'}`,
                }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-2xl">⚔️</span>
                  <span
                    className="text-base font-bold tracking-wider"
                    style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      color: hoveredItem === 'mode-skirmish' ? '#F5E6A3' : '#D4AF37',
                    }}
                  >
                    SKIRMISH
                  </span>
                </div>
                <p className="text-[10px] opacity-50 ml-9" style={{ fontFamily: 'var(--font-cinzel), serif' }}>
                  Jump straight into battle. Pure strategy with no story interruptions. Conquer the Khmer Empire at your own pace with random events and full tactical gameplay.
                </p>
              </button>
            </div>
            <button
              onClick={() => setShowModeSelect(false)}
              className="w-full mt-4 py-2 rounded text-[10px] tracking-widest uppercase transition-all opacity-50 hover:opacity-100"
              style={{
                fontFamily: 'var(--font-cinzel), serif',
                color: '#8B7355',
                border: '1px solid rgba(139,115,85,0.2)',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu panel */}
      <div
        className="absolute z-20 flex flex-col items-center gap-3"
        style={{
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {menuItems.map((item, index) => (
          <button
            key={item.id}
            onClick={item.action}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className="group relative font-[var(--font-cinzel)] select-none outline-none border-none bg-transparent"
            style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
              fontWeight: 600,
              color: hoveredItem === item.id ? '#F5E6A3' : '#C9A84C',
              textShadow: hoveredItem === item.id
                ? '0 0 15px rgba(212,175,55,0.8), 0 0 30px rgba(212,175,55,0.4), 0 2px 4px rgba(0,0,0,0.9)'
                : '0 0 8px rgba(212,175,55,0.3), 0 1px 3px rgba(0,0,0,0.8)',
              letterSpacing: '0.2em',
              padding: '8px 32px',
              transition: 'all 0.3s ease',
              transform: hoveredItem === item.id ? 'scale(1.08)' : 'scale(1)',
              animation: `menuFadeIn 0.8s ease ${index * 0.12}s both`,
              cursor: 'pointer',
              background: hoveredItem === item.id
                ? 'linear-gradient(90deg, transparent, rgba(212,175,55,0.08), transparent)'
                : 'none',
              borderRadius: '4px',
            }}
          >
            {/* Hover underline glow */}
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] transition-all duration-300"
              style={{
                width: hoveredItem === item.id ? '80%' : '0%',
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
                boxShadow: '0 0 8px rgba(212,175,55,0.6)',
              }}
            />
            {/* Side decorative brackets on hover */}
            {hoveredItem === item.id && (
              <>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 text-sm animate-pulse">[</span>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 text-sm animate-pulse">]</span>
              </>
            )}
            {item.label}
          </button>
        ))}
      </div>

      {/* Torch flicker effects (bottom corners) */}
      <div className="absolute bottom-0 left-0 z-10 pointer-events-none w-32 h-48">
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '20%',
            width: '30px',
            height: '50px',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,150,30,0.25) 0%, rgba(255,100,20,0.1) 40%, transparent 70%)',
            animation: 'torchFlicker 0.15s ease-in-out infinite alternate',
            filter: 'blur(3px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '25%',
            width: '12px',
            height: '20px',
            background: 'radial-gradient(ellipse at 50% 70%, rgba(255,220,100,0.6) 0%, rgba(255,150,30,0.2) 50%, transparent 80%)',
            animation: 'torchFlame 0.1s ease-in-out infinite alternate',
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 z-10 pointer-events-none w-32 h-48">
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: '30px',
            height: '50px',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(255,150,30,0.25) 0%, rgba(255,100,20,0.1) 40%, transparent 70%)',
            animation: 'torchFlicker 0.18s ease-in-out infinite alternate-reverse',
            filter: 'blur(3px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '25%',
            width: '12px',
            height: '20px',
            background: 'radial-gradient(ellipse at 50% 70%, rgba(255,220,100,0.6) 0%, rgba(255,150,30,0.2) 50%, transparent 80%)',
            animation: 'torchFlame 0.12s ease-in-out infinite alternate-reverse',
          }}
        />
      </div>

      {/* Loading overlay */}
      <div
        className="absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000"
        style={{ opacity: loaded ? 0 : 1, pointerEvents: loaded ? 'none' : 'all' }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 border-2 border-t-transparent rounded-full mx-auto mb-4"
            style={{
              borderColor: '#D4AF37',
              borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p
            className="font-[var(--font-cinzel)] text-lg tracking-widest"
            style={{ color: '#C9A84C', textShadow: '0 0 10px rgba(212,175,55,0.4)' }}
          >
            ENTERING THE REALM...
          </p>
        </div>
      </div>

      {/* Fade to game transition */}
      <div
        className="absolute inset-0 z-50 bg-black pointer-events-none transition-opacity duration-1000"
        style={{ opacity: fadeToGame ? 1 : 0 }}
      />

      {/* Image preload + loaded trigger */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/game_menu.png"
        alt=""
        className="hidden"
        onLoad={() => {
          setTimeout(() => setLoaded(true), 400);
        }}
        onError={() => setLoaded(true)}
      />

      {/* Inline keyframes */}
      <style jsx global>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.06) translate(-0.5%, -0.3%); }
        }
        @keyframes titleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes titleGlow {
          0% { opacity: 0.2; }
          100% { opacity: 0.4; }
        }
        @keyframes dividerGlow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes menuFadeIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes torchFlicker {
          0% { opacity: 0.6; transform: scaleY(1); }
          100% { opacity: 1; transform: scaleY(1.15); }
        }
        @keyframes torchFlame {
          0% { opacity: 0.7; transform: scaleX(0.9) scaleY(0.95); }
          100% { opacity: 1; transform: scaleX(1.1) scaleY(1.05); }
        }
        @keyframes lightBeam {
          0% { opacity: 0.5; transform: translateX(-50%) rotate(-1deg); }
          100% { opacity: 0.8; transform: translateX(-50%) rotate(1deg); }
        }
        @keyframes portalPulse {
          0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes modeFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}