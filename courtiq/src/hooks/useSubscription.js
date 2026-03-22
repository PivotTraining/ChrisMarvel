import { useState, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { isDemoMode } from '../lib/demoData'
import { getStripe, STRIPE_CONFIGURED, PRICE_IDS } from '../lib/stripe'

const TIER_HIERARCHY = { free: 0, pro: 1, team: 2 }

export function useSubscription() {
  const { profile, user, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tier = profile?.subscription_tier || 'free'
  const stripeCustomerId = profile?.stripe_customer_id || null
  const expiresAt = profile?.subscription_expires_at || null
  const isActive = tier !== 'free' && (!expiresAt || new Date(expiresAt) > new Date())
  const isPro = TIER_HIERARCHY[tier] >= TIER_HIERARCHY.pro && isActive
  const isTeam = tier === 'team' && isActive

  /**
   * Check if the user has access to a given tier level
   */
  const hasAccess = useCallback((requiredTier) => {
    if (isDemoMode()) return true // In demo mode, everything is unlocked
    const required = TIER_HIERARCHY[requiredTier] ?? 0
    const current = TIER_HIERARCHY[tier] ?? 0
    return current >= required && (tier === 'free' || isActive)
  }, [tier, isActive])

  /**
   * Redirect to Stripe Checkout for a given plan
   */
  const checkout = useCallback(async (plan, annual = false) => {
    setError(null)

    if (isDemoMode() || !STRIPE_CONFIGURED) {
      setError('Payments are not available in demo mode. Configure Stripe to enable subscriptions.')
      return
    }

    if (!user) {
      setError('You must be signed in to subscribe.')
      return
    }

    setLoading(true)

    try {
      const priceId = annual
        ? PRICE_IDS[`${plan}_annual`]
        : PRICE_IDS[`${plan}_monthly`]

      // Call the Supabase Edge Function to create a checkout session
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: {
            priceId,
            successUrl: `${window.location.origin}/profile?subscription=success`,
            cancelUrl: `${window.location.origin}/pricing`,
          },
        }
      )

      if (fnError) throw fnError
      if (!data?.sessionId) throw new Error('No session ID returned')

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (!stripe) throw new Error('Stripe failed to load')

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (stripeError) throw stripeError
    } catch (err) {
      console.error('Checkout error:', err)
      setError(err.message || 'Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user])

  /**
   * Open the Stripe Customer Portal for billing management
   */
  const manageBilling = useCallback(async () => {
    setError(null)

    if (isDemoMode() || !STRIPE_CONFIGURED) {
      setError('Billing management is not available in demo mode.')
      return
    }

    if (!user) {
      setError('You must be signed in to manage billing.')
      return
    }

    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-portal-session',
        {
          body: {
            returnUrl: `${window.location.origin}/profile`,
          },
        }
      )

      if (fnError) throw fnError
      if (!data?.url) throw new Error('No portal URL returned')

      window.location.href = data.url
    } catch (err) {
      console.error('Billing portal error:', err)
      setError(err.message || 'Failed to open billing portal. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user])

  return {
    tier,
    isPro,
    isTeam,
    isActive,
    stripeCustomerId,
    expiresAt,
    hasAccess,
    checkout,
    manageBilling,
    loading,
    error,
    stripeConfigured: STRIPE_CONFIGURED,
  }
}
