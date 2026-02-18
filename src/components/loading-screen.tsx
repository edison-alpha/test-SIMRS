/**
 * SIMRS Loading Screen Component
 * Compact loading screen with animated logo
 */

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import brandLogo from '@/assets/brand-icons/brand.png'

interface LoadingScreenProps {
  isLoading: boolean
  onLoadingComplete?: () => void
}

const logoVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.6,
    rotate: -90,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 120,
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
}

const textVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.2,
    },
  },
}

const pulseVariants: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--loadingscreen)' }}
          onAnimationComplete={onLoadingComplete}
        >
          {/* Compact centered content */}
          <motion.div
            className="flex flex-col items-center gap-4"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Logo with pulse animation */}
            <motion.div
              variants={logoVariants}
              className="relative"
            >
              <motion.div
                variants={pulseVariants}
                animate="animate"
              >
                <img
                  src={brandLogo}
                  alt="SIMRS"
                  className="h-20 w-20 object-contain drop-shadow-lg"
                  style={{ 
                    filter: 'brightness(0) saturate(100%) invert(100%)',
                  }}
                />
              </motion.div>
              {/* Subtle glow */}
              <motion.div
                className="absolute inset-0 -z-10 rounded-full bg-white/15 blur-xl"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* SIMRS Title */}
            <motion.h1
              variants={textVariants}
              className="text-3xl font-bold tracking-[0.2em] text-white drop-shadow-md"
            >
              SIMRS
            </motion.h1>

            {/* Simple progress dots */}
            <motion.div
              className="mt-2 flex items-center gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
