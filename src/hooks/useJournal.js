import { useState, useEffect, useCallback } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const STORAGE_KEY = 'courtiq_journal'
const PAGE_SIZE = 10

function computeMentalGameScore(entry) {
  const confidence = entry.confidence || 0
  const focus = entry.focus || 0
  const stress = entry.stress || 0
  const sleepQuality = entry.sleep_quality || 0
  const energyLevel = entry.energy_level || 0
  return +((confidence + focus + (11 - stress) + sleepQuality + energyLevel) / 5.0).toFixed(2)
}

function getAllEntriesFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return parsed.sort((a, b) => (b.entry_date || '').localeCompare(a.entry_date || ''))
  } catch {
    return []
  }
}

function saveEntriesToStorage(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage full or unavailable
  }
}

export default function useJournal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [allEntries, setAllEntries] = useState([])

  const fetchEntries = useCallback(async (pageNum = 0) => {
    setLoading(true)
    try {
      if (BYPASS_AUTH) {
        const all = getAllEntriesFromStorage()
        setAllEntries(all)
        const end = (pageNum + 1) * PAGE_SIZE
        const sliced = all.slice(0, end)
        setEntries(sliced)
        setHasMore(end < all.length)
      } else {
        const start = 0
        const end = (pageNum + 1) * PAGE_SIZE - 1

        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .order('entry_date', { ascending: false })
          .range(start, end)

        if (error) throw error

        setEntries(data || [])
        setHasMore((data || []).length === (pageNum + 1) * PAGE_SIZE)

        // Fetch all entries for recent scores
        const { data: allData, error: allError } = await supabase
          .from('journal_entries')
          .select('*')
          .order('entry_date', { ascending: false })

        if (allError) throw allError
        setAllEntries(allData || [])
      }
    } catch {
      // error fetching entries
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEntries(page)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchEntries(nextPage)
  }, [hasMore, loading, page, fetchEntries])

  const addEntry = useCallback(async (entryData) => {
    try {
      const mentalGameScore = computeMentalGameScore(entryData)

      if (BYPASS_AUTH) {
        const newEntry = {
          ...entryData,
          id: crypto.randomUUID(),
          user_id: 'bypass-user',
          mental_game_score: mentalGameScore,
          created_at: new Date().toISOString(),
        }
        const all = getAllEntriesFromStorage()
        all.push(newEntry)
        saveEntriesToStorage(all)
        await fetchEntries(page)
        return newEntry
      } else {
        const { data, error } = await supabase
          .from('journal_entries')
          .insert([{ ...entryData, mental_game_score: mentalGameScore }])
          .select()
          .single()

        if (error) throw error
        await fetchEntries(page)
        return data
      }
    } catch {
      return null
    }
  }, [page, fetchEntries])

  const updateEntry = useCallback(async (id, updates) => {
    try {
      const finalUpdates = { ...updates }
      // Recompute mental_game_score if relevant fields changed
      if (BYPASS_AUTH) {
        const all = getAllEntriesFromStorage()
        const index = all.findIndex((e) => e.id === id)
        if (index === -1) return null
        const merged = { ...all[index], ...finalUpdates }
        merged.mental_game_score = computeMentalGameScore(merged)
        all[index] = merged
        saveEntriesToStorage(all)
        await fetchEntries(page)
        return merged
      } else {
        // For Supabase, merge with existing to recompute score
        const { data: existing, error: fetchError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) throw fetchError

        const merged = { ...existing, ...finalUpdates }
        finalUpdates.mental_game_score = computeMentalGameScore(merged)

        const { data, error } = await supabase
          .from('journal_entries')
          .update(finalUpdates)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        await fetchEntries(page)
        return data
      }
    } catch {
      return null
    }
  }, [page, fetchEntries])

  const deleteEntry = useCallback(async (id) => {
    try {
      if (BYPASS_AUTH) {
        const all = getAllEntriesFromStorage()
        const filtered = all.filter((e) => e.id !== id)
        saveEntriesToStorage(filtered)
        await fetchEntries(page)
        return true
      } else {
        const { error } = await supabase
          .from('journal_entries')
          .delete()
          .eq('id', id)

        if (error) throw error
        await fetchEntries(page)
        return true
      }
    } catch {
      return false
    }
  }, [page, fetchEntries])

  // Last 3 mental_game_scores from all entries (sorted by entry_date desc)
  const recentScores = allEntries
    .slice(0, 3)
    .map((e) => e.mental_game_score)
    .filter((s) => s != null)

  // Show mental health support if last 3 scores are all < 3.0
  const showMentalHealthSupport =
    recentScores.length === 3 && recentScores.every((s) => s < 3.0)

  return {
    entries,
    allEntries,
    loading,
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    page,
    setPage,
    hasMore,
    loadMore,
    recentScores,
    showMentalHealthSupport,
  }
}
