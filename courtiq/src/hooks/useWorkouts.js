import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useWorkouts() {
  const { user } = useAuth()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTemplates = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('workout_templates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)

    if (!error) setTemplates(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchTemplates() }, [fetchTemplates])

  async function addTemplate(template) {
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
