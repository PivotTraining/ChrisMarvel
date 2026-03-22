import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode, demoWorkoutTemplates } from '../lib/demoData'

export function useWorkouts() {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = useCallback(async () => {
    if (!user) return
    setLoading(true)

    if (isDemoMode()) {
      // In demo mode, load preloaded workouts plus any user-created ones from local state
      setTemplates(prev => {
        // On first load, use demo templates; after that, preserve user additions
        if (prev.length === 0) return demoWorkoutTemplates
        return prev
      })
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) setTemplates(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  async function addTemplate(template) {
    if (isDemoMode()) {
      const newTemplate = {
        ...template,
        id: `wt-custom-${Date.now()}`,
        user_id: 'demo-user-001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setTemplates(prev => [newTemplate, ...prev])
      return { data: newTemplate, error: null }
    }

    const { data, error } = await supabase
      .from('workout_templates')
      .insert({ ...template, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setTemplates(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function updateTemplate(id, updates) {
    if (isDemoMode()) {
      const updated = { ...updates, id, updated_at: new Date().toISOString() }
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t))
      return { data: updated, error: null }
    }

    const { data, error } = await supabase
      .from('workout_templates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTemplates(prev => prev.map(t => t.id === id ? data : t))
    }
    return { data, error }
  }

  async function deleteTemplate(id) {
    if (isDemoMode()) {
      setTemplates(prev => prev.filter(t => t.id !== id))
      return { error: null }
    }

    const { error } = await supabase
      .from('workout_templates')
      .delete()
      .eq('id', id)

    if (!error) {
      setTemplates(prev => prev.filter(t => t.id !== id))
    }
    return { error }
  }

  return { templates, loading, addTemplate, updateTemplate, deleteTemplate, refetch: fetchTemplates }
}
