import { createClient } from '@supabase/supabase-js'

// Hardcoded production fallbacks so the app always works even if the Vercel
// env vars get misconfigured. The anon key is designed to be public (RLS is
// what protects the data) and is already hardcoded the same way in
// ios/App/ci_scripts/ci_post_clone.sh for the native build.
const FALLBACK_SUPABASE_URL = 'https://tkjvkvrzlvbukxbsilvw.supabase.co'
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRranZrdnJ6bHZidWt4YnNpbHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjIyMzQsImV4cCI6MjA5MTQ5ODIzNH0.ebLBIuzir8oVH_tLKqW7VV_RTQEbwT1LpfMe6vsc4VQ'

// Use env vars if they look valid, otherwise fall back. A valid anon key
// starts with either `eyJ` (legacy JWT) or `sb_publishable_` (modern).
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const isValidKey = (k) => typeof k === 'string' && (k.startsWith('eyJ') || k.startsWith('sb_publishable_'))

const supabaseUrl = envUrl && envUrl.includes('.supabase.co') ? envUrl : FALLBACK_SUPABASE_URL
const supabaseAnonKey = isValidKey(envKey) ? envKey : FALLBACK_SUPABASE_ANON_KEY

if (import.meta.env.DEV || typeof window !== 'undefined') {
  // One-line startup log so we can verify in browser console which key source
  // is active without leaking the full key.
  const src = isValidKey(envKey) ? 'env' : 'fallback'
  const keyPrefix = supabaseAnonKey.slice(0, 12)
  // eslint-disable-next-line no-console
  console.info(`[CourtIQ] Supabase key source: ${src} (${keyPrefix}…)`)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Always run against real Supabase in production. BYPASS_AUTH is only for
// local dev when the developer explicitly opts in.
export const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true'
