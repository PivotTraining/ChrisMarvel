import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useSchedule() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', user.id)
      .order('event_date', { ascending: true })
      .limit(50)

    if (!error) setEvents(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function addEvent(event) {
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
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id)

    if (!error) {
      setEvents(prev => prev.filter(e => e.id !== id))
    }
    return { error }
  }

  return { events, loading, addEvent, toggleComplete, deleteEvent, refetch: fetchEvents }
}
