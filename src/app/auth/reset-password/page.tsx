'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Could not update password. The link may have expired.')
      setLoading(false)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#F0FDF4' }}>
        <div className="max-w-md w-full text-center space-y-5 bg-white rounded-3xl p-10 shadow-sm" style={{ border: '1px solid #DCFCE7' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto" style={{ background: '#F0FDF4' }}>✅</div>
          <h1 className="text-2xl font-black text-slate-900" style={{ letterSpacing: '-0.02em' }}>Password updated!</h1>
          <p className="text-slate-500 text-sm">Taking you to your dashboard...</p>
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
            Set new password
          </h1>
          <p className="text-sm text-slate-400">Choose a strong password for your account.</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm mb-5" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">New password</label>
            <input
              type="password" required autoFocus autoComplete="new-password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', fontFamily: 'inherit', color: '#1E293B',
                transition: 'border-color 150ms' }}
              onFocus={e => e.target.style.borderColor = '#16A34A'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            />
          </div>

          {/* Password strength */}
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

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1.5">Confirm password</label>
            <input
              type="password" required autoComplete="new-password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
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
            {loading ? '⏳ Updating...' : 'Update password →'}
          </button>

        </form>

      </div>
    </div>
  )
}
