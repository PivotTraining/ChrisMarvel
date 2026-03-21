import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useBadges() {
  const { user } = useAuth()
  const [badges, setBadges] = useState([])
  const [earnedBadges, setEarnedBadges] = useState([])
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)

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

    if (!badgesRes.error) setBadges(badgesRes.data || [])
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
    refetch: fetchAll,
  }
}
