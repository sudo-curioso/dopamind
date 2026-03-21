'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: string
  title: string
  priority: number
  bucket: string
  status: string
  steps?: { text: string; done: boolean }[]
}

interface PlanBlock {
  time: string
  duration: string
  task: string
  task_id?: string
  type: 'focus' | 'break' | 'admin' | 'energy'
  strategy: string
  why: string
  tip: string
  energy_required: 'low' | 'medium' | 'high'
}

interface DayPlan {
  greeting: string
  energy_assessment: string
  focus_window: string
  schedule: PlanBlock[]
  daily_intention: string
  warning: string
}

const ENERGY_CONFIG: Record<number, {
  label: string, emoji: string, color: string,
  bg: string, description: string
}> = {
  1: { label: 'Exhausted',  emoji: '😴', color: '#EF4444', bg: '#FEF2F2', description: 'Very low energy — survival mode' },
  2: { label: 'Low',        emoji: '😔', color: '#F97316', bg: '#FFF7ED', description: 'Low energy — gentle tasks only' },
  3: { label: 'Okay',       emoji: '😐', color: '#EAB308', bg: '#FEFCE8', description: 'Medium energy — steady pace' },
  4: { label: 'Good',       emoji: '😊', color: '#22C55E', bg: '#F0FDF4', description: 'High energy — tackle hard tasks' },
  5: { label: 'Energized',  emoji: '⚡', color: '#8B5CF6', bg: '#F5F3FF', description: 'Peak energy — deep work time' },
}

const MOOD_OPTIONS = [
  { id: 'focused',    emoji: '🎯', label: 'Focused' },
  { id: 'anxious',    emoji: '😰', label: 'Anxious' },
  { id: 'scattered',  emoji: '🌀', label: 'Scattered' },
  { id: 'motivated',  emoji: '💪', label: 'Motivated' },
  { id: 'foggy',      emoji: '🌫️', label: 'Brain fog' },
  { id: 'creative',   emoji: '✨', label: 'Creative' },
]

// ── TIME HELPERS ──
function getNow() {
  const now = new Date()
  const h = now.getHours()
  const m = now.getMinutes()
  // Round to next 15 min block
  const nextM = Math.ceil(m / 15) * 15
  const startH = nextM >= 60 ? h + 1 : h
  const startM = nextM >= 60 ? 0 : nextM
  const ampm = startH >= 12 ? 'PM' : 'AM'
  const h12 = startH % 12 === 0 ? 12 : startH % 12
  const startTime12 = `${h12}:${String(startM).padStart(2,'0')} ${ampm}`

  const periodH = now.getHours()
  const period = periodH < 12 ? 'morning' : periodH < 17 ? 'afternoon' : 'evening'
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: true })

  return { period, dayName, dateStr, timeStr, startTime12, hour: h }
}

function BlockIcon({ type }: { type: string }) {
  return <span>{ {focus:'🎯',break:'☕',admin:'📋',energy:'⚡'}[type] || '📌' }</span>
}

function EnergyDot({ level }: { level: string }) {
  const c = { low:'#22C55E', medium:'#EAB308', high:'#EF4444' }[level] || '#94A3B8'
  return <span className="inline-block w-2 h-2 rounded-full" style={{ background: c }}/>
}

// ── ACTIVE MODE - same page focus view ──
function ActiveMode({
  plan, tasks, energy, onBack
}: {
  plan: DayPlan
  tasks: Task[]
  energy: number
  onBack: () => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [note, setNote] = useState('')

  const current = plan.schedule[currentIdx]
  const durationMin = parseInt(current?.duration) || 25
  const totalBlocks = plan.schedule.length
  const progress = Math.round((completed.size / totalBlocks) * 100)

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setTimerActive(false)
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  function startTimer() {
    setTimeLeft(durationMin * 60)
    setTimerActive(true)
  }

  function markDone() {
    setCompleted(prev => new Set([...prev, currentIdx]))
    setTimerActive(false)
    setTimeLeft(0)
    setNote('')
    if (currentIdx < totalBlocks - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  function skipBlock() {
    setTimerActive(false)
    setTimeLeft(0)
    if (currentIdx < totalBlocks - 1) setCurrentIdx(currentIdx + 1)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const timerPercent = timeLeft > 0 ? (timeLeft / (durationMin * 60)) * 100 : 0
  const circumference = 2 * Math.PI * 54

  if (completed.size === totalBlocks) {
    return (
      <motion.div
        initial={{ opacity:0, scale:0.95 }}
        animate={{ opacity:1, scale:1 }}
        className="text-center space-y-6 py-8">
        <div className="text-6xl">🎉</div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Day complete!</h2>
          <p className="text-sm text-slate-500">
            You completed all {totalBlocks} blocks. That's your ADHD brain working at its best.
          </p>
        </div>
        <div className="rounded-2xl p-5"
          style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC' }}>
          <p className="text-3xl font-black text-green-600 mb-1">{completed.size}</p>
          <p className="text-sm text-green-700">blocks completed today</p>
        </div>
        <button onClick={onBack}
          className="w-full py-3 rounded-2xl text-sm font-bold text-white"
          style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}>
          Back to planner
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      className="space-y-4">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-slate-400 flex items-center gap-1">
          ← Back to plan
        </button>
        <div className="text-xs text-slate-400">
          {completed.size}/{totalBlocks} done
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full" style={{ background:'#F1F5F9' }}>
        <motion.div
          className="h-2 rounded-full"
          style={{ background:'linear-gradient(90deg,#16A34A,#22C55E)' }}
          initial={{ width:0 }}
          animate={{ width:`${progress}%` }}
          transition={{ duration:0.5 }}
        />
      </div>

      {/* Intention reminder */}
      <div className="rounded-2xl p-4 text-center"
        style={{ background:'#1E1B4B' }}>
        <p className="text-xs text-indigo-300 mb-1">Today's intention</p>
        <p className="text-sm font-bold text-white">"{plan.daily_intention}"</p>
      </div>

      {/* Current block - big card */}
      <AnimatePresence mode="wait">
        <motion.div key={currentIdx}
          initial={{ opacity:0, x:20 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:-20 }}
          className="rounded-3xl p-6"
          style={{
            background: current.type === 'break' ? '#F0FDF4' :
                        current.type === 'energy' ? '#FFF7ED' : '#EFF6FF',
            border: `2px solid ${current.type === 'break' ? '#86EFAC' :
                                  current.type === 'energy' ? '#FED7AA' : '#BFDBFE'}`,
          }}>

          {/* Block header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background:'rgba(255,255,255,0.7)' }}>
                <BlockIcon type={current.type} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">
                  {current.type} · {current.time}
                </p>
                <p className="text-xs text-slate-400">{current.duration}</p>
              </div>
            </div>
            <EnergyDot level={current.energy_required} />
          </div>

          {/* Task name */}
          <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
            {current.task}
          </h2>
          <p className="text-sm text-slate-500 mb-5">{current.why}</p>

          {/* Timer circle */}
          {current.type !== 'break' && (
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54"
                    fill="none" stroke="#E2E8F0" strokeWidth="8"/>
                  <circle cx="60" cy="60" r="54"
                    fill="none"
                    stroke={timerActive ? '#2563EB' : '#E2E8F0'}
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (timerPercent/100)*circumference}
                    strokeLinecap="round"
                    style={{ transition:'stroke-dashoffset 1s linear' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {timerActive ? (
                    <>
                      <span className="text-2xl font-black text-slate-900">
                        {formatTime(timeLeft)}
                      </span>
                      <span className="text-xs text-slate-400">remaining</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-slate-900">
                        {durationMin}
                      </span>
                      <span className="text-xs text-slate-400">min</span>
                    </>
                  )}
                </div>
              </div>
              {!timerActive && timeLeft === 0 && (
                <button onClick={startTimer}
                  className="mt-3 px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                  Start timer
                </button>
              )}
              {timerActive && (
                <button onClick={() => setTimerActive(false)}
                  className="mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background:'#F1F5F9', color:'#64748B' }}>
                  Pause
                </button>
              )}
            </div>
          )}

          {/* Strategy */}
          <div className="rounded-2xl p-3 mb-3"
            style={{ background:'rgba(255,255,255,0.6)' }}>
            <p className="text-xs font-semibold text-slate-600 mb-1">🧠 Strategy</p>
            <p className="text-xs text-slate-600">{current.strategy}</p>
          </div>

          {/* Micro starter */}
          <div className="rounded-2xl p-3 mb-4"
            style={{ background:'rgba(255,255,255,0.6)' }}>
            <p className="text-xs font-semibold text-slate-600 mb-1">🚀 Start here (2 min)</p>
            <p className="text-xs text-slate-600">{current.tip}</p>
          </div>

          {/* Quick note */}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Quick note for this block..."
            rows={2}
            className="w-full text-xs px-3 py-2 rounded-xl border resize-none outline-none mb-4"
            style={{ border:'1px solid #E2E8F0', color:'#475569' }}
          />

          {/* Action buttons */}
          <div className="flex gap-3">
            <button onClick={skipBlock}
              className="flex-1 py-3 rounded-xl text-sm font-semibold"
              style={{ background:'#F1F5F9', color:'#94A3B8' }}>
              Skip
            </button>
            <button onClick={markDone}
              className="flex-2 flex-grow-[2] py-3 rounded-xl text-sm font-bold text-white"
              style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}>
              ✓ Done
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Upcoming blocks */}
      {plan.schedule.length > currentIdx + 1 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Up next
          </p>
          <div className="space-y-2">
            {plan.schedule.slice(currentIdx+1, currentIdx+4).map((block, i) => (
              <div key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: completed.has(currentIdx+1+i) ? '#F0FDF4' : '#F8FAFC',
                  border: '1px solid #F1F5F9',
                  opacity: 0.7,
                }}>
                <BlockIcon type={block.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{block.task}</p>
                  <p className="text-xs text-slate-400">{block.time} · {block.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function PlannerPage() {
  const router = useRouter()
  const [plan, setPlan] = useState<DayPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [energy, setEnergy] = useState(3)
  const [mood, setMood] = useState('')
  const [hasDeadline, setHasDeadline] = useState(false)
  const [deadlineTask, setDeadlineTask] = useState('')
  const [hasAccess, setHasAccess] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')
  const [activeBlock, setActiveBlock] = useState<number | null>(null)
  const [mode, setMode] = useState<'form' | 'plan' | 'active'>('form')
  const tc = getNow()

  useEffect(() => { checkAccess() }, [])

  async function checkAccess() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: ud } = await sb.from('users')
      .select('plan,trial_ends_at,created_at').eq('id',user.id).single()

    let access = ud?.plan === 'pro'
    if (!access) {
      const trialEnd = ud?.trial_ends_at
        ? new Date(ud.trial_ends_at)
        : new Date(new Date(ud?.created_at||user.created_at).getTime()+14*864e5)
      access = trialEnd > new Date()
    }
    setHasAccess(access)

    if (access) {
      const { data: td } = await sb.from('tasks')
        .select('id,title,priority,bucket,status,steps')
        .eq('user_id', user.id)
        .in('status', ['pending','in_progress'])
        .order('priority', { ascending:true })
        .limit(20)
      setTasks(td || [])
    }
    setChecking(false)
  }

  async function generatePlan() {
    setLoading(true)
    setError('')

    try {
      const tc2 = getNow()
      const eCfg = ENERGY_CONFIG[energy]
      const moodLabel = MOOD_OPTIONS.find(m => m.id === mood)?.label || 'not specified'

      const taskContext = tasks.length > 0
        ? tasks.slice(0,12).map((t,i) => {
            const steps = t.steps?.length || 0
            const done = t.steps?.filter(s => s.done).length || 0
            const prog = steps > 0 ? ` [${done}/${steps} steps done]` : ''
            const pri = t.priority <= 2 ? 'URGENT' : t.priority <= 4 ? 'High' : t.priority <= 6 ? 'Medium' : 'Low'
            return `${i+1}. "${t.title}" | Priority: ${pri} | Category: ${t.bucket||'General'}${prog}`
          }).join('\n')
        : 'No tasks — help user build day structure'

      const deadlineCtx = hasDeadline && deadlineTask
        ? `\nURGENT DEADLINE TODAY: "${deadlineTask}" — schedule FIRST.`
        : ''

      const prompt = `You are an expert ADHD productivity coach. Create a hyper-personalized schedule.

CURRENT TIME: ${tc2.startTime12} (${tc2.dayName})
HOURS LEFT TODAY: ~${Math.max(1, 23 - tc2.hour)} hours until midnight
USER ENERGY: ${energy}/5 — ${eCfg.label} (${eCfg.description})
MOOD: ${moodLabel}${deadlineCtx}

TASKS:
${taskContext}

SCHEDULING RULES:
- Start ALL times from ${tc2.startTime12} onwards. NEVER schedule anything before current time.
- Use 12-hour format with AM/PM (e.g. "9:45 PM" not "21:45")
- Energy ${energy <= 2 ? '1-2: max 2 focus blocks, 15-20 min each, easiest tasks first' : energy === 3 ? '3: max 3 focus blocks, 20-25 min each' : '4-5: up to 5 focus blocks, 25-45 min each, hardest tasks first'}
- Add 5-10 min break between every focus block
- Be REALISTIC — only plan ${Math.max(1, Math.min(3, Math.floor((23-tc2.hour)/1.5)))} hours max

Respond with ONLY this JSON (no markdown):
{
  "greeting": "warm personalized greeting for ${tc2.period} (2 sentences)",
  "energy_assessment": "what this energy level means today (1-2 sentences)",
  "focus_window": "best 2-hour window starting from ${tc2.startTime12}",
  "daily_intention": "powerful one-line theme for tonight",
  "warning": "one ADHD-specific trap to avoid tonight",
  "schedule": [
    {
      "time": "H:MM AM/PM",
      "duration": "X min",
      "task": "specific task name",
      "task_id": null,
      "type": "focus",
      "energy_required": "medium",
      "strategy": "specific ADHD technique for this block",
      "why": "why this task now (1 sentence)",
      "tip": "micro-starter — exact first 2-min action"
    }
  ]
}`

      const res = await fetch('/api/planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g,'').trim()
      const s = clean.indexOf('{'), e2 = clean.lastIndexOf('}')
      if (s === -1 || e2 === -1) throw new Error('No JSON found')
      const parsed: DayPlan = JSON.parse(clean.slice(s, e2+1))
      if (!parsed.schedule?.length) throw new Error('Empty schedule')

      setPlan(parsed)
      setMode('plan')
    } catch(e: any) {
      console.error(e)
      setError('Could not generate plan. Please try again.')
    }
    setLoading(false)
  }

  // ── PAYWALL ──
  if (checking) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-slate-400">Loading...</p>
    </div>
  )

  if (!hasAccess) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <div className="text-5xl mb-3">✦</div>
        <div className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>PRO</div>
        <h1 className="text-xl font-semibold text-slate-900">AI Daily Planner</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Your ADHD brain coach. Analyzes tasks, energy, and mood to build a realistic daily schedule.
        </p>
        <button onClick={() => router.push('/pricing')}
          className="w-full py-3 rounded-2xl text-sm font-bold text-white"
          style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
          Upgrade to Pro
        </button>
        <button onClick={() => router.push('/tasks')}
          className="w-full py-2 text-sm text-slate-400">Back to tasks</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Header */}
        {mode !== 'active' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">AI Planner</h1>
              <span className="text-white font-bold rounded-md px-2 py-0.5 text-xs"
                style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>PRO</span>
            </div>
            <p className="text-sm text-slate-400">
              {tc.timeStr} · {tc.dayName} · {tasks.length} tasks
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">

          {/* ════ FORM ════ */}
          {mode === 'form' && (
            <motion.div key="form"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="space-y-4">

              {/* Energy */}
              <div className="rounded-2xl p-5"
                style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                <p className="text-sm font-semibold text-slate-800 mb-1">How is your energy right now?</p>
                <p className="text-xs text-slate-400 mb-4">This changes which tasks AI assigns you today</p>
                <div className="grid grid-cols-5 gap-2">
                  {[1,2,3,4,5].map(lvl => {
                    const cfg = ENERGY_CONFIG[lvl]
                    const active = energy === lvl
                    return (
                      <button key={lvl} onClick={() => setEnergy(lvl)}
                        className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all"
                        style={{
                          background: active ? cfg.color : '#F1F5F9',
                          transform: active ? 'scale(1.05)' : 'scale(1)',
                        }}>
                        <span className="text-lg">{cfg.emoji}</span>
                        <span className="text-xs font-semibold"
                          style={{ color: active ? '#fff' : '#94A3B8' }}>{cfg.label}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="text-xs text-center mt-3 font-medium"
                  style={{ color: ENERGY_CONFIG[energy].color }}>
                  {ENERGY_CONFIG[energy].description}
                </p>
              </div>

              {/* Mood */}
              <div className="rounded-2xl p-5"
                style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                <p className="text-sm font-semibold text-slate-800 mb-3">What best describes your mind right now?</p>
                <div className="grid grid-cols-3 gap-2">
                  {MOOD_OPTIONS.map(m => (
                    <button key={m.id} onClick={() => setMood(mood === m.id ? '' : m.id)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                      style={{
                        background: mood === m.id ? '#EFF6FF' : '#fff',
                        border: mood === m.id ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                        color: mood === m.id ? '#2563EB' : '#64748B',
                      }}>
                      <span>{m.emoji}</span> {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div className="rounded-2xl p-4"
                style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-800">Any deadline today?</p>
                  <button onClick={() => setHasDeadline(!hasDeadline)}
                    className="w-10 h-6 rounded-full transition-all relative"
                    style={{ background: hasDeadline ? '#EF4444' : '#E2E8F0' }}>
                    <span className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all"
                      style={{ left: hasDeadline ? '20px' : '4px' }}/>
                  </button>
                </div>
                {hasDeadline && (
                  <input value={deadlineTask} onChange={e => setDeadlineTask(e.target.value)}
                    placeholder="What must be done today?"
                    className="w-full text-sm px-3 py-2.5 rounded-xl border outline-none"
                    style={{ border:'1px solid #FCA5A5', background:'#FEF2F2', color:'#991B1B' }}
                  />
                )}
              </div>

              {/* Task preview */}
              <div className="rounded-2xl p-4"
                style={{ background:'#F8FAFC', border:'1px solid #F1F5F9' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-slate-800">Tasks AI will analyze</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg text-white"
                    style={{ background:'#2563EB' }}>{tasks.length}</span>
                </div>
                {tasks.length === 0 ? (
                  <p className="text-xs text-slate-400">No pending tasks — AI will help you build structure.</p>
                ) : (
                  <div className="space-y-1.5">
                    {tasks.slice(0,5).map(t => (
                      <div key={t.id} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: t.priority<=3?'#EF4444':t.priority<=6?'#F59E0B':'#94A3B8' }}/>
                        <span className="text-xs text-slate-600 truncate">{t.title}</span>
                        <span className="text-xs text-slate-300 ml-auto flex-shrink-0">{t.bucket}</span>
                      </div>
                    ))}
                    {tasks.length > 5 && (
                      <p className="text-xs text-slate-400 pt-1">+{tasks.length-5} more included</p>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-xl p-3 text-sm text-red-600"
                  style={{ background:'#FEF2F2', border:'1px solid #FCA5A5' }}>
                  {error}
                </div>
              )}

              <button onClick={generatePlan} disabled={loading}
                className="w-full py-4 rounded-2xl text-sm font-bold text-white"
                style={{ background: loading ? '#94A3B8' : 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                {loading ? '🧠 Analyzing your tasks and energy...' : `✦ Build my plan for ${tc.period}`}
              </button>

              {loading && (
                <p className="text-xs text-center text-slate-400 animate-pulse">
                  Matching your tasks to your energy level...
                </p>
              )}
            </motion.div>
          )}

          {/* ════ PLAN VIEW ════ */}
          {mode === 'plan' && plan && (
            <motion.div key="plan"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              className="space-y-4">

              {/* Greeting */}
              <div className="rounded-2xl p-5"
                style={{
                  background: `linear-gradient(135deg,${ENERGY_CONFIG[energy].bg},#fff)`,
                  border: `1px solid ${ENERGY_CONFIG[energy].color}33`,
                }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{ENERGY_CONFIG[energy].emoji}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">{plan.greeting}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{plan.energy_assessment}</p>
                  </div>
                </div>
              </div>

              {/* Intention */}
              <div className="rounded-2xl p-4" style={{ background:'#1E1B4B' }}>
                <p className="text-xs font-semibold text-indigo-300 mb-1 uppercase tracking-wider">
                  Today's intention
                </p>
                <p className="text-sm font-bold text-white">"{plan.daily_intention}"</p>
              </div>

              {/* Focus + Warning */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4"
                  style={{ background:'#F0FDF4', border:'1px solid #BBF7D0' }}>
                  <p className="text-xs font-semibold text-green-600 mb-1">⚡ Peak window</p>
                  <p className="text-xs font-bold text-green-800">{plan.focus_window}</p>
                </div>
                <div className="rounded-2xl p-4"
                  style={{ background:'#FFF7ED', border:'1px solid #FED7AA' }}>
                  <p className="text-xs font-semibold text-orange-600 mb-1">⚠️ Watch out</p>
                  <p className="text-xs font-bold text-orange-800">{plan.warning}</p>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Your schedule
                </p>
                <div className="space-y-2">
                  {plan.schedule.map((block, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, x:-8 }}
                      animate={{ opacity:1, x:0 }}
                      transition={{ delay: i*0.05 }}>
                      <button
                        className="w-full text-left rounded-2xl p-4 transition-all"
                        onClick={() => setActiveBlock(activeBlock === i ? null : i)}
                        style={{
                          background: block.type === 'break' ? '#F8FAFC' :
                                      block.type === 'energy' ? '#F0FDF4' : '#fff',
                          border: activeBlock === i ? '1.5px solid #2563EB' : '1px solid #F1F5F9',
                          boxShadow: activeBlock === i ? '0 0 0 3px rgba(37,99,235,0.06)' : 'none',
                        }}>
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-16 text-center">
                            <p className="text-xs font-bold text-slate-900">{block.time}</p>
                            <p className="text-xs text-slate-400">{block.duration}</p>
                          </div>
                          <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                            style={{
                              background: block.type === 'focus' ? '#EFF6FF' :
                                          block.type === 'break' ? '#F0FDF4' :
                                          block.type === 'energy' ? '#FFF7ED' : '#F5F3FF'
                            }}>
                            <BlockIcon type={block.type} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-semibold text-slate-900 truncate">{block.task}</p>
                              <EnergyDot level={block.energy_required} />
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{block.why}</p>
                          </div>
                          <span className="text-slate-300 text-xs mt-1 flex-shrink-0">
                            {activeBlock === i ? '▲' : '▼'}
                          </span>
                        </div>

                        {/* Expanded */}
                        <AnimatePresence>
                          {activeBlock === i && (
                            <motion.div
                              initial={{ height:0, opacity:0 }}
                              animate={{ height:'auto', opacity:1 }}
                              exit={{ height:0, opacity:0 }}
                              className="overflow-hidden">
                              <div className="mt-4 pt-4 space-y-2"
                                style={{ borderTop:'1px solid #F1F5F9' }}>
                                <div className="rounded-xl p-3" style={{ background:'#EFF6FF' }}>
                                  <p className="text-xs font-semibold text-blue-600 mb-1">🧠 Strategy</p>
                                  <p className="text-xs text-blue-800">{block.strategy}</p>
                                </div>
                                <div className="rounded-xl p-3" style={{ background:'#F0FDF4' }}>
                                  <p className="text-xs font-semibold text-green-600 mb-1">🚀 Start here</p>
                                  <p className="text-xs text-green-800">{block.tip}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setPlan(null); setMode('form'); setError('') }}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background:'#F1F5F9', color:'#475569' }}>
                  ↺ Regenerate
                </button>
                <button
                  onClick={() => setMode('active')}
                  className="flex-[2] py-3 rounded-2xl text-sm font-bold text-white"
                  style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
                  ▶ Start my day
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 pb-4">
                Plan built at {tc.timeStr} · {tasks.length} tasks analyzed
              </p>
            </motion.div>
          )}

          {/* ════ ACTIVE MODE ════ */}
          {mode === 'active' && plan && (
            <motion.div key="active"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
              <ActiveMode
                plan={plan}
                tasks={tasks}
                energy={energy}
                onBack={() => setMode('plan')}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}