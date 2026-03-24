'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

const FREE_FEATURES = [
  { icon: '🧠', text: 'Brain dump and task management' },
  { icon: '⏱️', text: 'Focus timer with 5 presets' },
  { icon: '✦', text: 'AI task breakdown (unlimited)' },
  { icon: '📊', text: 'Weekly progress charts' },
  { icon: '🔍', text: 'Search across all tasks' },
  { icon: '🌙', text: 'Daily reflection journal' },
  { icon: '🌳', text: 'Virtual forest (basic)' },
  { icon: '🔒', text: 'GDPR compliant, EU servers' },
]

const PRO_FEATURES = [
  { icon: '✦', text: 'Everything in Free' },
  { icon: '🤖', text: 'AI Daily Planner — personalized schedule every morning' },
  { icon: '👥', text: 'Body Doubling rooms — silent co-working with others' },
  { icon: '🌲', text: 'Full virtual forest with rare tree types' },
  { icon: '🏆', text: 'Global leaderboard and streak badges' },
  { icon: '⚡', text: 'Early access to every new feature' },
  { icon: '💬', text: 'Priority support — real humans, fast' },
]

const FAQS = [
  {
    q: 'Can I use Dopamind free forever?',
    a: 'Yes. The Free plan has no time limit. Brain dump, focus timer, AI task breakdown, progress charts and more — no credit card required, ever.',
  },
  {
    q: 'What happens after my 14-day Pro trial?',
    a: 'After 14 days you stay on Free automatically. No charge, no surprises. You can upgrade to Pro anytime from your account settings.',
  },
  {
    q: 'What is body doubling?',
    a: "Working silently alongside another person is one of the most effective ADHD strategies known. Dopamind's rooms let you do this virtually with other users — no talking required.",
  },
  {
    q: 'Is my data private and secure?',
    a: 'Yes. Dopamind is GDPR compliant. All data is encrypted and stored on EU servers (Frankfurt). We never sell your data.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no lock-in. Cancel from your account settings and you will never be charged again. Your data stays accessible on the Free plan.',
  },
]

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const monthlyPrice = 8.99
  const annualMonthly = (74.99 / 12).toFixed(2)

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
          >
            D
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">Dopamind</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900" style={{ transition: 'color 150ms' }}>Features</Link>
          <Link href="/pricing" className="text-sm font-semibold" style={{ color: '#16A34A' }}>Pricing</Link>
          <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900" style={{ transition: 'color 150ms' }}>Blog</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900" style={{ transition: 'color 150ms' }}>Log in</Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
            style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        className="px-6 pt-16 pb-10 text-center"
        style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #ffffff 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
            Pricing
          </p>
          <h1
            className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            Simple, honest pricing.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              No traps.
            </span>
          </h1>
          <p className="text-base text-slate-500 max-w-md mx-auto leading-relaxed mb-8">
            Start free forever. Every new account gets a 14-day Pro trial automatically. No credit card needed.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center flex-wrap gap-4 mb-8">
            {[
              { icon: '🎁', text: '14-day Pro trial free' },
              { icon: '🔓', text: 'No credit card required' },
              { icon: '↩️', text: 'Cancel anytime' },
              { icon: '🇪🇺', text: 'GDPR compliant' },
            ].map(b => (
              <div
                key={b.text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-600"
                style={{ background: '#F0FDF4', border: '1px solid #DCFCE7' }}
              >
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm font-medium" style={{ color: !annual ? '#16A34A' : '#94A3B8' }}>Monthly</span>
            <button
              onClick={() => setAnnual(v => !v)}
              className="relative w-12 h-6 rounded-full transition-colors duration-200"
              style={{ background: annual ? '#16A34A' : '#E2E8F0' }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: annual ? 'translateX(26px)' : 'translateX(4px)' }}
              />
            </button>
            <span className="text-sm font-medium flex items-center gap-1.5" style={{ color: annual ? '#16A34A' : '#94A3B8' }}>
              Annual
              <span
                className="text-white text-xs font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: '#16A34A', fontSize: '9px' }}
              >
                SAVE 30%
              </span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="max-w-4xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">

          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-3xl p-8"
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌱</span>
                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Free</span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span
                  className="text-5xl font-black text-slate-900"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  $0
                </span>
                <span className="text-slate-400 text-sm mb-2">/ forever</span>
              </div>
              <p className="text-sm text-slate-400">All the core tools, free forever.</p>
            </div>

            <Link
              href="/signup"
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-slate-700 flex items-center justify-center mb-7"
              style={{
                background: '#fff',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'box-shadow 150ms',
              }}
            >
              Get started free — no card needed
            </Link>

            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                What is included
              </p>
              {FREE_FEATURES.map(f => (
                <div key={f.text} className="flex items-center gap-3 py-1.5">
                  <span className="text-base w-5 flex-shrink-0">{f.icon}</span>
                  <span className="text-sm text-slate-600">{f.text}</span>
                </div>
              ))}
              <div className="pt-2 space-y-1.5">
                {['AI Daily Planner', 'Body Doubling Rooms', 'Global Leaderboard'].map(f => (
                  <div key={f} className="flex items-center gap-3 py-1 opacity-35">
                    <span className="text-base w-5 flex-shrink-0">🔒</span>
                    <span className="text-sm text-slate-400 line-through">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #052e16 0%, #14532d 60%, #166534 100%)',
              boxShadow: '0 8px 40px rgba(22,101,52,0.35), 0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            {/* Glow blobs */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(134,239,172,0.15) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(74,222,128,0.10) 0%, transparent 70%)',
                transform: 'translate(-20%, 20%)',
              }}
            />

            {/* Badge */}
            <div
              className="absolute top-5 right-5 text-xs font-black px-3 py-1 rounded-full"
              style={{
                background: 'rgba(134,239,172,0.2)',
                color: '#86EFAC',
                border: '1px solid rgba(134,239,172,0.3)',
                fontSize: '9px',
                letterSpacing: '0.08em',
              }}
            >
              MOST POPULAR
            </div>

            <div className="mb-6 relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌲</span>
                <span className="text-sm font-black uppercase tracking-widest" style={{ color: '#86EFAC' }}>Pro</span>
              </div>

              <motion.div
                key={String(annual)}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-end gap-1 mb-1">
                  <span
                    className="text-5xl font-black text-white"
                    style={{ letterSpacing: '-0.04em' }}
                  >
                    ${annual ? annualMonthly : monthlyPrice}
                  </span>
                  <span className="text-green-300 text-sm mb-2">/ month</span>
                </div>
                {annual && (
                  <p className="text-xs font-semibold" style={{ color: '#86EFAC' }}>
                    Billed $74.99/year — you save $32.89
                  </p>
                )}
                {!annual && (
                  <p className="text-xs text-green-400">Billed monthly. Switch to annual to save 30%.</p>
                )}
              </motion.div>
            </div>

            <Link
              href="/upgrade"
              className="w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 flex items-center justify-center mb-7 relative"
              style={{
                background: 'linear-gradient(135deg, #86EFAC, #4ADE80)',
                boxShadow: '0 4px 20px rgba(74,222,128,0.35)',
                transition: 'transform 150ms, box-shadow 150ms',
              }}
            >
              Start 14-day free trial
            </Link>

            <div className="space-y-1 relative">
              <p
                className="text-xs font-black uppercase tracking-widest mb-3"
                style={{ color: 'rgba(134,239,172,0.7)' }}
              >
                Everything in Free, plus
              </p>
              {PRO_FEATURES.map(f => (
                <div key={f.text} className="flex items-start gap-3 py-1.5">
                  <span className="text-base w-5 flex-shrink-0 mt-0.5">{f.icon}</span>
                  <span className="text-sm text-green-100 leading-snug">{f.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Annual banner */}
        {!annual && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{ background: '#F0FDF4', border: '1px solid #DCFCE7' }}
          >
            <div className="flex items-center gap-2">
              <span>💡</span>
              <p className="text-sm text-slate-600">
                Switch to annual and save <strong className="text-slate-900">$32.89/year</strong> — that is 3 months free.
              </p>
            </div>
            <button
              onClick={() => setAnnual(true)}
              className="text-xs font-bold px-3 py-1.5 rounded-lg text-white flex-shrink-0"
              style={{ background: '#16A34A' }}
            >
              Switch
            </button>
          </motion.div>
        )}
      </section>

      {/* Social proof */}
      <section className="max-w-4xl mx-auto px-6 py-10">
        <div
          className="rounded-3xl p-8"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center mb-6">
            Trusted by ADHD adults who finally found what works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                quote: "I've tried every app. Dopamind is the first one that actually works with my brain instead of against it.",
                name: "Priya R.",
                role: "Late-diagnosed ADHD, 31",
                emoji: "🌿",
              },
              {
                quote: "The focus timer + growing a tree is such a small thing but it genuinely changed how I approach work.",
                name: "Marcus T.",
                role: "Freelancer with ADHD, 26",
                emoji: "🌳",
              },
              {
                quote: "Body doubling rooms are incredible. I finished my tax filing in one session after avoiding it for 3 months.",
                name: "Sara K.",
                role: "Designer, ADHD + anxiety, 34",
                emoji: "🌸",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl p-5 bg-white"
                style={{ border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <p className="text-2xl mb-3">{t.emoji}</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3 italic">"{t.quote}"</p>
                <p className="text-xs font-bold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-6 pb-20">
        <h2
          className="text-2xl font-black text-slate-900 text-center mb-8"
          style={{ letterSpacing: '-0.02em' }}
        >
          Questions answered
        </h2>
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <p className="text-sm font-bold text-slate-900 mb-1.5">{item.q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-3xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, #052e16, #14532d)',
            boxShadow: '0 8px 40px rgba(22,101,52,0.3)',
          }}
        >
          <div className="text-4xl mb-4">🌳</div>
          <h3
            className="text-2xl font-black text-white mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Start growing your forest today
          </h3>
          <p className="text-green-300 text-sm mb-6">
            Free forever. 14-day Pro trial included. No credit card needed.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-2xl text-sm font-black text-slate-900"
            style={{
              background: 'linear-gradient(135deg, #86EFAC, #4ADE80)',
              boxShadow: '0 4px 20px rgba(74,222,128,0.35)',
            }}
          >
            Get started free →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 Dopamind. All rights reserved.</p>
        <div className="flex gap-6">
          {[['Privacy Policy', '/'], ['Terms of Service', '/'], ['Blog', '/blog']].map(([l, href]) => (
            <Link key={l} href={href} className="text-xs text-slate-400 hover:text-slate-600" style={{ transition: 'color 150ms' }}>
              {l}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
