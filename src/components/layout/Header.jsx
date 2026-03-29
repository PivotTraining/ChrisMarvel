import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useOffline } from '../../context/OfflineContext'
import { useAuth } from '../../context/AuthContext'

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0] || '').toUpperCase()
}

export default function Header() {
  const { isOnline } = useOffline()
  const { profile } = useAuth()
  const initials = getInitials(profile?.full_name)

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
      style={{
        backgroundColor: '#13131A',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h1
        className="text-xl tracking-wide"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
      >
        Court<span style={{ color: '#F97316' }}>IQ</span>
      </h1>

      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          title={isOnline ? 'Online' : 'Offline'}
          style={{ backgroundColor: isOnline ? '#22C55E' : '#EAB308' }}
        />
        {initials && (
          <Link
            to="/settings"
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors"
            style={{
              backgroundColor: 'rgba(249, 115, 22, 0.15)',
              color: '#F97316',
              fontFamily: "'Barlow Condensed', sans-serif",
              textDecoration: 'none',
            }}
          >
            {initials}
          </Link>
        )}
        {!initials && (
          <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </Link>
        )}
      </div>
    </header>
  )
}
