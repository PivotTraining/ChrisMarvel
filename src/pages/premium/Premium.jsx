import { useState } from 'react'
import { Zap, Check, Crown, Lock, Flame, Target, Timer, BarChart3, Share2, Crosshair, Dumbbell, ChevronRight, Star } from 'lucide-react'
import { usePremium, PLANS } from '../../context/PremiumContext'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import { useToast } from '../../context/ToastContext'

const PRO_FEATURES = [
  { icon: Flame, title: 'Quick Game', desc: 'Tap stats live from the sideline — real-time play-by-play', color: 'var(--color-accent)' },
  { icon: Target, title: 'Practice Mode', desc: 'Structured workouts with targets, rest timers, and rep counters', color: 'var(--color-success)' },
  { icon: BarChart3, title: 'Advanced Analytics', desc: 'Radar charts, heat maps, shooting trends, and archetype detection', color: 'var(--color-info)' },
  { icon: Crosshair, title: 'Unlimited Tracking', desc: 'No limits on games, shots, drills, or journal entries', color: 'var(--color-purple)' },
  { icon: Dumbbell, title: 'Training Packs', desc: 'Full access to all 30-day structured training programs', color: 'var(--color-warning)' },
  { icon: Share2, title: 'Share Cards & Export', desc: 'Share your stats on social media and export all data', color: 'var(--color-accent)' },
]

const TESTIMONIALS = [
  { name: 'Marcus J.', role: 'HS Varsity Guard', quote: 'Quick Game changed how my dad tracks my stats. We review play-by-play after every game now.' },
  { name: 'Coach Davis', role: 'AAU Coach', quote: 'Practice Mode lets my players structure their own gym sessions. Accountability goes way up.' },
  { name: 'Aaliyah R.', role: 'D3 Forward', quote: 'The heat map and shooting analytics helped me see I was avoiding the left wing. Shot 40% from there last month.' },
]

export default function Premium() {
  const { isPro, upgrade, downgrade } = usePremium()
  const { showToast } = useToast()
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      upgrade()
      setProcessing(false)
      showToast('Welcome to CourtIQ Pro!', 'success')
    }, 1500)
  }

  const handleDowngrade = () => {
    if (window.confirm('Are you sure you want to downgrade? You\'ll lose access to Pro features.')) {
      downgrade()
      showToast('Downgraded to Free plan', 'info')
    }
  }

  return (
    <PageWrapper>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'var(--space-3) 0 var(--space-4)' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: isPro
              ? 'linear-gradient(135deg, #D97706, #F59E0B, #FBBF24)'
              : 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-2)',
            boxShadow: isPro
              ? '0 8px 32px rgba(217, 119, 6, 0.4)'
              : '0 8px 32px rgba(255, 107, 53, 0.4)',
          }}
        >
          <Crown size={32} style={{ color: '#fff' }} />
        </div>

        <h1 className="t-title1" style={{ marginBottom: '4px' }}>
          Court<span style={{ color: 'var(--color-accent)' }}>IQ</span>{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #D97706, #FBBF24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pro
          </span>
        </h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)' }}>
          {isPro ? 'You\'re on the Pro plan' : 'Unlock your full potential'}
        </p>
      </div>

      {/* Current status badge */}
      {isPro && (
        <Card padding="md" style={{ marginBottom: 'var(--space-3)', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706, #FBBF24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star size={20} style={{ color: '#fff' }} fill="#fff" />
            </div>
            <div className="flex-1">
              <p className="t-body" style={{ fontWeight: 700, color: '#FBBF24' }}>Pro Member</p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>All features unlocked</p>
            </div>
            <Check size={20} style={{ color: 'var(--color-success)' }} />
          </div>
        </Card>
      )}

      {/* Pricing cards */}
      {!isPro && (
        <div style={{ marginBottom: 'var(--space-3)' }}>
          {/* Free plan */}
          <Card padding="md" style={{ marginBottom: 'var(--space-1)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
              <div>
                <h3 className="t-title3">Free</h3>
                <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Get started</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="t-stat-sm" style={{ color: 'var(--color-text)' }}>$0</span>
              </div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {PLANS.free.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2" style={{ padding: '4px 0' }}>
                  <Check size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                  <span className="t-body" style={{ color: 'var(--color-text-sec)' }}>{f}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Pro plan */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-card)',
              padding: '2px',
              background: 'linear-gradient(135deg, #D97706, #FBBF24, #D97706)',
            }}
          >
            {/* Most Popular badge */}
            <div
              style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #D97706, #FBBF24)',
                padding: '4px 16px',
                borderRadius: '20px',
                zIndex: 1,
              }}
            >
              <span className="t-caption" style={{ color: '#000', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Most Popular
              </span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-card)',
                borderRadius: 'calc(var(--radius-card) - 2px)',
                padding: 'var(--space-3)',
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)', marginTop: '8px' }}>
                <div>
                  <h3 className="t-title3" style={{ color: '#FBBF24' }}>Pro</h3>
                  <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Everything unlimited</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="t-stat-sm" style={{ color: '#FBBF24' }}>$4.99</span>
                  <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>/month</span>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: 'var(--space-3)' }}>
                {PLANS.pro.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2" style={{ padding: '5px 0' }}>
                    <Check size={14} style={{ color: '#FBBF24', flexShrink: 0 }} />
                    <span className="t-body" style={{ color: 'var(--color-text)' }}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={processing}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #D97706, #FBBF24)',
                  color: '#000',
                  fontSize: '17px',
                  fontWeight: 900,
                  fontFamily: 'inherit',
                  cursor: processing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 16px rgba(217, 119, 6, 0.4)',
                  letterSpacing: '-0.2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: processing ? 0.7 : 1,
                  transition: 'transform 0.2s ease, opacity 0.15s ease',
                }}
              >
                <Zap size={20} />
                {processing ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature showcase */}
      <h2 className="section-label" style={{ marginBottom: 'var(--space-2)', marginTop: 'var(--space-2)' }}>What You Get</h2>
      {PRO_FEATURES.map((feat, i) => (
        <Card key={i} padding="md" style={{ marginBottom: 'var(--space-1)' }}>
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: `${feat.color}18`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <feat.icon size={22} style={{ color: feat.color }} />
            </div>
            <div className="flex-1">
              <h3 className="t-body" style={{ fontWeight: 700 }}>{feat.title}</h3>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{feat.desc}</p>
            </div>
            {isPro ? (
              <Check size={16} style={{ color: 'var(--color-success)' }} />
            ) : (
              <Lock size={16} style={{ color: 'var(--color-text-sec)' }} />
            )}
          </div>
        </Card>
      ))}

      {/* Testimonials */}
      <h2 className="section-label" style={{ marginBottom: 'var(--space-2)', marginTop: 'var(--space-3)' }}>What Players Say</h2>
      {TESTIMONIALS.map((t, i) => (
        <Card key={i} padding="md" style={{ marginBottom: 'var(--space-1)' }}>
          <p className="t-body" style={{ color: 'var(--color-text)', fontStyle: 'italic', marginBottom: '8px' }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-tint)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="t-caption" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                {t.name.split(' ').map((w) => w[0]).join('')}
              </span>
            </div>
            <div>
              <p className="t-caption" style={{ color: 'var(--color-text)', fontWeight: 600 }}>{t.name}</p>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{t.role}</p>
            </div>
          </div>
        </Card>
      ))}

      {/* Manage subscription */}
      {isPro && (
        <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
          <button
            onClick={handleDowngrade}
            className="t-caption"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-sec)',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit',
            }}
          >
            Downgrade to Free
          </button>
        </div>
      )}
    </PageWrapper>
  )
}
