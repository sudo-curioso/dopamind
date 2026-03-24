export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CompleteTaskButton from './complete-button'
import SliceButton from './slice-button'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('bucket', 'today')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const todayTasks = tasks || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Today
              </h1>
              <p className="text-slate-500 mt-1">
                {todayTasks.length === 0
                  ? 'All done. Great work today.'
                  : `${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'} to do`}
              </p>
            </div>
            <Link
              href="/tasks"
              className="text-sm font-semibold"
              style={{ color: '#16A34A' }}
            >
              + Add tasks
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <>
              <style>{`
                @keyframes glowPulse {
                  0%,100% { box-shadow: 0 0 24px rgba(74,222,128,0.15), 0 8px 32px rgba(0,0,0,0.4); }
                  50%     { box-shadow: 0 0 40px rgba(74,222,128,0.28), 0 8px 32px rgba(0,0,0,0.4); }
                }
                @keyframes slideUp {
                  from { opacity:0; transform:translateY(16px); }
                  to   { opacity:1; transform:translateY(0); }
                }
                @keyframes badgePop {
                  from { opacity:0; transform:scale(0.8); }
                  to   { opacity:1; transform:scale(1); }
                }
                .glow-card { animation: glowPulse 3s ease-in-out infinite; }
                .slide-1 { animation: slideUp 0.4s ease both 0.05s; }
                .slide-2 { animation: slideUp 0.4s ease both 0.15s; }
                .slide-3 { animation: slideUp 0.4s ease both 0.25s; }
                .slide-4 { animation: slideUp 0.4s ease both 0.35s; }
                .badge-pop { animation: badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
                .cta-btn:hover { opacity: 0.88; transform: scale(1.03); }
                .cta-btn { transition: opacity 180ms ease, transform 180ms ease; }
              `}</style>

              <div
                className="glow-card rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg,#0F172A 0%,#0D1F12 100%)',
                  border: '1px solid rgba(74,222,128,0.18)',
                }}
              >
                {/* Neon glow orb top-right */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(22,163,74,0.22) 0%,transparent 70%)' }} />
                {/* Neon glow orb bottom-left */}
                <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle,rgba(74,222,128,0.12) 0%,transparent 70%)' }} />

                {/* Top tag row */}
                <div className="slide-1 flex items-center gap-2 mb-6 flex-wrap">
                  {['#ADHD', '#brainrot', '#executive dysfunction', '#we got this'].map((tag, i) => (
                    <span
                      key={tag}
                      className="badge-pop text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        animationDelay: `${0.1 + i * 0.07}s`,
                        background: i === 0 ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
                        color: i === 0 ? '#4ADE80' : 'rgba(255,255,255,0.45)',
                        border: i === 0 ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Headline */}
                <div className="slide-2 mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4ADE80' }}>
                    real talk
                  </p>
                  <h2 className="text-3xl font-black leading-tight tracking-tight text-white">
                    Still thinking about
                    <br />
                    that thing from{' '}
                    <span style={{
                      background: 'linear-gradient(135deg,#4ADE80,#16A34A)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      3 weeks ago?
                    </span>
                  </h2>
                </div>

                {/* Relatable checklist */}
                <div className="slide-3 space-y-2.5 mb-7">
                  {[
                    { icon: '💀', text: 'tasks living in your head rent-free' },
                    { icon: '😮‍💨', text: 'overwhelmed before you even start' },
                    { icon: '🔁', text: '"i\'ll do it tomorrow" — day 14' },
                  ].map(item => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)' }}
                      >
                        <span style={{ fontSize: '10px' }}>✓</span>
                      </div>
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {item.text} <span style={{ fontSize: '14px' }}>{item.icon}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="slide-4">
                  <Link
                    href="/tasks"
                    className="cta-btn inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-black text-white"
                    style={{
                      background: 'linear-gradient(135deg,#16A34A,#15803D)',
                      boxShadow: '0 4px 20px rgba(22,163,74,0.40)',
                    }}
                  >
                    OK let&apos;s get it out 🧠
                    <span style={{ fontSize: '16px' }}>→</span>
                  </Link>
                  <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    no judgment. no sorting. just go.
                  </p>
                </div>
              </div>
            </>

          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col p-4 rounded-xl border transition-colors"
                  style={{ background: '#FAFAFA', borderColor: '#F1F5F9' }}
                >
                  <div className="flex items-center gap-3">
                    <CompleteTaskButton taskId={task.id} />
                    <span className="text-slate-900 text-sm flex-1">
                      {task.title}
                    </span>
                    <SliceButton taskId={task.id} taskTitle={task.title} />
                    <Link
                      href={`/focus?task=${task.id}`}
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: '#16A34A' }}
                    >
                      Focus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="text-center">
              <p className="text-xs text-slate-400">
                Pick one task and focus on it. You do not need to do everything today.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}