import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.10.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

// Map Stripe price IDs to subscription tiers
const PRICE_TO_TIER: Record<string, string> = {
  'price_pro_monthly': 'pro',
  'price_pro_annual': 'pro',
  'price_team_monthly': 'team',
  'price_team_annual': 'team',
}

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

  // Use service role key for admin-level updates
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log(`Processing webhook event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.subscription
          ? (await stripe.subscriptions.retrieve(session.subscription as string)).metadata.supabase_user_id
          : session.metadata?.supabase_user_id

        if (!userId) {
          // Try to find user by customer ID
          const customerId = session.customer as string
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single()

          if (!profile) {
            console.error('Could not find user for checkout session')
            break
          }

          // Retrieve subscription to get price ID and period end
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
            const priceId = subscription.items.data[0]?.price.id
            const tier = PRICE_TO_TIER[priceId] || 'pro'
            const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

            await supabaseAdmin
              .from('profiles')
              .update({
                subscription_tier: tier,
                subscription_expires_at: expiresAt,
              })
              .eq('id', profile.id)
          }
          break
        }

        // We have the userId from metadata
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          const priceId = subscription.items.data[0]?.price.id
          const tier = PRICE_TO_TIER[priceId] || 'pro'
          const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: expiresAt,
            })
            .eq('id', userId)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id
        const priceId = subscription.items.data[0]?.price.id
        const tier = PRICE_TO_TIER[priceId] || 'pro'
        const expiresAt = new Date(subscription.current_period_end * 1000).toISOString()

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: expiresAt,
            })
            .eq('id', userId)
        } else {
          // Fallback: find user by customer ID
          const customerId = subscription.customer as string
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: tier,
              subscription_expires_at: expiresAt,
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (userId) {
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_expires_at: null,
            })
            .eq('id', userId)
        } else {
          // Fallback: find user by customer ID
          const customerId = subscription.customer as string
          await supabaseAdmin
            .from('profiles')
            .update({
              subscription_tier: 'free',
              subscription_expires_at: null,
            })
            .eq('stripe_customer_id', customerId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  } catch (err) {
    console.error(`Error processing ${event.type}:`, err)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
