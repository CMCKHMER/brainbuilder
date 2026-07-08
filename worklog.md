---
Task ID: 1
Agent: Main Agent
Task: Add unit figures, type advantages, damage stats, and military tactics buffs to the Aethermoor board game

Work Log:
- Analyzed existing game codebase (game-data.ts, game-logic.ts, game-store.ts, all components)
- Designed 6 unit types: Swordsman, Archer, Cavalry, Mage, Shield Bearer, Siege Engine - each with unique ATK/DEF/HP/cost stats
- Designed rock-paper-scissors type advantage system (Swordsman>Archer>Cavalry>Swordsman, Mage>Shield, Siege>Shield)
- Designed 6 military tactics buffs: Phalanx, Cavalry Charge, Volley Fire, Arcane Surge, Siege Preparation, Rally Cry
- Refactored game-data.ts with unit type definitions, type advantage lookups, and tactics definitions
- Refactored game-logic.ts with unit-based combat system (dominant unit type, type advantage modifiers, unit removal by HP priority, per-class bonuses)
- Refactored game-store.ts to use unit arrays instead of army counts, with tactics state management (activation, cooldowns, per-turn usage)
- Created UnitCards.tsx with SVG unit figures, stat cards, composition displays, and type advantage indicators
- Created UnitDeployer.tsx for deploy phase unit type selection
- Created TacticsPanel.tsx for military tactics activation with cooldown/requirement tracking
- Updated GameMap.tsx to show unit icons on territories with dominant type display
- Updated ActionPanel.tsx with unit-aware combat (type advantage display, unit composition in attack info)
- Updated PlayerPanel.tsx with unit composition summaries per player
- Updated GameSetup.tsx with expandable Unit Guide showing all 6 units with stats, type advantages, and the advantage cycle chart
- Updated GameBoard.tsx with territory tooltip on hover and turn number display
- Fixed all import and export issues (default vs named exports, cross-module imports)
- Verified via Agent Browser: setup screen, unit guide, game board, deploy phase, attack phase, tactics panel all working

Stage Summary:
- 6 unique unit types with SVG figures, stats, and rock-paper-scissors advantages
- 6 military tactics buffs with cooldowns and unit requirements
- Full unit composition system replacing plain army counts
- Interactive deploy phase with unit type selection
- Type advantage indicators during combat
- Expandable unit reference guide on setup screen
- All verified working in browser