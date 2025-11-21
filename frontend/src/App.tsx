import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (saved) setToken(saved)
  }, [])

  if (!token) return <Login onLogin={(t) => { localStorage.setItem('token', t); setToken(t) }} />
  return <Dashboard token={token} onLogout={() => { localStorage.removeItem('token'); setToken(null) }} />
}
