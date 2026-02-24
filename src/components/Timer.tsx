import { useState, useEffect, useRef, useCallback } from 'react'
import type { TimerStatus } from '../types'

const DURATIONS = [25, 45] as const

const REST_INFO: Record<number, string> = {
  25: '5 min rest · 15 min after 4 sessions',
  45: '15 min rest',
}

const CIRCUMFERENCE = 2 * Math.PI * 120 // r=120

interface TimerProps {
  onSessionComplete: (
    task: string,
    plannedMinutes: number,
    actualSeconds: number,
  ) => void
}

export default function Timer({ onSessionComplete }: TimerProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(25)
  const [task, setTask] = useState('')
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [remaining, setRemaining] = useState(25 * 60)
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedAtPauseRef = useRef(0)

  const totalSeconds = selectedDuration * 60
  const progress = (totalSeconds - remaining) / totalSeconds
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress)

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const tick = useCallback(() => {
    setRemaining((r) => {
      if (r <= 1) {
        clearTimer()
        setStatus('done')
        return 0
      }
      return r - 1
    })
    setElapsed((e) => e + 1)
  }, [])

  const handleStart = () => {
    if (status === 'idle') {
      setRemaining(selectedDuration * 60)
      setElapsed(0)
    }
    setStatus('running')
    intervalRef.current = setInterval(tick, 1000)
  }

  const handlePause = () => {
    clearTimer()
    elapsedAtPauseRef.current = elapsed
    setStatus('paused')
  }

  const handleResume = () => {
    setStatus('running')
    intervalRef.current = setInterval(tick, 1000)
  }

  const handleStop = () => {
    clearTimer()
    const actualSecs = elapsed
    setStatus('idle')
    setRemaining(selectedDuration * 60)
    setElapsed(0)
    if (actualSecs >= 60) {
      onSessionComplete(
        task || 'Untitled session',
        selectedDuration,
        actualSecs,
      )
    }
  }

  const handleDone = () => {
    onSessionComplete(task || 'Untitled session', selectedDuration, elapsed)
    setStatus('idle')
    setRemaining(selectedDuration * 60)
    setElapsed(0)
    setTask('')
  }

  // When duration picker changes (only in idle)
  const pickDuration = (d: number) => {
    if (status !== 'idle') return
    setSelectedDuration(d)
    setRemaining(d * 60)
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  const formatTime = (secs: number) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const isRunning = status === 'running'
  const isDone = status === 'done'

  // Ring color based on status
  const ringColor = isDone
    ? 'var(--green)'
    : isRunning
      ? 'var(--accent)'
      : 'var(--border)'

  return (
    <div
      className='fade-in'
      style={{
        minHeight: 'calc(100vh - 52px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2.5rem',
      }}
    >
      {/* Duration picker */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '0.35rem',
          }}
        >
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => pickDuration(d)}
              disabled={status !== 'idle'}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                background:
                  selectedDuration === d ? 'var(--accent-dim)' : 'transparent',
                color:
                  selectedDuration === d
                    ? 'var(--accent)'
                    : 'var(--text-secondary)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.82rem',
                fontWeight: selectedDuration === d ? 600 : 400,
                outline:
                  selectedDuration === d
                    ? '1px solid var(--accent-glow)'
                    : 'none',
                transition: 'all 0.2s',
                cursor: status === 'idle' ? 'pointer' : 'default',
                opacity: status !== 'idle' && selectedDuration !== d ? 0.35 : 1,
              }}
            >
              {d}m
            </button>
          ))}
        </div>
        <p
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-secondary)',
            margin: 0,
            letterSpacing: '0.02em',
          }}
        >
          rest · {REST_INFO[selectedDuration]}
        </p>
      </div>

      {/* SVG Ring Timer */}
      <div style={{ position: 'relative', width: 288, height: 288 }}>
        <svg width={288} height={288} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={144}
            cy={144}
            r={120}
            fill='none'
            stroke='var(--border)'
            strokeWidth={3}
          />
          {/* Progress arc */}
          <circle
            cx={144}
            cy={144}
            r={120}
            fill='none'
            stroke={ringColor}
            strokeWidth={3}
            strokeLinecap='round'
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s linear, stroke 0.4s ease',
            }}
          />
        </svg>

        {/* Center content */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
          }}
        >
          {isDone ? (
            <span style={{ fontSize: '3rem' }}>✓</span>
          ) : (
            <span
              className={isRunning ? 'tick' : ''}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '3.5rem',
                fontWeight: 300,
                color: 'var(--text-primary)',
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              {formatTime(remaining)}
            </span>
          )}

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.7rem',
              color: isDone
                ? 'var(--green)'
                : isRunning
                  ? 'var(--accent)'
                  : 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              marginTop: '0.25rem',
            }}
          >
            {isDone
              ? 'session done'
              : isRunning
                ? 'focusing'
                : status === 'paused'
                  ? 'paused'
                  : 'ready'}
          </span>
        </div>
      </div>

      {/* Task input */}
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <input
          type='text'
          placeholder='What are you working on?'
          value={task}
          onChange={(e) => setTask(e.target.value)}
          disabled={status !== 'idle'}
          style={{
            width: '100%',
            padding: '0.85rem 1.1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            opacity: status !== 'idle' ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-glow)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
          }}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {isDone ? (
          <button
            onClick={handleDone}
            className='pulse-glow'
            style={{
              padding: '0.8rem 2.5rem',
              borderRadius: '12px',
              border: '1px solid var(--green)',
              background: 'var(--green-dim)',
              color: 'var(--green)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.88rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              transition: 'all 0.2s',
            }}
          >
            log session →
          </button>
        ) : (
          <>
            {(status === 'idle' || status === 'paused') && (
              <button
                onClick={status === 'idle' ? handleStart : handleResume}
                style={{
                  padding: '0.8rem 2.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--accent-glow)',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
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
                {status === 'idle' ? 'start' : 'resume'}
              </button>
            )}

            {status === 'running' && (
              <button
                onClick={handlePause}
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-secondary)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                pause
              </button>
            )}

            {(status === 'running' || status === 'paused') && (
              <button
                onClick={handleStop}
                style={{
                  padding: '0.8rem 2rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.85rem',
                  fontWeight: 400,
                  transition: 'all 0.2s',
                }}
              >
                stop
              </button>
            )}
          </>
        )}
      </div>

      {/* Elapsed time (while running/paused) */}
      {(isRunning || status === 'paused') && elapsed > 0 && (
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {Math.floor(elapsed / 60)}m {elapsed % 60}s elapsed
        </p>
      )}
    </div>
  )
}
