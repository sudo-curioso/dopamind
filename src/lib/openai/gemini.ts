import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function sliceTask(taskTitle: string): Promise<string[]> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      {
        role: 'system',
        content: 'You are helping someone with ADHD break down tasks into small steps. Return ONLY a JSON array of strings. No explanation, no markdown, just the array.'
      },
      {
        role: 'user',
        content: `Break this task into 3-5 small, specific, actionable steps (5-15 minutes each): "${taskTitle}"`
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  })

  const text = completion.choices[0]?.message?.content?.trim() || ''

  try {
    const clean = text.replace(/```json|```/g, '').trim()
    const steps = JSON.parse(clean)
    if (Array.isArray(steps)) {
      return steps.slice(0, 5)
    }
    return []
  } catch {
    return []
  }
}
