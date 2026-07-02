import { create } from 'zustand'

// ─── Types ───────────────────────────────────────────────────────────
export type Difficulty = 'easy' | 'medium' | 'hard'
export type GameMode = 'free' | 'level'
export type GamePhase = 'menu' | 'playing' | 'paused' | 'won' | 'lost'

export interface Card {
  id: string
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export interface DifficultyConfig {
  pairs: number
  cols: number
  timeSeconds: number
  label: string
  description: string
  pointsPerMatch: number
}

// ─── Constants ───────────────────────────────────────────────────────
export const EMOJI_POOL = [
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
  '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
  '🦄', '🐲', '🎉', '🌺', '🍎', '🍕', '🚀', '⭐',
  '💎', '🎸', '🌈', '🔥', '❄️', '🍀', '🎯', '🎲',
  '🎭', '🎪', '🎨', '🎬', '🧩', '🪄', '🎮', '🦋',
]

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    pairs: 6,
    cols: 4,
    timeSeconds: 60,
    label: 'Dễ',
    description: '6 cặp bài - 60 giây',
    pointsPerMatch: 10,
  },
  medium: {
    pairs: 8,
    cols: 4,
    timeSeconds: 90,
    label: 'Trung bình',
    description: '8 cặp bài - 90 giây',
    pointsPerMatch: 15,
  },
  hard: {
    pairs: 10,
    cols: 5,
    timeSeconds: 120,
    label: 'Khó',
    description: '10 cặp bài - 120 giây',
    pointsPerMatch: 20,
  },
}

export const LEVEL_CONFIGS: DifficultyConfig[] = [
  { pairs: 4, cols: 4, timeSeconds: 30, label: 'Màn 1', description: '4 cặp - 30 giây', pointsPerMatch: 10 },
  { pairs: 6, cols: 4, timeSeconds: 50, label: 'Màn 2', description: '6 cặp - 50 giây', pointsPerMatch: 15 },
  { pairs: 8, cols: 4, timeSeconds: 70, label: 'Màn 3', description: '8 cặp - 70 giây', pointsPerMatch: 20 },
  { pairs: 10, cols: 5, timeSeconds: 90, label: 'Màn 4', description: '10 cặp - 90 giây', pointsPerMatch: 25 },
  { pairs: 12, cols: 6, timeSeconds: 110, label: 'Màn 5', description: '12 cặp - 110 giây', pointsPerMatch: 30 },
  { pairs: 15, cols: 6, timeSeconds: 140, label: 'Màn 6', description: '15 cặp - 140 giây', pointsPerMatch: 35 },
]

// ─── Helpers ─────────────────────────────────────────────────────────
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateCards(pairs: number): Card[] {
  const selectedEmojis = shuffleArray(EMOJI_POOL).slice(0, pairs)
  const cardPairs: Card[] = selectedEmojis.flatMap((emoji, index) => [
    { id: `${index}-a`, emoji, isFlipped: false, isMatched: false },
    { id: `${index}-b`, emoji, isFlipped: false, isMatched: false },
  ])
  return shuffleArray(cardPairs)
}

// ─── Store ───────────────────────────────────────────────────────────
interface GameState {
  // Game config
  gameMode: GameMode
  difficulty: Difficulty
  currentLevel: number
  config: DifficultyConfig

  // Game state
  phase: GamePhase
  cards: Card[]
  flippedCardIds: string[]
  score: number
  moves: number
  matchesFound: number
  totalPairs: number
  timeLeft: number

  // Actions
  setGameMode: (mode: GameMode) => void
  setDifficulty: (d: Difficulty) => void
  startGame: () => void
  startNextLevel: () => void
  restartGame: () => void
  goToMenu: () => void
  flipCard: (cardId: string) => void
  tick: () => void
  getTimeBonus: () => number
}

export const useGameStore = create<GameState>((set, get) => ({
  // Defaults
  gameMode: 'free',
  difficulty: 'easy',
  currentLevel: 0,
  config: DIFFICULTY_CONFIGS.easy,
  phase: 'menu',
  cards: [],
  flippedCardIds: [],
  score: 0,
  moves: 0,
  matchesFound: 0,
  totalPairs: 6,
  timeLeft: 60,

  setGameMode: (mode) => set({ gameMode: mode }),

  setDifficulty: (d) => set({ difficulty: d }),

  startGame: () => {
    const { gameMode, difficulty, currentLevel } = get()
    const config = gameMode === 'level'
      ? LEVEL_CONFIGS[currentLevel]
      : DIFFICULTY_CONFIGS[difficulty]

    const cards = generateCards(config.pairs)

    set({
      phase: 'playing',
      cards,
      flippedCardIds: [],
      score: 0,
      moves: 0,
      matchesFound: 0,
      totalPairs: config.pairs,
      timeLeft: config.timeSeconds,
      config,
    })
  },

  startNextLevel: () => {
    const { currentLevel, score } = get()
    const nextLevel = currentLevel + 1

    if (nextLevel >= LEVEL_CONFIGS.length) {
      // All levels complete!
      set({ phase: 'won' })
      return
    }

    const config = LEVEL_CONFIGS[nextLevel]
    const cards = generateCards(config.pairs)

    set({
      currentLevel: nextLevel,
      phase: 'playing',
      cards,
      flippedCardIds: [],
      moves: 0,
      matchesFound: 0,
      totalPairs: config.pairs,
      timeLeft: config.timeSeconds,
      config,
      // Keep cumulative score
    })
  },

  restartGame: () => {
    const { gameMode } = get()
    set({ currentLevel: 0 })
    if (gameMode === 'level') {
      const config = LEVEL_CONFIGS[0]
      const cards = generateCards(config.pairs)
      set({
        phase: 'playing',
        cards,
        flippedCardIds: [],
        score: 0,
        moves: 0,
        matchesFound: 0,
        totalPairs: config.pairs,
        timeLeft: config.timeSeconds,
        config,
      })
    } else {
      get().startGame()
    }
  },

  goToMenu: () => set({
    phase: 'menu',
    cards: [],
    flippedCardIds: [],
    score: 0,
    moves: 0,
    matchesFound: 0,
    currentLevel: 0,
  }),

  flipCard: (cardId) => {
    const { phase, cards, flippedCardIds, config } = get()
    if (phase !== 'playing') return
    if (flippedCardIds.length >= 2) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const newFlipped = [...flippedCardIds, cardId]
    const updatedCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    )

    set({
      cards: updatedCards,
      flippedCardIds: newFlipped,
    })

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      const firstCard = updatedCards.find(c => c.id === firstId)!
      const secondCard = updatedCards.find(c => c.id === secondId)!

      set(state => ({ moves: state.moves + 1 }))

      if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          set(state => {
            const matchedCards = state.cards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
            const newMatchesFound = state.matchesFound + 1
            const newScore = state.score + state.config.pointsPerMatch

            // Check win condition
            const allMatched = newMatchesFound === state.totalPairs
            if (allMatched) {
              return {
                cards: matchedCards,
                flippedCardIds: [],
                matchesFound: newMatchesFound,
                score: newScore,
                phase: 'won' as GamePhase,
              }
            }

            return {
              cards: matchedCards,
              flippedCardIds: [],
              matchesFound: newMatchesFound,
              score: newScore,
            }
          })
        }, 400)
      } else {
        // No match - flip back
        setTimeout(() => {
          set(state => ({
            cards: state.cards.map(c =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            ),
            flippedCardIds: [],
          }))
        }, 800)
      }
    }
  },

  tick: () => {
    const { phase, timeLeft } = get()
    if (phase !== 'playing') return
    if (timeLeft <= 0) {
      set({ phase: 'lost', timeLeft: 0 })
      return
    }
    set({ timeLeft: timeLeft - 1 })
    if (timeLeft - 1 <= 0) {
      set({ phase: 'lost' })
    }
  },

  getTimeBonus: () => {
    const { timeLeft, config } = get()
    return Math.floor(timeLeft * (config.pointsPerMatch * 0.1))
  },
}))