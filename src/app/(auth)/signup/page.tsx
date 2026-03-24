'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) {
      setError('Please accept the privacy policy to continue.')
      return
    }
    if (password.length < 12) {
      setError('Password must be at least 12 characters.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/survey/1')
      router.refresh()
    } else {
      setSuccess(true)
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="text-4xl">✉️</div>
          <h1 className="text-2xl font-bold text-slate-900">Check your inbox</h1>
          <p className="text-slate-600">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account.
          </p>
          <p className="text-sm text-slate-400">
            Link expires in 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-8">

        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              C
            </div>
            <span className="text-lg font-semibold text-slate-900">Dopamind</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Create your free account
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Built for ADHD brains. Simple. Calm. Effective.
          </p>
        </div>

        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm"
            style={{ background: '#FEF2F2', color: '#EF4444' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">

          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-slate-700">
              Your name
            </Label>
            <Input
              id="name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First name"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 12 characters"
              required
              className="rounded-xl"
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              className="mt-1"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <label htmlFor="consent" className="text-xs text-slate-500 leading-relaxed">
              I agree to the{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>
              . I understand Dopamind is a productivity tool and not a medical service.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !consent}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: consent
                ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                : '#E2E8F0',
              color: consent ? '#fff' : '#94A3B8',
            }}
          >
            {loading ? 'Creating account...' : 'Create free account'}
          </button>

        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium" style={{ color: '#2563EB' }}>
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}