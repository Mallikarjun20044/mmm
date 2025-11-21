import { useEffect, useState } from 'react'

export default function Dashboard({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [exams, setExams] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/exams', { headers: { Authorization: `Bearer ${token}` }})
      .then(async r => { const j = await r.json(); if (!r.ok) throw new Error(j.error||'Failed'); return j; })
      .then(setExams)
      .catch(e => setError(e.message))
  }, [token])

  return (
    <div className="container">
      <div className="nav">
        <h2>Dashboard</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="card">
        <h3>Exams</h3>
        <ul>
          {exams.map(e => <li key={e.id}>{e.title} — {e.duration_minutes} min</li>)}
        </ul>
      </div>
    </div>
  )
}
