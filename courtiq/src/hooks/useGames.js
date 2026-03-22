import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { updateStreak } from '../lib/streaks'
import { DEMO_MODE, demoGames } from '../lib/demoData'

export function useGames() {
  const { user, refreshProfile } = useAuth()
  const [games, setGames] = useState(DEMO_MODE ? demoGames : [])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchGames = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', user.id)
      .order('game_date', { ascending: false })
      .limit(50)

    if (fetchError) {
      console.error('Failed to fetch games:', fetchError.message)
      setError(fetchError.message)
    } else {
      setGames(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { if (!DEMO_MODE) fetchGames() }, [fetchGames])

  async function addGame(game) {
    if (DEMO_MODE) {
      const newGame = { ...game, id: `demo-game-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setGames(prev => [newGame, ...prev])
      return { data: newGame, error: null }
    }
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
    if (DEMO_MODE) {
      setGames(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
      return { data: { id, ...updates }, error: null }
    }
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
    if (DEMO_MODE) {
      setGames(prev => prev.filter(g => g.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id)

    if (!error) {
      setGames(prev => prev.filter(g => g.id !== id))
    }
    return { error }
  }

  return { games, loading, error, addGame, updateGame, deleteGame, refetch: fetchGames }
}
