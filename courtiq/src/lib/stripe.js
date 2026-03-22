import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Only initialize Stripe if a real key is configured
const isConfigured = stripePublishableKey &&
  !stripePublishableKey.includes('placeholder') &&
  stripePublishableKey.startsWith('pk_')

let stripePromise = null

export function getStripe() {
  if (!isConfigured) return null
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

export const STRIPE_CONFIGURED = isConfigured

export const PRICE_IDS = {
  pro_monthly: 'price_pro_monthly',
  pro_annual: 'price_pro_annual',
  team_monthly: 'price_team_monthly',
  team_annual: 'price_team_annual',
}
