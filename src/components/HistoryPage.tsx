import { useSessions } from '../hooks/useSessions'
import type { FocusSession } from '../types'

export default function HistoryPage() {
  const { sessions, loading } = useSessions()

  if (loading) {
    return (
      <div
        style={{
          minHeight: 'calc(100vh - 52px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
        }}
      >
        loading...
      </div>
    )
  }

  // Group by date
  const grouped = sessions.reduce<Record<string, FocusSession[]>>((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0]
    if (dateStr === today) return 'Today'
    if (dateStr === yesterday) return 'Yesterday'
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (isoStr: string) => {
    return new Date(isoStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div
      className='fade-in'
      style={{
        minHeight: 'calc(100vh - 52px)',
        padding: '2.5rem 1.5rem',
        maxWidth: '680px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '2rem',
        }}
      >
        history
      </h1>

      {sortedDates.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          No sessions logged yet.
          <br />
          <span
            style={{
              color: 'var(--accent)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Start focusing →
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {sortedDates.map((date) => {
            const daySessions = grouped[date]
            const dayMinutes = daySessions.reduce(
              (acc, s) => acc + Math.floor(s.actualDuration / 60),
              0,
            )

            return (
              <div key={date}>
                {/* Date header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {formatDate(date)}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '0.72rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {dayMinutes}m focused
                  </span>
                </div>

                {/* Sessions */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  {daySessions.map((s) => (
                    <SessionCard
                      key={s.id}
                      session={s}
                      formatTime={formatTime}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SessionCard({
  session,
  formatTime,
}: {
  session: FocusSession
  formatTime: (iso: string) => string
}) {
  const mins = Math.floor(session.actualDuration / 60)
  const completionPct = Math.min(
    Math.round((session.actualDuration / (session.duration * 60)) * 100),
    100,
  )
  const isComplete = completionPct >= 90

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1rem 1.1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: session.reflection ? '0.75rem' : 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-primary)',
              fontWeight: 500,
              marginBottom: '0.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {session.task}
          </div>
          <div
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.72rem',
                color: isComplete ? 'var(--green)' : 'var(--accent)',
              }}
            >
              {mins}m / {session.duration}m
            </span>
            <span
              style={{
                width: '60px',
                height: '3px',
                background: 'var(--bg-elevated)',
                borderRadius: '2px',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${completionPct}%`,
                  background: isComplete ? 'var(--green)' : 'var(--accent)',
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }}
              />
            </span>
          </div>
        </div>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {formatTime(session.completedAt)}
        </span>
      </div>

      {session.reflection && (
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.65rem',
            fontStyle: 'italic',
          }}
        >
          "{session.reflection}"
        </p>
      )}
    </div>
  )
}
