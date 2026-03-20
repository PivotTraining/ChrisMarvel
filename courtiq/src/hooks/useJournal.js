import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useJournal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(50)

    if (!error) setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  async function addEntry(entry) {
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({ ...entry, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateEntry(id, updates) {
    const { data, error } = await supabase
      .from('journal_entries')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => prev.map(e => e.id === id ? data : e))
    }
    return { data, error }
  }

  async function deleteEntry(id) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id))
    }
    return { error }
  }

  return { entries, loading, addEntry, updateEntry, deleteEntry, refetch: fetchEntries }
}
