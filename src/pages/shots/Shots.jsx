// My IQ — read-only comprehensive analytics dashboard.
//
// Aggregates every game (Gametime or manually logged) via useGames() and
// derives: season totals, per-zone shooting %, a court-heat-map built from
// the raw _shots coordinates saved by Gametime, plain-english coaching
// feedback, and Pro-gated advanced views (radar chart / archetype).
//
// This page is explicitly NOT a logger — logging happens in Gametime. Users
// come here to see their ongoing story.

import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { localToday, parseLocalDate } from '../../utils/dateUtils'
import {
  BarChart3, Flame, TrendingUp, TrendingDown, Target, Trophy,
  Lock, Sparkles, Crown, Dumbbell, RefreshCw, Brain, Download,
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import RadarChart from '../../components/ui/RadarChart'
import useGames from '../../hooks/useGames'
import useDrills from '../../hooks/useDrills'
import useJournal from '../../hooks/useJournal'
import { usePremium } from '../../context/PremiumContext'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { fetchInsights } from '../../lib/insights'

// ─── Court constants — must match QuickGame.jsx exactly ──────────────────────
const W = 500, H = 470
const BASKET_X = W / 2, BASKET_Y = H - 52
const ARC_R = 232
const CORNER_3_X_LEFT = 60, CORNER_3_X_RIGHT = 440
const CORNER_3_Y = H - 40
const CORNER_BREAK_Y = BASKET_Y - Math.sqrt(
  ARC_R * ARC_R - (BASKET_X - CORNER_3_X_LEFT) * (BASKET_X - CORNER_3_X_LEFT)
)

// ─── Zone classifier for coordinate-tagged shots ─────────────────────────────
// Gametime stores raw {x, y, made, is3}. We bucket each into one of eight
// labelled zones so we can compute per-zone %.
function classifyZone(x, y) {
  const dx = x - BASKET_X
  const dy = y - BASKET_Y
  const dist = Math.sqrt(dx * dx + dy * dy)

  // Corner 3s
  if (x <= CORNER_3_X_LEFT || x >= CORNER_3_X_RIGHT) {
    if (y >= CORNER_BREAK_Y) return x <= CORNER_3_X_LEFT ? 'L Corner 3' : 'R Corner 3'
    // out-of-bounds-ish; treat as wing
    return x <= CORNER_3_X_LEFT ? 'L Wing 3' : 'R Wing 3'
  }

  // Beyond the arc
  if (dist > ARC_R) {
    if (x < 180) return 'L Wing 3'
    if (x > 320) return 'R Wing 3'
    return 'Top 3'
  }

  // Inside the arc
  // Paint: x in [178,322] and y in [H-190, H-20]
  if (x >= 178 && x <= 322 && y >= H - 190 && y <= H - 20) return 'Paint'
  if (x < 180) return 'L Mid'
  if (x > 320) return 'R Mid'
  return 'Top Mid'
}

const ALL_ZONES = [
  'L Corner 3', 'L Wing 3', 'Top 3', 'R Wing 3', 'R Corner 3',
  'L Mid', 'Top Mid', 'R Mid', 'Paint',
]

// ─── Aggregation ─────────────────────────────────────────────────────────────
function aggregate(allGames) {
  const zones = Object.fromEntries(ALL_ZONES.map(z => [z, { made: 0, att: 0, shots: [] }]))
  let totalShots = []
  let totals = {
    games: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, to: 0, fouls: 0,
    fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0, wins: 0,
  }

  for (const g of allGames) {
    totals.games += 1
    totals.pts += g.points || 0
    totals.reb += g.rebounds || 0
    totals.ast += g.assists || 0
    totals.stl += g.steals || 0
    totals.blk += g.blocks || 0
    totals.to  += g.turnovers || 0
    totals.fouls += g.fouls || 0
    totals.fgm += g.field_goals_made || 0
    totals.fga += g.field_goals_attempted || 0
    totals.tpm += g.three_pointers_made || 0
    totals.tpa += g.three_pointers_attempted || 0
    totals.ftm += g.free_throws_made || 0
    totals.fta += g.free_throws_attempted || 0
    if (g.result === 'Win') totals.wins += 1

    if (Array.isArray(g._shots)) {
      for (const s of g._shots) {
        totalShots.push(s)
        const z = classifyZone(s.x, s.y)
        if (zones[z]) {
          zones[z].att += 1
          zones[z].shots.push(s)
          if (s.made) zones[z].made += 1
        }
      }
    }
  }

  const n = Math.max(totals.games, 1)
  const avg = {
    ppg: +(totals.pts / n).toFixed(1),
    rpg: +(totals.reb / n).toFixed(1),
    apg: +(totals.ast / n).toFixed(1),
    spg: +(totals.stl / n).toFixed(1),
    bpg: +(totals.blk / n).toFixed(1),
    topg: +(totals.to / n).toFixed(1),
    fgPct: totals.fga ? +((totals.fgm / totals.fga) * 100).toFixed(1) : 0,
    tpPct: totals.tpa ? +((totals.tpm / totals.tpa) * 100).toFixed(1) : 0,
    ftPct: totals.fta ? +((totals.ftm / totals.fta) * 100).toFixed(1) : 0,
    winPct: totals.games ? +((totals.wins / totals.games) * 100).toFixed(0) : 0,
  }

  // Best / worst zone (require ≥3 attempts so we don't crown a 1/1 zone)
  const qualified = ALL_ZONES
    .map(z => ({ zone: z, ...zones[z], pct: zones[z].att ? (zones[z].made / zones[z].att) * 100 : null }))
    .filter(z => z.att >= 3 && z.pct !== null)

  const best = qualified.length
    ? qualified.reduce((a, b) => (a.pct > b.pct ? a : b))
    : null
  const worst = qualified.length
    ? qualified.reduce((a, b) => (a.pct < b.pct ? a : b))
    : null

  // Trend: compare last 3 games vs previous 3 (PPG)
  const sorted = [...allGames].sort((a, b) =>
    (b.game_date || '').localeCompare(a.game_date || '')
  )
  const last3 = sorted.slice(0, 3)
  const prev3 = sorted.slice(3, 6)
  const last3Avg = last3.length ? last3.reduce((s, g) => s + (g.points || 0), 0) / last3.length : 0
  const prev3Avg = prev3.length ? prev3.reduce((s, g) => s + (g.points || 0), 0) / prev3.length : 0
  const trend = prev3.length ? +(last3Avg - prev3Avg).toFixed(1) : 0

  return { totals, avg, zones, totalShots, best, worst, trend }
}

// ─── Signature zone — find the tightest, highest-make cluster of shots. ────
// Bins shots into a 5×5 court grid, scores each bin by (make% × log(volume))
// so high-volume + high-accuracy wins over a 2/2 fluke, then reports the
// centroid + radius of the winning bin's shots for on-court rendering.
function computeSignatureZone(shots) {
  const list = shots || []
  if (list.length < 8) return null
  const GRID = 5
  const bins = new Map()
  for (const s of list) {
    if (s.x == null || s.y == null) continue
    const gx = Math.min(GRID - 1, Math.floor((s.x / W) * GRID))
    const gy = Math.min(GRID - 1, Math.floor((s.y / H) * GRID))
    const key = `${gx},${gy}`
    const cur = bins.get(key) || { shots: [], made: 0 }
    cur.shots.push(s)
    if (s.made) cur.made += 1
    bins.set(key, cur)
  }
  let best = null
  for (const [, bucket] of bins) {
    const att = bucket.shots.length
    if (att < 3) continue
    const pct = (bucket.made / att) * 100
    const score = pct * Math.log2(att + 1)
    if (!best || score > best.score) {
      const cx = bucket.shots.reduce((s, p) => s + p.x, 0) / att
      const cy = bucket.shots.reduce((s, p) => s + p.y, 0) / att
      const r = Math.max(
        22,
        Math.sqrt(
          bucket.shots.reduce((s, p) => s + ((p.x - cx) ** 2 + (p.y - cy) ** 2), 0) / att
        )
      )
      best = { cx, cy, r, att, made: bucket.made, pct: Math.round(pct), score }
    }
  }
  return best
}

// ─── Text feedback engine ────────────────────────────────────────────────────
// Generate plain-english coaching cues based on the aggregates.
function generateInsights({ avg, totals, best, worst, trend }) {
  const out = []

  if (totals.games === 0) return out

  if (best) {
    out.push({
      kind: 'strength',
      title: `Elite from ${best.zone}`,
      body: `You're shooting ${best.pct.toFixed(0)}% (${best.made}/${best.att}) from ${best.zone}. That's your money spot — keep hunting it.`,
    })
  }
  if (worst && worst.pct < 35) {
    out.push({
      kind: 'work',
      title: `${worst.zone} needs reps`,
      body: `${worst.pct.toFixed(0)}% (${worst.made}/${worst.att}) from ${worst.zone}. Add 50 reps per session here and track the climb.`,
    })
  }

  if (avg.fgPct >= 50) {
    out.push({ kind: 'strength', title: 'Efficient scorer', body: `${avg.fgPct}% FG is elite efficiency. You pick your spots.` })
  } else if (avg.fgPct > 0 && avg.fgPct < 38) {
    out.push({ kind: 'work', title: 'Shot selection check', body: `${avg.fgPct}% FG is on the low side. Focus on getting cleaner looks.` })
  }

  if (avg.tpPct >= 38) {
    out.push({ kind: 'strength', title: 'Deep threat', body: `${avg.tpPct}% from three will bend any defense.` })
  }

  if (avg.ftPct >= 80) {
    out.push({ kind: 'strength', title: 'Automatic at the line', body: `${avg.ftPct}% FT — defenses can't foul you out of a game.` })
  } else if (avg.ftPct > 0 && avg.ftPct < 65) {
    out.push({ kind: 'work', title: 'FT is free points', body: `${avg.ftPct}% FT. Add 50 free throws to every session.` })
  }

  if (trend > 2) {
    out.push({ kind: 'trend', title: 'Trending up', body: `Last 3 games: +${trend} PPG vs. your previous 3. The work is paying off.` })
  } else if (trend < -2) {
    out.push({ kind: 'trend', title: 'Cooling off', body: `Last 3 games: ${trend} PPG vs. previous. Time to get back in the gym.` })
  }

  if (avg.apg >= 5) {
    out.push({ kind: 'strength', title: 'Court vision', body: `${avg.apg} APG — you're making your teammates better.` })
  }
  if (avg.topg > 4) {
    out.push({ kind: 'work', title: 'Protect the ball', body: `${avg.topg} TO per game. Slow down on the first dribble.` })
  }

  return out.slice(0, 6)
}

// ─── Heat map court SVG ──────────────────────────────────────────────────────
function HeatCourt({ shots, signature }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', display: 'block' }}>
      <defs>
        <radialGradient id="iqCourtGrad" cx="50%" cy="85%" r="75%">
          <stop offset="0%" stopColor="#0F1524" />
          <stop offset="100%" stopColor="#05070E" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx="8" fill="url(#iqCourtGrad)" />
      {/* Court lines */}
      <g stroke="rgba(100,200,255,0.45)" strokeWidth="2" fill="none">
        <rect x="18" y="10" width={W - 36} height={H - 20} rx="4" />
        <rect x="178" y={H - 190} width={144} height="170" />
        <path d={`M 178 ${H - 190} A 72 72 0 0 1 322 ${H - 190}`} />
        <path d={`M 178 ${H - 190} A 72 72 0 0 0 322 ${H - 190}`} strokeDasharray="8 6" />
        <path
          d={`M ${CORNER_3_X_LEFT} ${CORNER_3_Y}
              L ${CORNER_3_X_LEFT} ${CORNER_BREAK_Y}
              A ${ARC_R} ${ARC_R} 0 0 1 ${CORNER_3_X_RIGHT} ${CORNER_BREAK_Y}
              L ${CORNER_3_X_RIGHT} ${CORNER_3_Y}`}
        />
        <path d={`M ${BASKET_X - 48} ${H - 20} A 48 48 0 0 1 ${BASKET_X + 48} ${H - 20}`} />
        <line x1={BASKET_X - 55} y1={H - 28} x2={BASKET_X + 55} y2={H - 28} strokeWidth={4} />
      </g>
      <circle cx={BASKET_X} cy={BASKET_Y} r="14" fill="none" stroke="#FF6B35" strokeWidth="3" />
      {/* Signature zone — the tightest high-make cluster, drawn beneath the dots */}
      {signature && (
        <g>
          <defs>
            <radialGradient id="sigGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#FFD700" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle
            cx={signature.cx}
            cy={signature.cy}
            r={signature.r + 8}
            fill="url(#sigGrad)"
          />
          <circle
            cx={signature.cx}
            cy={signature.cy}
            r={signature.r}
            fill="none"
            stroke="#FFD700"
            strokeOpacity="0.85"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          <text
            x={signature.cx}
            y={signature.cy - signature.r - 8}
            textAnchor="middle"
            fill="#FFD700"
            fontSize="14"
            fontWeight="900"
            style={{ textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            Signature {signature.pct}%
          </text>
        </g>
      )}
      {/* Shot dots — green made, red missed, translucent so density reads as heat */}
      {shots.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="8"
          fill={s.made ? '#39FF88' : '#FF2D55'}
          fillOpacity="0.55"
          stroke={s.made ? '#39FF88' : '#FF2D55'}
          strokeOpacity="0.9"
          strokeWidth="1.2"
        />
      ))}
    </svg>
  )
}

// ─── Mini stat card ──────────────────────────────────────────────────────────
function StatTile({ label, value, color, suffix }) {
  return (
    <div
      style={{
        flex: '1 1 0',
        minWidth: '70px',
        padding: '14px 8px',
        borderRadius: '14px',
        border: `1px solid ${color}35`,
        background: `linear-gradient(160deg, ${color}18, ${color}06)`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '26px', fontWeight: 900, color, letterSpacing: '-1px', lineHeight: 1 }}>
        {value}
        {suffix && <span style={{ fontSize: '14px', marginLeft: '2px' }}>{suffix}</span>}
      </div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.8px', marginTop: '4px', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function MyIQ() {
  const navigate = useNavigate()
  const { allGames, loading } = useGames()
  const { drills, categoryStats, recentStreak } = useDrills()
  const { allEntries: journalEntries } = useJournal()
  const { isPro } = usePremium()
  const { showToast } = useToast()
  const { profile } = useAuth()

  const data = useMemo(() => aggregate(allGames || []), [allGames])
  const insights = useMemo(() => generateInsights(data), [data])
  const signatureZone = useMemo(() => computeSignatureZone(data.totalShots), [data.totalShots])

  // Training Load aggregates drill completions into a single coach's-eye view.
  const training = useMemo(() => {
    const list = drills || []
    const totalSessions = list.length
    const totalMinutes = list.reduce((s, d) => s + (Number(d.duration_minutes) || 0), 0)
    // Weekly sessions — last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const last7 = list.filter(d => new Date(d.session_date).getTime() >= weekAgo).length
    // Top category by minutes
    let topCat = null
    let topMin = 0
    Object.entries(categoryStats || {}).forEach(([cat, s]) => {
      if (s.totalMinutes > topMin) { topMin = s.totalMinutes; topCat = cat }
    })
    return { totalSessions, totalMinutes, last7, topCat, topMin, streak: recentStreak || 0 }
  }, [drills, categoryStats, recentStreak])

  // Mental Game: surface journal data in MyIQ so the mental side of the
  // game gets the same weight as the physical side. This is a key
  // differentiator — shown to free users on purpose as a retention hook.
  const mentalGame = useMemo(() => {
    const list = (journalEntries || []).filter(e => e.mental_game_score != null)
    if (list.length === 0) return null
    // Sort ascending by date for the trend line
    const sorted = [...list].sort(
      (a, b) => (a.entry_date || '').localeCompare(b.entry_date || '')
    )
    const last30 = sorted.slice(-30).map((e, idx) => ({
      day: idx + 1,
      score: +(e.mental_game_score || 0),
      date: e.entry_date || '',
    }))
    // Average across all journal entries
    const avgScore = +(list.reduce((s, e) => s + (e.mental_game_score || 0), 0) / list.length).toFixed(1)
    // Mood distribution over last 30 entries
    const moodCounts = {}
    list.slice(-30).forEach((e) => {
      const m = e.mood || 'Okay'
      moodCounts[m] = (moodCounts[m] || 0) + 1
    })
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null
    return {
      count: list.length,
      avgScore,
      last30,
      topMood,
      latest: sorted[sorted.length - 1],
    }
  }, [journalEntries])

  // Radar chart data for season-level "Player Profile" view (Pro). Maps
  // season averages onto the same 6-axis layout used in per-game review,
  // but at a seasonal scale so the scores are interpretable across games.
  const seasonRadar = useMemo(() => {
    const avg = data?.avg || {}
    const scoring = Math.min(100, ((avg.ppg || 0) / 25) * 100)
    const shooting = Math.min(100, ((avg.fgPct || 0) / 55) * 100)
    const playmaking = Math.min(100, ((avg.apg || 0) / 8) * 100)
    const defense = Math.min(100, (((avg.spg || 0) + (avg.bpg || 0)) / 4) * 100)
    const hustle = Math.min(100, ((avg.rpg || 0) / 10) * 100)
    const efficiency = Math.min(100, ((avg.winPct || 0) / 70) * 100)
    return [scoring, shooting, playmaking, defense, hustle, efficiency]
  }, [data])

  // Last-10 trend data for Points + FG% line charts
  const last10Trend = useMemo(() => {
    const last = [...(allGames || [])]
      .sort((a, b) => (a.game_date || '').localeCompare(b.game_date || ''))
      .slice(-10)
    return last.map((g, i) => {
      const fga = g.field_goals_attempted || 0
      const fgm = g.field_goals_made || 0
      return {
        game: `G${i + 1}`,
        pts: g.points || 0,
        fgPct: fga > 0 ? Math.round((fgm / fga) * 100) : 0,
      }
    })
  }, [allGames])

  // CSV export (Pro). Exports every saved game as a single CSV file
  // users can open in Excel / Google Sheets / Numbers.
  const handleExportCSV = useCallback(() => {
    const rows = allGames || []
    if (rows.length === 0) {
      showToast('No games to export yet', 'info')
      return
    }
    const headers = [
      'date', 'opponent', 'result', 'points', 'rebounds', 'assists', 'steals',
      'blocks', 'turnovers', 'fouls', 'fg_made', 'fg_attempted', 'three_made',
      'three_attempted', 'ft_made', 'ft_attempted',
    ]
    const escape = (v) => {
      const s = v == null ? '' : String(v)
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }
    const lines = [headers.join(',')]
    rows.forEach((g) => {
      lines.push([
        g.game_date, g.opponent, g.result, g.points, g.rebounds, g.assists, g.steals,
        g.blocks, g.turnovers, g.fouls, g.field_goals_made, g.field_goals_attempted,
        g.three_pointers_made, g.three_pointers_attempted,
        g.free_throws_made, g.free_throws_attempted,
      ].map(escape).join(','))
    })
    const csv = lines.join('\n')
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const stamp = localToday()
      a.href = url
      a.download = `courtiq-stats-${stamp}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      showToast(`Exported ${rows.length} games`, 'success')
    } catch {
      showToast('Export failed', 'error')
    }
  }, [allGames, showToast])

  // AI Coach — calls Claude edge function (or local rules in BYPASS_AUTH mode).
  const [aiInsights, setAiInsights] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSource, setAiSource] = useState(null)
  const aiReqRef = useRef(0)

  const runAI = useCallback(async () => {
    const shotsArr = data?.totalShots || []
    const shotsCount = shotsArr.length
    const madeCount = shotsArr.filter(s => s.made).length
    if (shotsCount === 0 && training.totalSessions === 0 && (allGames || []).length === 0) return
    const myReq = ++aiReqRef.current
    setAiLoading(true)
    const summary = {
      games: {
        count: (allGames || []).length,
        avgPts: Math.round(data?.avg?.ppg || 0),
        avgFgPct: Math.round((data?.avg?.fgPct || 0) * 10) / 10,
      },
      shots: {
        total: shotsCount,
        made: madeCount,
        pct: shotsCount ? Math.round((madeCount / shotsCount) * 100) : 0,
      },
      signature: signatureZone ? { pct: signatureZone.pct, attempts: signatureZone.att } : null,
      training,
    }
    try {
      const res = await fetchInsights({
        summary,
        player: { name: profile?.full_name, position: profile?.position, level: profile?.skill_level },
      })
      if (myReq !== aiReqRef.current) return // a newer request superseded us
      setAiInsights(res.insights || [])
      setAiSource(res.source || null)
    } catch {
      /* noop */
    } finally {
      if (myReq === aiReqRef.current) setAiLoading(false)
    }
  }, [allGames, data, training, signatureZone, profile?.full_name, profile?.position, profile?.skill_level])

  useEffect(() => {
    runAI()
  }, [runAI])

  if (loading && (!allGames || allGames.length === 0)) {
    return (
      <PageWrapper>
        <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-sec)' }}>
          Loading your IQ…
        </div>
      </PageWrapper>
    )
  }

  if ((!allGames || allGames.length === 0) && training.totalSessions === 0) {
    // Read-only empty state: My IQ is the home for your accumulated story,
    // not a place to start a session. We keep the messaging instructive
    // but deliberately do NOT render an action button here — users start
    // games from the Gametime tab in the bottom nav.
    return (
      <PageWrapper>
        <EmptyState
          icon={BarChart3}
          title="My IQ"
          description="Your shooting heat map, season averages, and coaching feedback will appear here as you play. Head to Gametime in the bottom nav to start logging."
        />
      </PageWrapper>
    )
  }

  const { avg, totals, zones, totalShots, trend } = data

  return (
    <PageWrapper>
      {/* Title */}
      <div style={{ padding: '6px 0 14px' }}>
        <h1 className="t-title2" style={{ marginBottom: '2px' }}>
          My <span style={{ color: 'var(--color-accent)' }}>IQ</span>
        </h1>
        <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
          Everything your game is telling us, in one place.
        </p>
      </div>

      {/* Season headline */}
      <Card padding="md" style={{ marginBottom: '12px' }}>
        <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
          <Trophy size={16} style={{ color: 'var(--color-accent)' }} />
          <span className="section-label">Season Totals · {totals.games} {totals.games === 1 ? 'game' : 'games'}</span>
          {trend !== 0 && (
            <span
              className="flex items-center gap-1"
              style={{
                marginLeft: 'auto',
                fontSize: '11px',
                fontWeight: 800,
                color: trend > 0 ? '#22C55E' : '#EF4444',
              }}
            >
              {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trend > 0 ? '+' : ''}{trend} PPG L3
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <StatTile label="PPG"  value={avg.ppg}  color="#FF6B35" />
          <StatTile label="RPG"  value={avg.rpg}  color="#3B82F6" />
          <StatTile label="APG"  value={avg.apg}  color="#22C55E" />
          <StatTile label="SPG"  value={avg.spg}  color="#A78BFA" />
          <StatTile label="BPG"  value={avg.bpg}  color="#F59E0B" />
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
          <StatTile label="FG%"  value={avg.fgPct} color="#22C55E" suffix="%" />
          <StatTile label="3P%"  value={avg.tpPct} color="#3B82F6" suffix="%" />
          <StatTile label="FT%"  value={avg.ftPct} color="#F59E0B" suffix="%" />
          <StatTile label="WIN%" value={avg.winPct} color="#FF6B35" suffix="%" />
        </div>
      </Card>

      {/* Mental Game — unique to CourtIQ. Surfaces journal data in the
          season dashboard so the mental side of the game gets equal weight.
          Shown to free users on purpose as a retention hook. */}
      {mentalGame && (
        <Card padding="md" style={{ marginBottom: '12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <span className="section-label flex items-center gap-2">
              <Brain size={14} style={{ color: '#A78BFA' }} /> Mental Game
            </span>
            <button
              onClick={() => navigate('/journal')}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--color-accent)', fontSize: '11px', fontWeight: 800,
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.3px',
              }}
            >
              Journal →
            </button>
          </div>

          {/* Top-line stats row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <StatTile label="SCORE" value={mentalGame.avgScore} color="#A78BFA" suffix="/10" />
            <StatTile label="ENTRIES" value={mentalGame.count} color="#3B82F6" />
            {mentalGame.topMood && (
              <div style={{
                flex: 1, minWidth: '72px',
                padding: '10px 12px', borderRadius: '12px',
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.25)',
                display: 'flex', flexDirection: 'column', gap: '3px',
              }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.6px' }}>MOOD</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#A78BFA' }}>{mentalGame.topMood}</span>
              </div>
            )}
          </div>

          {/* Trend line (last ~30 entries) */}
          {mentalGame.last30.length >= 2 && (
            <div style={{ height: '100px', margin: '0 -6px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mentalGame.last30}>
                  <defs>
                    <linearGradient id="mentalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" hide />
                  <YAxis domain={[0, 10]} hide />
                  <Tooltip
                    contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                    itemStyle={{ color: '#A78BFA' }}
                    formatter={(v) => [`${v}/10`, 'Score']}
                  />
                  <Line type="monotone" dataKey="score" stroke="url(#mentalGrad)" strokeWidth={2.5} dot={{ fill: '#A78BFA', r: 2 }} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      )}

      {/* Recent games — lives here now that Game Log was removed from the
          bottom nav. Shows the 5 most recent saved games so users can still
          scan individual box scores without leaving My IQ. */}
      {(allGames || []).length > 0 && (
        <Card padding="md" style={{ marginBottom: '12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <span className="section-label flex items-center gap-2">
              <Trophy size={14} style={{ color: 'var(--color-accent)' }} />
              Recent Games
            </span>
            {(allGames || []).length > 5 && (
              <button
                onClick={() => navigate('/games')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-accent)',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.3px',
                }}
              >
                View all →
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(allGames || []).slice(0, 5).map((g, i) => {
              const d = g.game_date ? parseLocalDate(g.game_date) : null
              const dateLabel = d
                ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : '—'
              const isWin = g.result === 'Win'
              const resultColor = isWin ? '#22C55E' : g.result === 'Loss' ? '#EF4444' : 'rgba(255,255,255,0.3)'
              return (
                <div
                  key={g.id || i}
                  onClick={() => navigate('/games')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: `${resultColor}18`,
                      border: `1px solid ${resultColor}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 900,
                      color: resultColor,
                      flexShrink: 0,
                    }}
                  >
                    {g.result ? g.result.charAt(0) : '—'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--color-text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      vs {g.opponent || 'Opponent'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-sec)', marginTop: '1px' }}>
                      {dateLabel}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1 }}>
                        {g.points || 0}
                      </div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: '2px', letterSpacing: '0.5px' }}>
                        PTS
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#3B82F6', lineHeight: 1 }}>
                        {g.rebounds || 0}
                      </div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: '2px', letterSpacing: '0.5px' }}>
                        REB
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#22C55E', lineHeight: 1 }}>
                        {g.assists || 0}
                      </div>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: '2px', letterSpacing: '0.5px' }}>
                        AST
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Heat map */}
      <Card padding="md" style={{ marginBottom: '12px' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
          <span className="section-label flex items-center gap-2">
            <Flame size={14} style={{ color: 'var(--color-accent)' }} /> Shot Heat Map
          </span>
          <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
            {totalShots.length} shots
          </span>
        </div>
        {totalShots.length > 0 ? (
          <div style={{ borderRadius: '14px', overflow: 'hidden' }}>
            <HeatCourt shots={totalShots} signature={signatureZone} />
          </div>
        ) : (
          <p className="t-caption" style={{ color: 'var(--color-text-sec)', textAlign: 'center', padding: '20px' }}>
            Log shots in Gametime to build your heat map.
          </p>
        )}
      </Card>

      {/* Zone breakdown */}
      <Card padding="md" style={{ marginBottom: '12px' }}>
        <div className="section-label flex items-center gap-2" style={{ marginBottom: '10px' }}>
          <Target size={14} style={{ color: 'var(--color-accent)' }} /> Zone Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ALL_ZONES.map((zone) => {
            const z = zones[zone]
            const pct = z.att ? Math.round((z.made / z.att) * 100) : 0
            const barColor = z.att === 0
              ? 'rgba(255,255,255,0.1)'
              : pct >= 50 ? '#22C55E' : pct >= 35 ? '#F59E0B' : '#EF4444'
            return (
              <div key={zone} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '92px', fontSize: '12px', color: 'var(--color-text-sec)', fontWeight: 600 }}>{zone}</span>
                <div style={{ flex: 1, height: '10px', borderRadius: '6px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.max(z.att ? pct : 0, z.att ? 4 : 0)}%`,
                      height: '100%',
                      background: barColor,
                      borderRadius: '6px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <span style={{ width: '68px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: z.att ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                  {z.att ? `${z.made}/${z.att} ${pct}%` : '—'}
                </span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Training Load — drill aggregation */}
      {training.totalSessions > 0 && (
        <Card padding="md" style={{ marginBottom: '12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <span className="section-label flex items-center gap-2">
              <Dumbbell size={14} style={{ color: 'var(--color-accent)' }} /> Training Load
            </span>
            {training.streak > 0 && (
              <span
                className="flex items-center gap-1"
                style={{ fontSize: '11px', fontWeight: 800, color: '#F59E0B' }}
              >
                <Flame size={12} /> {training.streak}d streak
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <StatTile label="Sessions" value={training.totalSessions} color="#22C55E" />
            <StatTile label="Minutes" value={training.totalMinutes} color="#3B82F6" />
            <StatTile label="Last 7d" value={training.last7} color="#A78BFA" />
          </div>
          {training.topCat && (
            <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '10px' }}>
              Most time on <b style={{ color: 'var(--color-text)' }}>{training.topCat}</b> ({training.topMin} min)
            </p>
          )}
        </Card>
      )}

      {/* AI Coach insights */}
      {(aiLoading || aiInsights.length > 0) && (
        <Card padding="md" style={{ marginBottom: '12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
            <div className="section-label flex items-center gap-2">
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              Coach AI
              {aiSource === 'claude' && (
                <span style={{ fontSize: '10px', color: 'var(--color-accent)', fontWeight: 700, marginLeft: '4px' }}>
                  · Claude
                </span>
              )}
            </div>
            <button
              onClick={runAI}
              disabled={aiLoading}
              aria-label="Refresh coach insights"
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-sec)',
                borderRadius: '8px',
                padding: '4px 8px',
                cursor: aiLoading ? 'default' : 'pointer',
                opacity: aiLoading ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'inherit',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <RefreshCw
                size={11}
                style={{
                  animation: aiLoading ? 'spin 0.8s linear infinite' : 'none',
                }}
              />
              Refresh
            </button>
          </div>
          {aiLoading && aiInsights.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    borderLeft: '3px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <div
                    style={{
                      width: '40%',
                      height: '12px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.08)',
                      marginBottom: '8px',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '90%',
                      height: '10px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.06)',
                      marginBottom: '5px',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      width: '70%',
                      height: '10px',
                      borderRadius: '4px',
                      background: 'rgba(255,255,255,0.06)',
                      animation: 'pulse 1.4s ease-in-out infinite',
                    }}
                  />
                </div>
              ))}
              <style>{`@keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {aiInsights.map((ins, i) => {
                const tagColor = ins.tag === 'shooting' ? '#F59E0B'
                  : ins.tag === 'gametime' ? '#3B82F6'
                  : ins.tag === 'training' ? '#22C55E'
                  : '#A855F7'
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      borderLeft: `3px solid ${tagColor}`,
                      background: `${tagColor}10`,
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: 800, color: tagColor, marginBottom: '3px' }}>
                      {ins.title}
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.45 }}>
                      {ins.body}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Card padding="md" style={{ marginBottom: '12px' }}>
          <div className="section-label flex items-center gap-2" style={{ marginBottom: '10px' }}>
            <Sparkles size={14} style={{ color: 'var(--color-accent)' }} /> Insights
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {insights.map((ins, i) => {
              const accent = ins.kind === 'strength' ? '#22C55E'
                : ins.kind === 'work' ? '#F59E0B'
                : '#3B82F6'
              return (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    borderLeft: `3px solid ${accent}`,
                    background: `${accent}10`,
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: accent, marginBottom: '3px' }}>
                    {ins.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.45 }}>
                    {ins.body}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Pro-gated advanced analytics */}
      {!isPro && (
        <Card
          padding="md"
          hover
          onClick={() => navigate('/premium')}
          style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.35)' }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #D97706, #FBBF24)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Crown size={20} style={{ color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center gap-2">
                <span style={{ fontWeight: 800, color: '#FBBF24' }}>Unlock Advanced IQ</span>
                <Lock size={12} style={{ color: '#FBBF24' }} />
              </div>
              <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginTop: '3px' }}>
                Radar chart · archetype detection · last-10 trend graphs · export your data
              </p>
            </div>
          </div>
        </Card>
      )}

      {isPro && (
        <>
          {/* Pro · Archetype */}
          <Card padding="md" style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
            <div className="section-label flex items-center gap-2" style={{ marginBottom: '10px' }}>
              <Crown size={14} style={{ color: '#FBBF24' }} /> Pro · Archetype
            </div>
            <p className="t-body" style={{ color: 'var(--color-text)' }}>
              {(() => {
                if (avg.tpPct >= 38 && avg.ppg >= 15) return 'Sniper — you live beyond the arc and you make defenses pay.'
                if (avg.apg >= 5 && avg.topg < 3) return 'Floor General — you set the table and don\'t turn it over.'
                if (avg.rpg >= 8 && avg.bpg >= 1) return 'Anchor — glass-crashing rim protector.'
                if (avg.spg >= 2) return 'Menace — you disrupt everything on the defensive end.'
                if (avg.fgPct >= 50) return 'Efficient Finisher — no wasted possessions.'
                return 'Two-Way — balanced profile, keep stacking games.'
              })()}
            </p>
          </Card>

          {/* Pro · Season Radar */}
          {(allGames || []).length > 0 && (
            <Card padding="md" style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div className="section-label flex items-center gap-2" style={{ marginBottom: '12px' }}>
                <Crown size={14} style={{ color: '#FBBF24' }} /> Pro · Season Profile
              </div>
              <RadarChart data={seasonRadar} title="" />
            </Card>
          )}

          {/* Pro · Last-10 Points Trend */}
          {last10Trend.length >= 2 && (
            <Card padding="md" style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
                <span className="section-label flex items-center gap-2">
                  <Crown size={14} style={{ color: '#FBBF24' }} /> Pro · Last 10 — Points
                </span>
                <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
                  {last10Trend.length} games
                </span>
              </div>
              <div style={{ height: '140px', margin: '0 -6px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last10Trend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="game" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip
                      contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                      itemStyle={{ color: '#FF6B35' }}
                    />
                    <Line type="monotone" dataKey="pts" stroke="#FF6B35" strokeWidth={2.5} dot={{ fill: '#FF6B35', r: 3 }} activeDot={{ r: 5 }} name="Points" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Pro · Last-10 FG% Trend */}
          {last10Trend.length >= 2 && (
            <Card padding="md" style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
              <div className="section-label flex items-center gap-2" style={{ marginBottom: '10px' }}>
                <Crown size={14} style={{ color: '#FBBF24' }} /> Pro · Last 10 — Field Goal %
              </div>
              <div style={{ height: '140px', margin: '0 -6px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last10Trend}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="game" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{ background: '#0D0D1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '11px' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                      itemStyle={{ color: '#22C55E' }}
                      formatter={(v) => [`${v}%`, 'FG%']}
                    />
                    <Line type="monotone" dataKey="fgPct" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: '#22C55E', r: 3 }} activeDot={{ r: 5 }} name="FG%" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Pro · Export */}
          <Card padding="md" style={{ marginBottom: '12px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <div className="section-label flex items-center gap-2" style={{ marginBottom: '10px' }}>
              <Crown size={14} style={{ color: '#FBBF24' }} /> Pro · Export Data
            </div>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: '12px' }}>
              Download every saved game as a CSV for Excel, Google Sheets, or Numbers.
            </p>
            <button
              onClick={handleExportCSV}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                background: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.04))',
                color: '#FBBF24', cursor: 'pointer', fontFamily: 'inherit',
                fontWeight: 800, fontSize: '13px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Download size={15} /> Export Season CSV
            </button>
          </Card>
        </>
      )}

      {/* My IQ is read-only by design — no "Start Gametime" CTA here.
          Users start games from the Gametime bottom-nav tab. */}
      <div style={{ height: '96px' }} />
    </PageWrapper>
  )
}
