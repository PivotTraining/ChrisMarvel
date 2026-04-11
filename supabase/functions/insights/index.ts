// Supabase Edge Function: insights
//
// Takes a player's game + drill summary and returns 3 short, actionable
// coaching insights. When ANTHROPIC_API_KEY is present we call Claude; when
// it isn't we fall back to a deterministic rule-based analyzer so the UI
// still renders something useful in dev.
//
// Request:
//   POST /functions/v1/insights
//   Body: { summary: { games, shots, drills, training }, player }
// Response:
//   { insights: [{ title, body, tag }] }

// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `You are a basketball skills coach embedded in an app called CourtIQ.
You receive a compact JSON summary of a player's recent games, shots, and drill sessions.
Return exactly 3 insights as a JSON array, each with:
  - "title": 3-5 word headline
  - "body":  1-2 sentence actionable takeaway
  - "tag":   one of "shooting", "gametime", "training", "mindset"
Focus on patterns (hot zones, cold zones, training load, streaks, variance).
Be specific and encouraging. Return ONLY valid JSON, no prose, no markdown fences.`

function ruleBased(summary: any) {
  const t = summary?.training || {}
  const shots = summary?.shots || { total: 0, made: 0, pct: 0 }
  const games = summary?.games || { count: 0, avgPts: 0, avgFgPct: 0 }
  const insights: any[] = []

  if (shots.total >= 10) {
    insights.push({
      title: shots.pct >= 50 ? 'Shot efficiency is strong' : 'Pick a zone to own',
      body: shots.pct >= 50
        ? `You're converting ${shots.pct}% across ${shots.total} tracked shots. Keep feeding your hot zones.`
        : `${shots.pct}% across ${shots.total} shots — spend this week drilling your cleanest zone until it's automatic.`,
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
      body: `Over ${games.count} tracked games at ${games.avgFgPct}% FG. Watch your turnover and FT lines next game — those two numbers move ${games.avgPts > 10 ? 'scoring' : 'efficiency'} the fastest.`,
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

async function callClaude(summary: any, player: any) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
  if (!apiKey) return null

  const userMsg = `Player: ${JSON.stringify(player || {})}\nSummary: ${JSON.stringify(summary || {})}\nReturn exactly 3 JSON insights now.`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMsg }],
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.content?.[0]?.text || ''
    const match = text.match(/\[[\s\S]*\]/)
    if (!match) return null
    const parsed = JSON.parse(match[0])
    if (!Array.isArray(parsed)) return null
    return parsed.slice(0, 3)
  } catch {
    return null
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  try {
    const { summary, player } = await req.json()
    const fromClaude = await callClaude(summary, player)
    const insights = fromClaude || ruleBased(summary)
    return new Response(JSON.stringify({ insights, source: fromClaude ? 'claude' : 'rules' }), {
      headers: { ...CORS, 'content-type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...CORS, 'content-type': 'application/json' },
    })
  }
})
