import Link from 'next/link'

const POSTS = [
  {
    id: 1,
    tag: 'Productivity',
    title: 'Why to-do lists fail ADHD brains (and what to do instead)',
    excerpt: 'Traditional productivity systems are built for neurotypical brains. Here is the neuroscience behind why they consistently fail people with ADHD, and what actually works.',
    date: 'March 10, 2026',
    readTime: '6 min read',
    color: '#F0FDF4',
    accent: '#16A34A',
    emoji: '🧠',
    featured: true,
  },
  {
    id: 2,
    tag: 'Focus',
    title: 'What is body doubling and why it works for ADHD',
    excerpt: 'Working silently alongside another person is one of the most effective ADHD productivity strategies ever discovered. Here is the neuroscience behind it.',
    date: 'March 5, 2026',
    readTime: '5 min read',
    color: '#EFF6FF',
    accent: '#2563EB',
    emoji: '🤝',
    featured: false,
  },
  {
    id: 3,
    tag: 'Treatment',
    title: 'ADHD medication: what the research actually says',
    excerpt: 'Cutting through the noise on ADHD medication. What Lancet-published meta-analyses show, what they do not show, and how to talk to your doctor.',
    date: 'Feb 28, 2026',
    readTime: '7 min read',
    color: '#FFF7ED',
    accent: '#EA580C',
    emoji: '💊',
    featured: false,
  },
  {
    id: 4,
    tag: 'Awareness',
    title: 'Time blindness: the ADHD symptom nobody talks about',
    excerpt: 'Time blindness is not carelessness. It is a neurological difference in how ADHD brains perceive time. Dr. Russell Barkley calls it central to the entire disorder.',
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
    excerpt: 'RSD is one of the most painful and least understood aspects of ADHD. Understanding the neurobiology is the first step to managing it without shame.',
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
    excerpt: 'The Pomodoro technique is everywhere. But the 25-minute standard interval was designed for neurotypical brains. Here is what actually works for ADHD.',
    date: 'Feb 8, 2026',
    readTime: '5 min read',
    color: '#ECFDF5',
    accent: '#059669',
    emoji: '🍅',
    featured: false,
  },
  {
    id: 7,
    tag: 'Awareness',
    title: "Executive dysfunction: why you can't just 'try harder'",
    excerpt: "You have been sitting at your desk for three hours. The email is three sentences. You know what to say. You cannot type it. This is not laziness.",
    date: 'Feb 2, 2026',
    readTime: '6 min read',
    color: '#F0FDF4',
    accent: '#16A34A',
    emoji: '⚡',
    featured: false,
  },
  {
    id: 8,
    tag: 'Neuroscience',
    title: 'Dopamine and ADHD: the real neuroscience explained',
    excerpt: 'ADHD is not a dopamine deficiency. It is dopamine dysregulation. Understanding the difference changes everything about how you approach motivation.',
    date: 'Jan 27, 2026',
    readTime: '7 min read',
    color: '#FFF7ED',
    accent: '#D97706',
    emoji: '🔬',
    featured: false,
  },
  {
    id: 9,
    tag: 'Stories',
    title: 'ADHD diagnosed in adulthood: what late diagnosis feels like',
    excerpt: "You are 34, or 42, or 51. You just got diagnosed with ADHD. And your first emotion isn't relief. It's grief. And that is completely valid.",
    date: 'Jan 20, 2026',
    readTime: '8 min read',
    color: '#F5F3FF',
    accent: '#7C3AED',
    emoji: '🌱',
    featured: false,
  },
  {
    id: 10,
    tag: 'Wellbeing',
    title: 'How sleep affects ADHD symptoms (and what to do about it)',
    excerpt: 'Up to 80% of adults with ADHD have sleep disturbances. New research shows the relationship is neurobiological, not just behavioral. Here is what helps.',
    date: 'Jan 14, 2026',
    readTime: '7 min read',
    color: '#EFF6FF',
    accent: '#3B82F6',
    emoji: '🌙',
    featured: false,
  },
  {
    id: 11,
    tag: 'Focus',
    title: 'ADHD hyperfocus: the superpower with a serious catch',
    excerpt: 'You sat down to quickly check something at 9pm. You looked up and it was 4am. Hyperfocus is real, validated by research, and more complex than it looks.',
    date: 'Jan 7, 2026',
    readTime: '6 min read',
    color: '#ECFDF5',
    accent: '#059669',
    emoji: '🔥',
    featured: false,
  },
  {
    id: 12,
    tag: 'Productivity',
    title: 'Building an ADHD-friendly morning routine that actually works',
    excerpt: 'Every morning routine article sounds the same. None of them account for ADHD neurology. Here is what evidence-based research says actually works.',
    date: 'Jan 1, 2026',
    readTime: '6 min read',
    color: '#FFFBEB',
    accent: '#F59E0B',
    emoji: '☀️',
    featured: false,
  },
]

const TAGS = ['All', 'Productivity', 'Focus', 'Awareness', 'Wellbeing', 'Neuroscience', 'Treatment', 'Stories']

export default function BlogPage() {
  const featured = POSTS.find(p => p.featured)
  const rest = POSTS.filter(p => !p.featured)

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header
        className="sticky top-0 z-50 px-6 h-14 flex items-center justify-between"
        style={{
          background: 'rgba(255,255,255,0.90)',
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
            C
          </div>
          <span className="text-sm font-semibold text-slate-900 tracking-tight">Dopamind</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900" style={{ transition: 'color 150ms' }}>Features</Link>
          <Link href="/pricing" className="text-sm text-slate-500 hover:text-slate-900" style={{ transition: 'color 150ms' }}>Pricing</Link>
          <Link href="/blog" className="text-sm font-medium" style={{ color: '#16A34A' }}>Blog</Link>
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
        className="px-6 py-16 text-center"
        style={{
          background: 'linear-gradient(180deg, #F0FDF4 0%, #ffffff 100%)',
          borderBottom: '1px solid #DCFCE7',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#16A34A' }}>
            The Dopamind Blog
          </p>
          <h1
            className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"
            style={{ letterSpacing: '-0.03em' }}
          >
            ADHD insights{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              without the fluff.
            </span>
          </h1>
          <p className="text-base text-slate-500 leading-relaxed max-w-lg mx-auto">
            Evidence-based articles, real stories, and practical strategies for adults navigating ADHD every day.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
            <span>📚 {POSTS.length} articles</span>
            <span>·</span>
            <span>🔬 Research-backed</span>
            <span>·</span>
            <span>💚 Written for ADHD brains</span>
          </div>
        </div>
      </section>

      {/* Tag filter */}
      <section className="max-w-5xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2 flex-wrap">
          {TAGS.map((tag, i) => (
            <div
              key={tag}
              className="px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer"
              style={{
                background: i === 0 ? '#15803D' : '#F8FAFC',
                color: i === 0 ? '#fff' : '#64748B',
                border: i === 0 ? 'none' : '1px solid #E2E8F0',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24">

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.id}`} className="block mb-8 group">
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                border: '1px solid #DCFCE7',
                boxShadow: '0 4px 24px rgba(22,163,74,0.08)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2">

                <div
                  className="flex items-center justify-center py-16 px-8"
                  style={{ background: featured.color }}
                >
                  <div className="text-center">
                    <div style={{ fontSize: '80px', lineHeight: 1 }}>{featured.emoji}</div>
                    <div
                      className="mt-4 inline-block text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ background: featured.accent }}
                    >
                      Featured
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-center bg-white">
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
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{featured.date}</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-xs text-slate-400">{featured.readTime}</span>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                      style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
                    >
                      Read article →
                    </span>
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
              className="block rounded-2xl overflow-hidden bg-white group"
              style={{
                border: '1px solid #F1F5F9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
              }}
            >
              <div
                className="flex items-center justify-center py-10 relative"
                style={{ background: post.color }}
              >
                <span style={{ fontSize: '48px', lineHeight: 1 }}>{post.emoji}</span>
                <div
                  className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-md text-white"
                  style={{ background: post.accent, fontSize: '9px' }}
                >
                  {post.tag}
                </div>
              </div>

              <div className="p-5">
                <h3
                  className="text-base font-bold text-slate-900 leading-snug mb-2"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {post.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{post.date}</span>
                  <span className="text-xs font-semibold" style={{ color: post.accent }}>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div
          className="mt-14 rounded-3xl p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '1px solid #BBF7D0',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '14px' }}>📬</div>
          <h2
            className="text-2xl font-black text-slate-900 mb-2"
            style={{ letterSpacing: '-0.02em' }}
          >
            Get ADHD insights in your inbox
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
            New evidence-based articles every week. No spam. Written for ADHD brains.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: '#fff',
                border: '1.5px solid #BBF7D0',
                fontFamily: 'inherit',
                color: '#374151',
              }}
            />
            <button
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}
            >
              Subscribe
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-3">No spam. No noise. Just clarity.</p>
        </div>

      </section>

      {/* Footer */}
      <footer
        className="px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid #F1F5F9' }}
      >
        <p className="text-xs text-slate-400">© 2026 Dopamind. All rights reserved.</p>
        <div className="flex gap-6">
          {['Privacy Policy', 'Terms of Service', 'Pricing'].map(l => (
            <Link key={l} href="/" className="text-xs text-slate-400 hover:text-slate-600" style={{ transition: 'color 150ms' }}>
              {l}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
