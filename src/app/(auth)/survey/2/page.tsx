'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const QUESTIONS = [
  {
    id: 'improve',
    question: 'What do you want to improve most?',
    options: [
      'My focus and concentration',
      'My organisation and planning',
      'My time management',
      'My motivation and energy',
    ],
  },
  {
    id: 'struggle',
    question: 'When do you struggle the most?',
    options: [
      'In the morning (getting started)',
      'During the day (staying on track)',
      'In the evening (winding down)',
      'All day consistently',
    ],
  },
  {
    id: 'workstyle',
    question: 'How would you describe your work style?',
    options: [
      'I work best under pressure',
      'I need complete silence to focus',
      'I work in short bursts',
      'I hyperfocus for hours then crash',
    ],
  },
  {
    id: 'support',
    question: 'What kind of support do you prefer?',
    options: [
      'Gentle reminders and nudges',
      'Strict accountability',
      'Visual progress tracking',
      'AI-powered suggestions',
    ],
  },
  {
    id: 'goal',
    question: 'What is your main goal with Dopamind?',
    options: [
      'Complete more tasks daily',
      'Reduce anxiety around work',
      'Build better habits',
      'Understand my ADHD better',
    ],
  },
]

export default function SurveyPage2() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [others, setOthers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function handleSelect(questionId: string, option: string) {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
    if (option !== 'Other') {
      setOthers(prev => ({ ...prev, [questionId]: '' }))
    }
  }

  function handleOther(questionId: string, value: string) {
    setOthers(prev => ({ ...prev, [questionId]: value }))
    setAnswers(prev => ({ ...prev, [questionId]: 'Other' }))
  }

  async function handleFinish() {
    setLoading(true)

    const page2Data = { ...answers }
    Object.keys(others).forEach(k => {
      if (others[k]) page2Data[k] = others[k]
    })

    const page1Data = JSON.parse(localStorage.getItem('survey_page1') || '{}')
    const allAnswers = { ...page1Data, ...page2Data }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('users')
        .update({
          consent_version: JSON.stringify(allAnswers)
        })
        .eq('id', user.id)
    }

    localStorage.removeItem('survey_page1')
    router.push('/dashboard')
    router.refresh()
  }

  const allAnswered = QUESTIONS.every(q => {
    if (answers[q.id] === 'Other') return others[q.id]?.trim().length > 0
    return !!answers[q.id]
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
            >
              C
            </div>
            <span className="text-sm font-semibold text-slate-900">Dopamind</span>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#E2E8F0' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: '100%',
                  background: 'linear-gradient(90deg, #2563EB, #7C3AED)'
                }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">2 of 2</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Almost there
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            5 more questions to personalise your experience.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {QUESTIONS.map((q, qi) => (
            <div key={q.id}>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white mr-2"
                  style={{ background: '#7C3AED' }}
                >
                  {qi + 6}
                </span>
                {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map(option => {
                  const isSelected = answers[q.id] === option
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(q.id, option)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        background: isSelected ? '#F5F3FF' : '#F8FAFC',
                        border: isSelected ? '1.5px solid #7C3AED' : '1px solid #F1F5F9',
                        color: isSelected ? '#7C3AED' : '#374151',
                        fontWeight: isSelected ? '500' : '400',
                      }}
                    >
                      {option}
                    </button>
                  )
                })}

                {/* Other option */}
                <button
                  onClick={() => handleSelect(q.id, 'Other')}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    background: answers[q.id] === 'Other' ? '#F5F3FF' : '#F8FAFC',
                    border: answers[q.id] === 'Other' ? '1.5px solid #7C3AED' : '1px solid #F1F5F9',
                    color: answers[q.id] === 'Other' ? '#7C3AED' : '#374151',
                    fontWeight: answers[q.id] === 'Other' ? '500' : '400',
                  }}
                >
                  Other
                </button>

                {answers[q.id] === 'Other' && (
                  <textarea
                    autoFocus
                    value={others[q.id] || ''}
                    onChange={e => handleOther(q.id, e.target.value)}
                    placeholder="Tell us more..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none transition-all"
                    style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #7C3AED',
                      fontFamily: 'inherit',
                      color: '#374151',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Finish button */}
        <div className="mt-10 space-y-3">
          <button
            onClick={handleFinish}
            disabled={!allAnswered || loading}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: allAnswered
                ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                : '#E2E8F0',
              color: allAnswered ? '#fff' : '#94A3B8',
            }}
          >
            {loading ? 'Setting up your account...' : 'Get started with Dopamind →'}
          </button>

          <button
            onClick={() => router.back()}
            className="w-full py-2.5 text-sm text-slate-400 hover:text-slate-600"
          >
            ← Back to part 1
          </button>

          <p className="text-xs text-slate-400 text-center">
            Your answers are private and used only to personalise your experience.
          </p>
        </div>

      </div>
    </div>
  )
}