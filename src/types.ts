export interface FocusSession {
  id: string
  task: string
  duration: number // planned minutes
  actualDuration: number // actual seconds completed
  reflection: string
  completedAt: string // ISO date string
  date: string // YYYY-MM-DD
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null // YYYY-MM-DD
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'
