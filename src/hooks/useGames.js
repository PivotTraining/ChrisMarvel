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
        const end = (pageNum + 1) * PAGE_SIZE
        setGames(all.slice(0, end))
        setHasMore(end < all.length)
        return
      }

      // PRODUCTION: localStorage is the source of truth. Supabase is a
      // best-effort sync layer. Previously this branch was Supabase-only
      // and any insert error silently lost the user's game. Now we always
      // start from localStorage and merge in whatever Supabase returns.
      const local = getAllGamesFromStorage()

      let remoteAll = []
      try {
        const { data, error } = await supabase.from('games').select('*')
        if (error) {
          // eslint-disable-next-line no-console
          console.warn('[CourtIQ] Supabase games fetch skipped:', error.message)
        } else {
          remoteAll = data || []
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[CourtIQ] Supabase games fetch threw:', e?.message || e)
      }

      // Merge by id. Remote rows win on conflict (server is canonical
      // when reachable). Local-only rows stay so unsynced games still
      // appear in the UI.
      const byId = new Map()
      for (const g of local) if (g && g.id) byId.set(g.id, g)
      for (const g of remoteAll) if (g && g.id) byId.set(g.id, g)
      const merged = Array.from(byId.values()).sort(
        (a, b) => (b.game_date || '').localeCompare(a.game_date || '')
      )

      // Persist the merged set so localStorage stays canonical even
      // after a remote-only sync brought in new rows.
      saveGamesToStorage(merged)

      setAllGames(merged)
      const end = (pageNum + 1) * PAGE_SIZE
      setGames(merged.slice(0, end))
      setHasMore(end < merged.length)
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
    // Build the new game with a stable id we control client-side. This
    // matters because the localStorage write needs to happen BEFORE the
    // Supabase insert (so it's durable even if Supabase fails) and both
    // copies need the same id so the merge in fetchGames dedupes them.
    const newGame = {
      ...gameData,
      id: gameData.id || (crypto.randomUUID ? crypto.randomUUID() : `game-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`),
      created_at: gameData.created_at || new Date().toISOString(),
    }

    // 1. ALWAYS persist to localStorage first. This is the write the
    //    user actually cares about — it cannot silently fail.
    const all = getAllGamesFromStorage()
    all.push(newGame)
    saveGamesToStorage(all)

    if (BYPASS_AUTH) {
      newGame.user_id = newGame.user_id || 'bypass-user'
      // Re-save so user_id sticks
      const updated = getAllGamesFromStorage().map(g => g.id === newGame.id ? newGame : g)
      saveGamesToStorage(updated)
      await fetchGames(page)
      return newGame
    }

    // 2. Best-effort sync to Supabase. Errors are logged but never
    //    thrown — the localStorage write above is what counts.
    try {
      const { data, error } = await supabase
        .from('games')
        .insert([newGame])
        .select()
        .single()
      if (error) {
        // eslint-disable-next-line no-console
        console.warn('[CourtIQ] Supabase games insert skipped:', error.message)
      } else if (data) {
        // Replace the localStorage row with the canonical Supabase row
        // (it may have server-set fields like user_id from RLS).
        const synced = getAllGamesFromStorage().map(g => g.id === newGame.id ? data : g)
        saveGamesToStorage(synced)
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Supabase games insert threw:', e?.message || e)
    }

    // 3. Refresh derived state from storage.
    await fetchGames(page)
    return newGame
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
