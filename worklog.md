---
Task ID: 1
Agent: Main Agent
Task: Replace character hero portraits with new Cambodian folklore-themed art

Work Log:
- Read game-data.ts (already had Cambodian folklore character configs from previous session)
- Read GameSetup.tsx (already properly references PLAYER_CONFIGS for all character data)
- Generated 5 hero portrait images using z-ai image generation CLI:
  - hero_knight.png (King Soryan - Cursed King, Angkor ruins monarch)
  - hero_rogue.png (Queen Veasna - Serpent Queen, Naga-inspired)
  - hero_mage.png (Lord Chanreth - Trickster Monk, saffron robes)
  - hero_paladin.png (Emperor Kiriath - Spirit Guardian, Khmer temple armor)
  - hero_villager.png (Young Villager hero, bonus portrait)
- Fixed pre-existing TypeScript errors in ActionPanel.tsx (null guards for selectedTerr/targetTerr)
- Fixed TacticsPanel.tsx (hasRequired → hasRequiredUnit, 3 occurrences)
- Fixed GameMap3D.tsx (bufferAttribute args prop, Fallback2DMap typing)
- Verified zero game-component TypeScript errors
- Production build successful

Stage Summary:
- All 4 character portraits regenerated with Khmer folklore-themed dark fantasy art
- 1 bonus portrait (young villager) generated for future use
- All TypeScript errors fixed, production build passes cleanly
- Image paths in game-data.ts already matched the generated filenames

---
Task ID: 2
Agent: Main Agent
Task: Add cinematic game intro and battle map animations

Work Log:
- Added `battleAnimation` and `cinematicIntroActive` state to game-store.ts
- Added `dismissCinematicIntro()` function to store
- Modified `setupGame()` to activate cinematic intro and defer story queue until intro completes
- Modified `executeAttack()` to set battleAnimation state with from/to territory IDs and timestamp
- Added auto-clear of battleAnimation after 2 seconds
- Created CinematicIntro.tsx: dramatic title reveal with golden glow, floating particles, character portraits slide-in, skip button
- Modified TerritoryMesh (3D): battle animation flash (red for target, gold for source), shake effect on target, pulsing emissive
- Created BattleExplosion component: 40-particle burst at target territory with gravity and fade-out
- Modified Fallback2DMap (2D): CSS flash animation on battle target/source territories, red/orange stroke
- Added screen shake effect to GameBoard map container on battle (4 rapid shakes)
- Merged all keyframes into single styled-jsx block to avoid nested style tag error
- Production build passes cleanly

Stage Summary:
- Cinematic intro plays on first game start: black → "REALM OF THE KHMER EMPIRE" title reveal → 4 character portraits → fade to prologue story
- Battle animations: 3D territory flash + shake + particle explosion, 2D SVG flash, screen shake
- Conquest battles show orange/gold flash, normal battles show red flash
- All animations auto-clear after ~2 seconds