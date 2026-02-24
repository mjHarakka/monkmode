import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, signOut, signInWithGoogle, signInError } = useAuth()

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-base)',
      }}
    >
      {/* Top nav */}
      <header
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 1.5rem',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(8, 8, 8, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand */}
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.9rem',
            fontWeight: 700,
            color: 'var(--accent)',
            letterSpacing: '-0.01em',
          }}
        >
          ◎ monk flow
        </span>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {[
            { to: '/', label: 'Focus' },
            { to: '/stats', label: 'Stats' },
            { to: '/history', label: 'History' },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                padding: '0.35rem 0.75rem',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: isActive
                  ? '1px solid var(--accent-glow)'
                  : '1px solid transparent',
                transition: 'all 0.2s',
                textDecoration: 'none',
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.35rem',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            {user ? (
              <>
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? ''}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      opacity: 0.8,
                    }}
                  />
                )}
                <button
                  onClick={signOut}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    borderRadius: '7px',
                    color: 'var(--text-muted)',
                    fontSize: '0.78rem',
                    padding: '0.3rem 0.65rem',
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      'var(--text-secondary)'
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLButtonElement).style.color =
                      'var(--text-muted)'
                  }}
                >
                  sign out
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle}
                style={{
                  background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-glow)',
                  borderRadius: '7px',
                  color: 'var(--accent)',
                  fontSize: '0.78rem',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
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
                sign in
              </button>
            )}
          </div>
          {signInError && (
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--red)',
                maxWidth: '220px',
                textAlign: 'right',
                lineHeight: 1.4,
              }}
            >
              {signInError}
            </span>
          )}
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
