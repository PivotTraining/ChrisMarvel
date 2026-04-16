import { useState, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'courtiq_schedule'

function getStoredEvents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveEvents(events) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)) } catch { /* noop */ }
}

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * useSchedule — local-first schedule for upcoming games, practices, and workouts.
 *
 * Events are stored in localStorage. The architecture is ready for Google
 * Calendar API sync once OAuth scopes are configured in the Supabase
 * dashboard (add calendar.readonly to the Google provider).
 *
 * Event shape:
 *   { id, title, type: 'Game'|'Practice'|'Workout', date, time, location, notes, source: 'local'|'google' }
 */
export default function useSchedule() {
  const [events, setEvents] = useState(getStoredEvents)

  const addEvent = useCallback((eventData) => {
    const event = {
      ...eventData,
      id: eventData.id || generateId(),
      source: eventData.source || 'local',
      created_at: new Date().toISOString(),
    }
    const updated = [...getStoredEvents(), event]
    saveEvents(updated)
    setEvents(updated)
    return event
  }, [])

  const updateEvent = useCallback((id, updates) => {
    const all = getStoredEvents()
    const idx = all.findIndex((e) => e.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], ...updates }
    saveEvents(all)
    setEvents(all)
    return all[idx]
  }, [])

  const deleteEvent = useCallback((id) => {
    const all = getStoredEvents().filter((e) => e.id !== id)
    saveEvents(all)
    setEvents(all)
  }, [])

  // Upcoming events — today and future, sorted by date+time ascending.
  const upcoming = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return events
      .filter((e) => e.date >= today)
      .sort((a, b) => {
        const dateComp = (a.date || '').localeCompare(b.date || '')
        if (dateComp !== 0) return dateComp
        return (a.time || '').localeCompare(b.time || '')
      })
  }, [events])

  // Today's events specifically.
  const todayEvents = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return upcoming.filter((e) => e.date === today)
  }, [upcoming])

  return {
    events,
    upcoming,
    todayEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  }
}
