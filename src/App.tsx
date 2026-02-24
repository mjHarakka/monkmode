import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthPage from './components/AuthPage'
import Layout from './components/Layout'
import FocusPage from './components/FocusPage'
import StatsPage from './components/StatsPage'
import HistoryPage from './components/HistoryPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-base)',
          color: 'var(--text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
        }}
      >
        ◎
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<FocusPage />} />
        <Route path='/stats' element={<StatsPage />} />
        <Route path='/history' element={<HistoryPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
