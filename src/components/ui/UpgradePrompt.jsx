import { useNavigate } from 'react-router-dom'
import { Sparkles, X } from 'lucide-react'

const DEFAULT_BENEFITS = [
  'Practice Mode with timers',
  'Advanced analytics & heat maps',
  'All training packs',
  'Custom drill templates',
  'Export your data',
]

export default function UpgradePrompt({
  title = 'Unlock CourtIQ Pro',
  subtitle = "You're crushing it. Take your training to the next level.",
  benefits = DEFAULT_BENEFITS,
  onClose,
  // Optional: called instead of navigate('/premium') when user taps upgrade.
  // Useful when the prompt appears mid-session (e.g. after Gametime) and we
  // don't want to unmount the current page and lose in-memory state.
  onUpgrade,
}) {
  const navigate = useNavigate()

  const handleUpgrade = () => {
    if (onClose) onClose()
    if (onUpgrade) {
      onUpgrade()
    } else {
      navigate('/premium')
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%', maxWidth: '380px',
          background: 'linear-gradient(160deg, #1a1a2e, #16213e)',
          border: '1px solid rgba(255,107,53,0.4)',
          borderRadius: '24px',
          padding: '32px 24px 24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(255,107,53,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: '50%',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '64px', height: '64px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #FF6B35, #C8490A)',
              boxShadow: '0 8px 28px rgba(255,107,53,0.45)',
              marginBottom: '16px',
            }}
          >
            <Sparkles size={28} color="#fff" />
          </div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 900, margin: '0 0 8px', letterSpacing: '-0.3px' }}>
            {title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
          {benefits.map((b, i) => (
            <li
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 0',
                borderBottom: i < benefits.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
            >
              <span
                style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#22C55E', fontSize: '12px', fontWeight: 900, flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: 500 }}>
                {b}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleUpgrade}
          style={{
            width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
            background: 'linear-gradient(135deg, #FF6B35, #C8490A)',
            color: '#fff', fontSize: '16px', fontWeight: 900, fontFamily: 'inherit',
            cursor: 'pointer', boxShadow: '0 8px 24px rgba(255,107,53,0.4)',
            marginBottom: '8px',
          }}
        >
          Upgrade to Pro — $4.99/mo
        </button>
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '12px', borderRadius: '14px',
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  )
}
