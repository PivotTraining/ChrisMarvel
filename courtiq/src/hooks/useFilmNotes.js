import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/demoData'

export function useFilmNotes(gameId) {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(!isDemoMode())
  const [error, setError] = useState(null)

  const fetchNotes = useCallback(async () => {
    if (isDemoMode() || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)

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

    const { data, error: fetchError } = await query
    if (fetchError) {
      console.error('Failed to fetch film notes:', fetchError.message)
      setError(fetchError.message)
    } else {
      setNotes(data || [])
    }
    setLoading(false)
  }, [user, gameId])

  useEffect(() => { fetchNotes() }, [fetchNotes])

  async function addNote(note) {
    if (isDemoMode()) {
      const newNote = { ...note, id: `demo-note-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setNotes(prev => [newNote, ...prev])
      return { data: newNote, error: null }
    }
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
    if (isDemoMode()) {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n))
      return { data: { id, ...updates }, error: null }
    }
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
    if (isDemoMode()) {
      setNotes(prev => prev.filter(n => n.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('film_notes')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotes(prev => prev.filter(n => n.id !== id))
    }
    return { error }
  }

  const allTags = [...new Set(notes.flatMap(n => n.tags || []))]

  return { notes, loading, error, allTags, addNote, updateNote, deleteNote, refetch: fetchNotes }
}
