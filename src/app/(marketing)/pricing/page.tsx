import Link from 'next/link'

export default function PricingPage() {
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
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            C
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">
            Dopamind
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm font-medium" style={{ color: '#2563EB' }}>
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
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Get started free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: '#2563EB' }}
        >
          Pricing
        </p>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Simple, honest pricing
        </h1>
        <p className="text-slate-500 text-base max-w-md mx-auto">
          Start free forever. Upgrade when you are ready for more.
          No hidden fees. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Free Plan */}
          <div
            className="rounded-3xl p-7 space-y-6"
            style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
          >
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400 text-sm mb-1">/ forever</span>
              </div>
              <p className="text-xs text-slate-400">
                Everything you need to get started.
              </p>
            </div>

            <Link
              href="/signup"
              className="w-full py-3 rounded-2xl text-sm font-semibold text-slate-700 flex items-center justify-center"
              style={{ background: '#fff', border: '1.5px solid #E2E8F0' }}
            >
              Get started free
            </Link>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                What is included
              </p>
              {[
                'Brain dump and task management',
                'Quick add task with priority labels',
                'Focus timer per task',
                'AI task slicer (break down tasks)',
                'Daily, weekly, monthly progress',
                'Search tasks',
                'Daily reflection',
                'Medication reminders',
                'GDPR compliant and encrypted',
              ].map(f => (
                <div key={f} className="flex items-start gap-2.5">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
              <div className="flex items-start gap-2.5 opacity-40">
                <span className="mt-0.5 flex-shrink-0">🔒</span>
                <span className="text-sm text-slate-400">AI Daily Planner</span>
              </div>
              <div className="flex items-start gap-2.5 opacity-40">
                <span className="mt-0.5 flex-shrink-0">🔒</span>
                <span className="text-sm text-slate-400">Body Doubling Rooms</span>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div
            className="rounded-3xl p-7 space-y-6 relative"
            style={{
              background: '#fff',
              border: '2px solid #2563EB',
            }}
          >
            {/* Most popular badge */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Most popular
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-500 mb-2">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">$8.99</span>
                <span className="text-slate-400 text-sm mb-1">/ month</span>
              </div>
              <p className="text-xs text-slate-400">
                Unlock everything. Built for serious focus.
              </p>
            </div>

            <Link
              href="/upgrade"
              className="w-full py-3 rounded-2xl text-sm font-semibold text-white flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Get started with Pro
            </Link>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Everything in Free, plus
              </p>
              {[
                'Everything in Free plan',
                'AI Daily Planner (top 3 tasks every morning)',
                'Body Doubling Rooms (silent coworking)',
                'Priority support',
                'Early access to new features',
              ].map(f => (
                <div key={f} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex-shrink-0 font-bold"
                    style={{ color: '#7C3AED' }}
                  >
                    ✦
                  </span>
                  <span className="text-sm text-slate-600">{f}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Annual note */}
        <div
          className="mt-5 rounded-2xl p-4 text-center"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          <p className="text-sm text-slate-500">
            Annual plan coming soon at <strong>$74.99/year</strong> — save 30% compared to monthly.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            Frequently asked questions
          </h2>
          {[
            {
              q: 'Can I use Dopamind for free forever?',
              a: 'Yes. The free plan has no time limit. You get all core features including brain dump, focus timer, AI task slicer, progress tracking, and more.'
            },
            {
              q: 'What is Body Doubling?',
              a: 'Body doubling is working silently alongside another person. It is one of the most effective ADHD productivity strategies. Our rooms let you do this virtually with other Dopamind users.'
            },
            {
              q: 'Is my data private?',
              a: 'Yes. Dopamind is GDPR compliant. Your data is encrypted and stored in EU servers. We never sell your data. Medication reminders store time only, never medication names.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes. No contracts, no lock-in. Cancel anytime from your account settings and you will not be charged again.'
            },
          ].map(item => (
            <div
              key={item.q}
              className="rounded-2xl p-5"
              style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
            >
              <p className="text-sm font-semibold text-slate-900 mb-2">{item.q}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 Dopamind. All rights reserved.</p>
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