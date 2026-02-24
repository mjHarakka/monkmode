import { useState } from 'react'

interface ReflectionModalProps {
  task: string
  plannedMinutes: number
  actualSeconds: number
  onSave: (reflection: string) => void
  onSkip: () => void
}

export default function ReflectionModal({
  task,
  plannedMinutes,
  actualSeconds,
  onSave,
  onSkip,
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState('')
  const mins = Math.floor(actualSeconds / 60)
  const secs = actualSeconds % 60
  const pct = Math.round((actualSeconds / (plannedMinutes * 60)) * 100)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        zIndex: 100,
      }}
    >
      <div
        className='scale-in'
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          padding: '2rem',
          width: '100%',
          maxWidth: '440px',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--green-dim)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              marginBottom: '1rem',
            }}
          >
            <span
              style={{
                color: 'var(--green)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              session complete
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '0.35rem',
              lineHeight: 1.3,
            }}
          >
            {task}
          </h2>

          <div
            style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem' }}
          >
            <Stat
              label='focused'
              value={`${mins}m ${secs < 10 ? '0' + secs : secs}s`}
            />
            <Stat label='of goal' value={`${pct}%`} accent={pct >= 100} />
            <Stat label='planned' value={`${plannedMinutes}m`} />
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'var(--border)',
            marginBottom: '1.5rem',
          }}
        />

        {/* Reflection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              fontWeight: 500,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '0.6rem',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            reflection
          </label>
          <textarea
            placeholder="How did it go? Any blockers? What's next?"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
            autoFocus
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-glow)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => onSave(reflection)}
            style={{
              flex: 1,
              padding: '0.8rem',
              borderRadius: '10px',
              border: '1px solid var(--accent-glow)',
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                'rgba(245,158,11,0.18)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                'var(--accent-dim)'
            }}
          >
            save session
          </button>
          <button
            onClick={onSkip}
            style={{
              padding: '0.8rem 1.2rem',
              borderRadius: '10px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            skip
          </button>
        </div>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: accent ? 'var(--green)' : 'var(--text-primary)',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          marginTop: '0.1rem',
        }}
      >
        {label}
      </div>
    </div>
  )
}
