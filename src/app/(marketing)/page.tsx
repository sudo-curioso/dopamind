'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🧠', title: 'Brain dump', accent: '#16A34A', bg: '#F0FDF4',
    desc: 'Dump everything on your mind in one place. No organising required. Just get it out.',
  },
  {
    icon: '⏱️', title: 'Focus timer', accent: '#2563EB', bg: '#EFF6FF',
    desc: 'Per-task timers that keep running in the background while you navigate the app.',
  },
  {
    icon: '✦', title: 'AI task slicer', accent: '#7C3AED', bg: '#F5F3FF',
    desc: 'Break any overwhelming task into 3-5 small, specific, doable steps instantly.',
  },
  {
    icon: '🌳', title: 'Grow a forest', accent: '#16A34A', bg: '#F0FDF4',
    desc: 'Every completed focus session plants a tree. Watch your virtual forest grow session by session.',
  },
  {
    icon: '👥', title: 'Body doubling', accent: '#EA580C', bg: '#FFF7ED',
    desc: 'Focus rooms where you work alongside others — zero pressure, maximum accountability.',
  },
  {
    icon: '🔒', title: 'Private by design', accent: '#64748B', bg: '#F8FAFC',
    desc: 'GDPR compliant. Encrypted. EU data residency. We never sell your information.',
  },
]

const steps = [
  {
    n: '01', title: 'Dump your tasks', icon: '🧠',
    desc: 'Add everything that\'s on your mind — no sorting, no structure needed.',
  },
  {
    n: '02', title: 'Focus with a timer', icon: '⏱️',
    desc: 'Pick a task, set a timer, and watch a tree grow as you focus.',
  },
  {
    n: '03', title: 'Build your forest', icon: '🌳',
    desc: 'Completed sessions become trees. Your progress becomes a living forest.',
  },
]

const floatingTrees = [
  { emoji: '🌳', x: '8%',  y: '18%', size: 28, delay: 0   },
  { emoji: '🌲', x: '88%', y: '12%', size: 22, delay: 0.8 },
  { emoji: '🌿', x: '5%',  y: '62%', size: 18, delay: 1.6 },
  { emoji: '🌳', x: '92%', y: '58%', size: 24, delay: 0.4 },
  { emoji: '🌱', x: '82%', y: '80%', size: 16, delay: 1.2 },
  { emoji: '🌲', x: '14%', y: '84%', size: 20, delay: 2.0 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)' }}
          >
            C
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">Dopamind</span>
        </div>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150">Features</Link>
          <Link href="#how" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150">How it works</Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150">Pricing</Link>
          <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150">Blog</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity duration-150 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)', boxShadow: '0 4px 14px rgba(22,163,74,0.30)' }}
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden max-w-3xl mx-auto px-6 py-24 text-center">

        {/* Floating trees in background */}
        {floatingTrees.map((t, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{ left: t.x, top: t.y, fontSize: t.size, opacity: 0.18 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: t.delay }}
          >
            {t.emoji}
          </motion.div>
        ))}

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
          style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0' }}
        >
          <span>🌱</span>
          Built for ADHD brains
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6 tracking-tight"
        >
          Your next right action.
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg,#16A34A,#15803D)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Always clear.
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Dopamind helps adults with ADHD get things done without
          overwhelming systems, shame spirals, or complex setup.
          Simple. Calm. Effective.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-xl text-sm font-bold text-white transition-opacity duration-150 hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#16A34A,#15803D)',
              boxShadow: '0 4px 20px rgba(22,163,74,0.32), 0 1px 4px rgba(22,163,74,0.16)',
            }}
          >
            Start growing free 🌱
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-100"
            style={{ background: '#F1F5F9' }}
          >
            Sign in
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-xs text-slate-400 mt-4"
        >
          No credit card required · 14-day free trial · Cancel anytime
        </motion.p>
      </section>

      {/* ── Stats strip ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 mb-16"
      >
        <div
          className="flex items-center justify-center gap-8 flex-wrap py-5 px-6 rounded-2xl"
          style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}
        >
          {[
            { value: '2,400+', label: 'Trees planted' },
            { value: '840+',   label: 'Users focusing' },
            { value: '14 days', label: 'Free trial' },
            { value: '100%',   label: 'ADHD-focused' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-xl font-black" style={{ color: '#16A34A' }}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── How it works ── */}
      <section id="how" className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
            How it works
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Three steps to clarity</h2>
          <p className="text-slate-500 mt-3">No complicated setup. No learning curve. Just focus.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
 
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-6 text-center"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)', color: 'white' }}
              >
                {step.n}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              {i < 2 && (
                <div
                  className="hidden sm:block absolute top-1/2 -right-4 text-slate-300 text-lg z-10"
                  style={{ transform: 'translateY(-50%)' }}
                >
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
            Features
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Everything your ADHD brain needs
          </h2>
          <p className="text-slate-500 mt-3">Simple tools that work with your brain, not against it.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4, boxShadow: '0 8px 28px rgba(0,0,0,0.08)' }}
              className="rounded-2xl p-5 cursor-default"
              style={{
                background: '#FFFFFF',
                border: '1px solid #F1F5F9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'box-shadow 220ms ease, transform 220ms ease',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing teaser ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-6 my-8 rounded-3xl px-8 py-12 text-center overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#F0FDF4 0%,#DCFCE7 100%)', border: '1px solid #BBF7D0' }}
      >
        {/* decorative trees */}
        <div className="absolute left-6 bottom-4 text-4xl opacity-20 pointer-events-none">🌳</div>
        <div className="absolute right-10 bottom-2 text-5xl opacity-15 pointer-events-none">🌲</div>
        <div className="absolute right-32 top-4 text-2xl opacity-10 pointer-events-none">🌿</div>

        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#16A34A' }}>
          Pricing
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          Start free. Upgrade when you need more.
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          The free plan gives you everything to get started.
          Pro unlocks AI Daily Planner, Body Doubling rooms, and your virtual forest.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)', boxShadow: '0 4px 14px rgba(22,163,74,0.28)' }}
        >
          See pricing
        </Link>
      </motion.section>

      {/* ── Blog teaser ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#16A34A' }}>Blog</p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">ADHD insights and tips</h2>
          </div>
          <Link href="/blog" className="text-sm font-semibold hover:underline" style={{ color: '#16A34A' }}>
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { bg: '#F0FDF4', icon: '🧠', tag: 'Productivity', title: 'Why to-do lists fail ADHD brains (and what to do instead)', date: 'March 10, 2026' },
            { bg: '#EFF6FF', icon: '⏱️', tag: 'Focus',        title: 'What is body doubling and why it works for ADHD',          date: 'March 5, 2026'  },
            { bg: '#FFF7ED', icon: '💊', tag: 'Awareness',    title: 'ADHD medication: what the research actually says',           date: 'Feb 28, 2026'   },
          ].map(post => (
            <motion.div key={post.title} whileHover={{ y: -3 }} style={{ transition: 'transform 200ms ease' }}>
              <Link
                href="/blog"
                className="rounded-2xl overflow-hidden block"
                style={{ border: '1px solid #F1F5F9', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div className="h-24 flex items-center justify-center text-4xl" style={{ background: post.bg }}>
                  {post.icon}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#16A34A' }}>
                    {post.tag}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 leading-snug mb-2">{post.title}</p>
                  <p className="text-xs text-slate-400">{post.date}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto px-6 py-16 text-center"
      >
        <div className="text-5xl mb-6">🌳</div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Ready to grow your forest?
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Join hundreds of adults with ADHD who are finally getting things done,
          one focused session at a time.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-4 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg,#16A34A,#15803D)',
            boxShadow: '0 4px 20px rgba(22,163,74,0.32), 0 1px 4px rgba(22,163,74,0.16)',
          }}
        >
          Create free account 🌱
        </Link>
        <p className="text-xs text-slate-400 mt-4">No credit card required. Cancel anytime.</p>

        <div
          className="mt-10 p-4 rounded-2xl text-xs text-slate-400 leading-relaxed text-left"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          Dopamind is a productivity tool, not a medical service.
          It is not a substitute for professional diagnosis, treatment,
          or medical advice. Always consult a qualified healthcare provider
          for ADHD diagnosis and treatment.
        </div>
      </motion.section>

      {/* ── Footer ── */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg,#16A34A,#15803D)', fontSize: '10px', fontWeight: 700 }}
          >
            C
          </div>
          <p className="text-xs text-slate-400">© 2026 Dopamind. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Blog'].map(l => (
            <Link key={l} href="/" className="text-xs text-slate-400 hover:text-slate-600 transition-colors duration-150">
              {l}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
