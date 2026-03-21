import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { taskTitle, proof, durationMinutes } = await req.json()

  if (!proof || proof.trim().length < 10) {
    return NextResponse.json({
      valid: false,
      feedback: 'Your proof is too short. Please describe what you actually accomplished in more detail.'
    })
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content: `You are a strict but encouraging ADHD productivity coach validating task completion proof.
Your job is to check if the user's proof actually demonstrates they worked on their task.

Rules:
- Accept proof if it shows genuine effort, even if task is not fully complete
- Reject proof if it is vague, irrelevant, or clearly fake (e.g. "I did it", "done", "finished")
- Reject proof if it has nothing to do with the task
- Be encouraging in feedback, never shame the user
- Keep feedback under 2 sentences

Respond ONLY as JSON: {"valid": true/false, "feedback": "your feedback here"}
No extra text. Just the JSON.`
          },
          {
            role: 'user',
            content: `Task: "${taskTitle}"
Session duration: ${durationMinutes} minutes
User's proof: "${proof}"

Is this valid proof of work?`
          }
        ]
      })
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)

    return NextResponse.json({
      valid: result.valid,
      feedback: result.feedback,
    })

  } catch (e) {
    // Fallback - accept if proof is substantial enough
    const isSubstantial = proof.trim().split(' ').length >= 8
    return NextResponse.json({
      valid: isSubstantial,
      feedback: isSubstantial
        ? 'Great work completing your session! Your tree has been added to your forest.'
        : 'Please provide more detail about what you accomplished.',
    })
  }
}