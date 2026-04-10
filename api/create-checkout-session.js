import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validate required env vars up front so misconfiguration is obvious.
  const missing = []
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY')
  if (!process.env.STRIPE_PRICE_ID) missing.push('STRIPE_PRICE_ID')
  if (missing.length) {
    return res.status(500).json({
      error: `Stripe not configured. Missing env var(s) on server: ${missing.join(', ')}. Set them in the Vercel project settings and redeploy.`,
    })
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      return_url: `${req.headers.origin}/premium?success=true`,
    })

    res.status(200).json({ clientSecret: session.client_secret })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
