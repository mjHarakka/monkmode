import { useAuth } from '../contexts/AuthContext'

export default function AuthPage() {
  const { signInWithGoogle } = useAuth()

  return (
    <div
      className='fade-in'
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--bg-base)',
      }}
    >
      {/* Logo mark */}
      <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--accent-dim)',
            border: '1px solid var(--accent-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '28px',
          }}
        >
          ◎
        </div>
        <h1
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.5rem',
          }}
        >
          monk mode
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: 400,
            letterSpacing: '0.02em',
          }}
        >
          deep work. tracked.
        </p>
      </div>

      {/* Sign in card */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '2rem',
          width: '100%',
          maxWidth: '360px',
        }}
      >
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
            textAlign: 'center',
          }}
        >
          Sign in to track your focus sessions, build streaks, and review your
          progress.
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            width: '100%',
            padding: '0.85rem 1.5rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor =
              'var(--accent)'
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'var(--accent-dim)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor =
              'var(--border)'
            ;(e.currentTarget as HTMLButtonElement).style.background =
              'var(--bg-elevated)'
          }}
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>

      <p
        style={{
          marginTop: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
        }}
      >
        no distractions. just work.
      </p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24'>
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </svg>
  )
}
