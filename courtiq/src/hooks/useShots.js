import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useShots(sessionDate) {
  const { user } = useAuth()
  const [shots, setShots] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchShots = useCallback(async () => {
    if (!user) return
    setLoading(true)

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

    const { data, error } = await query
    if (!error) setShots(data || [])
    setLoading(false)
  }, [user, sessionDate])

  useEffect(() => { fetchShots() }, [fetchShots])

  async function addShot(shot) {
    const { data, error } = await supabase
      .from('shot_logs')
      .insert({ ...shot, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setShots(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function deleteShot(id) {
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

  return { shots, stats, loading, addShot, deleteShot, refetch: fetchShots }
}
