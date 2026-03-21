import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchGoals = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!error) setGoals(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchGoals() }, [fetchGoals])

  async function addGoal(goal) {
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
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id)

    if (!error) {
      setGoals(prev => prev.filter(g => g.id !== id))
    }
    return { error }
  }

  return { goals, loading, addGoal, updateGoal, deleteGoal, refetch: fetchGoals }
}
