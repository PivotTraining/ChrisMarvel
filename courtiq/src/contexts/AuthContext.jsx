import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { isDemoMode, setDemoMode, demoProfile } from '../lib/demoData'
import { trackEvent } from '../lib/monitoring'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode()) {
      setSession({ user: { id: demoProfile.id, email: demoProfile.email } })
      setProfile(demoProfile)
      setLoading(false)
      return
    }

    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setProfile(data)
    }
    setLoading(false)
  }

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error) trackEvent('user_signup')
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) trackEvent('user_login')
    return { data, error }
  }

  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  async function signInWithGoogle() {
    if (!supabase) return { error: { message: 'Auth not available in demo mode' } }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/ChrisMarvel/',
      },
    })
    return { data, error }
  }

  function enterDemoMode() {
    setDemoMode(true)
    setSession({ user: { id: demoProfile.id, email: demoProfile.email } })
    setProfile(demoProfile)
    trackEvent('demo_mode_entered')
  }

  async function signOut() {
    trackEvent('user_logout')
    if (isDemoMode() || session?.user?.id === demoProfile.id) {
      setDemoMode(false)
      setSession(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  async function updateProfile(updates) {
    if (!session?.user) return { error: { message: 'Not authenticated' } }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  // Subscription convenience fields derived from profile
  const subscriptionTier = profile?.subscription_tier || 'free'
  const subscriptionActive = subscriptionTier !== 'free' &&
    (!profile?.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date())

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    enterDemoMode,
    resetPassword,
    updateProfile,
    refreshProfile: () => session?.user && fetchProfile(session.user.id),
    subscriptionTier,
    subscriptionActive,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
