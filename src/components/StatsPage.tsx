import { useSessions } from '../hooks/useSessions'

export default function StatsPage() {
  const { sessions, loading, streak, totalMinutes, weeklyMinutes } =
    useSessions()

  // Build last 7 days bar chart data
  const days: { label: string; date: string; minutes: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const date = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-US', { weekday: 'short' })
    const minutes = sessions
      .filter((s) => s.date === date)
      .reduce((acc, s) => acc + Math.floor(s.actualDuration / 60), 0)
    days.push({ label, date, minutes })
  }

  const maxMinutes = Math.max(...days.map((d) => d.minutes), 1)
  const today = new Date().toISOString().split('T')[0]

  const totalHours = totalMinutes / 60
  const weeklyHours = weeklyMinutes / 60
  const avgSessionMins =
    sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0

  if (loading) {
    return <LoadingState />
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
        stats
      </h1>

      {/* Top stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatCard
          label='total hours'
          value={
            totalHours >= 100
              ? `${Math.round(totalHours)}h`
              : `${totalHours.toFixed(1)}h`
          }
          sub={`${sessions.length} sessions`}
        />
        <StatCard
          label='this week'
          value={
            weeklyHours >= 10
              ? `${Math.round(weeklyHours)}h`
              : `${weeklyHours.toFixed(1)}h`
          }
          sub={`${weeklyMinutes}m total`}
        />
        <StatCard
          label='current streak'
          value={`${streak.currentStreak}d`}
          sub={streak.currentStreak > 0 ? 'keep going' : 'start today'}
          accent='amber'
        />
        <StatCard
          label='longest streak'
          value={`${streak.longestStreak}d`}
          sub={`avg ${avgSessionMins}m / session`}
        />
      </div>

      {/* Weekly bar chart */}
      <Section title='last 7 days'>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.6rem',
            height: '120px',
            padding: '0 0 0.5rem',
          }}
        >
          {days.map((d) => {
            const heightPct = d.minutes > 0 ? (d.minutes / maxMinutes) * 100 : 0
            const isToday = d.date === today
            return (
              <div
                key={d.date}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  title={`${d.minutes}m`}
                  style={{
                    width: '100%',
                    height: `${Math.max(heightPct, d.minutes > 0 ? 4 : 0)}%`,
                    minHeight: d.minutes > 0 ? '4px' : '2px',
                    borderRadius: '4px 4px 2px 2px',
                    background: isToday
                      ? 'var(--accent)'
                      : d.minutes > 0
                        ? 'var(--bg-elevated)'
                        : 'var(--border-subtle)',
                    border: isToday
                      ? 'none'
                      : d.minutes > 0
                        ? '1px solid var(--border)'
                        : 'none',
                    transition: 'height 0.4s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: isToday ? 'var(--accent)' : 'var(--text-muted)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {d.label.toLowerCase()}
                </span>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Recent tasks */}
      {sessions.length > 0 && (
        <Section title='recent sessions'>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
          >
            {sessions.slice(0, 5).map((s) => (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-elevated)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    fontWeight: 400,
                    flex: 1,
                    marginRight: '1rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {s.task}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {Math.floor(s.actualDuration / 60)}m
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {sessions.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
          }}
        >
          No sessions yet. Start your first focus session.
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent?: 'amber' | 'green'
}) {
  const accentColor =
    accent === 'amber'
      ? 'var(--accent)'
      : accent === 'green'
        ? 'var(--green)'
        : 'var(--text-primary)'

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '1.25rem 1.25rem',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: '0.5rem',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '2rem',
          fontWeight: 600,
          color: accentColor,
          lineHeight: 1,
          marginBottom: '0.35rem',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        {sub}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2
        style={{
          fontSize: '0.7rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '1rem',
        }}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}

function LoadingState() {
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
