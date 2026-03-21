'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTimer } from '@/context/timer-context'

const TIMER_OPTIONS = [5, 15, 25, 45, 60]

const PRIORITY_COLOR: Record<number, string> = {
  1: '#EF4444',
  2: '#F59E0B',
  3: '#6B7280',
}

interface Task {
  id: string
  title: string
  status: string
  priority: number
}

export default function TimerPage() {
  const router = useRouter()
  const { activeTimers, startTimer, pauseTimer, resetTimer, clearTimer } = useTimer()
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedDuration, setSelectedDuration] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .eq('bucket', 'today')
      .order('priority', { ascending: true })

    const taskList = data || []
    setTasks(taskList)

    const durations: Record<string, number> = {}
    taskList.forEach(t => { durations[t.id] = 1500 })
    setSelectedDuration(durations)
    setLoading(false)
  }

  async function handleMarkDone(taskId: string) {
    const supabase = createClient()
    await supabase
      .from('tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', taskId)
    clearTimer(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  function handleSelectDuration(taskId: string, seconds: number) {
    const t = activeTimers[taskId]
    if (t?.running) return
    setSelectedDuration(prev => ({ ...prev, [taskId]: seconds }))
    resetTimer(taskId, seconds)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Timer
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Every task has its own timer. Timers keep running even if you switch pages.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
          >
            <p className="text-slate-400 text-sm mb-3">No tasks for today.</p>
            <button
              onClick={() => router.push('/tasks/add')}
              className="text-sm font-medium"
              style={{ color: '#2563EB' }}
            >
              + Add a task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => {
              const t = activeTimers[task.id]
              const duration = selectedDuration[task.id] || 1500
              const timeLeft = t?.timeLeft ?? duration
              const totalTime = t?.totalTime ?? duration
              const running = t?.running ?? false
              const completed = t?.completed ?? false

              const progress = totalTime > 0 ? timeLeft / totalTime : 0
              const mins = Math.floor(timeLeft / 60)
              const secs = timeLeft % 60
              const circumference = 2 * Math.PI * 28
              const strokeDashoffset = circumference * (1 - progress)
              const progressColor = progress > 0.5
                ? '#2563EB'
                : progress > 0.25
                ? '#7C3AED'
                : '#EF4444'

              return (
                <div
                  key={task.id}
                  className="rounded-2xl p-5 transition-all"
                  style={{
                    background: completed ? '#F0FDF4' : '#F8FAFC',
                    border: completed
                      ? '1.5px solid #86EFAC'
                      : running
                      ? '1.5px solid #2563EB'
                      : '1px solid #F1F5F9',
                  }}
                >
                  {completed ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <span style={{ fontSize: '28px' }}>{t?.message.emoji}</span>
                        <div>
                          <p
                            className="text-base font-black tracking-tight"
                            style={{
                              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {t?.message.bold}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {t?.message.sub}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Task: <strong>{task.title}</strong>
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMarkDone(task.id)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white"
                          style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
                        >
                          Mark as done ✓
                        </button>
                        <button
                          onClick={() => resetTimer(task.id, duration)}
                          className="py-2.5 px-4 rounded-xl text-xs font-semibold"
                          style={{
                            background: '#fff',
                            border: '1px solid #E2E8F0',
                            color: '#94A3B8'
                          }}
                        >
                          Go again
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">

                      {/* Mini circle timer */}
                      <div className="relative flex-shrink-0">
                        <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="36" cy="36" r="28" fill="none" stroke="#E2E8F0" strokeWidth="5" />
                          <circle
                            cx="36" cy="36" r="28"
                            fill="none"
                            stroke={running ? progressColor : '#CBD5E1'}
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-xs font-semibold tabular-nums"
                            style={{ color: running ? progressColor : '#94A3B8' }}
                          >
                            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Task info + controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: PRIORITY_COLOR[task.priority] }}
                          />
                          <span className="text-sm font-medium text-slate-900 truncate">
                            {task.title}
                          </span>
                        </div>

                        {!running && (
                          <div className="flex gap-1 mb-3">
                            {TIMER_OPTIONS.map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleSelectDuration(task.id, opt * 60)}
                                className="px-2 py-0.5 rounded-lg text-xs font-medium transition-all"
                                style={{
                                  background: duration === opt * 60 ? '#EFF6FF' : '#fff',
                                  border: duration === opt * 60
                                    ? '1px solid #2563EB'
                                    : '1px solid #E2E8F0',
                                  color: duration === opt * 60 ? '#2563EB' : '#94A3B8',
                                }}
                              >
                                {opt}m
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          {!running ? (
                            <button
                              onClick={() => startTimer(task.id, task.title, duration)}
                              className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                            >
                              {t && t.timeLeft < duration && t.timeLeft > 0 ? 'Resume' : 'Start'}
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseTimer(task.id)}
                              className="px-4 py-1.5 rounded-xl text-xs font-semibold"
                              style={{
                                background: '#fff',
                                border: '1px solid #E2E8F0',
                                color: '#64748B'
                              }}
                            >
                              Pause
                            </button>
                          )}
                          <button
                            onClick={() => resetTimer(task.id, duration)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                            style={{
                              background: '#fff',
                              border: '1px solid #E2E8F0',
                              color: '#94A3B8'
                            }}
                          >
                            Reset
                          </button>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}