import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import FocusPage from './components/FocusPage'
import StatsPage from './components/StatsPage'
import HistoryPage from './components/HistoryPage'

function AppRoutes() {
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
