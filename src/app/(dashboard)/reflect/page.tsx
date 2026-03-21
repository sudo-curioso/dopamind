'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ReflectPage() {
  const router = useRouter()
  const [energy, setEnergy] = useState<number | null>(null)
  const [mood, setMood] = useState<number | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!energy || !mood) return
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const today = new Date().toISOString().split('T')[0]

    await supabase
      .from('daily_reflections')
      .upsert({
        user_id: user.id,
        plan_date: today,
        energy_level: energy,
        mood_level: mood,
        notes: notes.trim() || null
      }, { onConflict: 'user_id,plan_date' })

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-5xl">🌙</div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good work today
          </h1>
          <p className="text-slate-500">
            Reflection saved. Rest well and come back tomorrow.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="space-y-8">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              End of day
            </h1>
            <p className="text-slate-500 mt-1">
              Three quick questions. Takes 60 seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Energy */}
            <div className="space-y-3">
              <p className="font-medium text-slate-900">
                How was your energy today?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEnergy(n)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                      energy === n
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n === 1 ? '😴' : n === 2 ? '😕' : n === 3 ? '😐' : n === 4 ? '🙂' : '⚡'}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>Very low</span>
                <span>Very high</span>
              </div>
            </div>

            {/* Mood */}
            <div className="space-y-3">
              <p className="font-medium text-slate-900">
                How are you feeling right now?
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setMood(n)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                      mood === n
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n === 1 ? '😢' : n === 2 ? '😟' : n === 3 ? '😌' : n === 4 ? '😊' : '🌟'}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 px-1">
                <span>Rough day</span>
                <span>Great day</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-3">
              <p className="font-medium text-slate-900">
                Anything you want to remember? <span className="text-slate-400 font-normal">(optional)</span>
              </p>
              <textarea
                className="w-full h-24 px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="One thing that went well, or something for tomorrow..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={loading || !energy || !mood}
            >
              {loading ? 'Saving...' : 'Save reflection'}
            </Button>

          </form>

          <p className="text-xs text-slate-400 text-center">
            Your reflections are private. Only you can see them.
          </p>

        </div>
      </div>
    </div>
  )
}