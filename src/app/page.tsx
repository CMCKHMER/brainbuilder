'use client';

import { useGameStore } from '@/lib/game-store';
import TitleScreen from '@/components/game/TitleScreen';
import GameSetup from '@/components/game/GameSetup';
import GameBoard from '@/components/game/GameBoard';

export default function Home() {
  const phase = useGameStore((s) => s.phase);

  if (phase === 'title') {
    return <TitleScreen />;
  }

  if (phase === 'setup') {
    return <GameSetup />;
  }

  return <GameBoard />;
}