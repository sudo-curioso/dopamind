'use client'

import { useState } from 'react'

interface Step {
  text: string
  done: boolean
}

export default function SliceButton({ taskId, taskTitle }: { taskId: string; taskTitle: string }) {
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  async function handleSlice() {
    setLoading(true)
    setError('')
    setOpen(true)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskTitle })
      })

      const data = await response.json()

      if (data.error) {
        setError('Could not generate steps. Try again.')
        setLoading(false)
        return
      }

      setSteps(data.steps.map((text: string) => ({ text, done: false })))
    } catch {
      setError('Something went wrong. Try again.')
    }

    setLoading(false)
  }

  function toggleStep(index: number) {
    setSteps(prev => prev.map((step, i) =>
      i === index ? { ...step, done: !step.done } : step
    ))
  }

  if (!open) {
    return (
      <button
        onClick={handleSlice}
        className="text-xs text-purple-600 hover:underline flex-shrink-0"
      >
        Break down
      </button>
    )
  }

  return (
    <div className="w-full mt-2 space-y-2">
      {loading && (
        <p className="text-xs text-slate-400 animate-pulse">
          Breaking down task...
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {steps.length > 0 && (
        <div className="space-y-1 pl-2 border-l-2 border-purple-200">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-2"
            >
              <button
                onClick={() => toggleStep(i)}
                className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 transition-colors ${
                  step.done
                    ? 'bg-purple-500 border-purple-500'
                    : 'border-slate-300 hover:border-purple-400'
                }`}
              />
              <span className={`text-xs ${step.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {step.text}
              </span>
            </div>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-600 pt-1"
          >
            Hide steps
          </button>
        </div>
      )}
    </div>
  )
}