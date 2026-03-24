'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    id: 'age',
    question: 'How old are you?',
    options: ['Under 18', '18 - 24', '25 - 34', '35 - 44'],
  },
  {
    id: 'diagnosis',
    question: 'Have you been diagnosed with ADHD?',
    options: [
      'Yes, officially diagnosed',
      'I suspect I have ADHD but not diagnosed',
      'I was diagnosed as a child',
      'I am in the process of getting diagnosed',
    ],
  },
  {
    id: 'challenge',
    question: 'What is your biggest daily challenge?',
    options: [
      'Starting tasks (task initiation)',
      'Staying focused (getting distracted)',
      'Remembering things (forgetfulness)',
      'Managing time (time blindness)',
    ],
  },
  {
    id: 'work',
    question: 'How does ADHD affect your work or studies?',
    options: [
      'I miss deadlines frequently',
      'I struggle to concentrate in meetings or classes',
      'I procrastinate on important tasks',
      'I feel overwhelmed by workload',
    ],
  },
  {
    id: 'tried',
    question: 'What have you tried before to manage ADHD?',
    options: [
      'Medication',
      'Therapy or coaching',
      'Productivity apps',
      'Nothing yet',
    ],
  },
]

export default function SurveyPage1() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [others, setOthers] = useState<Record<string, string>>({})

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

  function handleNext() {
    const data = { ...answers }
    Object.keys(others).forEach(k => {
      if (others[k]) data[k] = others[k]
    })
    localStorage.setItem('survey_page1', JSON.stringify(data))
    router.push('/survey/2')
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
                  width: '50%',
                  background: 'linear-gradient(90deg, #2563EB, #7C3AED)'
                }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">1 of 2</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Let us understand you
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            5 quick questions. No right or wrong answers.
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {QUESTIONS.map((q, qi) => (
            <div key={q.id}>
              <p className="text-sm font-semibold text-slate-900 mb-3">
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white mr-2"
                  style={{ background: '#2563EB' }}
                >
                  {qi + 1}
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
                        background: isSelected ? '#EFF6FF' : '#F8FAFC',
                        border: isSelected ? '1.5px solid #2563EB' : '1px solid #F1F5F9',
                        color: isSelected ? '#2563EB' : '#374151',
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
                    background: answers[q.id] === 'Other' ? '#EFF6FF' : '#F8FAFC',
                    border: answers[q.id] === 'Other' ? '1.5px solid #2563EB' : '1px solid #F1F5F9',
                    color: answers[q.id] === 'Other' ? '#2563EB' : '#374151',
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
                      border: '1.5px solid #2563EB',
                      fontFamily: 'inherit',
                      color: '#374151',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Next button */}
        <div className="mt-10">
          <button
            onClick={handleNext}
            disabled={!allAnswered}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all"
            style={{
              background: allAnswered
                ? 'linear-gradient(135deg, #2563EB, #7C3AED)'
                : '#E2E8F0',
              color: allAnswered ? '#fff' : '#94A3B8',
            }}
          >
            Continue to part 2 →
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            Your answers help us personalise your experience.
          </p>
        </div>

      </div>
    </div>
  )
}