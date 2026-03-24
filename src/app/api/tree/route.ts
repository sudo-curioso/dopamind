export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function getTreeType(duration: number): string {
  if (duration <= 5) return 'sprout'
  if (duration <= 10) return 'baby'
  if (duration <= 25) return 'half'
  if (duration <= 30) return 'flowering'
  if (duration <= 45) return 'large'
  return 'full'
}

function getAcresForTree(treeType: string): number {
  const acres: Record<string, number> = {
    sprout: 0.01,
    baby: 0.02,
    half: 0.05,
    flowering: 0.07,
    large: 0.09,
    full: 0.12,
  }
  return acres[treeType] || 0.01
}

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { task_id, timer_duration, status } = await req.json()

  const treeType = getTreeType(timer_duration)
  const isAlive = status === 'alive'
  const acres = isAlive ? getAcresForTree(treeType) : 0

  await supabase.from('forest_trees').insert({
    user_id: user.id,
    task_id: task_id || null,
    tree_type: isAlive ? treeType : 'dead',
    status: isAlive ? 'alive' : 'dead',
    timer_duration,
    grown_at: isAlive ? new Date().toISOString() : null,
    died_at: !isAlive ? new Date().toISOString() : null,
  })

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (streak) {
    const newTotalGrown = isAlive
      ? streak.total_trees_grown + 1
      : streak.total_trees_grown
    const newTotalLost = !isAlive
      ? streak.total_trees_lost + 1
      : streak.total_trees_lost
    const newAcres = isAlive
      ? Number(streak.forest_acres) + acres
      : Number(streak.forest_acres)

    await supabase
      .from('user_streaks')
      .update({
        total_trees_grown: newTotalGrown,
        total_trees_lost: newTotalLost,
        forest_acres: newAcres,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    await supabase
      .from('leaderboard')
      .upsert({
        user_id: user.id,
        display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        forest_size: newAcres,
        total_trees: newTotalGrown,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
  }

  return NextResponse.json({ success: true, treeType, acres })
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: trees } = await supabase
    .from('forest_trees')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ trees: trees || [] })
}