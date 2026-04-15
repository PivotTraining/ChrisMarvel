import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'courtiq_games'
const PAGE_SIZE = 10

// localStorage is the SOURCE OF TRUTH for game data. Supabase is a
// best-effort sync layer. This guarantees that saving a game never
// silently fails — even if the Supabase `games` table doesn't exist
// yet, hasn't been granted the right RLS policies, or the user is
// offline. Previously the code was Supabase-only in production and
// games were vanishing because the .insert() error was silently
// caught and swallowed.

function getAllGamesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
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

// Merge local + remote, deduped by id. Remote rows win on conflict
// (they're presumed to be the canonical server-side version).
function mergeGames(local, remote) {
  const map = new Map()
  for (const g of local) {
    if (g && g.id) map.set(g.id, g)
  }
  for (const g of remote) {
    if (g && g.id) map.set(g.id, g)
  }
  return Array.from(map.values()).sort(
    (a, b) => (b.game_date || '').localeCompare(a.game_date || '')
  )
}

// Best-effort: try to read all games from Supabase. Returns [] on any
// failure (table missing, RLS, network, etc.) — never throws.
async function tryFetchRemoteGames() {
  try {
    const { data, error } = await supabase.from('games').select('*')
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Supabase games fetch skipped:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[CourtIQ] Supabase games fetch threw:', e?.message || e)
    return []
  }
}

// Best-effort: try to insert a game into Supabase. Logs a warning on
// failure but never throws — the localStorage write is what counts.
async function tryInsertRemoteGame(row) {
  try {
    const { error } = await supabase.from('games').insert([row])
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Supabase games insert skipped:', error.message)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[CourtIQ] Supabase games insert threw:', e?.message || e)
  }
}

async function tryUpdateRemoteGame(id, updates) {
  try {
    const { error } = await supabase.from('games').update(updates).eq('id', id)
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Supabase games update skipped:', error.message)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[CourtIQ] Supabase games update threw:', e?.message || e)
  }
}

async function tryDeleteRemoteGame(id) {
  try {
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Supabase games delete skipped:', error.message)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[CourtIQ] Supabase games delete threw:', e?.message || e)
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
      // 1. Load local games immediately — these are guaranteed.
      const local = getAllGamesFromStorage()

      // 2. Best-effort fetch remote games to merge in. If Supabase is
      //    unreachable / the table doesn't exist, this returns [] and
      //    we keep going with just localStorage.
      const remote = await tryFetchRemoteGames()

      // 3. Merge by id (remote wins on conflict) and persist the
      //    merged set back to localStorage so it stays the source of
      //    truth across sessions.
      const merged = mergeGames(local, remote)
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
    // Build the new game with a stable id + timestamp. Try to attach
    // the current Supabase user id if signed in; if not, leave null
    // so localStorage still works in unauthenticated/dev mode.
    let userId = null
    try {
      const { data } = await supabase.auth.getUser()
      userId = data?.user?.id || null
    } catch { /* ignore */ }

    const newGame = {
      ...gameData,
      id: gameData.id || crypto.randomUUID(),
      user_id: gameData.user_id || userId,
      created_at: gameData.created_at || new Date().toISOString(),
    }

    // 1. ALWAYS persist to localStorage first — this is the write that
    //    matters for the user. It cannot silently fail.
    const all = getAllGamesFromStorage()
    all.push(newGame)
    saveGamesToStorage(all)

    // 2. Best-effort sync to Supabase (fire and await, but errors are
    //    swallowed inside tryInsertRemoteGame).
    await tryInsertRemoteGame(newGame)

    // 3. Refresh derived state from storage.
    await fetchGames(page)
    return newGame
  }, [page, fetchGames])

  const updateGame = useCallback(async (id, updates) => {
    // 1. Local update first.
    const all = getAllGamesFromStorage()
    const index = all.findIndex((g) => g.id === id)
    if (index === -1) return null
    all[index] = { ...all[index], ...updates }
    saveGamesToStorage(all)

    // 2. Best-effort remote update.
    await tryUpdateRemoteGame(id, updates)

    await fetchGames(page)
    return all[index]
  }, [page, fetchGames])

  const deleteGame = useCallback(async (id) => {
    const all = getAllGamesFromStorage()
    const filtered = all.filter((g) => g.id !== id)
    saveGamesToStorage(filtered)

    await tryDeleteRemoteGame(id)

    await fetchGames(page)
    return true
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
