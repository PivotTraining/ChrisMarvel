import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { isDemoMode } from '../lib/demoData'

export function useBadges() {
  const { user } = useAuth()
  const [badges, setBadges] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(!isDemoMode())
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (isDemoMode() || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)

    const [badgesRes, earnedRes, challengesRes] = await Promise.all([
      supabase.from('badges').select('*').order('name'),
      supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false }),
      supabase
        .from('weekly_challenges')
        .select('*')
        .eq('user_id', user.id)
        .order('week_start', { ascending: false })
        .limit(10),
    ])

    if (badgesRes.error) {
      console.error('Failed to fetch badges:', badgesRes.error.message)
      setError(badgesRes.error.message)
    } else {
      setBadges(badgesRes.data || [])
    }
    if (!earnedRes.error) setEarnedBadges(earnedRes.data || [])
    if (!challengesRes.error) setChallenges(challengesRes.data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const earnedBadgeIds = new Set(earnedBadges.map(eb => eb.badge_id))

  return {
    badges,
    earnedBadges,
    earnedBadgeIds,
    challenges,
    loading,
    error,
    refetch: fetchAll,
  }
}
