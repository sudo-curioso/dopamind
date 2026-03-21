import Link from 'next/link'

const POSTS = [
  {
    id: 1,
    tag: 'Productivity',
    title: 'Why to-do lists fail ADHD brains (and what to do instead)',
    excerpt: 'Traditional productivity systems are built for neurotypical brains. Here is why they consistently fail people with ADHD and what actually works.',
    date: 'March 10, 2026',
    readTime: '5 min read',
    color: '#EFF6FF',
    accent: '#2563EB',
    emoji: '🧠',
    featured: true,
  },
  {
    id: 2,
    tag: 'Focus',
    title: 'What is body doubling and why it works for ADHD',
    excerpt: 'Working silently alongside another person is one of the most effective ADHD productivity strategies. Here is the science behind it.',
    date: 'March 5, 2026',
    readTime: '4 min read',
    color: '#F0FDF4',
    accent: '#16A34A',
    emoji: '⏱️',
    featured: false,
  },
  {
    id: 3,
    tag: 'Awareness',
    title: 'ADHD medication: what the research actually says',
    excerpt: 'Cutting through the noise on ADHD medication. What clinical research shows, what it does not show, and how to have a productive conversation with your doctor.',
    date: 'Feb 28, 2026',
    readTime: '7 min read',
    color: '#FFF7ED',
    accent: '#EA580C',
    emoji: '💊',
    featured: false,
  },
  {
    id: 4,
    tag: 'Productivity',
    title: 'Time blindness: the ADHD symptom nobody talks about',
    excerpt: 'Time blindness is not laziness. It is a neurological difference in how ADHD brains perceive time. Here is how to work with it.',
    date: 'Feb 20, 2026',
    readTime: '6 min read',
    color: '#FDF4FF',
    accent: '#9333EA',
    emoji: '⏰',
    featured: false,
  },
  {
    id: 5,
    tag: 'Wellbeing',
    title: 'ADHD and rejection sensitive dysphoria explained',
    excerpt: 'RSD is one of the most painful and least understood aspects of ADHD. Understanding it is the first step to managing it.',
    date: 'Feb 14, 2026',
    readTime: '8 min read',
    color: '#FFF1F2',
    accent: '#E11D48',
    emoji: '❤️',
    featured: false,
  },
  {
    id: 6,
    tag: 'Focus',
    title: 'The Pomodoro technique for ADHD: does it actually work?',
    excerpt: 'The Pomodoro technique is everywhere. But does it work for ADHD brains specifically? We looked at the evidence and talked to real users.',
    date: 'Feb 8, 2026',
    readTime: '5 min read',
    color: '#ECFDF5',
    accent: '#059669',
    emoji: '🍅',
    featured: false,
  },
]

const TAGS = ['All', 'Productivity', 'Focus', 'Awareness', 'Wellbeing']

export default function BlogPage() {
  const featured = POSTS.find(p => p.featured)
  const rest = POSTS.filter(p => !p.featured)

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
            ClarifyMind
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-medium" style={{ color: '#2563EB' }}>
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
      <section
        className="px-6 py-16 text-center"
        style={{
          background: 'linear-gradient(180deg, #F8FAFF 0%, #ffffff 100%)',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#2563EB' }}
          >
            The ClarifyMind Blog
          </p>
          <h1
            className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            ADHD insights
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              without the fluff.
            </span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-lg mx-auto">
            Evidence-based articles, real stories, and practical strategies
            for adults navigating ADHD every day.
          </p>
        </div>
      </section>

      {/* Tag filter - static for now */}
      <section className="max-w-5xl mx-auto px-6 py-6">
        <div className="flex items-center gap-2 flex-wrap">
          {TAGS.map((tag, i) => (
            <div
              key={tag}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all"
              style={{
                background: i === 0 ? '#1E293B' : '#F8FAFC',
                color: i === 0 ? '#fff' : '#64748B',
                border: i === 0 ? 'none' : '1px solid #F1F5F9',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.id}`} className="block mb-8">
            <div
              className="rounded-3xl overflow-hidden transition-all hover:scale-[1.01] duration-200"
              style={{ border: '1px solid #F1F5F9' }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* Left - visual */}
                <div
                  className="flex items-center justify-center py-16 px-8"
                  style={{ background: featured.color }}
                >
                  <div className="text-center">
                    <div style={{ fontSize: '80px', lineHeight: 1 }}>{featured.emoji}</div>
                    <div
                      className="mt-4 inline-block text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: featured.accent, color: '#fff' }}
                    >
                      Featured
                    </div>
                  </div>
                </div>

                {/* Right - content */}
                <div className="p-8 flex flex-col justify-center">
                  <div
                    className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit"
                    style={{ background: featured.color, color: featured.accent }}
                  >
                    {featured.tag}
                  </div>
                  <h2
                    className="text-2xl font-black text-slate-900 leading-snug mb-3"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{featured.date}</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-xs text-slate-400">{featured.readTime}</span>
                  </div>
                </div>

              </div>
            </div>
          </Link>
        )}

        {/* Post grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map(post => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block rounded-2xl overflow-hidden transition-all hover:scale-[1.02] duration-200"
              style={{ border: '1px solid #F1F5F9' }}
            >
              {/* Card top */}
              <div
                className="flex items-center justify-center py-10"
                style={{ background: post.color }}
              >
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{post.emoji}</span>
              </div>

              {/* Card body */}
              <div className="p-5">
                <div
                  className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
                  style={{ background: post.color, color: post.accent }}
                >
                  {post.tag}
                </div>
                <h3
                  className="text-base font-bold text-slate-900 leading-snug mb-2"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{post.date}</span>
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: post.accent }}
                  >
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div
          className="mt-12 rounded-3xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF, #F5F3FF)',
            border: '1px solid #DDD6FE',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📬</div>
          <h2
            className="text-2xl font-black text-slate-900 mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Get ADHD insights in your inbox
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            New articles every week. No spam. Unsubscribe anytime.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: '#fff',
                border: '1.5px solid #DDD6FE',
                fontFamily: 'inherit',
                color: '#374151',
              }}
            />
            <button
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            No spam. No noise. Just clarity.
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 ClarifyMind. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Pricing'].map(l => (
            <Link key={l} href="/" className="text-xs text-slate-400 hover:text-slate-600">
              {l}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}