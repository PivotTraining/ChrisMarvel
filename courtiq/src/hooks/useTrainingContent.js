import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useTrainingContent(contentType) {
  const { user } = useAuth()
  const [content, setContent] = useState([])
  const [savedIds, setSavedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  const fetchContent = useCallback(async () => {
    setLoading(true)

    let query = supabase
      .from('training_content')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('title')

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    const { data, error } = await query
    if (!error) setContent(data || [])

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
    if (!user) return

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
    if (!user) return

    await supabase.rpc('upsert_content_view', {
      p_user_id: user.id,
      p_content_id: contentId,
    }).catch(() => {
      // Fallback: just insert/update directly
      supabase
        .from('user_content_history')
        .upsert(
          { user_id: user.id, content_id: contentId, last_viewed_at: new Date().toISOString(), view_count: 1 },
          { onConflict: 'user_id,content_id' }
        )
    })
  }

  const featured = content.filter(c => c.is_featured)
  const categories = [...new Set(content.map(c => c.category).filter(Boolean))]

  return {
    content,
    featured,
    categories,
    savedIds,
    loading,
    toggleSave,
    recordView,
    refetch: fetchContent,
  }
}
