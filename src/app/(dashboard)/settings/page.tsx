'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Reminder {
  id: string
  reminder_time: string
  label: string | null
  active: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [time, setTime] = useState('')
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadReminders()
  }, [])

  async function loadReminders() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    const { data } = await supabase
      .from('medication_reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('reminder_time')
    setReminders(data || [])
    setFetching(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!time) {
      setError('Please select a time.')
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: insertError } = await supabase
      .from('medication_reminders')
      .insert({
        user_id: user.id,
        reminder_time: time,
        label: label.trim() || null,
        active: true
      })

    if (insertError) {
      setError('Could not save reminder. Try again.')
      setLoading(false)
      return
    }

    setTime('')
    setLabel('')
    setSuccess('Reminder saved.')
    setLoading(false)
    loadReminders()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase
      .from('medication_reminders')
      .update({ active: false })
      .eq('id', id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  function formatTime(time: string) {
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="space-y-8">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Medication reminders
            </h1>
            <p className="text-slate-500 mt-1">
              Set a daily reminder time. We store time only, never medication names.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="time">Reminder time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="label">
                Label <span className="text-slate-400 font-normal">(optional)</span>
              </Label>
              <Input
                id="label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Morning, Evening"
                maxLength={50}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add reminder'}
            </Button>
          </form>

          <div className="space-y-3">
            <h2 className="font-medium text-slate-900">
              Active reminders
            </h2>

            {fetching ? (
              <p className="text-slate-400 text-sm">Loading...</p>
            ) : reminders.length === 0 ? (
              <p className="text-slate-400 text-sm">
                No reminders set yet.
              </p>
            ) : (
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {formatTime(reminder.reminder_time)}
                      </p>
                      {reminder.label && (
                        <p className="text-sm text-slate-500">
                          {reminder.label}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(reminder.id)}
                      className="text-sm text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-6">
            <p className="text-xs text-slate-400 text-center">
              Dopamind stores reminder times only. We never ask for or store
              medication names, dosages, or medical information.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard')}
            className="w-full text-sm text-slate-400 hover:text-slate-600 text-center"
          >
            Back to dashboard
          </button>

        </div>
      </div>
    </div>
  )
}