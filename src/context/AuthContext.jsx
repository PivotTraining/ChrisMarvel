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

    // If the URL contains an OAuth callback code/token, we're in the
    // middle of a sign-in redirect and must NOT prematurely decide the
    // user is unauthenticated. Supabase's detectSessionInUrl will
    // process the code asynchronously and fire onAuthStateChange once
    // done. Staying in loading state keeps App.jsx on the spinner
    // instead of redirecting to /login (which would strip the ?code=
    // from the URL before exchange completes).
    const urlHasOAuthCode =
      typeof window !== 'undefined' &&
      (window.location.search.includes('code=') ||
        window.location.search.includes('error=') ||
        window.location.hash.includes('access_token='))

    if (urlHasOAuthCode) {
      // eslint-disable-next-line no-console
      console.info('[Auth] OAuth callback detected in URL — waiting for session exchange to complete.')
      // Keep loading=true; onAuthStateChange will fire SIGNED_IN and
      // flip loading=false when the exchange finishes. Fallback after
      // 15s so the UI can never deadlock.
      setTimeout(() => {
        setLoading((prev) => {
          if (prev) {
            // eslint-disable-next-line no-console
            console.warn('[Auth] OAuth exchange timed out after 15s — falling back to login.')
          }
          return false
        })
      }, 15000)
      const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          setSession(newSession)
          setUser(newSession.user)
          await fetchProfile(newSession.user.id)
          setLoading(false)
          // Clean the URL so refreshes don't retry the exchange
          if (typeof window !== 'undefined' && window.history?.replaceState) {
            window.history.replaceState({}, '', window.location.pathname)
          }
        }
      })
      return () => sub.unsubscribe()
    }

    // Race supabase.auth.getSession() against a hard 10-second timeout
    // so the loading screen can never deadlock. IMPORTANT: on timeout we
    // do NOT delete the sb-* tokens — that was the old bug that caused
    // users to have to sign in over and over again every time their
    // network was slow. The tokens are valid and persist across launches;
    // onAuthStateChange will fire a SIGNED_IN event as soon as
    // getSession() actually resolves in the background. We just unblock
    // the UI optimistically so the app is usable immediately.
    const sessionPromise = supabase.auth.getSession()
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ data: { session: null }, __timedOut: true }), 10000)
    })
    Promise.race([sessionPromise, timeoutPromise]).then((result) => {
      if (result?.__timedOut) {
        // eslint-disable-next-line no-console
        console.warn('[CourtIQ] getSession() slow — unblocking UI; tokens remain in storage and onAuthStateChange will restore the session when the network recovers.')
        // Do NOT clear tokens. Show login optimistically; if the real
        // session resolves, onAuthStateChange will take over and the
        // user will be signed in automatically without any further input.
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)

        // Let the actual getSession call finish in the background — if
        // it returns a valid session, onAuthStateChange fires and the
        // user is transparently signed back in.
        sessionPromise.then((late) => {
          const lateSession = late?.data?.session ?? null
          if (lateSession) {
            setSession(lateSession)
            setUser(lateSession.user ?? null)
            if (lateSession.user) fetchProfile(lateSession.user.id)
          }
        }).catch(() => { /* noop */ })
        return
      }
      const currentSession = result?.data?.session ?? null
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) fetchProfile(currentSession.user.id)
      setLoading(false)
    }).catch(() => {
      // getSession() rejected outright — treat as unauthed but keep
      // tokens intact so the next open has a chance to restore them.
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] supabase.auth.getSession() rejected — showing login (tokens preserved).')
      setSession(null)
      setUser(null)
      setProfile(null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)
        if (newSession?.user) await fetchProfile(newSession.user.id)
        else setProfile(null)
        setLoading(false)

        // Persist the Google provider_token so we can use it to call
        // Google Calendar API later. Supabase only exposes this on the
        // initial SIGNED_IN event after OAuth — it's NOT in the session
        // object on subsequent page loads. Without this persistence,
        // calendar sync would only work for ~1 session then stop.
        if (_event === 'SIGNED_IN' && newSession?.provider_token) {
          try {
            localStorage.setItem('courtiq_google_provider_token', newSession.provider_token)
            if (newSession.provider_refresh_token) {
              localStorage.setItem('courtiq_google_provider_refresh_token', newSession.provider_refresh_token)
            }
            // eslint-disable-next-line no-console
            console.info('[Auth] Stored Google provider_token for Calendar API access')
          } catch { /* noop */ }
        }
        if (_event === 'SIGNED_OUT') {
          try {
            localStorage.removeItem('courtiq_google_provider_token')
            localStorage.removeItem('courtiq_google_provider_refresh_token')
          } catch { /* noop */ }
        }

        // Close the in-app browser once OAuth completes on native
        if (_event === 'SIGNED_IN' && typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
          try { const { Browser } = await import('@capacitor/browser'); await Browser.close() } catch { /* noop */ }
        }
      }
    )

    // Handle the deep-link callback from OAuth on native iOS.
    // Supabase can return tokens in two formats:
    //   1. PKCE flow (preferred):  ?code=XXX → exchangeCodeForSession(url)
    //   2. Implicit flow:          #access_token=XXX&refresh_token=YYY → setSession()
    // The old code only handled #1 which is why Google/Apple silently failed on
    // device — the tokens were arriving in the hash fragment and being ignored.
    if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
      import('@capacitor/app').then(({ App }) => {
        App.addListener('appUrlOpen', async ({ url }) => {
          // Only react to our own OAuth callback URLs
          if (!url.includes('login-callback') && !url.includes('access_token') && !url.includes('code=')) {
            return
          }
          // eslint-disable-next-line no-console
          console.info('[Auth] OAuth callback URL received:', url.substring(0, 120))

          try {
            // Close the in-app browser immediately so the user sees the app again
            try { const { Browser } = await import('@capacitor/browser'); await Browser.close() } catch { /* noop */ }

            // Implicit flow: tokens are in the fragment (#) — parse and setSession
            const hashIdx = url.indexOf('#')
            if (hashIdx >= 0) {
              const hash = url.substring(hashIdx + 1)
              const params = new URLSearchParams(hash)
              const access_token = params.get('access_token')
              const refresh_token = params.get('refresh_token')
              if (access_token && refresh_token) {
                const { error } = await supabase.auth.setSession({ access_token, refresh_token })
                if (error) {
                  // eslint-disable-next-line no-console
                  console.error('[Auth] setSession failed:', error.message)
                } else {
                  // eslint-disable-next-line no-console
                  console.info('[Auth] Signed in via implicit flow')
                }
                return
              }
            }

            // PKCE flow: code is in the query — exchange it for a session
            if (url.includes('code=')) {
              const { error } = await supabase.auth.exchangeCodeForSession(url)
              if (error) {
                // eslint-disable-next-line no-console
                console.error('[Auth] exchangeCodeForSession failed:', error.message)
              } else {
                // eslint-disable-next-line no-console
                console.info('[Auth] Signed in via PKCE flow')
              }
              return
            }

            // eslint-disable-next-line no-console
            console.warn('[Auth] Callback URL had neither access_token nor code:', url.substring(0, 200))
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('[Auth] appUrlOpen handler threw:', e?.message || e)
          }
        })
      }).catch(() => {})
    }

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
    } else if (data?.user && !data?.session) {
      // No session — email confirmation may be on. Try signing in directly
      // in case the user was auto-confirmed server-side.
      try {
        const { data: signInData } = await supabase.auth.signInWithPassword({ email, password })
        if (signInData?.session) {
          return signInData
        }
      } catch { /* fall through — caller handles the no-session case */ }
    }
    return data
  }

  function isNative() {
    return typeof window !== 'undefined' && !!window.Capacitor?.isNativePlatform?.()
  }

  async function oauthRedirectTo() {
    // On native iOS use the registered URL scheme so the OS routes the
    // callback back to this app. On web use the current origin.
    return isNative() ? 'com.courtiq.app://login-callback' : `${window.location.origin}/`
  }

  async function openOAuth(url) {
    if (isNative()) {
      try {
        const { Browser } = await import('@capacitor/browser')
        await Browser.open({
          url,
          windowName: '_self',
          presentationStyle: 'fullscreen',
          toolbarColor: '#000000',
        })
        return
      } catch { /* fall through to window.location */ }
    }
    window.location.href = url
  }

  async function signInWithGoogle() {
    if (BYPASS_AUTH) throw new Error('Google sign-in is not available in demo mode.')
    const redirectTo = await oauthRedirectTo()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: isNative(),
        // Request read-only calendar access so we can pull upcoming
        // games/practices from the user's Google Calendar into the
        // Home screen schedule card. The provider_token on the session
        // will carry this scope after the user consents.
        scopes: 'https://www.googleapis.com/auth/calendar.events.readonly',
      },
    })
    if (error) throw error
    if (isNative() && data?.url) await openOAuth(data.url)
    return data
  }

  async function signInWithApple() {
    if (BYPASS_AUTH) throw new Error('Apple sign-in is not available in demo mode.')
    const redirectTo = await oauthRedirectTo()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo, skipBrowserRedirect: isNative() },
    })
    if (error) throw error
    if (isNative() && data?.url) await openOAuth(data.url)
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
