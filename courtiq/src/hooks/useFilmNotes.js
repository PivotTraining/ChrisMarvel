import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useFilmNotes(gameId) {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('film_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (gameId) {
      query = query.eq('game_id', gameId)
    } else {
      query = query.limit(100)
    }

    const { data, error } = await query
    if (!error) setNotes(data || [])
    setLoading(false)
  }, [user, gameId])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function addNote(note) {
    const { data, error } = await supabase
      .from('film_notes')
      .insert({ ...note, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setNotes(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateNote(id, updates) {
    const { data, error } = await supabase
      .from('film_notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setNotes(prev => prev.map(n => n.id === id ? data : n))
    }
    return { data, error }
  }

  async function deleteNote(id) {
    const { error } = await supabase
      .from('film_notes')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
    return { error }
  }

  // Get all unique tags across notes
  const allTags = [...new Set(notes.flatMap(n => n.tags || []))]

  return { notes, loading, allTags, addNote, updateNote, deleteNote, refetch: fetchNotes }
}
