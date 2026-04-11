import { useState, useEffect, useCallback } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const STORAGE_KEY = 'courtiq_games'
const PAGE_SIZE = 10

function getAllGamesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.sort((a, b) => (b.game_date || '').localeCompare(a.game_date || ''))
  } catch {
    return []
  }
}

function saveGamesToStorage(games) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch {
    // storage full or unavailable
  }
}

function computeSeasonAverages(allGames) {
  const count = allGames.length
  if (count === 0) {
    return {
      gamesPlayed: 0,
      ppg: 0,
      rpg: 0,
      apg: 0,
      spg: 0,
      bpg: 0,
      topg: 0,
      fpg: 0,
      fgPct: 0,
      ftPct: 0,
      threePct: 0,
      winPct: 0,
    }
  }

  const totals = allGames.reduce(
    (acc, g) => {
      acc.points += g.points || 0
      acc.rebounds += g.rebounds || 0
      acc.assists += g.assists || 0
      acc.steals += g.steals || 0
      acc.blocks += g.blocks || 0
      acc.turnovers += g.turnovers || 0
      acc.fouls += g.fouls || 0
      acc.fgMade += g.field_goals_made || 0
      acc.fgAtt += g.field_goals_attempted || 0
      acc.ftMade += g.free_throws_made || 0
      acc.ftAtt += g.free_throws_attempted || 0
      acc.threeMade += g.three_pointers_made || 0
      acc.threeAtt += g.three_pointers_attempted || 0
      if (g.result === 'Win') acc.wins += 1
      return acc
    },
    {
      points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
      turnovers: 0, fouls: 0, fgMade: 0, fgAtt: 0, ftMade: 0,
      ftAtt: 0, threeMade: 0, threeAtt: 0, wins: 0,
    }
  )

  return {
    gamesPlayed: count,
    ppg: +(totals.points / count).toFixed(1),
    rpg: +(totals.rebounds / count).toFixed(1),
    apg: +(totals.assists / count).toFixed(1),
    spg: +(totals.steals / count).toFixed(1),
    bpg: +(totals.blocks / count).toFixed(1),
    topg: +(totals.turnovers / count).toFixed(1),
    fpg: +(totals.fouls / count).toFixed(1),
    fgPct: totals.fgAtt > 0 ? +((totals.fgMade / totals.fgAtt) * 100).toFixed(1) : 0,
    ftPct: totals.ftAtt > 0 ? +((totals.ftMade / totals.ftAtt) * 100).toFixed(1) : 0,
    threePct: totals.threeAtt > 0 ? +((totals.threeMade / totals.threeAtt) * 100).toFixed(1) : 0,
    winPct: +((totals.wins / count) * 100).toFixed(1),
  }
}

export default function useGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [allGames, setAllGames] = useState([])

  const fetchGames = useCallback(async (pageNum = 0) => {
    setLoading(true)
    try {
      if (BYPASS_AUTH) {
        const all = getAllGamesFromStorage()
        setAllGames(all)
        const start = 0
        const end = (pageNum + 1) * PAGE_SIZE
        const sliced = all.slice(start, end)
        setGames(sliced)
        setHasMore(end < all.length)
      } else {
        const start = 0
        const end = (pageNum + 1) * PAGE_SIZE - 1

        const { data, error } = await supabase
          .from('games')
          .select('*')
          .order('game_date', { ascending: false })
          .range(start, end)

        if (error) throw error

        setGames(data || [])
        setHasMore((data || []).length === (pageNum + 1) * PAGE_SIZE)

        // Fetch all games for season averages
        const { data: allData, error: allError } = await supabase
          .from('games')
          .select('*')

        if (allError) throw allError
        setAllGames(allData || [])
      }
    } catch {
      // error fetching games
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames(page)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchGames(nextPage)
  }, [hasMore, loading, page, fetchGames])

  const addGame = useCallback(async (gameData) => {
    try {
      if (BYPASS_AUTH) {
        const newGame = {
          ...gameData,
          id: crypto.randomUUID(),
          user_id: 'bypass-user',
          created_at: new Date().toISOString(),
        }
        const all = getAllGamesFromStorage()
        all.push(newGame)
        saveGamesToStorage(all)
        await fetchGames(page)
        return newGame
      } else {
        const { data, error } = await supabase
          .from('games')
          .insert([gameData])
          .select()
          .single()

        if (error) throw error
        await fetchGames(page)
        return data
      }
    } catch {
      return null
    }
  }, [page, fetchGames])

  const updateGame = useCallback(async (id, updates) => {
    try {
      if (BYPASS_AUTH) {
        const all = getAllGamesFromStorage()
        const index = all.findIndex((g) => g.id === id)
        if (index === -1) return null
        all[index] = { ...all[index], ...updates }
        saveGamesToStorage(all)
        await fetchGames(page)
        return all[index]
      } else {
        const { data, error } = await supabase
          .from('games')
          .update(updates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        await fetchGames(page)
        return data
      }
    } catch {
      return null
    }
  }, [page, fetchGames])

  const deleteGame = useCallback(async (id) => {
    try {
      if (BYPASS_AUTH) {
        const all = getAllGamesFromStorage()
        const filtered = all.filter((g) => g.id !== id)
        saveGamesToStorage(filtered)
        await fetchGames(page)
        return true
      } else {
        const { error } = await supabase
          .from('games')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchGames(page)
        return true
      }
    } catch {
      return false
    }
  }, [page, fetchGames])

  const seasonAverages = computeSeasonAverages(allGames)

  return {
    games,
    allGames, // full list (not paginated) — used by My IQ analytics aggregator
    loading,
    fetchGames,
    addGame,
    updateGame,
    deleteGame,
    seasonAverages,
    page,
    setPage,
    hasMore,
    loadMore,
  }
}
