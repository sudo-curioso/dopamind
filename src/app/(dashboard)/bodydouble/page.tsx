'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RoomUser {
  id: string
  name: string
  task: string
  joined_at: string
}

export default function BodyDoublePage() {
  const router = useRouter()
  const [isPro, setIsPro] = useState(false)
  const [checkingPlan, setCheckingPlan] = useState(true)
  const [inRoom, setInRoom] = useState(false)
  const [myTask, setMyTask] = useState('')
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([])
  const [myName, setMyName] = useState('')
  const [myId, setMyId] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (inRoom) {
      interval = setInterval(() => {
        setElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [inRoom])

  useEffect(() => {
    if (!inRoom || !myId) return
    const supabase = createClient()

    const channel = supabase
      .channel('body_doubling_room')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const users: RoomUser[] = []
        Object.values(state).forEach((presences: any) => {
          presences.forEach((p: any) => {
            users.push({
              id: p.user_id,
              name: p.name,
              task: p.task,
              joined_at: p.joined_at,
            })
          })
        })
        setRoomUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: myId,
            name: myName,
            task: myTask,
            joined_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [inRoom, myId])

  async function checkUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    setIsPro(userData?.plan === 'pro')
    setMyId(user.id)
    setMyName(user.user_metadata?.display_name || user.email?.split('@')[0] || 'Anonymous')
    setCheckingPlan(false)
  }

  async function handleJoin() {
    if (!myTask.trim()) return
    setJoining(true)
    await new Promise(r => setTimeout(r, 800))
    setInRoom(true)
    setJoining(false)
  }

  async function handleLeave() {
    const supabase = createClient()
    const channels = supabase.getChannels()
    for (const channel of channels) {
      await supabase.removeChannel(channel)
    }
    setInRoom(false)
    setElapsed(0)
    setMyTask('')
    setRoomUsers([])
  }

  function formatElapsed(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  function timeInRoom(joinedAt: string) {
    const diff = Math.floor((Date.now() - new Date(joinedAt).getTime()) / 1000)
    const m = Math.floor(diff / 60)
    if (m < 1) return 'just joined'
    return `${m}m in room`
  }

  if (checkingPlan) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    )
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-2xl mx-auto"
            style={{ background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)' }}
          >
            ✦
          </div>
          <div>
            <div
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
              style={{ background: '#F5F3FF', color: '#7C3AED' }}
            >
              Pro Feature
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
              Body Doubling Rooms
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Join a silent focus room with other ClarifyMind users.
              Work alongside others without distraction.
              Proven to help ADHD brains focus.
            </p>
          </div>
          <div
            className="rounded-2xl p-4 text-left space-y-2"
            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
          >
            {[
              'Join silent focus rooms with other users',
              'See who is working alongside you',
              'Set your intention before joining',
              'No video. No pressure. Just presence.',
              'Proven to boost ADHD focus significantly',
            ].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
                <span style={{ color: '#7C3AED' }}>✦</span> {f}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/pricing')}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-2.5 text-sm text-slate-400"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!inRoom) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-4 py-10">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Body Doubling
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Work silently alongside others. No video. No pressure.
            </p>
          </div>

          {/* How it works */}
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              How it works
            </p>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Type what you are working on today' },
                { step: '2', text: 'Join the shared focus room' },
                { step: '3', text: 'See others working silently alongside you' },
                { step: '4', text: 'Leave whenever you are done' },
              ].map(s => (
                <div key={s.step} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                  >
                    {s.step}
                  </div>
                  <p className="text-sm text-slate-600">{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Task input */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-slate-900">
              What are you working on today?
            </p>
            <textarea
              value={myTask}
              onChange={e => setMyTask(e.target.value)}
              placeholder="e.g. Writing my project report, Studying for exam..."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all"
              style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                fontFamily: 'inherit',
                color: '#374151',
              }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <button
            onClick={handleJoin}
            disabled={!myTask.trim() || joining}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: myTask.trim()
                ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                : '#E2E8F0',
              color: myTask.trim() ? '#fff' : '#94A3B8',
            }}
          >
            {joining ? 'Joining room...' : 'Join focus room →'}
          </button>

        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Room header */}
        <div
          className="rounded-2xl p-5 mb-6 text-center"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
            border: '1px solid #DDD6FE'
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#16A34A', animation: 'pulse 2s infinite' }}
            />
            <span className="text-xs font-semibold text-slate-600">Live Focus Room</span>
          </div>
          <p className="text-3xl font-semibold text-slate-900 tabular-nums mb-1">
            {formatElapsed(elapsed)}
          </p>
          <p className="text-xs text-slate-500">
            {roomUsers.length} {roomUsers.length === 1 ? 'person' : 'people'} working right now
          </p>
        </div>

        {/* My task */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}
        >
          <p className="text-xs font-semibold text-green-600 mb-1">Your intention</p>
          <p className="text-sm text-slate-700">{myTask}</p>
        </div>

        {/* Room users */}
        <div className="space-y-2 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Working alongside you
          </p>
          {roomUsers.length <= 1 ? (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <p className="text-sm text-slate-400 mb-1">
                You are the first one here.
              </p>
              <p className="text-xs text-slate-400">
                Others will join soon. Start working.
              </p>
            </div>
          ) : (
            roomUsers
              .filter(u => u.id !== myId)
              .map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{user.task}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">
                    {timeInRoom(user.joined_at)}
                  </span>
                </div>
              ))
          )}
        </div>

        {/* Leave button */}
        <button
          onClick={handleLeave}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#EF4444',
          }}
        >
          Leave room
        </button>

        <p className="text-xs text-slate-300 text-center mt-4">
          Silent presence only. No chat. No video. Just focus.
        </p>

      </div>
    </div>
  )
}