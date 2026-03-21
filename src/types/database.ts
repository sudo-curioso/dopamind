export type UserPlan = 'free' | 'pro'
export type TaskBucket = 'today' | 'week' | 'later' | 'trash'
export type TaskStatus = 'pending' | 'in_progress' | 'done'
export type TaskPriority = 1 | 2 | 3

export interface UserProfile {
  id: string
  display_name: string | null
  timezone: string
  locale: string
  consent_gdpr: boolean
  consent_date: string | null
  plan: UserPlan
  created_at: string
  deleted_at: string | null
}

export interface TaskStep {
  id: string
  text: string
  done: boolean
}

export interface Task {
  id: string
  user_id: string
  title: string
  bucket: TaskBucket
  status: TaskStatus
  priority: TaskPriority
  steps: TaskStep[]
  created_at: string
  updated_at: string
  due_at: string | null
  completed_at: string | null
}

export interface FocusSession {
  id: string
  user_id: string
  task_id: string | null
  duration_s: number
  completed: boolean
  started_at: string
  ended_at: string | null
}

export interface MedicationReminder {
  id: string
  user_id: string
  reminder_time: string
  label: string | null
  active: boolean
}

export interface DailyReflection {
  id: string
  user_id: string
  plan_date: string
  energy_level: number | null
  mood_level: number | null
  top_task_ids: string[]
  notes: string | null
}