'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const TIMER_OPTIONS = [15, 25, 45, 60]

function FocusContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const taskId = searchParams.get('task')

  const [task, setTask] = useState<{ id: string; title: string } | null>(null)
  const [selectedMinutes, setSelectedMinutes] = useState(25)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [totalTime, setTotalTime] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function loadTask() {
      if (!taskId) { setLoading(false); return }
      const supabase = createClient()
      const { data } = await supabase
        .from('tasks').select('id, title').eq('id', taskId).single()
      if (data) setTask(data)
      setLoading(false)
    }
    loadTask()
  }, [taskId])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            setCompleted(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running])

  function handleStart() {
    const seconds = selectedMinutes * 60
    setTimeLeft(seconds); setTotalTime(seconds)
    setRunning(true); setCompleted(false)
  }

  function handlePause() {
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  function handleReset() {
    setRunning(false); setCompleted(false)
    setTimeLeft(selectedMinutes * 60); setTotalTime(selectedMinutes * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  async function handleComplete() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (task) {
      await supabase.from('tasks')
        .update({ status: 'done', completed_at: new Date().toISOString() })
        .eq('id', task.id)
    }
    await supabase.from('focus_sessions').insert({
      user_id: user.id,
      task_id: task?.id || null,
      duration_s: totalTime,
      completed: true,
      ended_at: new Date().toISOString()
    })
    router.push('/dashboard')
  }

  const progress = totalTime > 0 ? timeLeft / totalTime : 0
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-400">Loading...</p>
    </div>
  )

  if (completed) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-slate-900">Session complete</h1>
        <p className="text-slate-500">
          You focused for {selectedMinutes} minutes. That is something to be proud of.
        </p>
        {task && (
          <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
            Mark task as done
          </Button>
        )}
        <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
          Back to dashboard
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">

        <div className="text-center">
          {task ? (
            <>
              <p className="text-sm text-slate-400 mb-1">Focusing on</p>
              <h1 className="text-xl font-semibold text-slate-900">{task.title}</h1>
            </>
          ) : (
            <h1 className="text-xl font-semibold text-slate-900">Free focus session</h1>
          )}
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <svg width="280" height="280" className="-rotate-90">
              <circle cx="140" cy="140" r="120" fill="none" stroke="#F1F5F9" strokeWidth="12" />
              <circle
                cx="140" cy="140" r="120" fill="none"
                stroke="#16A34A" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-slate-900">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              {running && <span className="text-xs text-slate-400 mt-1">focusing</span>}
            </div>
          </div>
        </div>

        {!running && timeLeft === selectedMinutes * 60 && (
          <div className="flex justify-center gap-2">
            {TIMER_OPTIONS.map(min => (
              <button
                key={min}
                onClick={() => { setSelectedMinutes(min); setTimeLeft(min * 60); setTotalTime(min * 60) }}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  background: selectedMinutes === min ? '#16A34A' : '#F1F5F9',
                  color: selectedMinutes === min ? '#fff' : '#64748B',
                }}
              >
                {min}m
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {!running ? (
            <Button onClick={handleStart} className="flex-1 h-12" style={{ background: '#16A34A' }}>
              {timeLeft < selectedMinutes * 60 ? 'Resume' : 'Start focus'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" className="flex-1 h-12">Pause</Button>
          )}
          <Button onClick={handleReset} variant="outline" className="h-12 px-6">Reset</Button>
        </div>

        <div className="text-center">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-slate-400 hover:text-slate-600">
            Back to dashboard
          </button>
        </div>

      </div>
    </div>
  )
}

export default function FocusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    }>
      <FocusContent />
    </Suspense>
  )
}
