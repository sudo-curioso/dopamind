'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

export const CHEER_MESSAGES = [
  { emoji: '🔥', bold: 'ABSOLUTE FIRE.', sub: 'You crushed it. No cap.' },
  { emoji: '⚡', bold: 'LIGHTNING FOCUSED.', sub: 'Different breed. Keep going.' },
  { emoji: '🎯', bold: 'BULLSEYE.', sub: 'Main character energy. Fully unlocked.' },
  { emoji: '✨', bold: 'UNDERSTOOD THE ASSIGNMENT.', sub: 'We love to see it.' },
  { emoji: '🚀', bold: 'LAUNCHED.', sub: 'Your brain just did something incredible.' },
  { emoji: '💪', bold: 'BEAST MODE.', sub: 'ADHD? More like A-Damn-HD.' },
  { emoji: '🌳', bold: 'TREE GROWN!', sub: 'Your forest thanks you.' },
  { emoji: '👑', bold: 'ROYALTY BEHAVIOUR.', sub: 'Task conquered. Crown secured.' },
  { emoji: '🎉', bold: 'LET\'S GOOO!', sub: 'That dopamine hit is well earned.' },
  { emoji: '💚', bold: 'YOU SHOWED UP.', sub: 'That\'s the hardest part. You did it.' },
]

export interface ActiveTimer {
  taskId: string
  taskTitle: string
  timeLeft: number
  totalTime: number
  running: boolean
  completed: boolean
  dead: boolean
  treeStage: 'seed' | 'growing' | 'wilting' | 'grown' | 'dead'
  message: typeof CHEER_MESSAGES[0]
}

// Flying tree animation state - accessible globally
export interface FlyingTree {
  id: string
  startX: number
  startY: number
  treeType: string
}

interface TimerContextType {
  activeTimers: Record<string, ActiveTimer>
  flyingTrees: FlyingTree[]
  globalStreak: number
  startTimer: (taskId: string, taskTitle: string, seconds: number) => void
  pauseTimer: (taskId: string) => void
  resetTimer: (taskId: string, seconds: number) => void
  killTimer: (taskId: string) => void
  clearTimer: (taskId: string) => void
  triggerFlyingTree: (tree: FlyingTree) => void
  setGlobalStreak: (n: number) => void
}

const TimerContext = createContext<TimerContextType | null>(null)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [activeTimers, setActiveTimers] = useState<Record<string, ActiveTimer>>({})
  const [flyingTrees, setFlyingTrees] = useState<FlyingTree[]>([])
  const [globalStreak, setGlobalStreak] = useState(0)
  const intervalsRef = useRef<Record<string, NodeJS.Timeout>>({})

  function playCompletionSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      const notes = [523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ctx.currentTime + i * 0.18
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.35, t + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4)
        osc.start(t)
        osc.stop(t + 0.4)
      })
    } catch {}
  }

  function getTreeStage(progress: number): ActiveTimer['treeStage'] {
    if (progress < 0.15) return 'seed'
    if (progress < 0.8) return 'growing'
    if (progress >= 0.8) return 'growing'
    return 'growing'
  }

  const triggerFlyingTree = useCallback((tree: FlyingTree) => {
    setFlyingTrees(prev => [...prev, tree])
    setTimeout(() => {
      setFlyingTrees(prev => prev.filter(t => t.id !== tree.id))
    }, 1800)
  }, [])

  const startTimer = useCallback((taskId: string, taskTitle: string, seconds: number) => {
    if (intervalsRef.current[taskId]) {
      clearInterval(intervalsRef.current[taskId])
    }

    setActiveTimers(prev => ({
      ...prev,
      [taskId]: {
        taskId,
        taskTitle,
        timeLeft: prev[taskId]?.timeLeft ?? seconds,
        totalTime: seconds,
        running: true,
        completed: false,
        dead: false,
        treeStage: 'seed',
        message: CHEER_MESSAGES[0],
      }
    }))

    intervalsRef.current[taskId] = setInterval(() => {
      setActiveTimers(prev => {
        const t = prev[taskId]
        if (!t || !t.running) return prev

        if (t.timeLeft <= 1) {
          clearInterval(intervalsRef.current[taskId])
          playCompletionSound()
          const msg = CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]
          return {
            ...prev,
            [taskId]: {
              ...t,
              timeLeft: 0,
              running: false,
              completed: true,
              treeStage: 'grown',
              message: msg,
            }
          }
        }

        const newTimeLeft = t.timeLeft - 1
        const progress = 1 - newTimeLeft / t.totalTime
        return {
          ...prev,
          [taskId]: {
            ...t,
            timeLeft: newTimeLeft,
            treeStage: getTreeStage(progress),
          }
        }
      })
    }, 1000)
  }, [])

  const pauseTimer = useCallback((taskId: string) => {
    clearInterval(intervalsRef.current[taskId])
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], running: false }
    }))
  }, [])

  const resetTimer = useCallback((taskId: string, seconds: number) => {
    clearInterval(intervalsRef.current[taskId])
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        timeLeft: seconds,
        totalTime: seconds,
        running: false,
        completed: false,
        dead: false,
        treeStage: 'seed',
      }
    }))
  }, [])

  const killTimer = useCallback((taskId: string) => {
    clearInterval(intervalsRef.current[taskId])
    setActiveTimers(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        running: false,
        completed: false,
        dead: true,
        treeStage: 'dead',
      }
    }))
  }, [])

  const clearTimer = useCallback((taskId: string) => {
    clearInterval(intervalsRef.current[taskId])
    setActiveTimers(prev => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })
  }, [])

  return (
    <TimerContext.Provider value={{
      activeTimers, flyingTrees, globalStreak,
      startTimer, pauseTimer, resetTimer, killTimer, clearTimer,
      triggerFlyingTree, setGlobalStreak,
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used inside TimerProvider')
  return ctx
}