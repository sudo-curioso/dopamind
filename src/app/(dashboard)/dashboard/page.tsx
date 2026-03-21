import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Good morning 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Welcome to ClarifyMind. Let us get you set up.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 mb-1">
              Your account is ready
            </h2>
            <p className="text-sm text-slate-600">
              Signed in as: {user.email}
            </p>
          </div>

          <div className="text-sm text-slate-400">
            Dashboard features coming soon. We are building them step by step.
          </div>
        </div>
      </div>
    </div>
  )
}