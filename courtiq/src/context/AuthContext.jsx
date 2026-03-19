import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEMO_PROFILE } from '../lib/demoData';

const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  demoMode: false,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  enterDemoMode: () => {},
  exitDemoMode: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    let subscription;

    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          fetchProfile(currentSession.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        // Supabase unavailable (no credentials) — fall through to login/demo
        setLoading(false);
      });

    try {
      const result = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      });
      subscription = result.data.subscription;
    } catch {
      // Supabase unavailable — ignore
    }

    return () => subscription?.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      setProfile(data ?? null);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    if (demoMode) {
      exitDemoMode();
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  async function updateProfile(updates) {
    if (demoMode) {
      const updated = { ...profile, ...updates };
      setProfile(updated);
      return updated;
    }

    if (!user) throw new Error('No authenticated user.');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  }

  function enterDemoMode() {
    const demoUser = {
      id: DEMO_PROFILE.id,
      email: DEMO_PROFILE.email,
      user_metadata: { full_name: DEMO_PROFILE.full_name },
    };
    setDemoMode(true);
    setUser(demoUser);
    setSession({ user: demoUser });
    setProfile(DEMO_PROFILE);
    setLoading(false);
  }

  function exitDemoMode() {
    setDemoMode(false);
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        demoMode,
        signUp,
        signIn,
        signOut,
        updateProfile,
        enterDemoMode,
        exitDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
