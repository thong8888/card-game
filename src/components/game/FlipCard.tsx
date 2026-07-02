'use client'

import { Card } from '@/lib/game-store'
import { motion } from 'framer-motion'

interface FlipCardProps {
  card: Card
  onClick: (id: string) => void
  disabled: boolean
}

export function FlipCard({ card, onClick, disabled }: FlipCardProps) {
  const isRevealed = card.isFlipped || card.isMatched

  return (
    <motion.div
      className="cursor-pointer select-none"
      style={{ perspective: 800 }}
      onClick={() => !disabled && !card.isMatched && !card.isFlipped && onClick(card.id)}
      whileHover={!disabled && !card.isMatched && !card.isFlipped ? { scale: 1.05 } : {}}
      whileTap={!disabled && !card.isMatched && !card.isFlipped ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="relative w-full aspect-[3/4] rounded-xl"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isRevealed ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        {/* Back face (face-down) */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg flex items-center justify-center border-2 border-emerald-400/50">
            <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-emerald-400/30 to-teal-500/30 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl text-white/80">🂠</span>
            </div>
          </div>
        </div>

        {/* Front face (face-up / matched) */}
        <div
          className="absolute inset-0 rounded-xl flex items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {card.isMatched ? (
            <div className="w-full h-full rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 shadow-lg flex items-center justify-center border-2 border-amber-300 dark:border-amber-700">
              <span className="text-4xl sm:text-5xl md:text-6xl drop-shadow-sm">{card.emoji}</span>
            </div>
          ) : (
            <div className="w-full h-full rounded-xl bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center border-2 border-zinc-200 dark:border-zinc-700">
              <span className="text-4xl sm:text-5xl md:text-6xl">{card.emoji}</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}