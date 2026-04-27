import { Lock, Zap } from 'lucide-react'
import { usePremium, PLANS } from '../../context/PremiumContext'

export default function ProGate({ feature, children, fallback }) {
  const { canAccess, upgrade } = usePremium()

  if (canAccess(feature)) return children

  if (fallback) return fallback

  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-4) var(--space-3)',
        backgroundColor: 'var(--color-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-accent-tint), rgba(255,107,53,0.2))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-2)',
        }}
      >
        <Lock size={24} style={{ color: 'var(--color-accent)' }} />
      </div>
      <h3 className="t-title3" style={{ marginBottom: '4px' }}>Pro Feature</h3>
      <p className="t-body" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
        Upgrade to CourtIQ Pro to unlock this feature and take your game to the next level.
      </p>
      <button onClick={upgrade} className="btn-primary" style={{ maxWidth: '280px', margin: '0 auto' }}>
        <Zap size={18} />
        Upgrade to Pro
      </button>
    </div>
  )
}
