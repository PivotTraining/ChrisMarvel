import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const STORAGE_KEY = 'courtiq_shots'

export const COURT_ZONES = [
  { id: 'paint', label: 'Paint', x: 42, y: 70, w: 16, h: 22 },
  { id: 'mid-left', label: 'Mid Left', x: 10, y: 50, w: 20, h: 25 },
  { id: 'mid-right', label: 'Mid Right', x: 70, y: 50, w: 20, h: 25 },
  { id: 'mid-top', label: 'Mid Top', x: 30, y: 40, w: 40, h: 15 },
  { id: 'left-corner-3', label: 'Left Corner 3', x: 2, y: 70, w: 12, h: 22 },
  { id: 'right-corner-3', label: 'Right Corner 3', x: 86, y: 70, w: 12, h: 22 },
  { id: 'left-wing-3', label: 'Left Wing 3', x: 5, y: 30, w: 20, h: 22 },
  { id: 'right-wing-3', label: 'Right Wing 3', x: 75, y: 30, w: 20, h: 22 },
  { id: 'top-key-3', label: 'Top of Key 3', x: 30, y: 15, w: 40, h: 18 },
  { id: 'free-throw', label: 'Free Throw', x: 40, y: 55, w: 20, h: 10 },
]

const SHOT_TYPES = ['Catch & Shoot', 'Off Dribble', 'Post Up', 'Free Throw', 'Floater', 'Hook Shot']
const CONTEXTS = ['Practice', 'Game', 'Warmup']

function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

function getLocalShots() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalShots(shots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shots))
  } catch { /* noop */ }
}

function computeZoneStats(shotsList) {
  const map = new Map()
  for (const s of shotsList) {
    if (!map.has(s.zone_id)) {
      map.set(s.zone_id, { made: 0, attempted: 0, pct: 0 })
    }
    const entry = map.get(s.zone_id)
    entry.attempted += 1
    if (s.is_made) entry.made += 1
    entry.pct = entry.attempted > 0 ? Math.round((entry.made / entry.attempted) * 100) : 0
  }
  return map
}

export default function useShots() {
  const [shots, setShots] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [sessionContext, setSessionContext] = useState(null)
  const sessionActive = sessionId !== null
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const loadSessionShots = useCallback(async () => {
    if (!sessionId) return
    setLoading(true)
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        const filtered = all.filter((s) => s.session_id === sessionId)
        if (mountedRef.current) setShots(filtered)
      } else {
        const { data, error } = await supabase
          .from('shots')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
        if (error) throw error
        if (mountedRef.current) setShots(data || [])
      }
    } catch { /* noop */ } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId) loadSessionShots()
  }, [sessionId, loadSessionShots])

  const logShot = useCallback(async (zoneId, isMade, shotType = 'Catch & Shoot', context = null) => {
    const shot = {
      id: generateId(),
      user_id: null,
      session_id: sessionId,
      shot_date: todayDate(),
      zone_id: zoneId,
      is_made: isMade,
      shot_type: shotType,
      context: context || sessionContext || 'Practice',
      created_at: new Date().toISOString(),
    }
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        all.push(shot)
        setLocalShots(all)
      } else {
        const { error } = await supabase.from('shots').insert(shot)
        if (error) throw error
      }
      if (mountedRef.current) setShots((prev) => [...prev, shot])
    } catch { /* noop */ }
  }, [sessionId, sessionContext])

  const undoLastShot = useCallback(async () => {
    if (shots.length === 0) return
    const last = shots[shots.length - 1]
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        const idx = all.findIndex((s) => s.id === last.id)
        if (idx !== -1) {
          all.splice(idx, 1)
          setLocalShots(all)
        }
      } else {
        const { error } = await supabase.from('shots').delete().eq('id', last.id)
        if (error) throw error
      }
      if (mountedRef.current) setShots((prev) => prev.slice(0, -1))
    } catch { /* noop */ }
  }, [shots])

  const clearSession = useCallback(async () => {
    if (!sessionId) return
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        const filtered = all.filter((s) => s.session_id !== sessionId)
        setLocalShots(filtered)
      } else {
        const { error } = await supabase.from('shots').delete().eq('session_id', sessionId)
        if (error) throw error
      }
      if (mountedRef.current) setShots([])
    } catch { /* noop */ }
  }, [sessionId])

  const startSession = useCallback((context = 'Practice') => {
    const newId = generateId()
    setSessionId(newId)
    setSessionContext(context)
    setShots([])
  }, [])

  const endSession = useCallback(() => {
    setSessionId(null)
    setSessionContext(null)
  }, [])

  const zoneStats = useMemo(() => computeZoneStats(shots), [shots])

  const overallZoneStats = useMemo(() => {
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        return computeZoneStats(all)
      }
    } catch { /* noop */ }
    return computeZoneStats(shots)
  }, [shots])

  const sessionSummary = useMemo(() => {
    const totalMade = shots.filter((s) => s.is_made).length
    const totalAttempted = shots.length
    const pct = totalAttempted > 0 ? Math.round((totalMade / totalAttempted) * 100) : 0
    const shotsByZone = {}
    for (const s of shots) {
      if (!shotsByZone[s.zone_id]) {
        shotsByZone[s.zone_id] = { made: 0, attempted: 0 }
      }
      shotsByZone[s.zone_id].attempted += 1
      if (s.is_made) shotsByZone[s.zone_id].made += 1
    }
    return { totalMade, totalAttempted, pct, shotsByZone }
  }, [shots])

  const fetchHistory = useCallback(async (days = 30) => {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().split('T')[0]
    try {
      if (BYPASS_AUTH) {
        const all = getLocalShots()
        return all.filter((s) => s.shot_date >= sinceStr)
      } else {
        const { data, error } = await supabase
          .from('shots')
          .select('*')
          .gte('shot_date', sinceStr)
          .order('created_at', { ascending: false })
        if (error) throw error
        return data || []
      }
    } catch {
      return []
    }
  }, [])

  return {
    shots,
    loading,
    logShot,
    undoLastShot,
    clearSession,
    startSession,
    endSession,
    sessionActive,
    sessionContext,
    zoneStats,
    overallZoneStats,
    sessionSummary,
    fetchHistory,
  }
}
