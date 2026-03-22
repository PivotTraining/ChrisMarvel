import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE } from '../lib/demoData'

export function useTrainingContent(contentType) {
  const { user } = useAuth()
  const [content, setContent] = useState([])
  const [savedIds, setSavedIds] = useState(new Set())
  const [loading, setLoading] = useState(!DEMO_MODE)
  const [error, setError] = useState(null)

  const fetchContent = useCallback(async () => {
    if (DEMO_MODE || !supabase) { setLoading(false); return }
    setLoading(true)
    setError(null)

    let query = supabase
      .from('training_content')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('title')

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data, error: fetchError } = await query
    if (fetchError) {
      console.error('Failed to fetch training content:', fetchError.message)
      setError(fetchError.message)
    } else {
      setContent(data || [])
    }

    // Fetch saved content IDs
    if (user) {
      const { data: saved } = await supabase
        .from('saved_content')
        .select('content_id')
        .eq('user_id', user.id)

      if (saved) {
        setSavedIds(new Set(saved.map(s => s.content_id)))
      }
    }

    setLoading(false)
  }, [contentType, user])

  useEffect(() => { fetchContent() }, [fetchContent])

  async function toggleSave(contentId) {
    if (DEMO_MODE || !user || !supabase) return

    if (savedIds.has(contentId)) {
      await supabase
        .from('saved_content')
        .delete()
        .eq('user_id', user.id)
        .eq('content_id', contentId)

      setSavedIds(prev => {
        const next = new Set(prev)
        next.delete(contentId)
        return next
      })
    } else {
      await supabase
        .from('saved_content')
        .insert({ user_id: user.id, content_id: contentId })

      setSavedIds(prev => new Set(prev).add(contentId))
    }
  }

  async function recordView(contentId) {
    if (DEMO_MODE || !user || !supabase) return

    await supabase
      .from('user_content_history')
      .upsert(
        { user_id: user.id, content_id: contentId, last_viewed_at: new Date().toISOString(), view_count: 1 },
        { onConflict: 'user_id,content_id' }
      )
      .then(null, () => {}) // silently ignore view tracking errors
  }

  const featured = content.filter(c => c.is_featured)
  const categories = [...new Set(content.map(c => c.category).filter(Boolean))]

  return {
    content,
    featured,
    categories,
    savedIds,
    loading,
    error,
    toggleSave,
    recordView,
    refetch: fetchContent,
  }
}
