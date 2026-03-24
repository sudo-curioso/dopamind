'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { TreeData } from '@/components/ui/pixi-forest'

const PixiForest = dynamic(() => import('@/components/ui/pixi-forest'), {
  ssr: false,
  loading: () => (
    <div style={{
      height:'380px',
      background:'linear-gradient(180deg,#44AAD8 0%,#7ACCE8 48%,#B4E8CC 100%)',
      borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <p style={{color:'rgba(255,255,255,0.8)', fontSize:'13px'}}>🌱 Growing your forest...</p>
    </div>
  )
})

// ── TYPES ──
interface StreakData {
  current_streak: number
  longest_streak: number
  total_trees_grown: number
  total_trees_lost: number
  forest_acres: number
}

interface LeaderboardEntry {
  user_id: string
  display_name: string
  current_streak: number
  forest_size: number
  total_trees: number
  rank: number
}

type Tab = 'forest' | 'stats' | 'leaderboard'
type StatsRange = 'daily' | 'weekly' | 'monthly'

// ── HELPERS ──
function maskName(name: string) {
  if (!name) return 'Anonymous'
  const p = name.trim().split(' ')
  return p.length === 1 ? p[0] : `${p[0]} ${p[p.length-1][0]}.`
}


// ── STAT CARD ──
function StatCard({ icon, label, value, color }: {
  icon: string, label: string, value: string|number, color: string
}) {
  // derive a soft tint from the accent color
  const bgMap: Record<string, string> = {
    '#16A34A': '#F0FDF4',
    '#EF4444': '#FEF2F2',
    '#F59E0B': '#FFFBEB',
    '#7C3AED': '#F5F3FF',
    '#2563EB': '#EFF6FF',
  }
  const bg = bgMap[color] ?? '#F8FAFC'
  const borderMap: Record<string, string> = {
    '#16A34A': '#BBF7D0',
    '#EF4444': '#FECACA',
    '#F59E0B': '#FDE68A',
    '#7C3AED': '#DDD6FE',
    '#2563EB': '#BFDBFE',
  }
  const border = borderMap[color] ?? '#F1F5F9'

  return (
    <motion.div
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}
      className="rounded-2xl p-4"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
      }}
    >
      <div className="text-xl mb-2">{icon}</div>
      <div className="text-2xl font-black mb-0.5" style={{ color }}>{value}</div>
      <div className="text-xs font-medium" style={{ color: '#64748B' }}>{label}</div>
    </motion.div>
  )
}

// ── BAR CHART ──
function BarChart({ trees, range }: { trees: TreeData[], range: StatsRange }) {
  const bars = useMemo(() => {
    const now = new Date()
    if (range === 'daily') {
      return Array.from({length:7},(_,i) => {
        const d = new Date(); d.setDate(now.getDate()-6+i)
        const label = d.toLocaleDateString('en',{weekday:'short'})
        const isToday = i === 6
        const alive = trees.filter(t => {
          if (!t.grown_at || t.status !== 'alive') return false
          const td = new Date(t.grown_at)
          return td.toDateString() === d.toDateString()
        }).length
        const dead = trees.filter(t => {
          if (!t.grown_at || t.status !== 'dead') return false
          const td = new Date(t.grown_at)
          return td.toDateString() === d.toDateString()
        }).length
        return { label, alive, dead, isToday }
      })
    }
    if (range === 'weekly') {
      return Array.from({length:7},(_,i) => {
        const wStart = new Date(); wStart.setDate(now.getDate()-6*7+i*7)
        const wEnd   = new Date(wStart); wEnd.setDate(wStart.getDate()+6)
        const label  = `W${i+1}`
        const isToday = i === 6
        const alive = trees.filter(t => {
          if (!t.grown_at || t.status !== 'alive') return false
          const td = new Date(t.grown_at)
          return td >= wStart && td <= wEnd
        }).length
        const dead = trees.filter(t => {
          if (!t.grown_at || t.status !== 'dead') return false
          const td = new Date(t.grown_at)
          return td >= wStart && td <= wEnd
        }).length
        return { label, alive, dead, isToday }
      })
    }
    // monthly
    return Array.from({length:6},(_,i) => {
      const m = new Date(); m.setMonth(now.getMonth()-5+i)
      const label = m.toLocaleDateString('en',{month:'short'})
      const isToday = i === 5
      const alive = trees.filter(t => {
        if (!t.grown_at || t.status !== 'alive') return false
        const td = new Date(t.grown_at)
        return td.getMonth()===m.getMonth() && td.getFullYear()===m.getFullYear()
      }).length
      const dead = trees.filter(t => {
        if (!t.grown_at || t.status !== 'dead') return false
        const td = new Date(t.grown_at)
        return td.getMonth()===m.getMonth() && td.getFullYear()===m.getFullYear()
      }).length
      return { label, alive, dead, isToday }
    })
  }, [trees, range])

  const maxVal = Math.max(...bars.map(b => b.alive + b.dead), 1)

  return (
    <div>
      <div className="flex items-end gap-2" style={{height:'88px'}}>
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full flex flex-col justify-end" style={{height:'72px',gap:'1px'}}>
              {bar.dead > 0 && (
                <motion.div
                  initial={{ height:0 }} animate={{ height:`${(bar.dead/maxVal)*68}px` }}
                  transition={{ delay: i*0.04, duration:0.5 }}
                  className="w-full rounded-t-sm"
                  style={{ background:'#FCA5A5', minHeight:bar.dead>0?'3px':0 }}
                />
              )}
              {bar.alive > 0 && (
                <motion.div
                  initial={{ height:0 }} animate={{ height:`${(bar.alive/maxVal)*68}px` }}
                  transition={{ delay: i*0.04+0.1, duration:0.5 }}
                  className="w-full rounded-t-md"
                  style={{
                    background: bar.isToday
                      ? 'linear-gradient(180deg,#16A34A,#15803D)'
                      : '#86EFAC',
                    minHeight: bar.alive>0?'4px':0,
                  }}
                />
              )}
            </div>
            <span style={{
              fontSize:'8px',
              color: bar.isToday ? '#16A34A' : '#94A3B8',
              fontWeight: bar.isToday ? 700 : 400
            }}>
              {bar.label}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm" style={{background:'#86EFAC'}}/>
          <span className="text-xs text-slate-400">Trees grown</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2.5 h-2.5 rounded-sm" style={{background:'#FCA5A5'}}/>
          <span className="text-xs text-slate-400">Trees lost</span>
        </div>
      </div>
    </div>
  )
}

// ── STREAK BADGE ──
function StreakBadge({ days }: { days: number }) {
  const tier = days >= 30 ? 'legendary' : days >= 14 ? 'epic' : days >= 7 ? 'rare' : 'common'
  const colors = {
    legendary: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    epic: 'linear-gradient(135deg,#8B5CF6,#EC4899)',
    rare: 'linear-gradient(135deg,#3B82F6,#06B6D4)',
    common: 'linear-gradient(135deg,#16A34A,#15803D)',
  }
  const icons = { legendary:'🏆', epic:'⚡', rare:'💫', common:'🌱' }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-bold"
      style={{ background: colors[tier] }}>
      {icons[tier]} {days}d
    </div>
  )
}

// ── MAIN PAGE ──
export default function MyWorldPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('forest')
  const [statsRange, setStatsRange] = useState<StatsRange>('daily')
  const [trees, setTrees] = useState<TreeData[]>([])
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const [isInTrial, setIsInTrial] = useState(false)
  const [trialDaysLeft, setTrialDaysLeft] = useState(0)
  const [checking, setChecking] = useState(true)

  useEffect(() => { checkAccess() }, [])

  async function checkAccess() {
    const sb = createClient()
    const { data: { user } } = await sb.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: ud } = await sb.from('users')
      .select('plan,trial_ends_at,created_at').eq('id',user.id).single()

    if (ud?.plan === 'pro') {
      setIsPro(true); setChecking(false); loadData(user.id); return
    }

    const trialEnd = ud?.trial_ends_at
      ? new Date(ud.trial_ends_at)
      : new Date(new Date(ud?.created_at||user.created_at).getTime()+14*864e5)
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime()-Date.now())/864e5))

    if (daysLeft > 0) {
      setIsInTrial(true); setTrialDaysLeft(daysLeft)
      setChecking(false); loadData(user.id); return
    }
    setChecking(false)
  }

  async function loadData(userId: string) {
    const sb = createClient()
    const [tRes, sRes, lRes] = await Promise.all([
      sb.from('forest_trees').select('*').eq('user_id',userId).order('grown_at',{ascending:true}),
      sb.from('user_streaks').select('*').eq('user_id',userId).single(),
      sb.from('leaderboard').select('*').order('total_trees',{ascending:false}).limit(25),
    ])
    setTrees(tRes.data || [])
    if (sRes.data) setStreak(sRes.data)
    if (lRes.data) {
      setLeaderboard(lRes.data.map((e,i) => ({
        ...e, rank: i+1, display_name: maskName(e.display_name)
      })))
    }
    setLoading(false)
  }

  const aliveTrees = trees.filter(t => t.status === 'alive')
  const deadTrees  = trees.filter(t => t.status === 'dead')

  if (checking) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-sm text-slate-400">Loading your world...</p>
    </div>
  )

  if (!isPro && !isInTrial) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center space-y-5">
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring'}}>
          <div className="text-5xl mb-2">🌳</div>
          <div className="inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{background:'linear-gradient(135deg,#7C3AED,#2563EB)'}}>PRO</div>
        </motion.div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900 mb-1">Your trial has ended</h1>
          <p className="text-sm text-slate-500">Upgrade to keep growing your virtual forest.</p>
        </div>
        <div className="space-y-2">
          <Link href="/pricing"
            className="w-full py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center"
            style={{background:'linear-gradient(135deg,#16A34A,#15803D)'}}>
            Upgrade to Pro - $8.99/mo 🌳
          </Link>
          <button onClick={() => router.push('/tasks')} className="w-full py-2 text-sm text-slate-400">
            Back to tasks
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My World</h1>
              <span className="text-white font-bold rounded-md px-2 py-0.5"
                style={{fontSize:'8px',background:'linear-gradient(135deg,#7C3AED,#2563EB)'}}>
                PRO
              </span>
            </div>
            <p className="text-sm text-slate-400">
              {aliveTrees.length} trees · {deadTrees.length} lost
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isInTrial && (
              <div className="text-xs font-semibold px-3 py-1.5 rounded-xl"
                style={{background:'#FFF7ED',color:'#EA580C',border:'1px solid #FED7AA'}}>
                🔥 {trialDaysLeft}d left
              </div>
            )}
            {streak && <StreakBadge days={streak.current_streak} />}
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{background:'#F1F5F9'}}>
          {(['forest','stats','leaderboard'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all capitalize"
              style={{
                background: tab===t?'#fff':'transparent',
                color: tab===t?'#16A34A':'#94A3B8',
                boxShadow: tab===t?'0 1px 3px rgba(0,0,0,0.08)':'none',
              }}>
              {t === 'forest' ? '🌳 Forest' : t === 'stats' ? '📊 Stats' : '🏆 Leaderboard'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ════════════════ FOREST TAB ════════════════ */}
          {tab === 'forest' && (
            <motion.div key="forest"
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              className="space-y-4">

              {/* Forest visual */}
              <div className="rounded-3xl overflow-hidden"
                style={{border:'1px solid #DCFCE7'}}>
                {loading ? (
                  <div style={{
                    height:'380px',
                    background:'linear-gradient(180deg,#44AAD8 0%,#7ACCE8 48%,#B4E8CC 100%)',
                    display:'flex',alignItems:'center',justifyContent:'center'
                  }}>
                    <p style={{color:'rgba(255,255,255,0.8)',fontSize:'13px'}}>🌱 Growing...</p>
                  </div>
                ) : (
                  <PixiForest trees={trees} width={480} height={380} />
                )}
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon="🌳" label="Trees alive" value={aliveTrees.length} color="#16A34A"/>
                <StatCard icon="🥀" label="Trees lost"  value={deadTrees.length}  color="#EF4444"/>
                <StatCard icon="🔥" label="Day streak"  value={`${streak?.current_streak||0}d`} color="#EA580C"/>
                <StatCard icon="🏆" label="Best streak" value={`${streak?.longest_streak||0}d`} color="#F59E0B"/>
              </div>

              {/* Tree collection */}
              {aliveTrees.length > 0 && (
                <div className="rounded-2xl p-4" style={{background:'#F8FAFC',border:'1px solid #F1F5F9'}}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Collection
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(
                      aliveTrees.reduce((acc,t) => {
                        acc[t.tree_type] = (acc[t.tree_type]||0)+1
                        return acc
                      }, {} as Record<string,number>)
                    ).map(([type,count]) => (
                      <div key={type}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                        style={{background:'#fff',border:'1px solid #E2E8F0'}}>
                        <span>{
                          {sprout:'🌱',baby:'🌿',half:'🌳',flowering:'🌸',large:'🌲',full:'🌴',dead:'💀'}[type]||'🌱'
                        }</span>
                        <span className="text-slate-600 capitalize">{type}</span>
                        <span className="font-bold px-1.5 py-0.5 rounded-lg text-white text-xs"
                          style={{background:'#16A34A'}}>{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Best streak banner */}
              {streak && streak.longest_streak > 0 && (
                <div className="rounded-2xl p-4 flex items-center gap-4"
                  style={{background:'linear-gradient(135deg,#FFF7ED,#FFFBEB)',border:'1px solid #FED7AA'}}>
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Best streak: {streak.longest_streak} days
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Keep going. Every task grows your world.
                    </p>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {aliveTrees.length === 0 && !loading && (
                <div className="rounded-2xl p-6 text-center"
                  style={{background:'#F8FAFC',border:'1px solid #F1F5F9'}}>
                  <p className="text-2xl mb-2">🌱</p>
                  <p className="text-sm text-slate-500 mb-3">
                    Your forest is empty. Complete tasks to grow your first trees.
                  </p>
                  <button onClick={() => router.push('/tasks')}
                    className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
                    style={{background:'linear-gradient(135deg,#16A34A,#15803D)'}}>
                    Plant your first tree 🌱
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ════════════════ STATS TAB ════════════════ */}
          {tab === 'stats' && (
            <motion.div key="stats"
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              className="space-y-4">

              {/* Range selector */}
              <div className="flex gap-1 p-1 rounded-2xl" style={{background:'#F1F5F9'}}>
                {(['daily','weekly','monthly'] as StatsRange[]).map(r => (
                  <button key={r} onClick={() => setStatsRange(r)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                    style={{
                      background: statsRange===r?'#fff':'transparent',
                      color: statsRange===r?'#16A34A':'#94A3B8',
                      boxShadow: statsRange===r?'0 1px 3px rgba(0,0,0,0.08)':'none',
                    }}>
                    {r}
                  </button>
                ))}
              </div>

              {/* Bar chart */}
              <div className="rounded-2xl p-4" style={{background:'#F8FAFC',border:'1px solid #F1F5F9'}}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                  Trees grown vs lost — {statsRange}
                </p>
                <BarChart trees={trees} range={statsRange} />
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard icon="🌳" label="Total grown" value={streak?.total_trees_grown||aliveTrees.length} color="#16A34A"/>
                <StatCard icon="💀" label="Total lost"  value={streak?.total_trees_lost||deadTrees.length}  color="#EF4444"/>
                <StatCard icon="🌍" label="Forest acres" value={`${(streak?.forest_acres||0).toFixed(2)}`} color="#2563EB"/>
                <StatCard icon="🔥" label="Current streak" value={`${streak?.current_streak||0}d`} color="#EA580C"/>
              </div>

              {/* Streak breakdown */}
              <div className="rounded-2xl p-4" style={{background:'#F8FAFC',border:'1px solid #F1F5F9'}}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Streak history
                </p>
                <div className="space-y-3">
                  {[
                    {label:'Current streak', value:`${streak?.current_streak||0} days`, icon:'🔥', color:'#EA580C'},
                    {label:'Longest streak', value:`${streak?.longest_streak||0} days`, icon:'🏆', color:'#F59E0B'},
                    {label:'Forest health', value:`${aliveTrees.length>0?Math.round((aliveTrees.length/(aliveTrees.length+deadTrees.length))*100):0}%`, icon:'💚', color:'#16A34A'},
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span className="text-sm text-slate-600">{item.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{color:item.color}}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════ LEADERBOARD TAB ════════════════ */}
          {tab === 'leaderboard' && (
            <motion.div key="leaderboard"
              initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              className="space-y-3">

              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Top 25 globally
                </p>
                <p className="text-xs text-slate-400">Updated daily</p>
              </div>

              {/* Streak type selector */}
              <div className="flex gap-1 p-1 rounded-2xl" style={{background:'#F1F5F9'}}>
                {(['daily','weekly','monthly'] as StatsRange[]).map(r => (
                  <button key={r} onClick={() => setStatsRange(r)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all"
                    style={{
                      background: statsRange===r?'#fff':'transparent',
                      color: statsRange===r?'#7C3AED':'#94A3B8',
                      boxShadow: statsRange===r?'0 1px 3px rgba(0,0,0,0.08)':'none',
                    }}>
                    {r} streaks
                  </button>
                ))}
              </div>

              {loading ? (
                <p className="text-sm text-slate-400 text-center py-8">Loading...</p>
              ) : leaderboard.length === 0 ? (
                <div className="rounded-2xl p-8 text-center"
                  style={{background:'#F8FAFC',border:'1px solid #F1F5F9'}}>
                  <p className="text-2xl mb-2">🏆</p>
                  <p className="text-sm text-slate-400">No one here yet. Be the first!</p>
                </div>
              ) : (
                leaderboard.map((entry, i) => {
                  const medals = ['🥇','🥈','🥉']
                  const isTop3 = i < 3
                  return (
                    <motion.div key={entry.user_id}
                      initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                      transition={{delay:i*0.03}}
                      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                      style={{
                        background: isTop3?'linear-gradient(135deg,#FFFBEB,#FEF9C3)':'#F8FAFC',
                        border: isTop3?'1px solid #FDE68A':'1px solid #F1F5F9',
                      }}>
                      {/* rank */}
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{background:isTop3?'#FBBF24':'#E2E8F0',color:isTop3?'#fff':'#94A3B8'}}>
                        {medals[i] || entry.rank}
                      </div>
                      {/* avatar */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{background:'linear-gradient(135deg,#16A34A,#15803D)'}}>
                        {entry.display_name[0].toUpperCase()}
                      </div>
                      {/* name + stats */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {entry.display_name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StreakBadge days={entry.current_streak} />
                          <span className="text-xs text-slate-400">
                            🌳 {entry.total_trees}
                          </span>
                        </div>
                      </div>
                      {/* score */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold" style={{color:'#16A34A'}}>
                          {(entry.forest_size||0).toFixed(1)}
                        </p>
                        <p className="text-xs text-slate-400">acres</p>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}