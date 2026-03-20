import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useGames() {
  const { user } = useAuth()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchGames = useCallback(async () => {
    if (!user) return
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

  useEffect(() => { fetchGames() }, [fetchGames])

  async function addGame(game) {
    const { data, error } = await supabase
      .from('games')
      .insert({ ...game, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setGames(prev => [data, ...prev])
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

  return { games, loading, addGame, deleteGame, refetch: fetchGames }
}
