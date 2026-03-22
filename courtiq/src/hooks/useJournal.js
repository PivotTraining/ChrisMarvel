import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/demoData'

export function useJournal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(!isDemoMode())
  const [error, setError] = useState(null)

  const fetchEntries = useCallback(async () => {
    if (isDemoMode() || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('entry_date', { ascending: false })
      .limit(50)

    if (fetchError) {
      console.error('Failed to fetch journal:', fetchError.message)
      setError(fetchError.message)
    } else {
      setEntries(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  async function addEntry(entry) {
    if (isDemoMode()) {
      const newEntry = { ...entry, id: `demo-journal-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setEntries(prev => [newEntry, ...prev])
      return { data: newEntry, error: null }
    }
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
    if (isDemoMode()) {
      setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
      return { data: { id, ...updates }, error: null }
    }
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
    if (isDemoMode()) {
      setEntries(prev => prev.filter(e => e.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id))
    }
    return { error }
  }

  return { entries, loading, error, addEntry, updateEntry, deleteEntry, refetch: fetchEntries }
}
