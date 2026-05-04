import { Link } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { useOffline } from '../../context/OfflineContext'
import { useAuth } from '../../context/AuthContext'

const HEADER_BG = 'linear-gradient(180deg, #0B1A33 0%, #050C1C 100%)'
const HEADER_BORDER = '1px solid rgba(59, 130, 246, 0.22)'

function getInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  if (parts.length === 1 && parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0] || '').toUpperCase()
}

export default function Header() {
  const { isOnline, pendingCount } = useOffline()
  const { profile } = useAuth()
  const initials = getInitials(profile?.full_name)

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between"
      style={{
        background: HEADER_BG,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: HEADER_BORDER,
        padding: 'var(--space-2) var(--space-3)',
        paddingTop: 'calc(var(--space-2) + env(safe-area-inset-top, 0px))',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Basketball mark */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 6px rgba(255,107,53,0.5))' }}
        >
          <defs>
            <radialGradient id="hdrBall" cx="38%" cy="32%" r="60%">
              <stop offset="0%" stopColor="#FF9258" />
              <stop offset="55%" stopColor="#FF6B35" />
              <stop offset="100%" stopColor="#B8401A" />
            </radialGradient>
            <radialGradient id="hdrBallHi" cx="35%" cy="28%" r="28%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>
          <circle cx="16" cy="16" r="14" fill="url(#hdrBall)" />
          <g stroke="#2A0F05" strokeWidth="1.4" fill="none" opacity="0.7" strokeLinecap="round">
            <path d="M16,2 Q11,9 11,16 Q11,23 16,30" />
            <path d="M16,2 Q21,9 21,16 Q21,23 16,30" />
            <path d="M2,16 Q9,11 16,11 Q23,11 30,16" />
            <path d="M2,16 Q9,21 16,21 Q23,21 30,16" />
          </g>
          <circle cx="16" cy="16" r="14" fill="url(#hdrBallHi)" />
        </svg>
        <h1
          className="t-title3"
          style={{
            color: 'var(--color-text)',
            letterSpacing: '-0.5px',
            margin: 0,
          }}
        >
          Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            title={isOnline ? 'Online' : 'Offline'}
            style={{ backgroundColor: isOnline ? 'var(--color-success)' : 'var(--color-warning)' }}
          />
          {pendingCount > 0 && (
            <span
              className="t-caption"
              title={`${pendingCount} pending sync`}
              style={{ color: 'var(--color-warning)', fontSize: '10px', fontWeight: 700 }}
            >
              {pendingCount}
            </span>
          )}
        </div>
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
