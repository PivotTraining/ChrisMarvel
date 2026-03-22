import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { DEMO_MODE, demoNotifications } from '../lib/demoData'

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState(DEMO_MODE ? demoNotifications : [])
  const [loading, setLoading] = useState(!DEMO_MODE)

  const fetchNotifications = useCallback(async () => {
    if (DEMO_MODE || !user || !supabase) { setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error) setNotifications(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { if (!DEMO_MODE) fetchNotifications() }, [fetchNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  async function markRead(id) {
    if (DEMO_MODE) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      return
    }
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)

    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }
  }

  async function markAllRead() {
    if (DEMO_MODE) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      return
    }
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id)
    if (unreadIds.length === 0) return

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }
  }

  async function addNotification({ type, title, body, icon, action_url, metadata }) {
    if (DEMO_MODE || !user) return { data: null, error: null }
    const { data, error } = await supabase
      .from('notifications')
      .insert({ user_id: user.id, type, title, body, icon, action_url, metadata })
      .select()
      .single()

    if (!error && data) {
      setNotifications(prev => [data, ...prev])
    }
    return { data, error }
  }

  async function deleteNotification(id) {
    if (DEMO_MODE) {
      setNotifications(prev => prev.filter(n => n.id !== id))
      return
    }
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }
  }

  async function clearAll() {
    if (DEMO_MODE) {
      setNotifications([])
      return
    }
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id)

    if (!error) setNotifications([])
  }

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    addNotification,
    deleteNotification,
    clearAll,
    refetch: fetchNotifications,
  }
}
