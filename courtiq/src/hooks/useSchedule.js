import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE } from '../lib/demoData'

export function useSchedule() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })
      .limit(50)

    if (fetchError) {
      console.error('Failed to fetch schedule:', fetchError.message)
      setError(fetchError.message)
    } else {
      setEvents(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function addEvent(event) {
    if (DEMO_MODE) {
      const newEvent = { ...event, id: `demo-event-${Date.now()}`, user_id: 'demo-user-001', created_at: new Date().toISOString() }
      setEvents(prev => [...prev, newEvent].sort((a, b) => a.event_date.localeCompare(b.event_date)))
      return { data: newEvent, error: null }
    }
    const { data, error } = await supabase
      .from('schedule')
      .insert({ ...event, user_id: user.id })
      .select()
      .single()

    if (!error && data) {
      setEvents(prev => [...prev, data].sort((a, b) => a.event_date.localeCompare(b.event_date)))
    }
    return { data, error }
  }

  async function toggleComplete(id) {
    if (DEMO_MODE) {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, completed: !e.completed } : e))
      return { data: null, error: null }
    }
    const event = events.find(e => e.id === id)
    if (!event) return
    const { data, error } = await supabase
      .from('schedule')
      .update({ completed: !event.completed })
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setEvents(prev => prev.map(e => e.id === id ? data : e))
    }
    return { data, error }
  }

  async function deleteEvent(id) {
    if (DEMO_MODE) {
      setEvents(prev => prev.filter(e => e.id !== id))
      return { error: null }
    }
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id)

    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id))
    }
    return { error }
  }

  return { events, loading, error, addEvent, toggleComplete, deleteEvent, refetch: fetchEvents }
}
