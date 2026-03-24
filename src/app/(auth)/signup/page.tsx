'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [name, setName]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [consent, setConsent]   = useState(false)
  const [success, setSuccess]   = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setError('Please accept the Privacy Policy to continue.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true); setError('')

    try {
      const supabase = createClient()
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, display_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Email confirmation disabled → session returned immediately
      if (data.session) {
        router.push('/survey/1')
        router.refresh()
        return
      }

      // Email confirmation enabled → show check inbox screen
      setSuccess(true)
      setLoading(false)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F0FDF4' }}>
        <div className="max-w-md w-full text-center space-y-5 bg-white rounded-3xl p-10 shadow-sm" style={{ border: '1px solid #DCFCE7' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto" style={{ background: '#F0FDF4' }}>✉️</div>
          <h1 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Check your inbox</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We sent a confirmation link to <strong className="text-slate-800">{email}</strong>.<br />
            Click it to activate your Dopamind account.
          </p>
          <p className="text-xs text-slate-400">Link expires in 24 hours. Check your spam folder.</p>
          <button onClick={() => setSuccess(false)} className="text-sm font-medium" style={{ color: '#16A34A' }}>
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F0FDF4' }}>
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm" style={{ border: '1px solid #DCFCE7' }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #16A34A, #15803D)' }}>
              D
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tight">Dopamind</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ letterSpacing: '-0.02em' }}>
            Create your free account
          </h1>
          <p className="text-sm text-slate-400">Built for ADHD brains. Simple. Focused. Effective.</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm mb-5" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Your name</label>
            <input
              type="text" autoFocus required
              value={name} onChange={e => setName(e.target.value)}
              placeholder="First name"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Password</label>
            <input
              type="password" required autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-200"
                  style={{ background: password.length >= i * 3 ? (password.length >= 10 ? '#16A34A' : '#F59E0B') : '#E2E8F0' }} />
              ))}
              <span className="text-xs text-slate-400 ml-1">
                {password.length < 8 ? 'Too short' : password.length < 10 ? 'OK' : 'Strong'}
              </span>
            </div>
          )}

          <div className="flex items-start gap-3 pt-1">
            <input
              id="consent" type="checkbox"
              checked={consent} onChange={e => setConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-green-600"
            />
            <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
              I agree to the{' '}
              <Link href="/privacy" className="font-medium hover:underline" style={{ color: '#16A34A' }}>Privacy Policy</Link>
              {' '}and{' '}
              <Link href="/terms" className="font-medium hover:underline" style={{ color: '#16A34A' }}>Terms of Service</Link>.
              {' '}Dopamind is a productivity tool, not a medical service.
            </label>
          </div>

          <button
            type="submit" disabled={loading || !consent}
            className="w-full py-3.5 rounded-2xl text-sm font-black text-white mt-2"
            style={{
              background: consent && !loading ? 'linear-gradient(135deg, #16A34A, #15803D)' : '#E2E8F0',
              color: consent && !loading ? '#fff' : '#94A3B8',
              boxShadow: consent ? '0 4px 16px rgba(22,163,74,0.25)' : 'none',
              transition: 'all 200ms',
            }}
          >
            {loading ? '⏳ Creating account...' : 'Create free account →'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="font-bold hover:underline" style={{ color: '#16A34A' }}>Sign in</Link>
        </p>

      </div>
    </div>
  )
}
