export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!streak) {
    await supabase.from('user_streaks').insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
      total_trees_grown: 0,
      total_trees_lost: 0,
      forest_acres: 0,
    })
    return NextResponse.json({ streak: 1 })
  }

  const lastActive = streak.last_active_date
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak = streak.current_streak

  if (lastActive === today) {
    return NextResponse.json({ streak: newStreak })
  } else if (lastActive === yesterdayStr) {
    newStreak = streak.current_streak + 1
  } else {
    newStreak = 1
  }

  const newLongest = Math.max(newStreak, streak.longest_streak)

  await supabase
    .from('user_streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)

  await supabase
    .from('leaderboard')
    .upsert({
      user_id: user.id,
      display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
      current_streak: newStreak,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  return NextResponse.json({ streak: newStreak })
}