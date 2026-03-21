import { useMemo } from 'react'
import { Lightbulb, TrendingUp, TrendingDown, AlertTriangle, Trophy, Target, Flame } from 'lucide-react'

const INSIGHT_TYPES = {
  strength: { icon: Trophy, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
  weakness: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
  trend_up: { icon: TrendingUp, color: 'text-blue', bg: 'bg-blue/10', border: 'border-blue-border' },
  trend_down: { icon: TrendingDown, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
  tip: { icon: Target, color: 'text-blue', bg: 'bg-blue/5', border: 'border-blue-border/30' },
  streak: { icon: Flame, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/30' },
}

function generateInsights(games, drills, shots) {
  const insights = []
  if (games.length < 2 && drills.length < 2) return [{ type: 'tip', title: 'Log more data', body: 'Play at least 2 games and a few drills so we can generate personalized insights.' }]

  // ── Game-based insights ──
  if (games.length >= 3) {
    const recent5 = games.slice(0, 5)
    const avgPts = recent5.reduce((s, g) => s + (g.points || 0), 0) / recent5.length
    const avgReb = recent5.reduce((s, g) => s + (g.rebounds || 0), 0) / recent5.length
    const avgAst = recent5.reduce((s, g) => s + (g.assists || 0), 0) / recent5.length

    // Scoring trend
    if (games.length >= 6) {
      const older5 = games.slice(5, 10)
      if (older5.length >= 3) {
        const oldAvgPts = older5.reduce((s, g) => s + (g.points || 0), 0) / older5.length
        const pctChange = oldAvgPts > 0 ? Math.round(((avgPts - oldAvgPts) / oldAvgPts) * 100) : 0
        if (pctChange >= 15) {
          insights.push({ type: 'trend_up', title: 'Scoring surge', body: `Averaging ${avgPts.toFixed(1)} PTS in your last 5 games — up ${pctChange}% from previous games.` })
        } else if (pctChange <= -15) {
          insights.push({ type: 'trend_down', title: 'Scoring dip', body: `Averaging ${avgPts.toFixed(1)} PTS lately — down ${Math.abs(pctChange)}%. Consider more shooting drills.` })
        }
      }
    }

    // Win rate insight
    const wins = recent5.filter(g => g.result === 'Win').length
    const winPct = Math.round((wins / recent5.length) * 100)
    if (winPct >= 80) {
      insights.push({ type: 'strength', title: 'Winning machine', body: `${winPct}% win rate in your last ${recent5.length} games. Keep this momentum going!` })
    } else if (winPct <= 20 && recent5.length >= 3) {
      insights.push({ type: 'weakness', title: 'Tough stretch', body: `Only ${wins} win${wins !== 1 ? 's' : ''} in last ${recent5.length} games. Focus on fundamentals and team play.` })
    }

    // Stat balance
    if (avgPts >= 15 && avgAst < 2) {
      insights.push({ type: 'tip', title: 'Look to pass more', body: `Strong scoring (${avgPts.toFixed(1)} PPG) but averaging only ${avgAst.toFixed(1)} assists. Try involving teammates more.` })
    }
    if (avgAst >= 5 && avgPts < 8) {
      insights.push({ type: 'tip', title: 'Be more aggressive', body: `Great playmaking (${avgAst.toFixed(1)} APG) but scoring could improve. Look for your own shot more.` })
    }
    if (avgReb >= 8) {
      insights.push({ type: 'strength', title: 'Glass cleaner', body: `Averaging ${avgReb.toFixed(1)} rebounds — you dominate the boards. Keep crashing.` })
    }
  }

  // ── Shot-based insights ──
  if (shots.length >= 10) {
    const made = shots.filter(s => s.made).length
    const pct = Math.round((made / shots.length) * 100)
    if (pct >= 50) {
      insights.push({ type: 'strength', title: 'Sharpshooter', body: `${pct}% overall shooting from ${shots.length} tracked shots. Elite efficiency.` })
    } else if (pct < 35) {
      insights.push({ type: 'weakness', title: 'Shooting needs work', body: `${pct}% shooting accuracy. Focus on form and repetition in practice.` })
    }

    // Zone analysis
    const zoneMap = {}
    shots.forEach(s => {
      if (!zoneMap[s.zone_id]) zoneMap[s.zone_id] = { made: 0, total: 0 }
      zoneMap[s.zone_id].total++
      if (s.made) zoneMap[s.zone_id].made++
    })
    const zones = Object.entries(zoneMap).filter(([, v]) => v.total >= 5)
    if (zones.length >= 2) {
      const best = zones.reduce((a, b) => (a[1].made / a[1].total) > (b[1].made / b[1].total) ? a : b)
      const worst = zones.reduce((a, b) => (a[1].made / a[1].total) < (b[1].made / b[1].total) ? a : b)
      const bestPct = Math.round((best[1].made / best[1].total) * 100)
      const worstPct = Math.round((worst[1].made / worst[1].total) * 100)
      const formatZone = id => id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      if (bestPct - worstPct >= 20) {
        insights.push({ type: 'tip', title: `Work on: ${formatZone(worst[0])}`, body: `${worstPct}% from ${formatZone(worst[0])} vs ${bestPct}% from ${formatZone(best[0])}. Spend extra reps in your weak zone.` })
      }
    }
  }

  // ── Drill consistency ──
  if (drills.length >= 5) {
    const last14 = new Date()
    last14.setDate(last14.getDate() - 14)
    const last14Str = last14.toISOString().split('T')[0]
    const recentDrills = drills.filter(d => d.session_date >= last14Str)
    if (recentDrills.length >= 7) {
      insights.push({ type: 'streak', title: 'Training warrior', body: `${recentDrills.length} drill sessions in 14 days. Your consistency is paying off.` })
    } else if (recentDrills.length <= 1) {
      insights.push({ type: 'tip', title: 'Get back to training', body: `Only ${recentDrills.length} drill${recentDrills.length !== 1 ? 's' : ''} in the last 2 weeks. Schedule dedicated practice time.` })
    }
  }

  return insights.length > 0 ? insights : [{ type: 'tip', title: 'Keep going!', body: 'Log more games and drills to unlock deeper insights about your game.' }]
}

export default function SmartInsights({ games = [], drills = [], shots = [] }) {
  const insights = useMemo(() => generateInsights(games, drills, shots), [games, drills, shots])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb size={14} className="text-gold" />
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Smart Insights</h2>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const config = INSIGHT_TYPES[insight.type] || INSIGHT_TYPES.tip
          const Icon = config.icon
          return (
            <div key={i} className={`rounded-xl ${config.bg} border ${config.border} p-3.5 flex gap-3`}>
              <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon size={16} className={config.color} />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold text-text-primary">{insight.title}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{insight.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
