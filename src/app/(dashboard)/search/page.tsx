'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  status: string
  priority: number
  bucket: string
  created_at: string
}

const PRIORITY_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'High', color: '#EF4444' },
  2: { label: 'Medium', color: '#F59E0B' },
  3: { label: 'Low', color: '#6B7280' },
}

const BUCKET_LABEL: Record<string, string> = {
  today: 'Today',
  week: 'This Week',
  later: 'Later',
  trash: 'Trash',
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [filtered, setFiltered] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([])
      return
    }
    const q = query.toLowerCase()
    setFiltered(
      tasks.filter(t => t.title.toLowerCase().includes(q))
    )
  }, [query, tasks])

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
      .neq('bucket', 'trash')
      .order('created_at', { ascending: false })

    setTasks(data || [])
    setLoading(false)
  }

  function highlight(text: string, q: string) {
    if (!q.trim()) return text
    const parts = text.split(new RegExp(`(${q})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? `<mark style="background:#EFF6FF;color:#2563EB;border-radius:3px;padding:0 2px">${part}</mark>`
        : part
    ).join('')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Search
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Find any task instantly.
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            style={{ fontSize: '16px' }}
          >
            ⌕
          </div>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search your tasks..."
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm text-slate-900 outline-none transition-all"
            style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 text-lg"
            >
              ×
            </button>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-sm text-slate-400 text-center py-8">Loading...</p>
        ) : query.trim() === '' ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-3xl">⌕</div>
            <p className="text-sm text-slate-400">
              Start typing to search {tasks.length} tasks
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 space-y-2">
            <div className="text-3xl">◌</div>
            <p className="text-sm text-slate-400">
              No tasks found for "{query}"
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-slate-400 mb-4">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.map(task => {
              const priority = PRIORITY_LABEL[task.priority]
              const isDone = task.status === 'done'
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all"
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #F1F5F9',
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: priority?.color || '#CBD5E1' }}
                  />
                  <span
                    className="flex-1 text-sm"
                    style={{
                      color: isDone ? '#94A3B8' : '#1E293B',
                      textDecoration: isDone ? 'line-through' : 'none',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlight(task.title, query)
                    }}
                  />
                  <span
                    className="text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
                    style={{
                      background: '#F1F5F9',
                      color: '#94A3B8'
                    }}
                  >
                    {BUCKET_LABEL[task.bucket] || task.bucket}
                  </span>
                  {!isDone && (
                    <Link
                      href={`/focus?task=${task.id}`}
                      className="text-xs flex-shrink-0 font-medium"
                      style={{ color: '#2563EB' }}
                    >
                      Focus
                    </Link>
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