'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (resetError) {
      setError('Could not send reset email. Check your email address.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F0FDF4' }}>
        <div className="max-w-md w-full text-center space-y-5 bg-white rounded-3xl p-10 shadow-sm" style={{ border: '1px solid #DCFCE7' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto" style={{ background: '#F0FDF4' }}>✉️</div>
          <h1 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Check your inbox</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            We sent a reset link to <strong className="text-slate-800">{email}</strong>.<br />
            Click it to set a new password.
          </p>
          <p className="text-xs text-slate-400">Link expires in 1 hour. Check your spam folder.</p>
          <Link href="/login" className="inline-block text-sm font-bold hover:underline" style={{ color: '#16A34A' }}>
            Back to sign in
          </Link>
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
            Forgot password?
          </h1>
          <p className="text-sm text-slate-400">Enter your email and we will send a reset link.</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm mb-5" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Email</label>
            <input
              type="email" required autoFocus autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl text-sm font-black text-white mt-2"
            style={{
              background: loading ? '#E2E8F0' : 'linear-gradient(135deg, #16A34A, #15803D)',
              color: loading ? '#94A3B8' : '#fff',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(22,163,74,0.25)',
              transition: 'all 200ms',
            }}
          >
            {loading ? '⏳ Sending...' : 'Send reset link →'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember it?{' '}
          <Link href="/login" className="font-bold hover:underline" style={{ color: '#16A34A' }}>Sign in</Link>
        </p>

      </div>
    </div>
  )
}
