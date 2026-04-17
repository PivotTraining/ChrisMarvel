import { useState, useCallback, useMemo, useEffect } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'
import { localToday } from '../utils/dateUtils'

const STORAGE_KEY = 'courtiq_schedule'
const GCAL_CACHE_KEY = 'courtiq_gcal_cache'
const GCAL_CACHE_TTL = 10 * 60 * 1000 // 10 minutes

// Keywords we look for in Google Calendar event titles to identify
// basketball-related events worth surfacing in the schedule.
const BASKETBALL_KEYWORDS = [
  'basketball', 'hoops', 'game', 'practice', 'workout', 'training',
  'scrimmage', 'shootaround', 'shoot around', 'pickup', 'open gym',
  'league', 'tournament', 'tryout', 'camp', 'clinic',
]

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

// Classify a Google Calendar event title into Game/Practice/Workout.
function classifyEvent(title) {
  const t = (title || '').toLowerCase()
  if (/game|league|tournament|scrimmage|matchup|vs\.?/i.test(t)) return 'Game'
  if (/practice|shootaround|shoot around|clinic|camp|tryout|open gym/i.test(t)) return 'Practice'
  if (/workout|training|conditioning|lifting|weights/i.test(t)) return 'Workout'
  return 'Game' // default for generic basketball keywords
}

// Check if a calendar event title looks basketball-related.
function isBasketballEvent(title) {
  const t = (title || '').toLowerCase()
  return BASKETBALL_KEYWORDS.some((kw) => t.includes(kw))
}

// Parse Google Calendar events into our event shape.
function parseGCalEvents(gcalItems) {
  return (gcalItems || [])
    .filter((item) => isBasketballEvent(item.summary))
    .map((item) => {
      const start = item.start?.dateTime || item.start?.date || ''
      const dateStr = start.split('T')[0]
      const timeStr = start.includes('T')
        ? start.split('T')[1]?.slice(0, 5) || ''
        : ''
      return {
        id: `gcal_${item.id}`,
        title: item.summary || 'Calendar Event',
        type: classifyEvent(item.summary),
        date: dateStr,
        time: timeStr,
        location: item.location || '',
        notes: '',
        source: 'google',
        gcal_id: item.id,
        gcal_link: item.htmlLink || '',
      }
    })
}

// Read cached Google Calendar events (avoids hitting API on every render).
function getCachedGCalEvents() {
  try {
    const raw = localStorage.getItem(GCAL_CACHE_KEY)
    if (!raw) return null
    const { events, fetchedAt } = JSON.parse(raw)
    if (Date.now() - fetchedAt > GCAL_CACHE_TTL) return null // stale
    return events
  } catch { return null }
}

function setCachedGCalEvents(events) {
  try {
    localStorage.setItem(GCAL_CACHE_KEY, JSON.stringify({ events, fetchedAt: Date.now() }))
  } catch { /* noop */ }
}

/**
 * useSchedule — local-first schedule with Google Calendar sync.
 *
 * Local events are stored in localStorage. Google Calendar events are
 * fetched via the Google Calendar API using the provider_token from the
 * Supabase session (requires calendar.events.readonly scope, configured
 * in signInWithGoogle). The two sources are merged by id so Google events
 * show alongside manually-created ones.
 *
 * Event shape:
 *   { id, title, type: 'Game'|'Practice'|'Workout', date, time, location, notes, source: 'local'|'google' }
 */
export default function useSchedule() {
  const [localEvents, setLocalEvents] = useState(getStoredEvents)
  const [gcalEvents, setGcalEvents] = useState(getCachedGCalEvents() || [])
  const [gcalLoading, setGcalLoading] = useState(false)
  const [gcalError, setGcalError] = useState(null)

  // Fetch Google Calendar events. The provider_token is ONLY in the
  // session on the initial SIGNED_IN event — AuthContext persists it
  // to localStorage so we can read it back here on subsequent loads.
  const fetchGoogleCalendar = useCallback(async () => {
    if (BYPASS_AUTH) return

    try {
      // Check localStorage first (persisted from SIGNED_IN event),
      // then fall back to the live session in case we're running on
      // the same page-load as the sign-in.
      let token = null
      try { token = localStorage.getItem('courtiq_google_provider_token') } catch { /* noop */ }
      if (!token) {
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.provider_token || null
        if (token) {
          try { localStorage.setItem('courtiq_google_provider_token', token) } catch { /* noop */ }
        }
      }
      if (!token) {
        // eslint-disable-next-line no-console
        console.info('[CourtIQ] No Google provider_token — user signed in with email/Apple, or needs to re-auth with Google for calendar access.')
        return
      }

      setGcalLoading(true)
      setGcalError(null)

      // Fetch next 30 days of events from the user's primary calendar.
      const now = new Date()
      const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      const params = new URLSearchParams({
        timeMin: now.toISOString(),
        timeMax: future.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '50',
      })

      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // Token expired or scope not granted — wipe it so we don't
          // keep retrying with a dead token. User needs to re-auth
          // with Google and grant the calendar scope.
          try { localStorage.removeItem('courtiq_google_provider_token') } catch { /* noop */ }
          // eslint-disable-next-line no-console
          console.warn('[CourtIQ] Google Calendar token expired or scope missing — cleared, user must sign in with Google again.')
          setGcalError('reconnect')
        } else {
          // eslint-disable-next-line no-console
          console.warn('[CourtIQ] Google Calendar API error:', res.status)
        }
        return
      }

      const data = await res.json()
      const parsed = parseGCalEvents(data.items)
      setCachedGCalEvents(parsed)
      setGcalEvents(parsed)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Google Calendar fetch failed:', e?.message || e)
    } finally {
      setGcalLoading(false)
    }
  }, [])

  // Auto-fetch on mount (uses cache if fresh, otherwise hits API).
  useEffect(() => {
    const cached = getCachedGCalEvents()
    if (cached) {
      setGcalEvents(cached)
    } else {
      fetchGoogleCalendar()
    }
  }, [fetchGoogleCalendar])

  // Merge local + Google events into a single list, deduped by id.
  const events = useMemo(() => {
    const byId = new Map()
    for (const e of localEvents) byId.set(e.id, e)
    for (const e of gcalEvents) byId.set(e.id, e)
    return Array.from(byId.values())
  }, [localEvents, gcalEvents])

  const addEvent = useCallback((eventData) => {
    const event = {
      ...eventData,
      id: eventData.id || generateId(),
      source: eventData.source || 'local',
      created_at: new Date().toISOString(),
    }
    const updated = [...getStoredEvents(), event]
    saveEvents(updated)
    setLocalEvents(updated)
    return event
  }, [])

  const updateEvent = useCallback((id, updates) => {
    const all = getStoredEvents()
    const idx = all.findIndex((e) => e.id === id)
    if (idx === -1) return null
    all[idx] = { ...all[idx], ...updates }
    saveEvents(all)
    setLocalEvents(all)
    return all[idx]
  }, [])

  const deleteEvent = useCallback((id) => {
    const all = getStoredEvents().filter((e) => e.id !== id)
    saveEvents(all)
    setLocalEvents(all)
  }, [])

  // Upcoming events — today and future, sorted by date+time ascending.
  const upcoming = useMemo(() => {
    const today = localToday()
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
    const today = localToday()
    return upcoming.filter((e) => e.date === today)
  }, [upcoming])

  return {
    events,
    upcoming,
    todayEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    gcalLoading,
    gcalError,
    refreshGoogleCalendar: fetchGoogleCalendar,
  }
}
