---
Task ID: 1
Agent: Main Agent
Task: Build a complete card flip memory game in Next.js/TypeScript

Work Log:
- Explored project structure, confirmed Next.js 16 with Tailwind CSS 4, shadcn/ui, Zustand, Framer Motion
- Designed game data model: Card, DifficultyConfig, GamePhase, GameMode types
- Created game store (`src/lib/game-store.ts`) with Zustand: card generation, flip logic, match detection, scoring, timer, level progression
- Created FlipCard component (`src/components/game/FlipCard.tsx`) with 3D CSS flip animation using Framer Motion
- Built complete page (`src/app/page.tsx`) with:
  - Menu screen: Level mode + 3 difficulty buttons (Dễ, Trung bình, Khó)
  - Game screen: header (timer, score, level badge, progress bar), card grid, controls
  - Result dialog: win/lose states, time bonus, accuracy, next level button
- Added CSS for backface-visibility, timer pulse animation
- Fixed naming conflict: `Home` icon from lucide-react renamed to `HomeIcon`
- Verified with Agent Browser: menu renders, gameplay works (match + non-match), level progression works, mobile responsive

Stage Summary:
- Files created: `src/lib/game-store.ts`, `src/components/game/FlipCard.tsx`
- Files modified: `src/app/page.tsx`, `src/app/globals.css`
- Game features: 3 free-play difficulties, 6-level campaign mode, countdown timer, scoring with time bonus, 3D card flip animation, responsive design, sticky footer
- All features verified working via Agent Browser E2E testing