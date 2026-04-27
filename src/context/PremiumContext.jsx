import { createContext, useContext, useState, useCallback } from 'react'

const STORAGE_KEY = 'courtiq_premium'

const FREE_LIMITS = {
  gamesPerMonth: 5,
  shotsSessionsPerMonth: 10,
  drillsPerMonth: 15,
  journalEntriesPerMonth: 10,
  quickGame: true, // Gametime is a core free feature
  practiceMode: false,
  advancedAnalytics: false,
  trainingPacks: false,
  exportData: false,
  radarChart: false,
  shareCards: false,
  customDrillTemplates: false,
  gameFilm: false, // Record video during Gametime (Pro)
  trendGraphs: false, // Last-10 trend line charts (Pro)
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
  gameFilm: true,
  trendGraphs: true,
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
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
    limits: PRO_LIMITS,
    features: [
      'Unlimited game logging',
      'Game Film — record video while you track stats',
      'Gametime live tracker',
      'Practice Mode with timers',
      'Advanced analytics & radar chart',
      'Last-10 trend graphs',
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

  const canAccess = useCallback((feature) => {
    return limits[feature] === true || limits[feature] === Infinity
  }, [limits])

  const getLimit = useCallback((feature) => {
    return limits[feature]
  }, [limits])

  // Check whether a monthly-counted feature has remaining quota. Returns
  // { ok, used, limit, remaining } — ok is true if Pro or under the limit.
  // Caller passes an array of items with a date-ish field; we count items
  // whose date falls in the current calendar month.
  const checkMonthlyQuota = useCallback((feature, items, dateField = 'session_date') => {
    const limit = limits[feature]
    if (limit === Infinity || limit === true) return { ok: true, used: 0, limit: Infinity, remaining: Infinity }
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const used = (items || []).filter(i => {
      const d = new Date(i?.[dateField] || i?.game_date || i?.created_at || 0)
      return d.getFullYear() === y && d.getMonth() === m
    }).length
    return { ok: used < limit, used, limit, remaining: Math.max(0, limit - used) }
  }, [limits])

  return (
    <PremiumContext.Provider value={{ plan, isPro, currentPlan, limits, upgrade, downgrade, canAccess, getLimit, checkMonthlyQuota }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider')
  return ctx
}
