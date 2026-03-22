import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE } from '../lib/demoData'

export function useTeams() {
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchTeams = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)
    const { data: memberships, error: fetchError } = await supabase
      .from('team_members')
      .select('team_id, role, teams(id, name, code, description, created_by, created_at)')
      .eq('user_id', user.id)

    if (fetchError) {
      console.error('Failed to fetch teams:', fetchError.message)
      setError(fetchError.message)
    } else if (memberships) {
      setTeams(memberships.map(m => ({ ...m.teams, role: m.role })))
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchTeams() }, [fetchTeams])

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
    return code
  }

  async function createTeam(name, description) {
    if (DEMO_MODE) return { error: { message: 'Teams are not available in demo mode.' } }
    const code = generateCode()
    const { data: team, error } = await supabase
      .from('teams')
      .insert({ name, description, code, created_by: user.id })
      .select()
      .single()

    if (error) return { error }

    const { error: joinError } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, user_id: user.id, role: 'owner' })

    if (!joinError) {
      setTeams(prev => [...prev, { ...team, role: 'owner' }])
    }
    return { data: team, error: joinError }
  }

  async function joinTeam(code) {
    if (DEMO_MODE) return { error: { message: 'Teams are not available in demo mode.' } }
    const { data: team, error: lookupError } = await supabase
      .from('teams')
      .select('*')
      .eq('code', code.toUpperCase().trim())
      .single()

    if (lookupError || !team) return { error: { message: 'Team not found. Check the code and try again.' } }

    const existing = teams.find(t => t.id === team.id)
    if (existing) return { error: { message: 'You are already on this team.' } }

    const { error } = await supabase
      .from('team_members')
      .insert({ team_id: team.id, user_id: user.id, role: 'player' })

    if (!error) {
      setTeams(prev => [...prev, { ...team, role: 'player' }])
    }
    return { data: team, error }
  }

  async function leaveTeam(teamId) {
    if (DEMO_MODE) return { error: null }
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', user.id)

    if (!error) {
      setTeams(prev => prev.filter(t => t.id !== teamId))
    }
    return { error }
  }

  async function deleteTeam(teamId) {
    if (DEMO_MODE) return { error: null }
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', teamId)

    if (!error) {
      setTeams(prev => prev.filter(t => t.id !== teamId))
    }
    return { error }
  }

  return { teams, loading, error, createTeam, joinTeam, leaveTeam, deleteTeam, refetch: fetchTeams }
}

export function useTeamMembers(teamId) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)

  const fetchMembers = useCallback(async () => {
    if (DEMO_MODE || !teamId || !supabase) { setLoading(false); return }
    setLoading(true)
    const { data } = await supabase
      .from('team_members')
      .select('user_id, role, joined_at, profiles(id, full_name, position, xp, level, current_streak, avatar_url)')
      .eq('team_id', teamId)
      .order('joined_at', { ascending: true })

    if (data) {
      setMembers(data.map(m => ({
        id: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        ...m.profiles,
      })))
    }
    setLoading(false)
  }, [teamId])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  return { members, loading, refetch: fetchMembers }
}

export function useTeamLeaderboard(teamId) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(!DEMO_MODE)

  const fetchLeaderboard = useCallback(async () => {
    if (DEMO_MODE || !teamId || !supabase) { setLoading(false); return }
    setLoading(true)

    const { data: memberData } = await supabase
      .from('team_members')
      .select('user_id, profiles(id, full_name, position)')
      .eq('team_id', teamId)

    if (!memberData) { setLoading(false); return }

    const userIds = memberData.map(m => m.user_id)

    const { data: games } = await supabase
      .from('games')
      .select('user_id, points, rebounds, assists, result')
      .in('user_id', userIds)

    if (!games) { setLoading(false); return }

    const statsMap = {}
    userIds.forEach(uid => {
      statsMap[uid] = { games: 0, pts: 0, reb: 0, ast: 0, wins: 0 }
    })

    games.forEach(g => {
      const s = statsMap[g.user_id]
      if (!s) return
      s.games++
      s.pts += g.points || 0
      s.reb += g.rebounds || 0
      s.ast += g.assists || 0
      if (g.result === 'Win') s.wins++
    })

    const board = memberData.map(m => ({
      id: m.user_id,
      name: m.profiles?.full_name || 'Player',
      position: m.profiles?.position || '',
      games: statsMap[m.user_id].games,
      ppg: statsMap[m.user_id].games > 0 ? (statsMap[m.user_id].pts / statsMap[m.user_id].games).toFixed(1) : '0.0',
      rpg: statsMap[m.user_id].games > 0 ? (statsMap[m.user_id].reb / statsMap[m.user_id].games).toFixed(1) : '0.0',
      apg: statsMap[m.user_id].games > 0 ? (statsMap[m.user_id].ast / statsMap[m.user_id].games).toFixed(1) : '0.0',
      winPct: statsMap[m.user_id].games > 0 ? Math.round((statsMap[m.user_id].wins / statsMap[m.user_id].games) * 100) : 0,
      totalPts: statsMap[m.user_id].pts,
    }))

    board.sort((a, b) => parseFloat(b.ppg) - parseFloat(a.ppg))
    setLeaderboard(board)
    setLoading(false)
  }, [teamId])

  useEffect(() => { fetchLeaderboard() }, [fetchLeaderboard])

  return { leaderboard, loading, refetch: fetchLeaderboard }
}
