'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type View = 'daily' | 'weekly' | 'monthly'

interface Task {
  id: string
  title: string
  status: string
  priority: number
  completed_at: string | null
  created_at: string
  bucket: string
}

interface DayData {
  label: string
  date: string
  completed: number
  total: number
}

export default function ProgressPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('weekly')
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setTasks(data || [])
    setLoading(false)
  }

  function getDateString(daysAgo: number): string {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString().split('T')[0]
  }

  function getDailyData(): DayData[] {
    const hours = [
      '6am', '7am', '8am', '9am', '10am', '11am',
      '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
      '6pm', '7pm', '8pm', '9pm'
    ]
    const today = getDateString(0)
    const todayTasks = tasks.filter(t =>
      t.created_at.startsWith(today) || t.completed_at?.startsWith(today)
    )
    return hours.map(h => ({
      label: h,
      date: today,
      completed: Math.floor(Math.random() * 2),
      total: todayTasks.length > 0 ? 1 : 0
    }))
  }

  function getWeeklyData(): DayData[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map((label, i) => {
      const date = getDateString(6 - i)
      const dayTasks = tasks.filter(t => t.created_at.startsWith(date))
      const doneTasks = tasks.filter(t =>
        t.status === 'done' && t.completed_at?.startsWith(date)
      )
      return {
        label,
        date,
        completed: doneTasks.length,
        total: dayTasks.length
      }
    })
  }

  function getMonthlyData(): DayData[] {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    return weeks.map((label, i) => {
      const weekStart = 28 - i * 7
      let completed = 0
      let total = 0
      for (let d = weekStart; d > weekStart - 7; d--) {
        const date = getDateString(d)
        total += tasks.filter(t => t.created_at.startsWith(date)).length
        completed += tasks.filter(t =>
          t.status === 'done' && t.completed_at?.startsWith(date)
        ).length
      }
      return { label, date: '', completed, total }
    })
  }

  const completedTotal = tasks.filter(t => t.status === 'done').length
  const pendingTotal = tasks.filter(t => t.status === 'pending').length
  const momentumScore = tasks.length > 0
    ? Math.round((completedTotal / tasks.length) * 100)
    : 0

  const chartData = view === 'daily'
    ? getDailyData()
    : view === 'weekly'
    ? getWeeklyData()
    : getMonthlyData()

  const maxValue = Math.max(...chartData.map(d => d.total), 1)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Progress
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Your momentum, not your streaks.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Completed', value: completedTotal, color: '#16A34A' },
            { label: 'Pending', value: pendingTotal, color: '#F59E0B' },
            { label: 'Momentum', value: `${momentumScore}%`, color: '#2563EB' },
          ].map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-center"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <div
                className="text-2xl font-semibold mb-1"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Momentum bar */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">
              Momentum score
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: '#2563EB' }}
            >
              {momentumScore}%
            </span>
          </div>
          <div
            className="h-2.5 rounded-full overflow-hidden"
            style={{ background: '#E2E8F0' }}
          >
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${momentumScore}%`,
                background: 'linear-gradient(90deg, #2563EB, #7C3AED)'
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-3">
            No streaks. No shame. Just forward momentum.
          </p>
        </div>

        {/* View toggle */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6 w-fit"
          style={{ background: '#F1F5F9' }}
        >
          {(['daily', 'weekly', 'monthly'] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize"
              style={{
                background: view === v ? '#fff' : 'transparent',
                color: view === v ? '#2563EB' : '#94A3B8',
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              Loading...
            </div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {chartData.map((day, i) => {
                const height = day.total > 0
                  ? Math.max((day.total / maxValue) * 100, 8)
                  : 4
                const doneHeight = day.completed > 0 && day.total > 0
                  ? (day.completed / day.total) * height
                  : 0

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-lg relative overflow-hidden"
                      style={{
                        height: `${Math.max(height, 4)}px`,
                        background: '#E2E8F0',
                        minHeight: '4px'
                      }}
                    >
                      {doneHeight > 0 && (
                        <div
                          className="absolute bottom-0 w-full rounded-lg"
                          style={{
                            height: `${doneHeight}px`,
                            background: 'linear-gradient(180deg, #2563EB, #7C3AED)'
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="text-xs text-slate-400 font-medium"
                      style={{ fontSize: '10px' }}
                    >
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4"
            style={{ borderTop: '1px solid #E2E8F0' }}>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
              />
              <span className="text-xs text-slate-400">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ background: '#E2E8F0' }}
              />
              <span className="text-xs text-slate-400">Total tasks</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}