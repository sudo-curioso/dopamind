'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError('Incorrect email or password. Try again.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
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
            Welcome back
          </h1>
          <p className="text-sm text-slate-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm mb-5" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: '#16A34A' }}>
                Forgot password?
              </Link>
            </div>
            <input
              type="password" required autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
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
            {loading ? '⏳ Signing in...' : 'Sign in →'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          No account?{' '}
          <Link href="/signup" className="font-bold hover:underline" style={{ color: '#16A34A' }}>Create one free</Link>
        </p>

      </div>
    </div>
  )
}
