import { useNavigate } from 'react-router-dom'
import { Crown, Lock } from 'lucide-react'
import { useSubscription } from '../hooks/useSubscription'
import { DEMO_MODE } from '../lib/demoData'

/**
 * Wraps Pro-only (or Team-only) features.
 * If the user's tier is insufficient, shows an upgrade prompt instead of children.
 *
 * Usage:
 *   <SubscriptionGate requiredTier="pro">
 *     <AdvancedAnalytics />
 *   </SubscriptionGate>
 */
export default function SubscriptionGate({
  children,
  requiredTier = 'pro',
  fallback = null,
  inline = false,
}) {
  const { hasAccess } = useSubscription()
  const navigate = useNavigate()

  // In demo mode or if user has access, render children
  if (DEMO_MODE || hasAccess(requiredTier)) {
    return <>{children}</>
  }

  // Custom fallback
  if (fallback) return <>{fallback}</>

  const tierLabel = requiredTier === 'team' ? 'Team' : 'Pro'

  // Inline variant (small badge-like prompt)
  if (inline) {
    return (
      <button
        onClick={() => navigate('/pricing')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
      >
        <Crown size={12} />
        {tierLabel} Feature
      </button>
    )
  }

  // Full block variant
  return (
    <div className="rounded-2xl bg-bg-card border border-border p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3">
        <Lock size={22} className="text-gold" />
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1">
        {tierLabel} Feature
      </h3>
      <p className="text-xs text-text-muted mb-4 max-w-xs mx-auto">
        Upgrade to the {tierLabel} plan to unlock this feature and take your game to the next level.
      </p>
      <button
        onClick={() => navigate('/pricing')}
        className="px-5 py-2.5 rounded-xl bg-blue hover:bg-blue-dark text-white text-xs font-semibold transition-colors"
      >
        View Plans
      </button>
    </div>
  )
}
