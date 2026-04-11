// Client wrapper for the Claude-powered "My IQ insights" edge function.
//
// In real Supabase mode we POST to `/functions/v1/insights` (which either
// calls Claude or falls back to a rule engine). In BYPASS_AUTH / local mode
// we run the same rule engine right here so the UI always renders.

import { supabase, BYPASS_AUTH } from './supabase'

function ruleBased(summary) {
  const t = summary?.training || {}
  const shots = summary?.shots || { total: 0, made: 0, pct: 0 }
  const games = summary?.games || { count: 0, avgPts: 0, avgFgPct: 0 }
  const insights = []

  if (shots.total >= 10) {
    insights.push({
      title: shots.pct >= 50 ? 'Shot efficiency is strong' : 'Pick a zone to own',
      body: shots.pct >= 50
        ? `You're converting ${shots.pct}% across ${shots.total} tracked shots. Keep feeding your hot zones.`
        : `${shots.pct}% across ${shots.total} shots — spend this week drilling your cleanest zone until it's automatic.`,
      tag: 'shooting',
    })
  } else {
    insights.push({
      title: 'Log more shots',
      body: 'Open Gametime, tap shots in real time. Even 20 logged attempts unlock your personal heat map.',
      tag: 'shooting',
    })
  }

  if (t.last7 > 0) {
    insights.push({
      title: `${t.last7} session${t.last7 === 1 ? '' : 's'} this week`,
      body: t.last7 >= 4
        ? `Great load — ${t.totalMinutes} lifetime minutes. Mix in a recovery day before your next heavy block.`
        : `You're moving, but consistency wins. Aim for 4 sessions next week to build the habit.`,
      tag: 'training',
    })
  } else {
    insights.push({
      title: 'Restart the clock',
      body: 'No sessions logged in the last 7 days. A 15-minute form-shooting block today will reset your streak.',
      tag: 'mindset',
    })
  }

  if (games.count >= 3) {
    insights.push({
      title: `Averaging ${games.avgPts} pts`,
      body: `Over ${games.count} tracked games at ${games.avgFgPct}% FG. Watch your turnover and FT lines next game — those two numbers move efficiency the fastest.`,
      tag: 'gametime',
    })
  } else {
    insights.push({
      title: 'Track a real game',
      body: 'Log even a pickup run from Gametime — your My IQ heat map will start telling you what\'s actually working.',
      tag: 'gametime',
    })
  }

  return insights.slice(0, 3)
}

export async function fetchInsights({ summary, player }) {
  // Local mode: run rules client-side, no network roundtrip.
  if (BYPASS_AUTH) {
    return { insights: ruleBased(summary), source: 'local' }
  }

  try {
    const { data, error } = await supabase.functions.invoke('insights', {
      body: { summary, player },
    })
    if (error || !data?.insights) {
      return { insights: ruleBased(summary), source: 'fallback' }
    }
    return data
  } catch {
    return { insights: ruleBased(summary), source: 'fallback' }
  }
}
