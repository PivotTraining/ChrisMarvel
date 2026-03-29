import { useState, useEffect } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

function parseJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function toDateStr(d) {
  return d.toISOString().slice(0, 10)
}

function getDayLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getShortDay(date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
}

export default function useAnalytics() {
  const [loading, setLoading] = useState(true)
  const [scoringTrend, setScoringTrend] = useState([])
  const [shootingTrend, setShootingTrend] = useState([])
  const [mentalTrend, setMentalTrend] = useState([])
  const [weeklyActivity, setWeeklyActivity] = useState([])
  const [skillBreakdown, setSkillBreakdown] = useState([])
  const [overallStats, setOverallStats] = useState({
    totalGames: 0,
    totalDrills: 0,
    totalShots: 0,
    totalJournalEntries: 0,
    daysSinceJoined: 0,
  })

  useEffect(() => {
    computeAnalytics()
  }, [])

  async function computeAnalytics() {
    setLoading(true)
    try {
      let games, journal, drills, shots

      if (BYPASS_AUTH) {
        games = parseJSON('courtiq_games')
        journal = parseJSON('courtiq_journal')
        drills = parseJSON('courtiq_drills')
        shots = parseJSON('courtiq_shots')
      } else {
        const [gRes, jRes, dRes, sRes] = await Promise.all([
          supabase.from('games').select('*').order('game_date', { ascending: false }),
          supabase.from('journal_entries').select('*').order('entry_date', { ascending: false }),
          supabase.from('drill_sessions').select('*').order('session_date', { ascending: false }),
          supabase.from('shot_logs').select('*').order('created_at', { ascending: false }),
        ])
        games = gRes.data || []
        journal = jRes.data || []
        drills = dRes.data || []
        shots = sRes.data || []
      }

      // Sort games by date ascending for trend
      const sortedGames = [...games].sort((a, b) =>
        (a.game_date || '').localeCompare(b.game_date || '')
      )
      const last10Games = sortedGames.slice(-10)

      setScoringTrend(
        last10Games.map((g) => ({
          date: g.game_date,
          points: g.points || 0,
          label: getDayLabel(g.game_date),
        }))
      )

      setShootingTrend(
        last10Games.map((g) => {
          const fgAtt = g.field_goals_attempted || 0
          const threeAtt = g.three_pointers_attempted || 0
          return {
            date: g.game_date,
            fgPct: fgAtt > 0 ? +((( g.field_goals_made || 0) / fgAtt) * 100).toFixed(1) : 0,
            threePct: threeAtt > 0 ? +(((g.three_pointers_made || 0) / threeAtt) * 100).toFixed(1) : 0,
            label: getDayLabel(g.game_date),
          }
        })
      )

      // Mental trend from journal
      const sortedJournal = [...journal].sort((a, b) =>
        (a.entry_date || '').localeCompare(b.entry_date || '')
      )
      const last10Journal = sortedJournal.slice(-10)

      setMentalTrend(
        last10Journal.map((e) => ({
          date: e.entry_date,
          score: e.mental_game_score || 0,
          mood: e.mood || '',
          label: getDayLabel(e.entry_date),
        }))
      )

      // Weekly activity - last 7 days
      const today = new Date()
      const days = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const dateStr = toDateStr(d)
        const dayName = getShortDay(d)

        const drillCount = drills.filter((dr) => (dr.session_date || '').slice(0, 10) === dateStr).length
        const gameCount = games.filter((g) => (g.game_date || '').slice(0, 10) === dateStr).length
        const journalCount = journal.filter((j) => (j.entry_date || '').slice(0, 10) === dateStr).length

        days.push({ day: dayName, drills: drillCount, games: gameCount, journal: journalCount })
      }
      setWeeklyActivity(days)

      // Skill breakdown from drills
      const categoryMap = {}
      drills.forEach((d) => {
        const cat = d.category || d.drill_type || 'General'
        if (!categoryMap[cat]) categoryMap[cat] = { minutes: 0, sessions: 0 }
        categoryMap[cat].minutes += d.duration_minutes || d.duration || 0
        categoryMap[cat].sessions += 1
      })
      setSkillBreakdown(
        Object.entries(categoryMap).map(([category, data]) => ({
          category,
          minutes: data.minutes,
          sessions: data.sessions,
        }))
      )

      // Overall stats
      const allDates = [
        ...games.map((g) => g.game_date || g.created_at),
        ...journal.map((j) => j.entry_date || j.created_at),
        ...drills.map((d) => d.session_date || d.created_at),
        ...shots.map((s) => s.created_at),
      ].filter(Boolean)

      let daysSinceJoined = 0
      if (allDates.length > 0) {
        const earliest = allDates.reduce((min, d) => (d < min ? d : min), allDates[0])
        daysSinceJoined = Math.max(
          1,
          Math.ceil((today - new Date(earliest)) / (1000 * 60 * 60 * 24))
        )
      }

      setOverallStats({
        totalGames: games.length,
        totalDrills: drills.length,
        totalShots: shots.length,
        totalJournalEntries: journal.length,
        daysSinceJoined,
      })
    } catch {
      // analytics computation failed silently
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    scoringTrend,
    shootingTrend,
    mentalTrend,
    weeklyActivity,
    skillBreakdown,
    overallStats,
  }
}
