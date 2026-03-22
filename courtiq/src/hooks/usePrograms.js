import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE } from '../lib/demoData'

export function usePrograms() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchPrograms = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('training_programs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Failed to fetch programs:', fetchError.message)
      setError(fetchError.message)
    } else {
      setPrograms(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchPrograms() }, [fetchPrograms])

  async function createProgram(program) {
    if (DEMO_MODE) {
      const newProgram = { ...program, id: `demo-program-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setPrograms(prev => [newProgram, ...prev])
      return { data: newProgram, error: null }
    }
    const { data, error } = await supabase
      .from('training_programs')
      .insert({ ...program, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setPrograms(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateProgram(id, updates) {
    if (DEMO_MODE) {
      setPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
      return { data: { id, ...updates }, error: null }
    }
    const { data, error } = await supabase
      .from('training_programs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setPrograms(prev => prev.map(p => p.id === id ? data : p))
    }
    return { data, error }
  }

  async function deleteProgram(id) {
    if (DEMO_MODE) {
      setPrograms(prev => prev.filter(p => p.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('training_programs')
      .delete()
      .eq('id', id)

    if (!error) {
      setPrograms(prev => prev.filter(p => p.id !== id))
    }
    return { error }
  }

  return { programs, loading, error, createProgram, updateProgram, deleteProgram, refetch: fetchPrograms }
}

export function useProgramDays(programId) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)

  const fetchDays = useCallback(async () => {
    if (DEMO_MODE || !programId || !supabase) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('program_days')
      .select('*')
      .eq('program_id', programId)
      .order('week_number', { ascending: true })
      .order('day_number', { ascending: true })

    if (!error) setDays(data || [])
    setLoading(false)
  }, [programId])

  useEffect(() => { fetchDays() }, [fetchDays])

  async function addDay(day) {
    if (DEMO_MODE) return { data: null, error: null }
    const { data, error } = await supabase
      .from('program_days')
      .insert({ ...day, program_id: programId })
      .select()
      .single()

    if (!error && data) {
      setDays(prev => [...prev, data].sort((a, b) => a.week_number - b.week_number || a.day_number - b.day_number))
    }
    return { data, error }
  }

  async function toggleComplete(dayId) {
    if (DEMO_MODE) {
      setDays(prev => prev.map(d => d.id === dayId ? { ...d, completed: !d.completed } : d))
      return { data: null, error: null }
    }
    const day = days.find(d => d.id === dayId)
    if (!day) return
    const completed = !day.completed
    const { data, error } = await supabase
      .from('program_days')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', dayId)
      .select()
      .single()

    if (!error && data) {
      setDays(prev => prev.map(d => d.id === dayId ? data : d))
    }
    return { data, error }
  }

  async function updateDay(dayId, updates) {
    if (DEMO_MODE) return { data: null, error: null }
    const { data, error } = await supabase
      .from('program_days')
      .update(updates)
      .eq('id', dayId)
      .select()
      .single()

    if (!error && data) {
      setDays(prev => prev.map(d => d.id === dayId ? data : d))
    }
    return { data, error }
  }

  async function bulkAddDays(daysArr) {
    if (DEMO_MODE) return { data: null, error: null }
    const withProgramId = daysArr.map(d => ({ ...d, program_id: programId }))
    const { data, error } = await supabase
      .from('program_days')
      .insert(withProgramId)
      .select()

    if (!error && data) {
      setDays(prev => [...prev, ...data].sort((a, b) => a.week_number - b.week_number || a.day_number - b.day_number))
    }
    return { data, error }
  }

  return { days, loading, addDay, toggleComplete, updateDay, bulkAddDays, refetch: fetchDays }
}
