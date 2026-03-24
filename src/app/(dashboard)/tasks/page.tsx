'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTimer, CHEER_MESSAGES, ActiveTimer } from '@/context/timer-context'
import { motion, AnimatePresence } from 'framer-motion'
import GrowingTree from '@/components/ui/growing-tree'
import { AmbientSoundPlayer, SOUND_OPTIONS, type SoundMode } from '@/lib/ambient-sound'

type Tab = 'today' | 'add' | 'progress' | 'search' | 'focus' | 'reflect'

const PRIORITY_CONFIG: Record<number, { bg: string; color: string; label: string; border: string }> = {
  1: { bg: '#FEF2F2', color: '#EF4444', label: 'Urgent', border: '#FECACA' },
  2: { bg: '#FFFBEB', color: '#F59E0B', label: 'Medium', border: '#FDE68A' },
  3: { bg: '#F8FAFC', color: '#6B7280', label: 'Low',    border: '#E2E8F0' },
}

const PRESET_TIMERS = [5, 15, 25, 45, 60]

interface Task {
  id: string
  title: string
  status: string
  priority: number
  bucket: string
  created_at: string
  completed_at: string | null
  steps: { text: string; done: boolean }[] | null
}

// Cheer overlay shown after task completion
function CheerOverlay({
  message, onDone
}: {
  message: typeof CHEER_MESSAGES[0]
  onDone: () => void
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div
        className="rounded-3xl px-8 py-6 text-center shadow-2xl pointer-events-auto"
        style={{
          background: 'linear-gradient(135deg, #14532D, #166534)',
          border: '1px solid rgba(255,255,255,0.15)',
          maxWidth: '320px',
          width: '90%',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.6, repeat: 2 }}
          className="text-5xl mb-3"
        >
          {message.emoji}
        </motion.div>
        <p className="text-xl font-black text-white mb-1 tracking-tight">
          {message.bold}
        </p>
        <p className="text-sm text-green-200">{message.sub}</p>
        <motion.div
          className="mt-4 flex justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {['🌳','🌲','🌳','🌲','🌳'].map((t, i) => (
            <motion.span
              key={i}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

// Custom timer input modal
function CustomTimerModal({
  onSelect, onClose
}: {
  onSelect: (mins: number) => void
  onClose: () => void
}) {
  const [value, setValue] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-sm rounded-3xl p-6"
        style={{ background: '#fff' }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-base font-bold text-slate-900 mb-1">Custom timer</p>
        <p className="text-xs text-slate-400 mb-4">Enter minutes for this task</p>
        <div className="flex gap-2 mb-4">
          {[10, 20, 30, 40, 50, 90].map(m => (
            <button
              key={m}
              onClick={() => onSelect(m)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold"
              style={{ background: '#F1F5F9', color: '#475569' }}
            >
              {m}m
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Enter minutes..."
            min={1}
            max={300}
            className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none"
            style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B' }}
            onKeyDown={e => {
              if (e.key === 'Enter' && value) {
                const mins = Math.max(1, Math.min(300, parseInt(value)))
                if (!isNaN(mins)) onSelect(mins)
              }
            }}
          />
          <button
            onClick={() => {
              const mins = Math.max(1, Math.min(300, parseInt(value)))
              if (!isNaN(mins)) onSelect(mins)
            }}
            className="px-5 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
          >
            Set
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-3 py-2 text-xs text-slate-400">
          Cancel
        </button>
      </motion.div>
    </motion.div>
  )
}

// ─── Immersive Focus Mode (Forest-inspired) ────────────────────────────────

const PARTICLES = [
  { left: '8%',  size: 5, dur: 8.0, delay: 0.0, dx: 20  },
  { left: '20%', size: 3, dur: 7.0, delay: 1.5, dx: -15 },
  { left: '35%', size: 6, dur: 9.0, delay: 0.5, dx: 25  },
  { left: '50%', size: 4, dur: 7.5, delay: 2.0, dx: -20 },
  { left: '65%', size: 5, dur: 8.5, delay: 1.0, dx: 18  },
  { left: '78%', size: 3, dur: 6.5, delay: 3.0, dx: -10 },
  { left: '88%', size: 6, dur: 8.0, delay: 1.8, dx: 22  },
]

function getSkyGradient(): string {
  const h = new Date().getHours()
  if (h >= 5  && h < 7)  return 'linear-gradient(180deg,#C17B3A 0%,#E8945A 40%,#87CEEB 100%)'
  if (h >= 7  && h < 11) return 'linear-gradient(180deg,#4A9EE4 0%,#7DC4E4 50%,#A8D5A8 100%)'
  if (h >= 11 && h < 16) return 'linear-gradient(180deg,#2980B9 0%,#4A9EE4 60%,#87CEEB 100%)'
  if (h >= 16 && h < 19) return 'linear-gradient(180deg,#8B2500 0%,#D4521E 40%,#E8945A 100%)'
  if (h >= 19 && h < 22) return 'linear-gradient(180deg,#1a1a2e 0%,#16213e 60%,#1a3a1a 100%)'
  return 'linear-gradient(180deg,#0a0a1a 0%,#111128 60%,#0f1f0f 100%)'
}

function FocusImmersiveMode({
  task, timer, duration,
  onStart, onPause, onAbandon, onComplete, onDurationChange, onClose,
}: {
  task: Task
  timer: ActiveTimer | undefined
  duration: number
  onStart: () => void
  onPause: () => void
  onAbandon: () => void
  onComplete: (durationMins: number) => void
  onDurationChange: (secs: number) => void
  onClose: () => void
}) {
  const [showAbandonWarn, setShowAbandonWarn] = useState(false)
  const [showBlurWarn, setShowBlurWarn]   = useState(false)
  const [soundMode, setSoundMode]         = useState<SoundMode>(() =>
    (typeof window !== 'undefined'
      ? (localStorage.getItem('cm-ambient-sound') as SoundMode) || 'off'
      : 'off')
  )
  const [showSoundMenu, setShowSoundMenu] = useState(false)
  const soundRef = useRef<AmbientSoundPlayer | null>(null)

  const timeLeft     = timer?.timeLeft  ?? duration
  const totalTime    = timer?.totalTime ?? duration
  const running      = timer?.running   ?? false
  const completed    = timer?.completed ?? false
  const dead         = timer?.dead      ?? false
  const progress     = totalTime > 0 ? 1 - timeLeft / totalTime : 0
  const mins         = Math.floor(timeLeft / 60)
  const secs         = timeLeft % 60
  const durationMins = Math.round(duration / 60)
  const notStarted   = !running && progress === 0 && !completed && !dead

  // Shame mechanic — fires when tab loses focus mid-session
  useEffect(() => {
    if (!running) return
    const onBlur = () => setShowBlurWarn(true)
    const onVis  = () => { if (document.hidden) setShowBlurWarn(true) }
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [running])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Ambient sound player — create on mount, destroy on unmount
  useEffect(() => {
    soundRef.current = new AmbientSoundPlayer()
    return () => { soundRef.current?.destroy() }
  }, [])

  // Start/stop sound when timer running state changes
  useEffect(() => {
    if (running && soundMode !== 'off') {
      soundRef.current?.play(soundMode)
    } else if (!running) {
      soundRef.current?.stop()
    }
  }, [running, soundMode])

  function handleSoundChange(mode: SoundMode) {
    setSoundMode(mode)
    localStorage.setItem('cm-ambient-sound', mode)
    if (mode === 'off') {
      soundRef.current?.stop()
    } else if (running) {
      soundRef.current?.play(mode)
    }
    setShowSoundMenu(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: getSkyGradient() }}
    >
      {/* Ambient floating pollen particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: p.size, height: p.size, background: 'rgba(255,255,255,0.45)', left: p.left, bottom: -10 }}
          animate={{ y: [0, -900], opacity: [0, 0.7, 0.7, 0], x: [0, p.dx] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}

      {/* Ground strip */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '14%', background: 'linear-gradient(180deg,#2d5a27 0%,#1a3a15 100%)' }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <button
          onClick={() => running ? setShowAbandonWarn(true) : onClose()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
        >
          ← Back
        </button>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Focus Session
        </span>

        {/* Sound toggle */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowSoundMenu(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold"
            style={{ background: 'rgba(0,0,0,0.22)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <span>{SOUND_OPTIONS.find(o => o.mode === soundMode)?.icon ?? '🔇'}</span>
            {soundMode !== 'off' && running && (
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {showSoundMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 rounded-2xl p-1.5 flex flex-col gap-0.5 z-20"
                style={{ background: 'rgba(10,16,10,0.94)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', minWidth: '148px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              >
                {SOUND_OPTIONS.map(opt => (
                  <button
                    key={opt.mode}
                    onClick={() => handleSoundChange(opt.mode)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-colors"
                    style={{
                      background: soundMode === opt.mode ? 'rgba(255,255,255,0.10)' : 'transparent',
                      color: soundMode === opt.mode ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.72)',
                    }}
                  >
                    <span style={{ fontSize: '15px' }}>{opt.icon}</span>
                    <span className="font-medium">{opt.label}</span>
                    {soundMode === opt.mode && (
                      <span className="ml-auto text-green-400 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Task title */}
      <div className="relative z-10 px-8 text-center mt-1 mb-2">
        <p className="text-base font-bold text-white leading-snug" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          {task.title}
        </p>
      </div>

      {/* Tree + timer */}
      <div className="relative z-10 flex flex-col items-center flex-1 justify-center gap-5 pb-4">
        <motion.div
          animate={completed ? { scale: [1, 1.08, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <GrowingTree
            progress={completed ? 1 : dead ? 0 : progress}
            size={220}
            isDead={dead}
            durationMinutes={durationMins}
          />
        </motion.div>

        {/* Countdown */}
        {!completed && !dead && (
          <div className="text-center">
            <motion.div
              className="font-black tabular-nums"
              style={{ fontSize: '4.5rem', letterSpacing: '-0.05em', color: 'white', textShadow: '0 4px 24px rgba(0,0,0,0.25)', lineHeight: 1 }}
              animate={running ? { opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {String(mins).padStart(2, '0')}
              <span style={{ opacity: 0.4 }}>:</span>
              {String(secs).padStart(2, '0')}
            </motion.div>
            <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {running ? 'Stay focused...' : 'Ready when you are'}
            </p>
          </div>
        )}

        {/* Completed state */}
        {completed && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center px-6">
            <p className="text-2xl font-black text-white mb-1" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
              {timer?.message?.bold || 'Tree grown!'}
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {timer?.message?.sub || 'Plant it in your forest.'}
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onComplete(durationMins)}
              className="px-8 py-4 rounded-2xl text-base font-bold"
              style={{ background: 'rgba(255,255,255,0.95)', color: '#16A34A' }}
            >
              🌳 Plant in forest
            </motion.button>
          </motion.div>
        )}

        {/* Dead state */}
        {dead && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-6">
            <p className="text-xl font-black text-white mb-2">Tree died</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>That is okay. Try again.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl text-sm font-bold"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Back to tasks
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom controls */}
      {!completed && !dead && (
        <div className="relative z-10 flex flex-col items-center gap-3 px-8 pb-14">

          {/* Duration picker (only before starting) */}
          {notStarted && (
            <div className="flex gap-2 mb-1">
              {PRESET_TIMERS.map(opt => (
                <button
                  key={opt}
                  onClick={() => onDurationChange(opt * 60)}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: duration === opt * 60 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)',
                    color: duration === opt * 60 ? '#16A34A' : 'rgba(255,255,255,0.8)',
                    border: duration === opt * 60 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {opt}m
                </button>
              ))}
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={running ? onPause : onStart}
            className="w-full max-w-xs py-4 rounded-2xl text-base font-bold"
            style={{
              background: running ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.95)',
              color: running ? 'white' : '#16A34A',
              border: '1px solid rgba(255,255,255,0.25)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {running ? '⏸ Pause' : notStarted ? '🌱 Start growing' : '▶ Resume'}
          </motion.button>

          {running && (
            <button
              onClick={() => setShowAbandonWarn(true)}
              className="text-xs px-4 py-1.5 rounded-full"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              Give up (kills tree)
            </button>
          )}
        </div>
      )}

      {/* Blur warning — tree needs you */}
      <AnimatePresence>
        {showBlurWarn && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.65)' }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="rounded-3xl p-8 text-center w-full"
              style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.07)', maxWidth: 320 }}
            >
              <div className="text-4xl mb-3">🌳</div>
              <p className="text-lg font-black text-white mb-2">Your tree needs you!</p>
              <p className="text-sm mb-5" style={{ color: '#94A3B8' }}>Stay focused. Your tree is still growing.</p>
              <button
                onClick={() => setShowBlurWarn(false)}
                className="w-full py-3 rounded-2xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
              >
                Continue growing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Abandon warning */}
      <AnimatePresence>
        {showAbandonWarn && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center px-6"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <motion.div
              initial={{ scale: 0.88, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="rounded-3xl p-8 text-center w-full"
              style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.07)', maxWidth: 320 }}
            >
              <div className="text-4xl mb-3">💀</div>
              <p className="text-lg font-black text-white mb-2">Your tree will die!</p>
              <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>Giving up will kill your tree. Are you sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAbandonWarn(false)}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}
                >
                  Keep growing
                </button>
                <button
                  onClick={() => { setShowAbandonWarn(false); onAbandon() }}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background: '#EF4444' }}
                >
                  Give up
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function TasksPage() {
  const router = useRouter()
  const {
    activeTimers, startTimer, pauseTimer,
    resetTimer, killTimer, clearTimer, triggerFlyingTree,
  } = useTimer()

  const [tab, setTab] = useState<Tab>('today')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDuration, setSelectedDuration] = useState<Record<string, number>>({})
  const [breakingDown, setBreakingDown] = useState<string | null>(null)
  const [vanishingTasks, setVanishingTasks] = useState<Set<string>>(new Set())
  const [cheerMsg, setCheerMsg] = useState<typeof CHEER_MESSAGES[0] | null>(null)
  const [customTimerFor, setCustomTimerFor] = useState<string | null>(null)
  const taskCardRefs    = useRef<Record<string, HTMLDivElement | null>>({})
  const autoCompletedRef = useRef<Set<string>>(new Set())

  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState(2)
  const [newBucket, setNewBucket] = useState('today')
  const [addLoading, setAddLoading] = useState(false)

  const [query, setQuery] = useState('')
  const [streakData, setStreakData] = useState<{
    current_streak: number
    total_trees_grown: number
    total_trees_lost: number
    forest_acres: number
  } | null>(null)

  const [energy, setEnergy] = useState(3)
  const [mood, setMood] = useState(3)
  const [reflectNote, setReflectNote] = useState('')
  const [reflectSaved, setReflectSaved] = useState(false)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())
  const [focusImmersiveTask, setFocusImmersiveTask] = useState<Task | null>(null)

  useEffect(() => { loadData() }, [])

  // Auto-complete when timer finishes — triggers cheer + flying tree automatically
  useEffect(() => {
    Object.entries(activeTimers).forEach(([taskId, timer]) => {
      if (
        timer.completed &&
        !autoCompletedRef.current.has(taskId) &&
        focusImmersiveTask?.id !== taskId   // immersive mode handles itself
      ) {
        autoCompletedRef.current.add(taskId)
        const durationMins = Math.round((selectedDuration[taskId] || 1500) / 60)
        setTimeout(() => handleComplete(taskId, durationMins), 1200)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTimers])

  async function loadData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [tasksRes, streakRes] = await Promise.all([
      supabase.from('tasks').select('*').eq('user_id', user.id)
        .neq('bucket', 'trash').order('created_at', { ascending: false }),
      supabase.from('user_streaks').select('*').eq('user_id', user.id).single()
    ])

    const taskList = tasksRes.data || []
    setTasks(taskList)
    if (streakRes.data) setStreakData(streakRes.data)

    const durations: Record<string, number> = {}
    taskList.forEach(t => { durations[t.id] = 1500 })
    setSelectedDuration(durations)
    setLoading(false)
  }

  async function handleAddTask(e: React.FormEvent, stayOnAdd = false) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAddLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: task } = await supabase.from('tasks').insert({
      user_id: user.id, title: newTitle.trim(),
      bucket: newBucket, status: 'pending', priority: newPriority,
    }).select().single()

    if (task) {
      setTasks(prev => [task, ...prev])
      setSelectedDuration(prev => ({ ...prev, [task.id]: 1500 }))
    }

    setNewTitle('')
    setNewPriority(2)
    setAddLoading(false)
    if (!stayOnAdd) setTab('today')
  }

  async function handleComplete(taskId: string, durationMins?: number) {
    const timer = activeTimers[taskId]
    const cheerMessage = timer?.message || CHEER_MESSAGES[Math.floor(Math.random() * CHEER_MESSAGES.length)]

    // Trigger flying tree animation to navbar
    const cardEl = taskCardRefs.current[taskId]
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect()
      triggerFlyingTree({
        id: `${taskId}-${Date.now()}`,
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2,
        treeType: 'full',
      })
    }

    // Show cheer overlay
    setCheerMsg(cheerMessage)

    // Mark task as vanishing with animation
    setVanishingTasks(prev => new Set(Array.from(prev).concat(taskId)))

    // After animation completes - update DB
    setTimeout(async () => {
      const supabase = createClient()
      await supabase.from('tasks')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', taskId)

      const duration = durationMins || Math.round((selectedDuration[taskId] || 1500) / 60)
      await fetch('/api/tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, timer_duration: duration, status: 'alive' })
      })
      await fetch('/api/streak', { method: 'POST' })

      setTasks(prev => prev.filter(t => t.id !== taskId))
      setVanishingTasks(prev => { const n = new Set(prev); n.delete(taskId); return n })
      autoCompletedRef.current.delete(taskId)
      clearTimer(taskId)
      await loadData()
    }, 600)
  }

  async function handleBreakdown(task: Task) {
    setBreakingDown(task.id)
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Break down this task into 3-5 small actionable steps for someone with ADHD: "${task.title}".
Respond ONLY as a JSON array like: ["step 1","step 2","step 3"]
No extra text. Just the JSON array.`
        })
      })
      const data = await response.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const steps = JSON.parse(clean)
      const stepsObj = steps.map((s: string) => ({ text: s, done: false }))
      const supabase = createClient()
      await supabase.from('tasks').update({ steps: stepsObj }).eq('id', task.id)
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, steps: stepsObj } : t))
      setExpandedSteps(prev => new Set(Array.from(prev).concat(task.id)))
    } catch {}
    setBreakingDown(null)
  }

  async function toggleStep(taskId: string, stepIndex: number) {
    const task = tasks.find(t => t.id === taskId)
    if (!task?.steps) return
    const newSteps = task.steps.map((s, i) => i === stepIndex ? { ...s, done: !s.done } : s)
    const supabase = createClient()
    await supabase.from('tasks').update({ steps: newSteps }).eq('id', taskId)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, steps: newSteps } : t))
  }

  async function handleReflectSave() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('daily_reflections').insert({
      user_id: user.id, energy_level: energy, mood_level: mood,
      notes: reflectNote, plan_date: new Date().toISOString().split('T')[0],
    })
    setReflectSaved(true)
  }

  const todayStr     = new Date().toISOString().split('T')[0]
  const todayTasks   = tasks.filter(t => t.bucket === 'today' && t.created_at.startsWith(todayStr))
  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const doneTasks    = tasks.filter(t => t.status === 'done')

  // Weekly chart data for Progress tab
  const last7Bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - 6 + i)
    const ds = d.toISOString().split('T')[0]
    return {
      label:   d.toLocaleDateString('en', { weekday: 'short' }),
      count:   doneTasks.filter(t => t.completed_at?.startsWith(ds)).length,
      isToday: i === 6,
    }
  })
  const chartMax = Math.max(...last7Bars.map(b => b.count), 1)
  const filteredTasks = query.trim()
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : []

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'today',    label: 'Today',    icon: '◈' },
    { id: 'add',      label: 'Add',      icon: '+' },
    { id: 'progress', label: 'Progress', icon: '◎' },
    { id: 'search',   label: 'Search',   icon: '⌕' },
    { id: 'focus',    label: 'Focus',    icon: '◉' },
    { id: 'reflect',  label: 'Reflect',  icon: '◌' },
  ]

  return (
    <div className="min-h-screen bg-white">

      {/* Cheer overlay */}
      <AnimatePresence>
        {cheerMsg && (
          <CheerOverlay
            message={cheerMsg}
            onDone={() => setCheerMsg(null)}
          />
        )}
      </AnimatePresence>

      {/* Immersive focus mode overlay */}
      <AnimatePresence>
        {focusImmersiveTask && (
          <FocusImmersiveMode
            task={focusImmersiveTask}
            timer={activeTimers[focusImmersiveTask.id]}
            duration={selectedDuration[focusImmersiveTask.id] || 1500}
            onStart={() => startTimer(focusImmersiveTask.id, focusImmersiveTask.title, selectedDuration[focusImmersiveTask.id] || 1500)}
            onPause={() => pauseTimer(focusImmersiveTask.id)}
            onAbandon={() => {
              killTimer(focusImmersiveTask.id)
              fetch('/api/tree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  task_id: focusImmersiveTask.id,
                  timer_duration: Math.round((selectedDuration[focusImmersiveTask.id] || 1500) / 60),
                  status: 'dead',
                }),
              })
            }}
            onComplete={(durationMins) => {
              handleComplete(focusImmersiveTask.id, durationMins)
              setFocusImmersiveTask(null)
            }}
            onDurationChange={(secs) => {
              setSelectedDuration(prev => ({ ...prev, [focusImmersiveTask.id]: secs }))
              resetTimer(focusImmersiveTask.id, secs)
            }}
            onClose={() => setFocusImmersiveTask(null)}
          />
        )}
      </AnimatePresence>

      {/* Custom timer modal */}
      <AnimatePresence>
        {customTimerFor && (
          <CustomTimerModal
            onSelect={(mins) => {
              setSelectedDuration(prev => ({ ...prev, [customTimerFor]: mins * 60 }))
              resetTimer(customTimerFor, mins * 60)
              setCustomTimerFor(null)
            }}
            onClose={() => setCustomTimerFor(null)}
          />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
          style={{ background: '#F1F5F9' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0"
              style={{
                background: tab === t.id ? '#fff' : 'transparent',
                color: tab === t.id ? '#7C3AED' : '#94A3B8',
                boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <span style={{ fontSize: '10px' }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ TODAY TAB ══════════════ */}
        {tab === 'today' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Today</h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {todayTasks.filter(t => t.status === 'pending').length} tasks remaining
                </p>
              </div>
              <button
                onClick={() => setTab('add')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
              >
                + Add task
              </button>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400 text-center py-8">Loading...</p>
            ) : todayTasks.length === 0 ? (
              <div className="rounded-3xl p-8 text-center"
                style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC' }}>
                <div className="flex justify-center mb-3">
                  <GrowingTree progress={0.1} size={80} durationMinutes={5} />
                </div>
                <p className="text-sm font-semibold text-green-700 mb-1">Your forest awaits</p>
                <p className="text-xs text-green-600 mb-4">Add a task to grow your first tree today.</p>
                <button onClick={() => setTab('add')}
                  className="text-sm font-bold px-5 py-2.5 rounded-xl text-white"
                  style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}>
                  + Plant a task 🌱
                </button>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {todayTasks.map(task => {
                    const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[2]
                    const t = activeTimers[task.id]
                    const duration = selectedDuration[task.id] || 1500
                    const timeLeft = t?.timeLeft ?? duration
                    const totalTime = t?.totalTime ?? duration
                    const running = t?.running ?? false
                    const completed = t?.completed ?? false
                    const dead = t?.dead ?? false
                    const progress = totalTime > 0 ? 1 - timeLeft / totalTime : 0
                    const mins = Math.floor(timeLeft / 60)
                    const secs = timeLeft % 60
                    const isDone = task.status === 'done'
                    const durationMins = Math.round(duration / 60)
                    const isVanishing = vanishingTasks.has(task.id)
                    const stepsExpanded = expandedSteps.has(task.id)
                    const completedSteps = task.steps?.filter(s => s.done).length || 0
                    const totalSteps = task.steps?.length || 0

                    return (
                      <motion.div
                        key={task.id}
                        ref={el => { taskCardRefs.current[task.id] = el }}
                        layout
                        initial={{ opacity:0, y:10, scale:1 }}
                        animate={isVanishing
                          ? { opacity:0, scale:0.8, y:-30 }
                          : { opacity:1, y:0, scale:1 }
                        }
                        exit={{ opacity:0, x:60, scale:0.9 }}
                        transition={{ duration:0.4, type:'spring', stiffness:200 }}
                        className="rounded-2xl overflow-hidden"
                        style={{
                          background: isDone ? '#F0FDF4' :
                                      dead ? '#FEF2F2' :
                                      running ? '#F0FDF4' : '#FFFFFF',
                          border: isDone ? '1.5px solid #86EFAC' :
                                  dead ? '1.5px solid #FECACA' :
                                  running ? '1.5px solid #22C55E' :
                                  '1px solid #F1F5F9',
                          boxShadow: running
                            ? '0 0 0 3px rgba(34,197,94,0.12), 0 4px 16px rgba(0,0,0,0.06)'
                            : '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                          borderLeft: `3px solid ${p.color}`,
                        }}
                      >
                        {/* Task header */}
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <button
                              onClick={() => !running && handleComplete(task.id)}
                              className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                              style={{
                                borderColor: isDone ? '#16A34A' : '#CBD5E1',
                                background: isDone ? '#16A34A' : 'transparent',
                              }}
                            >
                              {isDone && <span className="text-white" style={{ fontSize:'10px' }}>✓</span>}
                            </button>

                            {/* Title area */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold leading-snug"
                                style={{
                                  textDecoration: isDone ? 'line-through' : 'none',
                                  color: isDone ? '#94A3B8' : '#1E293B',
                                }}>
                                {task.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-lg font-medium"
                                  style={{ background: p.bg, color: p.color, border:`1px solid ${p.border}` }}>
                                  {p.label}
                                </span>
                                {totalSteps > 0 && (
                                  <button
                                    onClick={() => setExpandedSteps(prev => {
                                      const n = new Set(prev)
                                      n.has(task.id) ? n.delete(task.id) : n.add(task.id)
                                      return n
                                    })}
                                    className="text-xs px-2 py-0.5 rounded-lg font-medium"
                                    style={{ background:'#F5F3FF', color:'#7C3AED' }}>
                                    {completedSteps}/{totalSteps} steps
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* AI breakdown button */}
                            {!isDone && (
                              <button
                                onClick={() => handleBreakdown(task)}
                                disabled={breakingDown === task.id}
                                className="flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl flex-shrink-0"
                                style={{ background:'#F5F3FF', color:'#7C3AED', border:'1px solid #EDE9FE' }}
                              >
                                {breakingDown === task.id ? (
                                  <motion.span animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1 }}>
                                    ✦
                                  </motion.span>
                                ) : '✦'} AI
                              </button>
                            )}
                          </div>

                          {/* Steps */}
                          <AnimatePresence>
                            {stepsExpanded && task.steps && task.steps.length > 0 && (
                              <motion.div
                                initial={{ height:0, opacity:0 }}
                                animate={{ height:'auto', opacity:1 }}
                                exit={{ height:0, opacity:0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 space-y-1.5 pl-8">
                                  {task.steps.map((step, i) => (
                                    <button
                                      key={i}
                                      onClick={() => toggleStep(task.id, i)}
                                      className="w-full flex items-start gap-2 text-left"
                                    >
                                      <div className="w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                                        style={{
                                          borderColor: step.done ? '#16A34A' : '#CBD5E1',
                                          background: step.done ? '#16A34A' : 'transparent',
                                        }}>
                                        {step.done && <span className="text-white" style={{ fontSize:'8px' }}>✓</span>}
                                      </div>
                                      <span className="text-xs leading-relaxed"
                                        style={{
                                          color: step.done ? '#94A3B8' : '#475569',
                                          textDecoration: step.done ? 'line-through' : 'none',
                                        }}>
                                        {step.text}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Timer section */}
                        {!isDone && (
                          <div className="mx-3 mb-3 rounded-2xl p-3"
                            style={{
                              background: running ? 'linear-gradient(135deg,#DCFCE7,#F0FDF4)' :
                                          dead ? '#FEF2F2' : '#fff',
                              border: running ? '1.5px solid #86EFAC' :
                                      dead ? '1.5px solid #FECACA' :
                                      '1px solid #E2E8F0',
                            }}>

                            {dead ? (
                              /* ── DEAD STATE ── */
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  <GrowingTree progress={0} size={80} isDead={true} durationMinutes={durationMins} />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-red-500 mb-0.5">Tree died 💀</p>
                                  <p className="text-xs text-slate-400 mb-2">
                                    That's okay. Try again.
                                  </p>
                                  <button
                                    onClick={() => resetTimer(task.id, duration)}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                                    style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                                    Plant again 🌱
                                  </button>
                                </div>
                              </div>
                            ) : completed ? (
                              /* ── COMPLETED STATE — auto-saves, no button needed ── */
                              <div className="flex items-center gap-3">
                                <motion.div
                                  className="flex-shrink-0"
                                  animate={{ scale:[1,1.12,1], rotate:[0,4,-4,0] }}
                                  transition={{ repeat:Infinity, duration:2 }}>
                                  <GrowingTree progress={1} size={80} durationMinutes={durationMins} />
                                </motion.div>
                                <div className="flex-1">
                                  <p className="text-sm font-black text-green-700 mb-0.5">
                                    {t?.message?.bold || 'Tree grown!'} 🌳
                                  </p>
                                  <p className="text-xs text-slate-400 mb-2">
                                    {t?.message?.sub || 'Flying to your forest...'}
                                  </p>
                                  <div className="flex items-center gap-1.5">
                                    <motion.span
                                      animate={{ opacity:[1,0.4,1] }}
                                      transition={{ repeat:Infinity, duration:1.2 }}
                                      className="text-xs font-semibold"
                                      style={{ color:'#16A34A' }}
                                    >
                                      🌿 Adding to forest...
                                    </motion.span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* ── TIMER STATE ── */
                              <div className="flex items-center gap-3">

                                {/* Tree visual */}
                                <div className="flex-shrink-0">
                                  <GrowingTree
                                    progress={progress}
                                    size={80}
                                    isDead={dead}
                                    isWilting={t?.treeStage === 'wilting'}
                                    durationMinutes={durationMins}
                                  />
                                </div>

                                {/* Timer + controls */}
                                <div className="flex-1 min-w-0">
                                  {/* Big timer display */}
                                  <motion.div
                                    className="font-black tabular-nums leading-none mb-2"
                                    style={{
                                      fontSize: '2.4rem',
                                      letterSpacing: '-0.04em',
                                      color: running ? '#15803D' : '#1E293B',
                                    }}
                                    animate={running ? { color:['#15803D','#16A34A','#15803D'] } : {}}
                                    transition={{ repeat:Infinity, duration:2 }}
                                  >
                                    {String(mins).padStart(2,'0')}
                                    <span style={{ opacity:0.35 }}>:</span>
                                    {String(secs).padStart(2,'0')}
                                  </motion.div>

                                  {/* Preset timers + custom button */}
                                  {!running && (
                                    <div className="flex gap-1 mb-2 flex-wrap items-center">
                                      {PRESET_TIMERS.map(opt => (
                                        <button
                                          key={opt}
                                          onClick={() => {
                                            setSelectedDuration(prev => ({ ...prev, [task.id]: opt * 60 }))
                                            resetTimer(task.id, opt * 60)
                                          }}
                                          className="px-2 py-1 rounded-lg text-xs font-semibold transition-all"
                                          style={{
                                            background: duration === opt * 60 ? '#16A34A' : '#F8FAFC',
                                            border: duration === opt * 60 ? '1px solid #16A34A' : '1px solid #E2E8F0',
                                            color: duration === opt * 60 ? '#fff' : '#94A3B8',
                                          }}
                                        >
                                          {opt}m
                                        </button>
                                      ))}
                                      {/* + custom timer button */}
                                      <button
                                        onClick={() => setCustomTimerFor(task.id)}
                                        className="px-2 py-1 rounded-lg text-xs font-bold transition-all"
                                        style={{
                                          background: '#F5F3FF',
                                          border: '1px solid #EDE9FE',
                                          color: '#7C3AED',
                                        }}
                                        title="Set custom timer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}

                                  {/* Action buttons */}
                                  <div className="flex gap-2">
                                    {!running ? (
                                      <button
                                        onClick={() => startTimer(task.id, task.title, duration)}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                                        style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}>
                                        🌱 {t && t.timeLeft < duration && t.timeLeft > 0 ? 'Resume' : 'Start'}
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => pauseTimer(task.id)}
                                          className="px-3 py-2 rounded-xl text-xs font-semibold"
                                          style={{ background:'#fff', border:'1px solid #E2E8F0', color:'#64748B' }}>
                                          ⏸ Pause
                                        </button>
                                        <button
                                          onClick={() => killTimer(task.id)}
                                          className="px-3 py-2 rounded-xl text-xs font-semibold"
                                          style={{ background:'#FEF2F2', border:'1px solid #FECACA', color:'#EF4444' }}>
                                          💀 Give up
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        )}

        {/* ══════════════ ADD TAB ══════════════ */}
        {tab === 'add' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Plant a task</h1>
              <p className="text-sm text-slate-400 mt-0.5">Each task grows a tree. One at a time.</p>
            </div>
            <div className="flex justify-center mb-5">
              <GrowingTree progress={0.2} size={100} durationMinutes={5} />
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <textarea
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="What do you need to do?"
                rows={3}
                className="w-full px-4 py-3.5 text-sm rounded-2xl resize-none outline-none transition-all"
                style={{
                  background: '#F8FAFC', border:'1.5px solid #E2E8F0',
                  fontFamily:'inherit', color:'#1E293B',
                }}
                onFocus={e => e.target.style.borderColor='#7C3AED'}
                onBlur={e => e.target.style.borderColor='#E2E8F0'}
              />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Priority</p>
                <div className="flex gap-2">
                  {[1,2,3].map(pr => {
                    const cfg = PRIORITY_CONFIG[pr]
                    return (
                      <button
                        key={pr} type="button"
                        onClick={() => setNewPriority(pr)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all"
                        style={{
                          background: newPriority === pr ? cfg.bg : '#F8FAFC',
                          border: newPriority === pr ? `1.5px solid ${cfg.color}` : '1.5px solid #E2E8F0',
                          color: newPriority === pr ? cfg.color : '#94A3B8',
                        }}>
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">When</p>
                <div className="flex gap-2">
                  {[
                    { value:'today', label:'Today', icon:'📅' },
                    { value:'week',  label:'This Week', icon:'📆' },
                    { value:'later', label:'Later', icon:'⏳' },
                  ].map(b => (
                    <button
                      key={b.value} type="button"
                      onClick={() => setNewBucket(b.value)}
                      className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-semibold transition-all"
                      style={{
                        background: newBucket === b.value ? '#F0FDF4' : '#F8FAFC',
                        border: newBucket === b.value ? '1.5px solid #16A34A' : '1.5px solid #E2E8F0',
                        color: newBucket === b.value ? '#16A34A' : '#94A3B8',
                      }}>
                      <span>{b.icon}</span>
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={addLoading || !newTitle.trim()}
                  onClick={e => handleAddTask(e as unknown as React.FormEvent, false)}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold text-white transition-all"
                  style={{
                    background: newTitle.trim() ? 'linear-gradient(135deg,#16A34A,#15803D)' : '#E2E8F0',
                    color: newTitle.trim() ? '#fff' : '#94A3B8',
                    boxShadow: newTitle.trim() ? '0 4px 14px rgba(22,163,74,0.25)' : 'none',
                  }}>
                  {addLoading ? 'Saving...' : '💾 Save task'}
                </button>
                <button
                  type="button"
                  disabled={addLoading || !newTitle.trim()}
                  onClick={e => handleAddTask(e as unknown as React.FormEvent, true)}
                  className="flex-1 py-4 rounded-2xl text-sm font-bold transition-all"
                  style={{
                    background: newTitle.trim() ? '#F0FDF4' : '#F8FAFC',
                    color: newTitle.trim() ? '#16A34A' : '#94A3B8',
                    border: newTitle.trim() ? '1.5px solid #86EFAC' : '1.5px solid #E2E8F0',
                  }}>
                  + Next task
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ══════════════ PROGRESS TAB ══════════════ */}
        {tab === 'progress' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Progress</h1>
              <p className="text-sm text-slate-400 mt-0.5">Your forest is growing.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label:'Trees grown', value:streakData?.total_trees_grown||0, color:'#16A34A', icon:'🌳' },
                { label:'Trees lost',  value:streakData?.total_trees_lost||0,  color:'#EF4444', icon:'💀' },
                { label:'Forest acres',value:`${(streakData?.forest_acres||0).toFixed(2)}`, color:'#2563EB', icon:'🌍' },
                { label:'Day streak',  value:streakData?.current_streak||0,    color:'#EA580C', icon:'🔥' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4"
                  style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold mb-0.5" style={{ color:s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label:'Done',    value:doneTasks.length,    color:'#16A34A' },
                { label:'Pending', value:pendingTasks.length, color:'#F59E0B' },
                { label:'Total',   value:tasks.length,        color:'#2563EB' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-3 text-center"
                  style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                  <div className="text-xl font-bold mb-0.5" style={{ color:s.color }}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              ))}
            </div>
            {/* Weekly bar chart */}
            <div className="rounded-2xl p-5 mb-4"
              style={{ background:'#FFFFFF', border:'1px solid #F1F5F9', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color:'#94A3B8' }}>
                  Last 7 days
                </p>
                <p className="text-xs font-semibold" style={{ color:'#16A34A' }}>
                  {last7Bars.reduce((a,b) => a + b.count, 0)} tasks done
                </p>
              </div>
              <div className="flex items-end gap-2" style={{ height:'88px' }}>
                {last7Bars.map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end" style={{ height:'68px' }}>
                      {bar.count > 0 ? (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(bar.count / chartMax) * 64}px` }}
                          transition={{ delay: i * 0.05, duration: 0.45, ease: [0.25,0.46,0.45,0.94] }}
                          className="w-full rounded-t-lg"
                          style={{
                            background: bar.isToday
                              ? 'linear-gradient(180deg,#16A34A,#15803D)'
                              : 'linear-gradient(180deg,#86EFAC,#BBF7D0)',
                            minHeight: '4px',
                          }}
                        />
                      ) : (
                        <div className="w-full rounded-t-lg" style={{ height:'3px', background:'#F1F5F9' }} />
                      )}
                    </div>
                    <span style={{
                      fontSize:'9px', fontWeight: bar.isToday ? 700 : 400,
                      color: bar.isToday ? '#16A34A' : '#94A3B8',
                    }}>
                      {bar.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop:'1px solid #F1F5F9' }}>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}/>
                  <span className="text-xs text-slate-400">Today</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background:'#86EFAC' }}/>
                  <span className="text-xs text-slate-400">Previous days</span>
                </div>
              </div>
            </div>

            {/* Overall completion card */}
            <div className="rounded-2xl p-5 text-center"
              style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC' }}>
              <div className="flex justify-center mb-2">
                <GrowingTree
                  progress={doneTasks.length / Math.max(tasks.length, 1)}
                  size={100} durationMinutes={60}
                />
              </div>
              <p className="text-sm font-bold text-green-700">
                {doneTasks.length} of {tasks.length} tasks completed
              </p>
              <p className="text-xs text-green-600 mt-1">
                {Math.round((doneTasks.length / Math.max(tasks.length, 1)) * 100)}% complete
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════════════ SEARCH TAB ══════════════ */}
        {tab === 'search' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Search</h1>
            </div>
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
              <input
                autoFocus type="text" value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background:'#F8FAFC', border:'1.5px solid #E2E8F0', color:'#1E293B' }}
                onFocus={e => e.target.style.borderColor='#7C3AED'}
                onBlur={e => e.target.style.borderColor='#E2E8F0'}
              />
            </div>
            {query.trim() === '' ? (
              <p className="text-sm text-slate-400 text-center py-8">
                Search {tasks.length} tasks...
              </p>
            ) : filteredTasks.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No results for "{query}"</p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 mb-2">{filteredTasks.length} result{filteredTasks.length!==1?'s':''}</p>
                {filteredTasks.map(task => (
                  <div key={task.id}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer"
                    style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}
                    onClick={() => setTab('today')}>
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background:PRIORITY_CONFIG[task.priority]?.color||'#94A3B8' }}/>
                    <span className="flex-1 text-sm truncate"
                      style={{ color:task.status==='done'?'#94A3B8':'#1E293B',
                               textDecoration:task.status==='done'?'line-through':'none' }}>
                      {task.title}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                      style={{ background:'#F1F5F9', color:'#94A3B8' }}>
                      {task.bucket}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════ FOCUS TAB ══════════════ */}
        {tab === 'focus' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Focus Mode</h1>
              <p className="text-sm text-slate-400 mt-0.5">Pick one. Grow a tree.</p>
            </div>
            {pendingTasks.length === 0 ? (
              <div className="rounded-3xl p-8 text-center"
                style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC' }}>
                <div className="flex justify-center mb-3">
                  <GrowingTree progress={1} size={80} durationMinutes={60} />
                </div>
                <p className="text-sm font-bold text-green-700">All tasks done!</p>
                <p className="text-xs text-green-600 mt-1">Your forest is thriving. 🌳</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map(task => {
                  const p = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG[2]
                  return (
                    <motion.div
                      key={task.id}
                      whileTap={{ scale:0.98 }}
                      className="flex items-center gap-3 px-4 py-4 rounded-2xl cursor-pointer"
                      style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}
                      onClick={() => setFocusImmersiveTask(task)}
                    >
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background:p.color }}/>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                        <p className="text-xs mt-0.5" style={{ color:p.color }}>{p.label}</p>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0"
                        style={{ color:'#16A34A' }}>
                        🌱 Focus →
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ══════════════ REFLECT TAB ══════════════ */}
        {tab === 'reflect' && (
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>

            {reflectSaved ? (
              <motion.div
                initial={{ opacity:0, scale:0.95 }}
                animate={{ opacity:1, scale:1 }}
                className="rounded-3xl p-10 text-center"
                style={{ background:'linear-gradient(145deg,#0F172A,#0D1F12)', border:'1px solid rgba(74,222,128,0.2)' }}
              >
                <div className="flex justify-center mb-4">
                  <GrowingTree progress={1} size={100} durationMinutes={60} />
                </div>
                <p className="text-2xl font-black text-white mb-2">Day closed. 🌙</p>
                <p className="text-sm" style={{ color:'rgba(255,255,255,0.5)' }}>
                  Your reflection is saved. Rest well — your forest grows tomorrow too.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-5">

                {/* Header card */}
                <div className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background:'linear-gradient(145deg,#0F172A,#0D1F12)', border:'1px solid rgba(74,222,128,0.15)' }}>
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,rgba(74,222,128,0.15) 0%,transparent 70%)' }} />
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'#4ADE80' }}>
                    End of day
                  </p>
                  <p className="text-xl font-black text-white leading-snug">
                    How did today actually go?
                  </p>
                  <p className="text-sm mt-1" style={{ color:'rgba(255,255,255,0.4)' }}>
                    No judgment. Just a quick check-in with yourself.
                  </p>
                </div>

                {/* Energy */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color:'#94A3B8' }}>
                    Energy today
                  </p>
                  <div className="flex gap-2">
                    {[
                      { emoji:'😴', label:'Dead' },
                      { emoji:'😔', label:'Low'  },
                      { emoji:'😐', label:'Meh'  },
                      { emoji:'😊', label:'Good' },
                      { emoji:'⚡', label:'Lit'  },
                    ].map((e, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setEnergy(i+1)}
                        className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                        style={{
                          background: energy===i+1 ? '#F0FDF4' : '#F8FAFC',
                          border: energy===i+1 ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                          boxShadow: energy===i+1 ? '0 0 0 3px rgba(22,163,74,0.12)' : 'none',
                        }}
                      >
                        <span className="text-2xl">{e.emoji}</span>
                        <span className="text-xs font-semibold" style={{ color: energy===i+1 ? '#16A34A' : '#94A3B8' }}>
                          {e.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color:'#94A3B8' }}>
                    Mood today
                  </p>
                  <div className="flex gap-2">
                    {[
                      { emoji:'😢', label:'Rough'   },
                      { emoji:'😕', label:'Bleh'    },
                      { emoji:'😶', label:'Ok'      },
                      { emoji:'🙂', label:'Good'    },
                      { emoji:'🤩', label:'Amazing' },
                    ].map((e, i) => (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.93 }}
                        onClick={() => setMood(i+1)}
                        className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
                        style={{
                          background: mood===i+1 ? '#F0FDF4' : '#F8FAFC',
                          border: mood===i+1 ? '2px solid #16A34A' : '1.5px solid #E2E8F0',
                          boxShadow: mood===i+1 ? '0 0 0 3px rgba(22,163,74,0.12)' : 'none',
                        }}
                      >
                        <span className="text-2xl">{e.emoji}</span>
                        <span className="text-xs font-semibold" style={{ color: mood===i+1 ? '#16A34A' : '#94A3B8' }}>
                          {e.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color:'#94A3B8' }}>
                    Anything on your mind?
                  </p>
                  <textarea
                    value={reflectNote}
                    onChange={e => setReflectNote(e.target.value)}
                    placeholder="wins, struggles, random thoughts — no filter needed"
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-2xl text-sm resize-none outline-none transition-all"
                    style={{
                      background:'#F8FAFC', border:'1.5px solid #E2E8F0',
                      fontFamily:'inherit', color:'#1E293B', lineHeight:'1.6',
                    }}
                    onFocus={e => e.target.style.borderColor='#16A34A'}
                    onBlur={e => e.target.style.borderColor='#E2E8F0'}
                  />
                </div>

                {/* CTA */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReflectSave}
                  className="w-full py-4 rounded-2xl text-sm font-black text-white"
                  style={{
                    background:'linear-gradient(135deg,#16A34A,#15803D)',
                    boxShadow:'0 4px 20px rgba(22,163,74,0.30)',
                  }}>
                  Close the day 🌙
                </motion.button>
                <p className="text-center text-xs" style={{ color:'#94A3B8' }}>
                  Takes 30 seconds. Worth every one.
                </p>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  )
}