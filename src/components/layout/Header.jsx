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
      className="sticky top-0 z-40 flex items-center justify-between"
      style={{
        backgroundColor: 'rgba(19, 19, 26, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0.875rem 1.25rem',
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
          className="inline-block h-2 w-2 rounded-full"
          title={isOnline ? 'Online' : 'Offline'}
          style={{ backgroundColor: isOnline ? '#22C55E' : '#EAB308' }}
        />
        {initials ? (
          <Link
            to="/settings"
            className="flex items-center justify-center rounded-full text-xs font-bold transition-all duration-200"
            style={{
              width: '34px',
              height: '34px',
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              color: '#F97316',
              fontFamily: "'Barlow Condensed', sans-serif",
              textDecoration: 'none',
              fontSize: '0.8125rem',
              letterSpacing: '0.02em',
            }}
          >
            {initials}
          </Link>
        ) : (
          <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">
            <Settings size={20} />
          </Link>
        )}
      </div>
    </header>
  )
}
