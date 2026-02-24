import { useState } from 'react'
import Timer from './Timer'
import ReflectionModal from './ReflectionModal'
import { useSessions } from '../hooks/useSessions'

interface PendingSession {
  task: string
  plannedMinutes: number
  actualSeconds: number
}

export default function FocusPage() {
  const { addSession, streak } = useSessions()
  const [pending, setPending] = useState<PendingSession | null>(null)

  const handleSessionComplete = (
    task: string,
    plannedMinutes: number,
    actualSeconds: number,
  ) => {
    setPending({ task, plannedMinutes, actualSeconds })
  }

  const handleSave = async (reflection: string) => {
    if (!pending) return
    const now = new Date()
    await addSession({
      task: pending.task,
      duration: pending.plannedMinutes,
      actualDuration: pending.actualSeconds,
      reflection,
      completedAt: now.toISOString(),
      date: now.toISOString().split('T')[0],
    })
    setPending(null)
  }

  const handleSkip = () => setPending(null)

  return (
    <>
      {/* Streak badge */}
      {streak.currentStreak > 0 && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            right: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '0.4rem 0.75rem',
            fontSize: '0.78rem',
            color: 'var(--accent)',
            fontFamily: "'JetBrains Mono', monospace",
            zIndex: 40,
          }}
        >
          <span style={{ fontSize: '0.9rem' }}>🔥</span>
          {streak.currentStreak}d streak
        </div>
      )}

      <Timer onSessionComplete={handleSessionComplete} />

      {pending && (
        <ReflectionModal
          task={pending.task}
          plannedMinutes={pending.plannedMinutes}
          actualSeconds={pending.actualSeconds}
          onSave={handleSave}
          onSkip={handleSkip}
        />
      )}
    </>
  )
}
