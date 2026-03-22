import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE, demoShots } from '../lib/demoData'
import { trackEvent } from '../lib/monitoring'

export function useShots(sessionDate) {
  const { user } = useAuth()
  const [shots, setShots] = useState(DEMO_MODE ? demoShots : [])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchShots = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) return
    setLoading(true)
    setError(null)

    let query = supabase
      .from('shot_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (sessionDate) {
      query = query.eq('session_date', sessionDate)
    } else {
      query = query.limit(200)
    }

    const { data, error: fetchError } = await query
    if (fetchError) {
      console.error('Failed to fetch shots:', fetchError.message)
      setError(fetchError.message)
    } else {
      setShots(data || [])
    }
    setLoading(false)
  }, [user, sessionDate])

  useEffect(() => { if (!DEMO_MODE) fetchShots() }, [fetchShots])

  async function addShot(shot) {
    if (DEMO_MODE) {
      const newShot = { ...shot, id: `demo-shot-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setShots(prev => [newShot, ...prev])
      return { data: newShot, error: null }
    }
    const { data, error } = await supabase
      .from('shot_logs')
      .insert({ ...shot, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setShots(prev => [data, ...prev])
      trackEvent('shot_session_logged')
    }
    return { data, error }
  }

  async function deleteShot(id) {
    if (DEMO_MODE) {
      setShots(prev => prev.filter(s => s.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('shot_logs')
      .delete()
      .eq('id', id)

    if (!error) {
      setShots(prev => prev.filter(s => s.id !== id))
    }
    return { error }
  }

  const stats = {
    total: shots.length,
    made: shots.filter(s => s.made).length,
    missed: shots.filter(s => !s.made).length,
    percentage: shots.length > 0
      ? Math.round((shots.filter(s => s.made).length / shots.length) * 100)
      : 0,
  }

  return { shots, stats, loading, error, addShot, deleteShot, refetch: fetchShots }
}
