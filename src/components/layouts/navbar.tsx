'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTimer } from '@/context/timer-context'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { activeTimers, flyingTrees, globalStreak, setGlobalStreak } = useTimer()
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null)
  const [isPro, setIsPro] = useState(false)
  const streakRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadUserData() }, [])

  async function loadUserData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('users')
      .select('plan, trial_ends_at, created_at')
      .eq('id', user.id)
      .single()

    if (data?.plan === 'pro') { setIsPro(true); return }

    const trialEnd = data?.trial_ends_at
      ? new Date(data.trial_ends_at)
      : new Date(new Date(data?.created_at || user.created_at).getTime() + 14 * 864e5)
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 864e5))
    setTrialDaysLeft(daysLeft)

    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .single()
    if (streakData) setGlobalStreak(streakData.current_streak)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const runningTimers = Object.values(activeTimers).filter(t => t.running)
  const completedTimers = Object.values(activeTimers).filter(t => t.completed)

  function formatTime(s: number) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
  }

  const navLinks = [
    { href: '/tasks',      label: 'Tasks',       icon: '◈',  isPremium: false },
    { href: '/planner',    label: 'AI Planner',  icon: '✦',  isPremium: true  },
    { href: '/bodydouble', label: 'Body Double', icon: '◉',  isPremium: true  },
    { href: '/myworld',    label: 'My World',    icon: '🌳', isPremium: true  },
  ]

  const isTrialActive  = trialDaysLeft !== null && trialDaysLeft > 0
  const isTrialExpired = trialDaysLeft !== null && trialDaysLeft === 0 && !isPro

  return (
    <>
      {/* Flying tree animations - fly from task card to streak icon */}
      <AnimatePresence>
        {flyingTrees.map(ft => (
          <motion.div
            key={ft.id}
            className="fixed z-[999] pointer-events-none text-xl"
            initial={{ x: ft.startX, y: ft.startY, scale: 1, opacity: 1 }}
            animate={{
              x: (streakRef.current?.getBoundingClientRect().x || window.innerWidth * 0.7),
              y: streakRef.current?.getBoundingClientRect().y || 8,
              scale: 0.3,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            🌳
          </motion.div>
        ))}
      </AnimatePresence>

      <nav
        className="fixed top-0 left-0 right-0 z-50 px-4 h-14"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-4xl mx-auto h-full flex items-center justify-between gap-2">

          {/* Logo */}
          <Link href="/tasks" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
              C
            </div>
            <span className="text-sm font-semibold text-slate-900 tracking-tight">ClarifyMind</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-0.5">
            {navLinks.map(link => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    color: isActive ? '#7C3AED' : '#64748B',
                    background: isActive ? '#F5F3FF' : 'transparent',
                  }}
                >
                  <span style={{ fontSize: '11px' }}>{link.icon}</span>
                  {link.label}
                  {link.isPremium && (
                    <span className="text-white font-bold rounded-md px-1 py-0.5"
                      style={{ fontSize:'7px', background:'linear-gradient(135deg,#7C3AED,#2563EB)', lineHeight:1.4 }}>
                      PRO
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 w-4 h-0.5 rounded-full"
                      style={{ background:'#7C3AED', transform:'translateX(-50%)' }}/>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* Trial badge */}
            {isTrialActive && !isPro && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold"
                style={{ background:'#FFF7ED', color:'#EA580C', border:'1px solid #FED7AA' }}>
                🔥 {trialDaysLeft}d free
              </div>
            )}

            {/* Upgrade button */}
            {isTrialExpired && (
              <Link href="/pricing"
                className="hidden sm:flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ background:'linear-gradient(135deg,#7C3AED,#2563EB)' }}>
                Upgrade
              </Link>
            )}

            {/* Running timer pill */}
            {runningTimers.length > 0 && (
              <Link href="/tasks"
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white"
                style={{ background:'linear-gradient(135deg,#16A34A,#15803D)' }}>
                <span>▶</span>
                <span>{formatTime(runningTimers[0].timeLeft)}</span>
              </Link>
            )}

            {/* Completed pill */}
            {completedTimers.length > 0 && runningTimers.length === 0 && (
              <Link href="/tasks"
                className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
                style={{ background:'#F0FDF4', color:'#16A34A', border:'1px solid #86EFAC' }}>
                🌱 Done!
              </Link>
            )}

            {/* STREAK COUNTER - flying tree destination */}
            <div
              ref={streakRef}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
              style={{ background:'#FFF7ED', color:'#EA580C', border:'1px solid #FED7AA' }}
              onClick={() => router.push('/myworld')}
            >
              <motion.span
                animate={globalStreak > 0 ? { scale:[1,1.3,1] } : {}}
                transition={{ duration:0.4 }}
              >
                🌳
              </motion.span>
              <span>{globalStreak}</span>
              {globalStreak > 0 && (
                <span className="text-xs" style={{ color:'#EA580C' }}>
                  🔥
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
              style={{ background:'linear-gradient(135deg,#2563EB,#7C3AED)' }}>
              S
            </div>

            <button onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-red-400 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <style jsx global>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.8} }
      `}</style>
    </>
  )
}