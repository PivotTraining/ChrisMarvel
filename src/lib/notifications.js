// Local notifications — daily streak reminder + weekly summary.
//
// We schedule on a repeating cron from inside the app (no backend required)
// using Capacitor's LocalNotifications plugin. The user's Settings toggles
// in `profile.notification_preferences` drive what gets scheduled. On web
// we quietly no-op because LocalNotifications is a native-only plugin.

import { Capacitor } from '@capacitor/core'

const STREAK_ID = 4101
const WEEKLY_ID = 4102

async function getPlugin() {
  if (!Capacitor.isNativePlatform?.()) return null
  try {
    const mod = await import('@capacitor/local-notifications')
    return mod.LocalNotifications
  } catch {
    return null
  }
}

export async function requestPermission() {
  const L = await getPlugin()
  if (!L) return { granted: false, reason: 'web' }
  try {
    const res = await L.requestPermissions()
    return { granted: res.display === 'granted' }
  } catch (e) {
    return { granted: false, reason: String(e) }
  }
}

export async function syncNotifications(prefs) {
  const L = await getPlugin()
  if (!L) return { ok: false, reason: 'web' }
  const streakReminder = prefs?.streak_reminder !== false
  const weeklySummary = prefs?.weekly_summary !== false

  try {
    // Clear anything we previously scheduled so the new state is canonical.
    await L.cancel({ notifications: [{ id: STREAK_ID }, { id: WEEKLY_ID }] })
  } catch { /* noop */ }

  const toSchedule = []

  if (streakReminder) {
    toSchedule.push({
      id: STREAK_ID,
      title: 'Keep your streak alive',
      body: 'Tap in for a quick drill or game log before the day ends.',
      schedule: {
        // Fires every day at 6:30 PM local time.
        on: { hour: 18, minute: 30 },
        allowWhileIdle: true,
      },
    })
  }

  if (weeklySummary) {
    toSchedule.push({
      id: WEEKLY_ID,
      title: 'Your week in CourtIQ',
      body: 'Your weekly summary is ready — see how far you moved this week.',
      schedule: {
        // Fires Sundays at 9:00 AM local time.
        // Capacitor uses iso weekday (1=Mon .. 7=Sun).
        on: { weekday: 7, hour: 9, minute: 0 },
        allowWhileIdle: true,
      },
    })
  }

  if (toSchedule.length === 0) return { ok: true, scheduled: 0 }

  try {
    await L.schedule({ notifications: toSchedule })
    return { ok: true, scheduled: toSchedule.length }
  } catch (e) {
    return { ok: false, reason: String(e) }
  }
}

export async function cancelAll() {
  const L = await getPlugin()
  if (!L) return
  try {
    await L.cancel({ notifications: [{ id: STREAK_ID }, { id: WEEKLY_ID }] })
  } catch { /* noop */ }
}
