import { supabase } from './supabase'

export async function updateStreak(userId) {
  if (!supabase || !userId) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_streak, longest_streak, last_activity_date')
    .eq('id', userId)
    .single()

  if (!profile) return

  const today = new Date().toISOString().split('T')[0]
  const lastDate = profile.last_activity_date

  // Already logged today
  if (lastDate === today) return

  let newStreak = 1

  if (lastDate) {
    const last = new Date(lastDate + 'T12:00:00')
    const now = new Date(today + 'T12:00:00')
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      // Consecutive day — extend streak
      newStreak = (profile.current_streak || 0) + 1
    }
    // diffDays > 1 means streak broken, reset to 1
  }

  const longestStreak = Math.max(newStreak, profile.longest_streak || 0)

  await supabase
    .from('profiles')
    .update({
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_activity_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
}
