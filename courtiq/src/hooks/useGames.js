import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { updateStreak } from '../lib/streaks'
import { DEMO_MODE, demoGames } from '../lib/demoData'

export function useGames() {
  const { user, refreshProfile } = useAuth()
  const [games, setGames] = useState(DEMO_MODE ? demoGames : [])
  const [loading, setLoading] = useState(!DEMO_MODE)

  const fetchGames = useCallback(async () => {
    if (DEMO_MODE || !user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .order('game_date', { ascending: false })
      .limit(50)

    if (!error) setGames(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { if (!DEMO_MODE) fetchGames() }, [fetchGames])

  async function addGame(game) {
    const { data, error } = await supabase
      .from('games')
      .insert({ ...game, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setGames(prev => [data, ...prev])
      updateStreak(user.id).then(() => refreshProfile())
    }
    return { data, error }
  }

  async function updateGame(id, updates) {
    const { data, error } = await supabase
      .from('games')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setGames(prev => prev.map(g => g.id === id ? data : g))
    }
    return { data, error }
  }

  async function deleteGame(id) {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)

    if (!error) {
      setGames(prev => prev.filter(g => g.id !== id))
    }
    return { error }
  }

  return { games, loading, addGame, updateGame, deleteGame, refetch: fetchGames }
}
