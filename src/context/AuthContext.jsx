import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const AuthContext = createContext(null)

const USERS_KEY = 'courtiq_users'
const ACTIVE_USER_KEY = 'courtiq_active_user'

/* ---------- localStorage user management ---------- */

function getStoredUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') } catch { return {} }
}

function saveStoredUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)) } catch { /* noop */ }
}

function getActiveUserId() {
  try { return localStorage.getItem(ACTIVE_USER_KEY) || null } catch { return null }
}

function setActiveUserId(id) {
  try {
    if (id) localStorage.setItem(ACTIVE_USER_KEY, id)
    else localStorage.removeItem(ACTIVE_USER_KEY)
  } catch { /* noop */ }
}

function createLocalUser(email, password, metadata = {}) {
  const users = getStoredUsers()
  if (users[email]) throw new Error('An account with this email already exists.')
  const id = crypto.randomUUID ? crypto.randomUUID() : `user-${Date.now()}`
  const user = {
    id,
    email,
    password,
    created_at: new Date().toISOString(),
  }
  const profile = {
    id,
    email,
    full_name: metadata.full_name || '',
    position: metadata.position || '',
    skill_level: metadata.skill_level || 'Beginner',
    onboarding_completed: false,
    date_of_birth: metadata.date_of_birth || '',
    xp: 0,
    level: 1,
    streak_count: 0,
    created_at: user.created_at,
    notification_preferences: { streak_reminder: true, weekly_summary: true },
  }
  users[email] = { user, profile }
  saveStoredUsers(users)
  return { user, profile }
}

function loginLocalUser(email, password) {
  const users = getStoredUsers()
  const entry = users[email]
  if (!entry) throw new Error('No account found with this email.')
  if (entry.user.password !== password) throw new Error('Incorrect password.')
  return { user: entry.user, profile: entry.profile }
}

function updateLocalProfile(email, updates) {
  const users = getStoredUsers()
  const entry = users[email]
  if (!entry) return null
  entry.profile = { ...entry.profile, ...updates }
  saveStoredUsers(users)
  return entry.profile
}

function getLocalProfile(email) {
  const users = getStoredUsers()
  return users[email]?.profile || null
}

function getLocalUserByEmail(email) {
  const users = getStoredUsers()
  return users[email] || null
}

function findUserById(id) {
  const users = getStoredUsers()
  for (const entry of Object.values(users)) {
    if (entry.user.id === id) return entry
  }
  return null
}

/* ---------- Provider ---------- */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(!BYPASS_AUTH)
  const [profile, setProfile] = useState(null)

  // On mount: restore active session from localStorage (bypass mode)
  useEffect(() => {
    if (BYPASS_AUTH) {
      const activeId = getActiveUserId()
      if (activeId) {
        const entry = findUserById(activeId)
        if (entry) {
          setUser(entry.user)
          setSession({ user: entry.user })
          setProfile(entry.profile)
          setLoading(false)
          return
        }
      }
      // No active user — auto-provision a dev account so the login screen
      // is skipped entirely in BYPASS_AUTH mode. This is strictly a dev
      // shortcut and runs only when no real user is signed in.
      const devEmail = 'dev@courtiq.local'
      let entry = getLocalUserByEmail(devEmail)
      if (!entry) {
        const { user: devUser, profile: devProfile } = createLocalUser(devEmail, 'devpass', {
          full_name: 'Dev Player',
          position: 'Guard',
          skill_level: 'Intermediate',
        })
        entry = { user: devUser, profile: { ...devProfile, onboarding_completed: true } }
        // Persist the onboarding-completed flag so we skip the onboarding flow.
        updateLocalProfile(devEmail, { onboarding_completed: true })
      }
      setUser(entry.user)
      setSession({ user: entry.user })
      setProfile(entry.profile)
      setActiveUserId(entry.user.id)
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) fetchProfile(currentSession.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) await fetchProfile(newSession.user.id)
        else setProfile(null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet — create it
        const { data: authData } = await supabase.auth.getUser()
        const { data: newProfile, error: insertErr } = await supabase
          .from('profiles')
          .upsert({ id: userId, email: authData?.user?.email || '' }, { onConflict: 'id' })
          .select()
          .single()
        if (insertErr) { setProfile(null); return null }
        setProfile(newProfile)
        return newProfile
      }
      if (error) throw error
      setProfile(data)
      return data
    } catch {
      setProfile(null)
      return null
    }
  }

  async function signUp(email, password, metadata = {}) {
    if (BYPASS_AUTH) {
      const { user: newUser, profile: newProfile } = createLocalUser(email, password, metadata)
      setUser(newUser)
      setSession({ user: newUser })
      setProfile(newProfile)
      setActiveUserId(newUser.id)
      return { user: newUser }
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    if (error) throw error
    // If we got a session (auto-confirmed), create profile now
    if (data?.session && data?.user) {
      await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email,
          date_of_birth: metadata.date_of_birth || null,
        }, { onConflict: 'id' })
    }
    return data
  }

  async function signInWithGoogle() {
    if (BYPASS_AUTH) throw new Error('Google sign-in is not available in demo mode.')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) throw error
    return data
  }

  async function signInWithApple() {
    if (BYPASS_AUTH) throw new Error('Apple sign-in is not available in demo mode.')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    if (BYPASS_AUTH) {
      const { user: loggedIn, profile: loggedInProfile } = loginLocalUser(email, password)
      setUser(loggedIn)
      setSession({ user: loggedIn })
      setProfile(loggedInProfile)
      setActiveUserId(loggedIn.id)
      return { user: loggedIn }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (BYPASS_AUTH) {
      setUser(null)
      setSession(null)
      setProfile(null)
      setActiveUserId(null)
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
      const email = user?.email
      if (email) {
        const updated = updateLocalProfile(email, updates)
        if (updated) setProfile(updated)
        return updated
      }
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

  async function deleteAccount() {
    if (BYPASS_AUTH) {
      const email = user?.email
      if (email) {
        const users = getStoredUsers()
        delete users[email]
        saveStoredUsers(users)
      }
      setUser(null)
      setSession(null)
      setProfile(null)
      setActiveUserId(null)
      return
    }
    await signOut()
  }

  const value = {
    user,
    session,
    loading,
    profile,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithApple,
    signOut,
    updateProfile,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
