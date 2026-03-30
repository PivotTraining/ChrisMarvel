import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 'demo-user-001',
  email: 'demo@courtiq.app',
}

const DEMO_PROFILE = {
  id: 'demo-user-001',
  full_name: 'Demo Player',
  position: 'SG',
  skill_level: 'Intermediate',
  onboarding_completed: true,
  date_of_birth: '2005-06-15',
  xp: 450,
  level: 3,
  streak_count: 5,
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(!BYPASS_AUTH)
  const [profile, setProfile] = useState(null)

  async function fetchProfile(userId) {
    if (BYPASS_AUTH) return DEMO_PROFILE
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
      return data
    } catch (err) {
      setProfile(null)
      return null
    }
  }

  useEffect(() => {
    if (BYPASS_AUTH) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) {
          await fetchProfile(newSession.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password, metadata = {}) {
    if (BYPASS_AUTH) {
      setUser(DEMO_USER)
      setProfile(DEMO_PROFILE)
      return { user: DEMO_USER }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (BYPASS_AUTH) {
      setUser(DEMO_USER)
      setProfile(DEMO_PROFILE)
      return { user: DEMO_USER }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  function demoSignIn() {
    setUser(DEMO_USER)
    setSession({ user: DEMO_USER })
    setProfile(DEMO_PROFILE)
    return { user: DEMO_USER }
  }

  async function signOut() {
    if (BYPASS_AUTH) {
      setUser(null)
      setSession(null)
      setProfile(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  async function updateProfile(updates) {
    if (BYPASS_AUTH) {
      const updated = { ...profile, ...updates }
      setProfile(updated)
      return updated
    }
    if (!user) throw new Error('No authenticated user')
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...updates }, { onConflict: 'id' })
      .select()
      .single()
    if (error) throw error
    setProfile(data)
    return data
  }

  const value = {
    user,
    session,
    loading,
    profile,
    signUp,
    signIn,
    signOut,
    demoSignIn,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
