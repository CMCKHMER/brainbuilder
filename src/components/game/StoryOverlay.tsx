'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { type StoryBeat } from '@/lib/story-data';
import Image from 'next/image';

interface StoryOverlayProps {
  beat: StoryBeat;
  onDismiss: () => void;
  onLastPage?: () => void;
}

const BG_STYLES: Record<string, { bg: string; overlay: string; accent: string }> = {
  dark: {
    bg: 'linear-gradient(180deg, #0a0806 0%, #1a1208 40%, #0d0a06 100%)',
    overlay: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.04) 0%, transparent 60%)',
    accent: '#D4AF37',
  },
  dramatic: {
    bg: 'linear-gradient(180deg, #0a0810 0%, #1a0f18 40%, #0d0810 100%)',
    overlay: 'radial-gradient(ellipse at 50% 40%, rgba(120,80,200,0.06) 0%, transparent 60%)',
    accent: '#A78BFA',
  },
  battle: {
    bg: 'linear-gradient(180deg, #100808 0%, #1a0a0a 40%, #0d0505 100%)',
    overlay: 'radial-gradient(ellipse at 50% 50%, rgba(220,38,38,0.06) 0%, transparent 60%)',
    accent: '#EF4444',
  },
  victory: {
    bg: 'linear-gradient(180deg, #0a0d06 0%, #1a1a08 40%, #0d0d06 100%)',
    overlay: 'radial-gradient(ellipse at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 55%)',
    accent: '#FDE68A',
  },
  defeat: {
    bg: 'linear-gradient(180deg, #080808 0%, #0d0a0a 40%, #050505 100%)',
    overlay: 'radial-gradient(ellipse at 50% 50%, rgba(100,100,100,0.04) 0%, transparent 60%)',
    accent: '#6B7280',
  },
};

export default function StoryOverlay({ beat, onDismiss, onLastPage }: StoryOverlayProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [fadeState, setFadeState] = useState<'in' | 'visible' | 'out'>('in');
  const [showSkip, setShowSkip] = useState(false);
  const [entering, setEntering] = useState(true);
  const typingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const page = beat.pages[pageIndex];
  const totalPages = beat.pages.length;
  const style = BG_STYLES[beat.bgStyle] || BG_STYLES.dark;
  // Detect chapter title pages (short text, no speaker, chapter-title prefix in ID)
  const isChapterTitlePage = !page?.speaker && page && page.text.length < 60 && beat.id.includes('chapter-title');

  // Skip hint after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => setEntering(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!page) return;
    const text = page.text;
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const type = () => {
      charIndex++;
      if (charIndex <= text.length) {
        setDisplayedText(text.slice(0, charIndex));
        typingRef.current = setTimeout(type, 18 + Math.random() * 12);
      } else {
        setIsTyping(false);
      }
    };

    typingRef.current = setTimeout(type, 400);

    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, [pageIndex, page]);

  // Fade in on page change
  useEffect(() => {
    setFadeState('in');
    const timer = setTimeout(() => setFadeState('visible'), 500);
    return () => clearTimeout(timer);
  }, [pageIndex]);

  const skipTyping = useCallback(() => {
    if (typingRef.current) clearTimeout(typingRef.current);
    if (page) {
      setDisplayedText(page.text);
      setIsTyping(false);
    }
  }, [page]);

  const advancePage = useCallback(() => {
    if (isTyping) {
      skipTyping();
      return;
    }

    if (pageIndex < totalPages - 1) {
      setFadeState('out');
      setTimeout(() => {
        setPageIndex(prev => prev + 1);
      }, 400);
    } else {
      // Last page — call onLastPage if provided, then dismiss
      if (onLastPage) onLastPage();
      setFadeState('out');
      setTimeout(() => {
        onDismiss();
      }, 500);
    }
  }, [pageIndex, totalPages, isTyping, skipTyping, onDismiss, onLastPage]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        advancePage();
      }
      if (e.key === 'Escape' && beat.skippable) {
        if (typingRef.current) clearTimeout(typingRef.current);
        setFadeState('out');
        setTimeout(() => onDismiss(), 300);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [advancePage, onDismiss, beat.skippable]);

  const fadeInOpacity = fadeState === 'in' ? 'opacity-0' : fadeState === 'out' ? 'opacity-0' : 'opacity-100';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: style.bg,
        opacity: entering ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
      onClick={advancePage}
    >
      {/* Atmospheric overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: style.overlay }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Side decorative lines */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          left: '8%',
          width: '1px',
          height: '70%',
          background: `linear-gradient(180deg, transparent, ${style.accent}22, transparent)`,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '15%',
          right: '8%',
          width: '1px',
          height: '70%',
          background: `linear-gradient(180deg, transparent, ${style.accent}22, transparent)`,
        }}
      />

      {/* Content */}
      <div
        ref={pageRef}
        className={`relative z-10 w-full max-w-2xl px-8 md:px-12 transition-opacity duration-400 ${fadeInOpacity}`}
        style={{
          animation: fadeState === 'in' ? 'storyFadeIn 0.5s ease forwards' : fadeState === 'out' ? 'storyFadeOut 0.4s ease forwards' : 'none',
        }}
      >
        {/* Title area — hide for chapter title pages to let text shine */}
        {!isChapterTitlePage && (
        <div className="text-center mb-8">
          {beat.subtitle && (
            <div
              className="text-[10px] uppercase tracking-[5px] mb-2"
              style={{
                color: style.accent,
                fontFamily: 'var(--font-cinzel), serif',
                opacity: 0.5,
              }}
            >
              {beat.subtitle}
            </div>
          )}
          <h2
            className="text-2xl md:text-3xl font-bold tracking-wider"
            style={{
              fontFamily: 'var(--font-cinzel), serif',
              color: style.accent,
              textShadow: `0 0 20px ${style.accent}33`,
            }}
          >
            {beat.title}
          </h2>
          <div
            className="w-32 h-px mx-auto mt-4"
            style={{
              background: `linear-gradient(90deg, transparent, ${style.accent}66, transparent)`,
            }}
          />
        </div>
        )}

        {/* Speaker area (portrait + name) */}
        {page?.speaker && (
          <div className="flex items-center gap-3 mb-5">
            {page.portrait && (
              <div
                className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                style={{
                  border: `1.5px solid ${page.speakerColor || style.accent}55`,
                  boxShadow: `0 0 12px ${page.speakerColor || style.accent}22`,
                }}
              >
                <Image
                  src={page.portrait}
                  alt={page.speaker}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            )}
            <div
              className="text-sm font-bold tracking-wide"
              style={{
                color: page.speakerColor || style.accent,
                fontFamily: 'var(--font-cinzel), serif',
                textShadow: `0 1px 4px ${page.speakerColor || style.accent}44`,
              }}
            >
              {page.speaker}
            </div>
          </div>
        )}

        {/* Story text */}
        <div
          className={`min-h-[140px] text-sm md:text-base leading-relaxed ${isChapterTitlePage ? 'text-center' : ''}`}
          style={{
            color: 'rgba(220,210,190,0.9)',
            fontFamily: 'var(--font-cinzel), serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            fontSize: isChapterTitlePage ? 'clamp(1.1rem, 3vw, 1.8rem)' : undefined,
            fontWeight: isChapterTitlePage ? 700 : undefined,
            letterSpacing: isChapterTitlePage ? '0.15em' : undefined,
          }}
        >
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-0.5 h-4 ml-0.5 align-middle"
              style={{
                background: style.accent,
                animation: 'cursorBlink 0.6s ease infinite',
              }}
            />
          )}
        </div>

        {/* Page indicator */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {beat.pages.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-300"
              style={{
                width: i === pageIndex ? '24px' : '6px',
                height: '3px',
                borderRadius: '2px',
                background: i === pageIndex ? style.accent : `${style.accent}33`,
                opacity: i <= pageIndex ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        {/* Continue hint */}
        {!isTyping && showSkip && (
          <div
            className="text-center mt-4"
            style={{
              animation: 'hintPulse 2s ease-in-out infinite',
            }}
          >
            <span
              className="text-[10px] tracking-[3px] uppercase"
              style={{
                color: `${style.accent}66`,
                fontFamily: 'var(--font-cinzel), serif',
              }}
            >
              {pageIndex < totalPages - 1 ? 'Click or press Space to continue' : 'Click or press Space to begin'}
            </span>
          </div>
        )}
      </div>

      {/* Skip button */}
      {beat.skippable && showSkip && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (typingRef.current) clearTimeout(typingRef.current);
            setFadeState('out');
            setTimeout(() => onDismiss(), 300);
          }}
          className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded text-[10px] tracking-widest uppercase transition-all hover:opacity-100 opacity-40"
          style={{
            fontFamily: 'var(--font-cinzel), serif',
            color: style.accent,
            border: `1px solid ${style.accent}33`,
            background: 'rgba(0,0,0,0.4)',
          }}
        >
          Skip
        </button>
      )}

      {/* Keyframes */}
      <style jsx global>{`
        @keyframes storyFadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes storyFadeOut {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes hintPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}