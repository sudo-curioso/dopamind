import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            C
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">
            ClarifyMind
          </span>
        </div>

        <nav className="flex items-center gap-6">
          <Link href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div
          className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
          style={{ background: '#EFF6FF', color: '#185FA5' }}
        >
          Built for ADHD brains
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6 tracking-tight">
          Your next right action.
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Always clear.
          </span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
          ClarifyMind helps adults with ADHD get things done without
          overwhelming systems, shame spirals, or complex setup.
          Simple. Calm. Effective.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl text-sm font-semibold text-slate-600"
            style={{ background: '#F1F5F9' }}
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          No credit card required. Free forever plan available.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>
            Features
          </p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Everything your ADHD brain needs
          </h2>
          <p className="text-slate-500 mt-3 text-base">
            Simple tools that work with your brain, not against it.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '🧠', title: 'Brain dump', desc: 'Dump everything on your mind in one place. No organising required. Just get it out.' },
            { icon: '⏱️', title: 'Focus timer', desc: 'Per-task timers that keep running in the background while you navigate the app.' },
            { icon: '✨', title: 'AI task slicer', desc: 'Break any overwhelming task into 3-5 small, specific, doable steps instantly.' },
            { icon: '📊', title: 'Progress view', desc: 'Daily, weekly, monthly momentum score. No streaks. No shame. Just forward.' },
            { icon: '💊', title: 'Medication reminders', desc: 'Simple daily reminders. We store time only, never medication names or dosages.' },
            { icon: '🔒', title: 'Private by design', desc: 'GDPR compliant. Encrypted. EU data residency. We never sell your information.' },
          ].map(f => (
            <div
              key={f.title}
              className="rounded-2xl p-5"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section
        className="mx-6 my-8 rounded-3xl px-8 py-12 text-center"
        style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#2563EB' }}>
          Pricing
        </p>
        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          Start free. Upgrade when you need more.
        </h2>
        <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
          The free plan gives you everything to get started.
          Pro unlocks AI Daily Planner and Focus Rooms.
        </p>
        <Link
          href="/pricing"
          className="inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
        >
          See pricing
        </Link>
      </section>

      {/* Blog teaser */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#2563EB' }}>
              Blog
            </p>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              ADHD insights and tips
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-medium" style={{ color: '#2563EB' }}>
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { bg: '#EFF6FF', icon: '🧠', tag: 'Productivity', title: 'Why to-do lists fail ADHD brains (and what to do instead)', date: 'March 10, 2026' },
            { bg: '#F0FDF4', icon: '⏱️', tag: 'Focus', title: 'What is body doubling and why it works for ADHD', date: 'March 5, 2026' },
            { bg: '#FFF7ED', icon: '💊', tag: 'Awareness', title: 'ADHD medication: what the research actually says', date: 'Feb 28, 2026' },
          ].map(post => (
            <Link
              key={post.title}
              href="/blog"
              className="rounded-2xl overflow-hidden block"
              style={{ border: '1px solid #F1F5F9' }}
            >
              <div className="h-20 flex items-center justify-center text-3xl" style={{ background: post.bg }}>
                {post.icon}
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#2563EB' }}>
                  {post.tag}
                </p>
                <p className="text-sm font-semibold text-slate-900 leading-snug mb-2">{post.title}</p>
                <p className="text-xs text-slate-400">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-slate-500 mb-8">
          Join thousands of adults managing ADHD with ClarifyMind.
        </p>
        <Link
          href="/signup"
          className="inline-block px-8 py-3.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
        >
          Create free account
        </Link>
        <div
          className="mt-8 p-4 rounded-2xl text-xs text-slate-400 leading-relaxed"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          ClarifyMind is a productivity tool, not a medical service.
          It is not a substitute for professional diagnosis, treatment,
          or medical advice. Always consult a qualified healthcare provider
          for ADHD diagnosis and treatment.
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 ClarifyMind. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Blog'].map(l => (
            <Link key={l} href="/" className="text-xs text-slate-400 hover:text-slate-600">
              {l}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}