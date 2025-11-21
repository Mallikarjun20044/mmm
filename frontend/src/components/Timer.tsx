import { useEffect, useState } from 'react'
export default function Timer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => { const id = setInterval(() => setLeft(s => Math.max(s-1,0)), 1000); return () => clearInterval(id) }, [])
  return <span>{left}s</span>
}
