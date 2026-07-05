'use client';

import { useGameStore } from '@/lib/game-store';
import GameSetup from '@/components/game/GameSetup';
import GameBoard from '@/components/game/GameBoard';

export default function Home() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'setup') {
    return <GameSetup />;
  }

  return <GameBoard />;
}