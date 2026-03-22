import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/demoData'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(!isDemoMode())
  const [error, setError] = useState(null)

  const fetchGoals = useCallback(async () => {
    if (isDemoMode() || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (fetchError) {
      console.error('Failed to fetch goals:', fetchError.message)
      setError(fetchError.message)
    } else {
      setGoals(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  async function addGoal(goal) {
    if (isDemoMode()) {
      const newGoal = { ...goal, id: `demo-goal-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setGoals(prev => [newGoal, ...prev])
      return { data: newGoal, error: null }
    }
    const { data, error } = await supabase
      .from('goals')
      .insert({ ...goal, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setGoals(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateGoal(id, updates) {
    if (isDemoMode()) {
      setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g))
      return { data: { id, ...updates }, error: null }
    }
    const { data, error } = await supabase
      .from('goals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setGoals(prev => prev.map(g => g.id === id ? data : g))
    }
    return { data, error }
  }

  async function deleteGoal(id) {
    if (isDemoMode()) {
      setGoals(prev => prev.filter(g => g.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id))
    }
    return { error }
  }

  return { goals, loading, error, addGoal, updateGoal, deleteGoal, refetch: fetchGoals }
}
