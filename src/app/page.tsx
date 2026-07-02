'use client'

import { useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore, DIFFICULTY_CONFIGS, LEVEL_CONFIGS, type Difficulty, type GameMode } from '@/lib/game-store'
import { FlipCard } from '@/components/game/FlipCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Play,
  RotateCcw,
  Home as HomeIcon,
  Clock,
  Trophy,
  Target,
  ChevronRight,
  Zap,
  Star,
  Timer,
  Sparkles,
  Gamepad2,
  Swords,
  Layers,
} from 'lucide-react'

// ─── Timer hook ──────────────────────────────────────────────────────
function useTimer() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tick = useGameStore(s => s.tick)
  const phase = useGameStore(s => s.phase)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      tick()
    }, 1000)
  }, [tick])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (phase === 'playing') {
      startTimer()
    } else {
      stopTimer()
    }
    return () => stopTimer()
  }, [phase, startTimer, stopTimer])

  return { startTimer, stopTimer }
}

// ─── Menu Screen ─────────────────────────────────────────────────────
function MenuScreen() {
  const setGameMode = useGameStore(s => s.setGameMode)
  const setDifficulty = useGameStore(s => s.setDifficulty)
  const startGame = useGameStore(s => s.startGame)

  const handleStart = (mode: GameMode, difficulty?: Difficulty) => {
    setGameMode(mode)
    if (difficulty) setDifficulty(difficulty)
    if (mode === 'level') {
      useGameStore.setState({ currentLevel: 0 })
    }
    startGame()
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Title */}
      <motion.div
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl sm:text-6xl">🃏</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
          Lật Thẻ Bài
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Tìm các cặp thẻ giống nhau để ghi điểm. Hãy nhanh tay và ghi nhớ vị trí các lá bài!
        </p>
      </motion.div>

      {/* Mode Selection */}
      <div className="w-full max-w-lg space-y-4">
        {/* Level Mode */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <button
            onClick={() => handleStart('level')}
            className="w-full group relative overflow-hidden rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-5 sm:p-6 text-left transition-all hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">Chơi Qua Màn</h3>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                    {LEVEL_CONFIGS.length} màn
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Vượt qua từng màn với độ khó tăng dần
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 transition-colors flex-shrink-0" />
            </div>
          </button>
        </motion.div>

        {/* Free Play Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 pt-2 px-1"
        >
          <Gamepad2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Chơi Tự Do</span>
        </motion.div>

        {/* Difficulty Cards */}
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff, i) => {
          const config = DIFFICULTY_CONFIGS[diff]
          const colors = {
            easy: {
              gradient: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
              border: 'border-green-200 dark:border-green-800',
              hoverBorder: 'hover:border-green-300 dark:hover:border-green-700',
              icon: 'from-green-500 to-emerald-500',
              iconBg: 'bg-green-500',
              text: 'text-green-700 dark:text-green-300',
              badge: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
            },
            medium: {
              gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
              border: 'border-amber-200 dark:border-amber-800',
              hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
              icon: 'from-amber-500 to-orange-500',
              iconBg: 'bg-amber-500',
              text: 'text-amber-700 dark:text-amber-300',
              badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
            },
            hard: {
              gradient: 'from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30',
              border: 'border-rose-200 dark:border-rose-800',
              hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
              icon: 'from-rose-500 to-red-500',
              iconBg: 'bg-rose-500',
              text: 'text-rose-700 dark:text-rose-300',
              badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
            },
          }
          const c = colors[diff]
          const icons = {
            easy: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            medium: <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
            hard: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />,
          }

          return (
            <motion.button
              key={diff}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
              onClick={() => handleStart('free', diff)}
              className={`w-full group relative overflow-hidden rounded-xl border ${c.border} ${c.hoverBorder} bg-gradient-to-br ${c.gradient} p-4 sm:p-5 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${c.icon} flex items-center justify-center shadow-md`}>
                  {icons[diff]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{config.label}</h3>
                    <Badge variant="secondary" className={`${c.badge} text-xs`}>
                      {config.pairs * 2} lá
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{config.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── Game Header ─────────────────────────────────────────────────────
function GameHeader() {
  const score = useGameStore(s => s.score)
  const moves = useGameStore(s => s.moves)
  const matchesFound = useGameStore(s => s.matchesFound)
  const totalPairs = useGameStore(s => s.totalPairs)
  const timeLeft = useGameStore(s => s.timeLeft)
  const config = useGameStore(s => s.config)
  const gameMode = useGameStore(s => s.gameMode)
  const currentLevel = useGameStore(s => s.currentLevel)
  const phase = useGameStore(s => s.phase)

  const progress = totalPairs > 0 ? (matchesFound / totalPairs) * 100 : 0
  const isLowTime = timeLeft <= 10 && phase === 'playing'

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-4 sm:mb-6">
      {/* Top stats bar */}
      <div className="flex items-center justify-between gap-3 sm:gap-4 mb-3">
        {/* Level / Difficulty badge */}
        <Badge
          variant="outline"
          className="text-xs sm:text-sm px-2.5 sm:px-3 py-1 font-semibold shrink-0"
        >
          {gameMode === 'level'
            ? `Màn ${currentLevel + 1}/${LEVEL_CONFIGS.length}`
            : config.label
          }
        </Badge>

        <div className="flex items-center gap-3 sm:gap-5">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 ${isLowTime ? 'text-red-500' : 'text-muted-foreground'}`}>
            <Timer className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className={`text-sm sm:text-base font-mono font-bold tabular-nums ${isLowTime ? 'animate-pulse' : ''}`}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-bold tabular-nums">{score}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Target className="w-3.5 h-3.5" />
            {matchesFound}/{totalPairs} cặp
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" />
            {moves} lượt
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  )
}

// ─── Game Board ──────────────────────────────────────────────────────
function GameBoard() {
  const cards = useGameStore(s => s.cards)
  const flipCard = useGameStore(s => s.flipCard)
  const flippedCardIds = useGameStore(s => s.flippedCardIds)
  const config = useGameStore(s => s.config)
  const phase = useGameStore(s => s.phase)

  const disabled = flippedCardIds.length >= 2 || phase !== 'playing'

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-2 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="grid gap-2 sm:gap-3"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          maxWidth: config.cols <= 4 ? '420px' : config.cols <= 5 ? '500px' : '580px',
          margin: '0 auto',
        }}
      >
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                duration: 0.3,
                delay: index * 0.03,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
            >
              <FlipCard card={card} onClick={flipCard} disabled={disabled} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Game Controls ───────────────────────────────────────────────────
function GameControls() {
  const restartGame = useGameStore(s => s.restartGame)
  const goToMenu = useGameStore(s => s.goToMenu)
  const phase = useGameStore(s => s.phase)

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto px-4 mt-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={goToMenu}
          className="gap-1.5"
        >
          <HomeIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Menu</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={restartGame}
          disabled={phase !== 'playing'}
          className="gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Chơi lại</span>
        </Button>
      </div>
    </motion.div>
  )
}

// ─── Result Dialog ───────────────────────────────────────────────────
function ResultDialog() {
  const phase = useGameStore(s => s.phase)
  const score = useGameStore(s => s.score)
  const moves = useGameStore(s => s.moves)
  const matchesFound = useGameStore(s => s.matchesFound)
  const totalPairs = useGameStore(s => s.totalPairs)
  const timeLeft = useGameStore(s => s.timeLeft)
  const gameMode = useGameStore(s => s.gameMode)
  const currentLevel = useGameStore(s => s.currentLevel)
  const getTimeBonus = useGameStore(s => s.getTimeBonus)
  const restartGame = useGameStore(s => s.restartGame)
  const goToMenu = useGameStore(s => s.goToMenu)
  const startNextLevel = useGameStore(s => s.startNextLevel)

  const isWon = phase === 'won'
  const isLost = phase === 'lost'
  const isOpen = isWon || isLost

  if (!isOpen) return null

  const timeBonus = isWon ? getTimeBonus() : 0
  const totalScore = score + timeBonus
  const isLastLevel = gameMode === 'level' && currentLevel >= LEVEL_CONFIGS.length - 1
  const allLevelsComplete = isWon && isLastLevel

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md mx-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center sm:text-center">
          <DialogTitle className="text-2xl sm:text-3xl font-bold">
            {allLevelsComplete ? '🎉 Hoàn Thành Tất Cả!' : isWon ? '🎉 Chiến Thắng!' : '⏰ Hết Giờ!'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {allLevelsComplete
              ? 'Bạn đã vượt qua tất cả các màn chơi!'
              : isWon
              ? `Bạn đã tìm đủ ${matchesFound} cặp!`
              : `Bạn tìm được ${matchesFound}/${totalPairs} cặp`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Điểm</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">{totalScore}</div>
            {isWon && timeBonus > 0 && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">+{timeBonus} thưởng thời gian</div>
            )}
          </div>
          <div className="rounded-xl bg-muted/50 p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1">Lượt chơi</div>
            <div className="text-xl sm:text-2xl font-bold">{moves}</div>
          </div>
        </div>

        {/* Accuracy */}
        {isWon && moves > 0 && (
          <div className="text-center text-sm text-muted-foreground mb-2">
            Độ chính xác: <span className="font-semibold text-foreground">{Math.round((totalPairs / moves) * 100)}%</span>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
          {isWon && gameMode === 'level' && !allLevelsComplete && (
            <Button onClick={startNextLevel} className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
              <Play className="w-4 h-4" />
              Màn Tiếp Theo
            </Button>
          )}
          <Button onClick={restartGame} variant="outline" className="w-full gap-2">
            <RotateCcw className="w-4 h-4" />
            Chơi Lại
          </Button>
          <Button onClick={goToMenu} variant="ghost" className="w-full gap-2">
            <HomeIcon className="w-4 h-4" />
            Về Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function Home() {
  const phase = useGameStore(s => s.phase)
  const score = useGameStore(s => s.score)

  useTimer()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/30">
      {/* Header bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🃏</span>
            <h1 className="text-base sm:text-lg font-bold tracking-tight">
              Lật Thẻ Bài
            </h1>
          </div>
          {phase !== 'menu' && (
            <Badge variant="outline" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              {score} đ
            </Badge>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {phase === 'menu' ? (
            <MenuScreen key="menu" />
          ) : (
            <motion.div
              key="game"
              className="flex-1 flex flex-col py-4 sm:py-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameHeader />
              <div className="flex-1 flex items-start justify-center">
                <GameBoard />
              </div>
              <GameControls />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Result Dialog */}
      <ResultDialog />

      {/* Footer */}
      <footer className="mt-auto border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto h-12 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            🃏 Game Lật Thẻ Bài — Tập trung và ghi nhớ!
          </p>
        </div>
      </footer>
    </div>
  )
}