'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CompleteTaskButton({ taskId }: { taskId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleComplete() {
    setLoading(true)
    const supabase = createClient()
    await supabase
      .from('tasks')
      .update({
        status: 'done',
        completed_at: new Date().toISOString()
      })
      .eq('id', taskId)

    setDone(true)
    setLoading(false)

    setTimeout(() => {
      router.refresh()
    }, 500)
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
        done
          ? 'bg-green-500 border-green-500'
          : 'border-slate-300 hover:border-green-400'
      }`}
    >
      {done && (
        <svg
          viewBox="0 0 20 20"
          fill="white"
          className="w-full h-full p-0.5"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}