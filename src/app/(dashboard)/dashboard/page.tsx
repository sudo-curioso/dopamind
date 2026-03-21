import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CompleteTaskButton from './complete-button'
import SliceButton from './slice-button'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .eq('bucket', 'today')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const todayTasks = tasks || []

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Today
              </h1>
              <p className="text-slate-500 mt-1">
                {todayTasks.length === 0
                  ? 'All done. Great work today.'
                  : `${todayTasks.length} task${todayTasks.length === 1 ? '' : 's'} to do`}
              </p>
            </div>
            <Link
              href="/tasks"
              className="text-sm text-blue-600 hover:underline"
            >
              + Add tasks
            </Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="text-4xl">🧠</div>
              <p className="text-slate-500">
                Start by doing a brain dump of everything on your mind.
              </p>
              <Link
                href="/tasks"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-blue-700"
              >
                Brain dump now
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CompleteTaskButton taskId={task.id} />
                    <span className="text-slate-900 text-sm flex-1">
                      {task.title}
                    </span>
                    <SliceButton taskId={task.id} taskTitle={task.title} />
                    <Link
                      href={`/focus?task=${task.id}`}
                      className="text-xs text-blue-600 hover:underline flex-shrink-0"
                    >
                      Focus
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {todayTasks.length > 0 && (
            <div className="text-center">
              <p className="text-xs text-slate-400">
                Pick one task and focus on it. You do not need to do everything today.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}