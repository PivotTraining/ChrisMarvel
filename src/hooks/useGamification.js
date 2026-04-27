import { useState, useEffect, useCallback } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'
import { XP_VALUES, BADGE_CRITERIA } from '../lib/gamificationRules'

const BADGE_DEFINITIONS = Object.entries(BADGE_CRITERIA).map(([name, criteria]) => {
  let check
  switch (criteria.type) {
    case 'count':
      check = (data) => (data[criteria.feature] || 0) >= criteria.threshold
      break
    case 'stat':
      check = (data) => (data[criteria.feature] || 0) >= criteria.threshold
      break
    case 'streak':
      check = (data) => (data.streak || 0) >= criteria.threshold
      break
    case 'special':
      if (criteria.feature === 'hasDoubleDouble') check = (data) => data.hasDoubleDouble
      else if (criteria.feature === 'allFeatures') check = (data) => data.games > 0 && data.drills > 0 && data.shots > 0 && data.journal > 0
      else check = () => false
      break
    default:
      check = () => false
  }
  return { name, description: `${name}`, check }
})

const CHALLENGE_TEMPLATES = [
  { name: 'Shot Clock', description: 'Log 50 shots this week', target: 50, type: 'shots' },
  { name: 'Grind Time', description: 'Complete 5 drill sessions', target: 5, type: 'drills' },
  { name: 'Game Ready', description: 'Log 3 games this week', target: 3, type: 'games' },
  { name: 'Mental Rep', description: 'Write 3 journal entries', target: 3, type: 'journal' },
  { name: 'Daily Grind', description: 'Train 5 out of 7 days', target: 5, type: 'active_days' },
]

function parseJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

function computeActivityStreak(games, drills, shots, journal) {
  const activityDates = new Set()
  games.forEach((g) => { if (g.game_date) activityDates.add(g.game_date.slice(0, 10)) })
  drills.forEach((d) => { if (d.session_date) activityDates.add(d.session_date.slice(0, 10)) })
  shots.forEach((s) => { if (s.created_at) activityDates.add(s.created_at.slice(0, 10)) })
  journal.forEach((j) => { if (j.entry_date) activityDates.add(j.entry_date.slice(0, 10)) })

  const sorted = [...activityDates].sort().reverse()
  if (sorted.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    if (activityDates.has(dateStr)) {
      streak++
    } else if (i === 0) {
      continue // today hasn't had activity yet, that's ok
    } else {
      break
    }
  }
  return streak
}

function hasDoubleDouble(games) {
  return games.some((g) => {
    const stats = [g.points || 0, g.rebounds || 0, g.assists || 0, g.steals || 0, g.blocks || 0]
    return stats.filter((s) => s >= 10).length >= 2
  })
}

function getWeeklyProgress(type, games, drills, shots, journal) {
  const weekStart = getWeekStart()

  const isThisWeek = (dateStr) => {
    if (!dateStr) return false
    return dateStr.slice(0, 10) >= weekStart
  }

  switch (type) {
    case 'shots':
      return shots.filter((s) => isThisWeek(s.created_at)).length
    case 'drills':
      return drills.filter((d) => isThisWeek(d.session_date || d.created_at)).length
    case 'games':
      return games.filter((g) => isThisWeek(g.game_date)).length
    case 'journal':
      return journal.filter((j) => isThisWeek(j.entry_date)).length
    case 'active_days': {
      const days = new Set()
      games.filter((g) => isThisWeek(g.game_date)).forEach((g) => days.add(g.game_date.slice(0, 10)))
      drills.filter((d) => isThisWeek(d.session_date || d.created_at)).forEach((d) => days.add((d.session_date || d.created_at).slice(0, 10)))
      shots.filter((s) => isThisWeek(s.created_at)).forEach((s) => days.add(s.created_at.slice(0, 10)))
      journal.filter((j) => isThisWeek(j.entry_date)).forEach((j) => days.add(j.entry_date.slice(0, 10)))
      return days.size
    }
    default:
      return 0
  }
}

export default function useGamification() {
  const [badges, setBadges] = useState([])
  const [unlockedBadges, setUnlockedBadges] = useState([])
  const [weeklyChallenge, setWeeklyChallenge] = useState(null)
  const [challengeProgress, setChallengeProgress] = useState(0)
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [xpToNextLevel, setXpToNextLevel] = useState(500)

  const loadData = useCallback(() => {
    let games, drills, shots, journal

    if (BYPASS_AUTH) {
      games = parseJSON('courtiq_games')
      drills = parseJSON('courtiq_drills')
      shots = parseJSON('courtiq_shots')
      journal = parseJSON('courtiq_journal')
    } else {
      return // non-bypass handled in loadFromSupabase
    }

    return { games, drills, shots, journal }
  }, [])

  const checkBadges = useCallback(async () => {
    let games, drills, shots, journal, existingBadges

    if (BYPASS_AUTH) {
      games = parseJSON('courtiq_games')
      drills = parseJSON('courtiq_drills')
      shots = parseJSON('courtiq_shots')
      journal = parseJSON('courtiq_journal')
      existingBadges = parseJSON('courtiq_badges')
    } else {
      const [gRes, dRes, sRes, jRes, bRes] = await Promise.all([
        supabase.from('games').select('*'),
        supabase.from('drill_sessions').select('*'),
        supabase.from('shot_logs').select('*'),
        supabase.from('journal_entries').select('*'),
        supabase.from('badges').select('*'),
      ])
      games = gRes.data || []
      drills = dRes.data || []
      shots = sRes.data || []
      journal = jRes.data || []
      existingBadges = bRes.data || []
    }

    const maxPoints = games.reduce((max, g) => Math.max(max, g.points || 0), 0)
    const streak = computeActivityStreak(games, drills, shots, journal)
    const contentCompleted = 0 // future feature

    const checkData = {
      games: games.length,
      drills: drills.length,
      shots: shots.length,
      journal: journal.length,
      maxPoints,
      hasDoubleDouble: hasDoubleDouble(games),
      streak,
      contentCompleted,
    }

    const existingNames = new Set(existingBadges.map((b) => b.badge_name))
    const newlyUnlocked = []

    for (const def of BADGE_DEFINITIONS) {
      if (existingNames.has(def.name)) continue
      if (def.check(checkData)) {
        const badge = {
          id: crypto.randomUUID(),
          badge_name: def.name,
          badge_description: def.description,
          earned_at: new Date().toISOString(),
        }

        if (BYPASS_AUTH) {
          existingBadges.push(badge)
        } else {
          await supabase.from('badges').insert([{
            badge_name: def.name,
            badge_description: def.description,
          }])
        }

        newlyUnlocked.push(badge)
      }
    }

    if (BYPASS_AUTH && newlyUnlocked.length > 0) {
      localStorage.setItem('courtiq_badges', JSON.stringify(existingBadges))
    }

    setBadges(existingBadges)
    setUnlockedBadges(newlyUnlocked)

    return newlyUnlocked
  }, [])

  const ensureWeeklyChallenge = useCallback(async () => {
    const weekStart = getWeekStart()
    let challenge, games, drills, shots, journal

    if (BYPASS_AUTH) {
      const challenges = parseJSON('courtiq_challenges')
      challenge = challenges.find((c) => c.week_start === weekStart)
      games = parseJSON('courtiq_games')
      drills = parseJSON('courtiq_drills')
      shots = parseJSON('courtiq_shots')
      journal = parseJSON('courtiq_journal')

      if (!challenge) {
        const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
        const template = CHALLENGE_TEMPLATES[weekNum % CHALLENGE_TEMPLATES.length]
        challenge = {
          id: crypto.randomUUID(),
          challenge_name: template.name,
          challenge_description: template.description,
          target_value: template.target,
          current_value: 0,
          week_start: weekStart,
          completed: false,
          xp_reward: template.target * 10,
          type: template.type,
          created_at: new Date().toISOString(),
        }
        challenges.push(challenge)
        localStorage.setItem('courtiq_challenges', JSON.stringify(challenges))
      }

      const progress = getWeeklyProgress(challenge.type, games, drills, shots, journal)
      challenge.current_value = progress
      challenge.completed = progress >= challenge.target_value
    } else {
      const { data } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('week_start', weekStart)
        .limit(1)
        .single()

      if (data) {
        challenge = data
      } else {
        const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
        const template = CHALLENGE_TEMPLATES[weekNum % CHALLENGE_TEMPLATES.length]
        const { data: newChallenge } = await supabase
          .from('weekly_challenges')
          .insert([{
            challenge_name: template.name,
            challenge_description: template.description,
            target_value: template.target,
            current_value: 0,
            week_start: weekStart,
            completed: false,
            xp_reward: template.target * 10,
          }])
          .select()
          .single()
        challenge = newChallenge
      }
    }

    setWeeklyChallenge(challenge)
    if (challenge) {
      setChallengeProgress(
        Math.min(1, (challenge.current_value || 0) / (challenge.target_value || 1))
      )
    }
  }, [])

  const computeXP = useCallback(async () => {
    let totalXP = 0

    if (BYPASS_AUTH) {
      const games = parseJSON('courtiq_games')
      const drills = parseJSON('courtiq_drills')
      const shots = parseJSON('courtiq_shots')
      const journal = parseJSON('courtiq_journal')
      const badges = parseJSON('courtiq_badges')
      const challenges = parseJSON('courtiq_challenges')

      totalXP += games.length * XP_VALUES.game_logged
      totalXP += drills.length * XP_VALUES.drill_completed
      totalXP += shots.length * XP_VALUES.shot_logged
      totalXP += journal.length * XP_VALUES.journal_entry
      totalXP += badges.length * XP_VALUES.badge_earned
      totalXP += challenges.filter((c) => c.completed).reduce((sum, c) => sum + (c.xp_reward || 0), 0)
    } else {
      const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .single()
      totalXP = profile?.xp || 0
    }

    setXp(totalXP)
    const computedLevel = Math.floor(totalXP / 500) + 1
    setLevel(computedLevel)
    setXpToNextLevel(computedLevel * 500 - totalXP)
  }, [])

  useEffect(() => {
    async function init() {
      await checkBadges()
      await ensureWeeklyChallenge()
      await computeXP()
    }
    init()
  }, [checkBadges, ensureWeeklyChallenge, computeXP])

  return {
    badges,
    unlockedBadges,
    checkBadges,
    weeklyChallenge,
    challengeProgress,
    xp,
    level,
    xpToNextLevel,
  }
}
