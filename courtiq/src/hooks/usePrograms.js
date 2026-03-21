import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function usePrograms() {
  const { user } = useAuth()
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPrograms = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('training_programs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setPrograms(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchPrograms() }, [fetchPrograms])

  async function createProgram(program) {
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
    const { error } = await supabase
      .from('training_programs')
      .delete()
      .eq('id', id)

    if (!error) {
      setPrograms(prev => prev.filter(p => p.id !== id))
    }
    return { error }
  }

  return { programs, loading, createProgram, updateProgram, deleteProgram, refetch: fetchPrograms }
}

export function useProgramDays(programId) {
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDays = useCallback(async () => {
    if (!programId) return
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
