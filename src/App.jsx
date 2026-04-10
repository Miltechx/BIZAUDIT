import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Subscribe from './pages/Subscribe'
import Terms from './pages/Terms'
import Admin from './pages/Admin'
import AuditEngine from './AuditEngine'

function getPage() {
  const hash = window.location.hash.replace('#', '').replace(/^\//, '') || ''
  if (hash.startsWith('audit'))     return 'audit'
  if (hash.startsWith('subscribe')) return 'subscribe'
  if (hash.startsWith('terms'))     return 'terms'
  if (hash.startsWith('admin'))     return 'admin'
  return 'landing'
}

export default function App() {
  const [page, setPage] = useState(getPage)

  useEffect(() => {
    const onHash = () => setPage(getPage())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function nav(p) {
    window.location.hash = p === 'landing' ? '/' : `/${p}`
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const props = { nav }

  if (page === 'audit')     return <AuditEngine {...props} />
  if (page === 'subscribe') return <Subscribe   {...props} />
  if (page === 'terms')     return <Terms       {...props} />
  if (page === 'admin')     return <Admin       {...props} />
  return                           <Landing     {...props} />
}
