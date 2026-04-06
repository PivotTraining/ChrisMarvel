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
      className="sticky top-0 z-40 flex items-center justify-between glass-card"
      style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--space-2) var(--space-3)',
      }}
    >
      <h1 className="t-title3" style={{ color: 'var(--color-text)' }}>
        Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
      </h1>

      <div className="flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 rounded-full"
          title={isOnline ? 'Online' : 'Offline'}
          style={{ backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-warning)' }}
        />
        {initials ? (
          <Link
            to="/settings"
            className="flex items-center justify-center rounded-full"
            style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
              color: '#fff',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '-0.2px',
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
            }}
          >
            {initials}
          </Link>
        ) : (
          <Link to="/settings" style={{ color: 'var(--color-text-sec)' }}>
            <Settings size={20} />
          </Link>
        )}
      </div>
    </header>
  )
}
