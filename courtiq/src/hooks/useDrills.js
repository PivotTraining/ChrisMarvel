import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { updateStreak } from '../lib/streaks'
import { isDemoMode, demoDrills } from '../lib/demoData'
import { trackEvent } from '../lib/monitoring'

export function useDrills() {
  const { user, refreshProfile } = useAuth()
  const [sessions, setSessions] = useState(isDemoMode() ? demoDrills : [])
  const [loading, setLoading] = useState(!isDemoMode())
  const [error, setError] = useState(null)

  const fetchSessions = useCallback(async () => {
    if (isDemoMode() || !user || !supabase) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('drill_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(50)

    if (fetchError) {
      console.error('Failed to fetch drills:', fetchError.message)
      setError(fetchError.message)
    } else {
      setSessions(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { if (!isDemoMode()) fetchSessions() }, [fetchSessions])

  async function addDrillSession(session) {
    if (isDemoMode()) {
      const newSession = { ...session, id: `demo-drill-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setSessions(prev => [newSession, ...prev])
      return { data: newSession, error: null }
    }
    const { data, error } = await supabase
      .from('drill_sessions')
      .insert({ ...session, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setSessions(prev => [data, ...prev])
      updateStreak(user.id).then(() => refreshProfile())
      trackEvent('drill_logged')
    }
    return { data, error }
  }

  async function updateDrillSession(id, updates) {
    if (isDemoMode()) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
      return { data: { id, ...updates }, error: null }
    }
    const { data, error } = await supabase
      .from('drill_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setSessions(prev => prev.map(s => s.id === id ? data : s))
    }
    return { data, error }
  }

  async function deleteDrillSession(id) {
    if (isDemoMode()) {
      setSessions(prev => prev.filter(s => s.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('drill_sessions')
      .delete()
      .eq('id', id)

    if (!error) {
      setSessions(prev => prev.filter(s => s.id !== id))
    }
    return { error }
  }

  return { sessions, loading, error, addDrillSession, updateDrillSession, deleteDrillSession, refetch: fetchSessions }
}
