'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/game-store';
import { playDialogueAppear } from '@/lib/audio-engine';
import Image from 'next/image';

export default function AIDialogueBubble() {
  const dialogue = useGameStore(s => s.aiDialogue);
  const dismissAIDialogue = useGameStore(s => s.dismissAIDialogue);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (dialogue) {
      playDialogueAppear();
      setVisible(true);
      setExiting(false);
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setVisible(false);
          dismissAIDialogue();
        }, 400);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      setExiting(false);
    }
  }, [dialogue, dismissAIDialogue]);

  if (!visible || !dialogue) return null;

  // Get portrait path from character class
  const portraitPath = dialogue.portrait || `/game/heroes/hero_${dialogue.characterClass.toLowerCase()}.png`;

  return (
    <div
      className="absolute bottom-20 left-1/2 z-30"
      style={{
        transform: exiting
          ? 'translateX(-50%) translateY(10px) scale(0.95)'
          : 'translateX(-50%) translateY(0) scale(1)',
        opacity: exiting ? 0 : 1,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: 'none',
      }}
    >
      <div
        className="relative max-w-md px-5 py-3 rounded-xl"
        style={{
          background: `linear-gradient(135deg, rgba(20,15,8,0.95), rgba(30,20,12,0.92))`,
          border: `1.5px solid ${dialogue.color}55`,
          boxShadow: `0 0 30px ${dialogue.color}15, 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Speaker info */}
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0"
            style={{
              border: `1.5px solid ${dialogue.color}66`,
              boxShadow: `0 0 10px ${dialogue.color}22`,
            }}
          >
            <Image
              src={portraitPath}
              alt={dialogue.speaker}
              width={36}
              height={36}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <div
              className="text-xs font-bold tracking-wide"
              style={{
                color: dialogue.color,
                fontFamily: 'var(--font-cinzel), serif',
                textShadow: `0 0 8px ${dialogue.color}44`,
              }}
            >
              {dialogue.icon} {dialogue.speaker}
            </div>
            <div
              className="text-[9px] opacity-40 uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-cinzel), serif' }}
            >
              {dialogue.characterClass}
            </div>
          </div>
        </div>

        {/* Dialogue text with typewriter effect */}
        <p
          className="text-sm leading-relaxed"
          style={{
            color: 'rgba(220,210,190,0.9)',
            fontFamily: 'var(--font-cinzel), serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            fontStyle: 'italic',
          }}
        >
          &ldquo;{dialogue.text}&rdquo;
        </p>

        {/* Speech bubble tail */}
        <div
          className="absolute -bottom-2 left-1/2 w-4 h-4 rotate-45"
          style={{
            background: 'rgba(20,15,8,0.95)',
            borderRight: `1.5px solid ${dialogue.color}55`,
            borderBottom: `1.5px solid ${dialogue.color}55`,
          }}
        />
      </div>
    </div>
  );
}