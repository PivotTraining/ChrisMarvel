import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { updateStreak } from '../lib/streaks'

export function useDrills() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSessions = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('drill_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('session_date', { ascending: false })
      .limit(50)

    if (!error) setSessions(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchSessions() }, [fetchSessions])

  async function addDrillSession(session) {
    const { data, error } = await supabase
      .from('drill_sessions')
      .insert({ ...session, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setSessions(prev => [data, ...prev])
      updateStreak(user.id)
    }
    return { data, error }
  }

  async function updateDrillSession(id, updates) {
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
    const { error } = await supabase
      .from('drill_sessions')
      .delete()
      .eq('id', id)

    if (!error) {
      setSessions(prev => prev.filter(s => s.id !== id))
    }
    return { error }
  }

  return { sessions, loading, addDrillSession, updateDrillSession, deleteDrillSession, refetch: fetchSessions }
}
