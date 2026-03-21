import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, TrendingUp, Target, Percent, Download, ArrowUp, ArrowDown, Minus, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts'
import { useGames } from '../hooks/useGames'
import { useShots } from '../hooks/useShots'
import { useToast } from '../contexts/ToastContext'
import PageShell from '../components/ui/PageShell'
import SectionHeader from '../components/ui/SectionHeader'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-bg-card border border-border px-3 py-2 text-xs shadow-lg">
      <p className="text-text-muted">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  )
}

const RANGES = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
  { key: 'all', label: 'All', days: null },
]

function daysAgo(days) {
  if (!days) return null
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().split('T')[0]
}

export default function Analytics() {
  const navigate = useNavigate()
  const { games: allGames } = useGames()
  const { shots: allShots, stats: allShotStats } = useShots()
  const toast = useToast()
  const [range, setRange] = useState('all')

  const cutoff = daysAgo(RANGES.find(r => r.key === range)?.days)
  const games = useMemo(() => cutoff ? allGames.filter(g => g.game_date >= cutoff) : allGames, [allGames, cutoff])
  const shots = useMemo(() => cutoff ? allShots.filter(s => s.session_date >= cutoff) : allShots, [allShots, cutoff])
  const shotStats = useMemo(() => {
    const made = shots.filter(s => s.made).length
    const total = shots.length
    return { total, made, percentage: total > 0 ? Math.round((made / total) * 100) : 0 }
  }, [shots])

  // Game averages
  const avgStats = useMemo(() => {
    if (games.length === 0) return { ppg: 0, rpg: 0, apg: 0, fgPct: 0 }
    const totals = games.reduce(
      (acc, g) => ({
        pts: acc.pts + g.points,
        reb: acc.reb + g.rebounds,
        ast: acc.ast + g.assists,
        fgm: acc.fgm + g.fg_made,
        fga: acc.fga + g.fg_attempted,
      }),
      { pts: 0, reb: 0, ast: 0, fgm: 0, fga: 0 }
    )
    return {
      ppg: (totals.pts / games.length).toFixed(1),
      rpg: (totals.reb / games.length).toFixed(1),
      apg: (totals.ast / games.length).toFixed(1),
      fgPct: totals.fga > 0 ? Math.round((totals.fgm / totals.fga) * 100) : 0,
    }
  }, [games])

  // Game trend data (last 10 games, oldest first)
  const gameTrend = useMemo(() => {
    return games
      .slice(0, 10)
      .reverse()
      .map(g => {
        const date = new Date(g.game_date + 'T12:00:00')
        return {
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          PTS: g.points,
          REB: g.rebounds,
          AST: g.assists,
        }
      })
  }, [games])

  // Shooting by zone
  const zoneBreakdown = useMemo(() => {
    const map = {}
    shots.forEach(s => {
      if (!map[s.zone_id]) map[s.zone_id] = { made: 0, total: 0 }
      map[s.zone_id].total++
      if (s.made) map[s.zone_id].made++
    })
    return Object.entries(map)
      .map(([zone, stat]) => ({
        zone: zone.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        'FG%': Math.round((stat.made / stat.total) * 100),
        shots: stat.total,
      }))
      .sort((a, b) => b.shots - a.shots)
      .slice(0, 8)
  }, [shots])

  // Win/Loss record
  const record = useMemo(() => {
    const w = games.filter(g => g.result === 'Win').length
    const l = games.filter(g => g.result === 'Loss').length
    return { w, l, pct: (w + l) > 0 ? Math.round((w / (w + l)) * 100) : 0 }
  }, [games])

  // Personal records
  const personalRecords = useMemo(() => {
    if (games.length === 0) return null
    return {
      pts: Math.max(...games.map(g => g.points)),
      reb: Math.max(...games.map(g => g.rebounds)),
      ast: Math.max(...games.map(g => g.assists)),
      stl: Math.max(...games.map(g => g.steals)),
      blk: Math.max(...games.map(g => g.blocks)),
    }
  }, [games])

  function exportCSV() {
    if (games.length === 0) { toast('No game data to export', 'info'); return }
    const headers = ['Date', 'Opponent', 'Result', 'PTS', 'REB', 'AST', 'STL', 'BLK', 'TO', 'FG Made', 'FG Att', '3P Made', '3P Att', 'FT Made', 'FT Att']
    const rows = games.map(g => [
      g.game_date, g.opponent || '', g.result || '',
      g.points, g.rebounds, g.assists, g.steals, g.blocks, g.turnovers,
      g.fg_made, g.fg_attempted, g.three_made, g.three_attempted, g.ft_made, g.ft_attempted,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `courtiq-games-${range}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast('CSV exported!')
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <SectionHeader
          title="Analytics"
          subtitle="Your performance at a glance."
          action={
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Export CSV"
            >
              <Download size={14} />
              Export
            </button>
          }
        />

        {/* Date Range Tabs */}
        <div className="flex gap-2 bg-bg-card border border-border rounded-xl p-1">
          {RANGES.map(r => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                range === r.key
                  ? 'bg-blue text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Season Averages */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Season Averages
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="PPG" value={avgStats.ppg} icon={TrendingUp} />
            <StatCard label="RPG" value={avgStats.rpg} icon={BarChart3} />
            <StatCard label="APG" value={avgStats.apg} icon={Target} />
            <StatCard label="FG%" value={`${avgStats.fgPct}%`} icon={Percent} />
          </div>
        </section>

        {/* Personal Records */}
        {personalRecords && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
              <Award size={14} className="text-gold" />
              Personal Records
            </h2>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'PTS', value: personalRecords.pts },
                { label: 'REB', value: personalRecords.reb },
                { label: 'AST', value: personalRecords.ast },
                { label: 'STL', value: personalRecords.stl },
                { label: 'BLK', value: personalRecords.blk },
              ].map(({ label, value }) => (
                <Card key={label} className="flex flex-col items-center py-3 space-y-1 p-2">
                  <p className="text-lg font-bold text-gold">{value}</p>
                  <p className="text-[9px] text-text-muted uppercase font-semibold">{label}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Record */}
        {(record.w + record.l) > 0 && (
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Record</h2>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{record.w}</p>
                <p className="text-[10px] text-text-muted uppercase">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-danger">{record.l}</p>
                <p className="text-[10px] text-text-muted uppercase">Losses</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-2xl font-bold text-text-primary">{record.pct}%</p>
                <p className="text-[10px] text-text-muted uppercase">Win Rate</p>
              </div>
            </div>
          </Card>
        )}

        {/* Scoring Trend */}
        {gameTrend.length >= 2 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Scoring Trend
            </h2>
            <Card className="pt-4 pr-2">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={gameTrend}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#5a5a6a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#5a5a6a' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="PTS"
                    stroke="#00A3FF"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#00A3FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </section>
        )}

        {/* Shot Zone Breakdown */}
        {zoneBreakdown.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Shooting by Zone
            </h2>
            <Card className="pt-4 pr-2">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={zoneBreakdown} layout="vertical">
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: '#5a5a6a' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <YAxis
                    dataKey="zone"
                    type="category"
                    tick={{ fontSize: 9, fill: '#8a8a9a' }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="FG%" fill="#00A3FF" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </section>
        )}

        {/* Game Comparison */}
        {games.length >= 2 && (() => {
          const latest = games[0]
          const prev = games[1]
          const stats = ['points', 'rebounds', 'assists'].map(key => {
            const labels = { points: 'PTS', rebounds: 'REB', assists: 'AST' }
            const diff = latest[key] - prev[key]
            return { label: labels[key], latest: latest[key], prev: prev[key], diff }
          })
          const latestDate = new Date(latest.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          const prevDate = new Date(prev.game_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

          return (
            <section className="space-y-4">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                Last 2 Games
              </h2>
              <Card className="space-y-4">
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{prevDate}</span>
                  <span className="font-semibold text-text-primary">vs</span>
                  <span>{latestDate}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {stats.map(({ label, latest: l, prev: p, diff }) => {
                    const TrendIcon = diff > 0 ? ArrowUp : diff < 0 ? ArrowDown : Minus
                    const color = diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : 'text-text-muted'
                    return (
                      <div key={label} className="text-center space-y-1">
                        <p className="text-[10px] text-text-muted uppercase">{label}</p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-text-secondary">{p}</span>
                          <TrendIcon size={12} className={color} />
                          <span className="text-sm font-bold text-text-primary">{l}</span>
                        </div>
                        <p className={`text-[10px] font-semibold ${color}`}>
                          {diff > 0 ? '+' : ''}{diff}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </section>
          )
        })()}

        {/* Overall Shooting */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Shot Tracking
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Total" value={shotStats.total} className="p-4" />
            <StatCard label="Made" value={shotStats.made} className="p-4" />
            <StatCard label="FG%" value={`${shotStats.percentage}%`} className="p-4" />
          </div>
        </section>

        {/* No data state */}
        {games.length === 0 && shots.length === 0 && (
          <Card>
            <div className="flex flex-col items-center py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-bg-section border border-border flex items-center justify-center">
                <BarChart3 size={22} className="text-text-muted" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-text-primary">No data yet</p>
                <p className="text-xs text-text-muted">Log games and track shots to see analytics.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
