import { createContext, useContext, useCallback } from 'react'

export const PLANS = {
  free: { id: 'free', name: 'Free', limits: {}, features: [] },
  pro: { id: 'pro', name: 'Pro', limits: {}, features: [] },
}

const PremiumContext = createContext(null)

export function PremiumProvider({ children }) {
  const value = {
    plan: 'pro',
    isPro: true,
    currentPlan: PLANS.pro,
    limits: {},
    upgrade: useCallback(() => {}, []),
    downgrade: useCallback(() => {}, []),
    canAccess: useCallback(() => true, []),
    getLimit: useCallback(() => Infinity, []),
    checkMonthlyQuota: useCallback(() => ({ ok: true, used: 0, limit: Infinity, remaining: Infinity }), []),
  }

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider')
  return ctx
}
