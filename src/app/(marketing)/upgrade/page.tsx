import Link from 'next/link'

export default function UpgradePage() {
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
            Coming Soon
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
            Pro payments launching soon
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            We are setting up secure payments. Pro will be available
            at $8.99/month very soon. We will notify you when it launches.
          </p>
        </div>

        <div
          className="rounded-2xl p-4 text-left space-y-2"
          style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}
        >
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pro includes
          </p>
          {[
            'AI Daily Planner every morning',
            'Body Doubling Rooms',
            'Priority support',
            'Early access to new features',
          ].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-slate-600">
              <span style={{ color: '#7C3AED' }}>✦</span> {f}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
          >
            Continue with free plan
          </Link>
          <Link
            href="/pricing"
            className="w-full py-2.5 text-sm text-slate-400 flex items-center justify-center hover:text-slate-600"
          >
            Back to pricing
          </Link>
        </div>

      </div>
    </div>
  )
}