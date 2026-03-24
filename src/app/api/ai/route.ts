export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sliceTask } from '@/lib/openai/gemini'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskTitle } = await request.json()

    if (!taskTitle || taskTitle.trim().length === 0) {
      return NextResponse.json({ error: 'Task title required' }, { status: 400 })
    }

    const steps = await sliceTask(taskTitle)

    return NextResponse.json({ steps })

  } catch (error) {
    console.error('AI route error:', error)
    return NextResponse.json({ 
      error: String(error),
      steps: [] 
    }, { status: 500 })
  }
}