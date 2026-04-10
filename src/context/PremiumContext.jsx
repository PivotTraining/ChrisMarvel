import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'courtiq_premium'

// Whitelist of local promo codes that unlock Pro instantly (for friends,
// family, beta testers, marketing campaigns). Real Stripe discounts are
// handled separately via allow_promotion_codes on the checkout session.
// Codes are compared case-insensitively.
const LOCAL_PROMO_CODES = [
  'COURTIQ100',
  'FRIENDS',
  'FAMILY',
  'BETA',
  'LAUNCH',
  'HOOPS',
]

const FREE_LIMITS = {
  gamesPerMonth: 5,
  shotsSessionsPerMonth: 10,
  drillsPerMonth: 15,
  journalEntriesPerMonth: 10,
  quickGame: true, // Quick Game is a core free feature
  practiceMode: false,
  advancedAnalytics: false,
  trainingPacks: false,
  exportData: false,
  radarChart: false,
  shareCards: false,
  customDrillTemplates: false,
}

const PRO_LIMITS = {
  gamesPerMonth: Infinity,
  shotsSessionsPerMonth: Infinity,
  drillsPerMonth: Infinity,
  journalEntriesPerMonth: Infinity,
  quickGame: true,
  practiceMode: true,
  advancedAnalytics: true,
  trainingPacks: true,
  exportData: true,
  radarChart: true,
  shareCards: true,
  customDrillTemplates: true,
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    limits: FREE_LIMITS,
    features: [
      '5 games per month',
      '10 shot sessions per month',
      'Basic game stats',
      'Journal entries',
      'Training content library',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '$4.99',
    period: '/month',
    limits: PRO_LIMITS,
    features: [
      'Unlimited game logging',
      'Quick Game live tracker',
      'Practice Mode with timers',
      'Advanced analytics & radar chart',
      'All training packs',
      'Share cards & data export',
      'Custom drill templates',
      'Priority support',
    ],
  },
}

const PremiumContext = createContext(null)

function getStoredPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.plan || 'free'
    }
  } catch { /* noop */ }
  return 'free'
}

function setStoredPlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, updatedAt: new Date().toISOString() }))
  } catch { /* noop */ }
}

export function PremiumProvider({ children }) {
  const [plan, setPlanState] = useState(getStoredPlan)

  const isPro = plan === 'pro'
  const currentPlan = isPro ? PLANS.pro : PLANS.free
  const limits = currentPlan.limits

  const setPlan = useCallback((newPlan) => {
    setPlanState(newPlan)
    setStoredPlan(newPlan)
  }, [])

  const upgrade = useCallback(() => {
    // In production this would open a payment flow
    // For now we toggle to pro
    setPlan('pro')
  }, [setPlan])

  const downgrade = useCallback(() => {
    setPlan('free')
  }, [setPlan])

  // Redeem a local promo code. Returns true if the code was valid and
  // Pro was unlocked; false otherwise. Case-insensitive.
  const redeemPromoCode = useCallback((code) => {
    if (!code) return false
    const normalized = code.trim().toUpperCase()
    if (LOCAL_PROMO_CODES.includes(normalized)) {
      setPlan('pro')
      return true
    }
    return false
  }, [setPlan])

  const canAccess = useCallback((feature) => {
    return limits[feature] === true || limits[feature] === Infinity
  }, [limits])

  const getLimit = useCallback((feature) => {
    return limits[feature]
  }, [limits])

  return (
    <PremiumContext.Provider value={{ plan, isPro, currentPlan, limits, upgrade, downgrade, redeemPromoCode, canAccess, getLimit }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider')
  return ctx
}
