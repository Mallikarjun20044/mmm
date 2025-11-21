import { useState } from 'react'

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin@123')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      onLogin(data.token)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <h1>Online Examination System</h1>
      <form onSubmit={submit} className="card">
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
