import { useMemo } from 'react'
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Target, Dumbbell } from 'lucide-react'

export default function WeeklyReport({ games = [], drills = [] }) {
  const report = useMemo(() => {
    const now = new Date()
    const thisWeekStart = new Date(now)
    thisWeekStart.setDate(now.getDate() - now.getDay())
    const lastWeekStart = new Date(thisWeekStart)
    lastWeekStart.setDate(lastWeekStart.getDate() - 7)

    const thisStr = thisWeekStart.toISOString().split('T')[0]
    const lastStr = lastWeekStart.toISOString().split('T')[0]

    const thisGames = games.filter(g => g.game_date >= thisStr)
    const lastGames = games.filter(g => g.game_date >= lastStr && g.game_date < thisStr)
    const thisDrills = drills.filter(s => s.session_date >= thisStr)
    const lastDrills = drills.filter(s => s.session_date >= lastStr && s.session_date < lastStr)

    const avg = (arr, key) => arr.length > 0 ? (arr.reduce((s, g) => s + g[key], 0) / arr.length).toFixed(1) : '0.0'

    const thisPPG = parseFloat(avg(thisGames, 'points'))
    const lastPPG = parseFloat(avg(lastGames, 'points'))
    const thisWins = thisGames.filter(g => g.result === 'Win').length

    return {
      gamesPlayed: thisGames.length,
      drillsDone: thisDrills.length,
      wins: thisWins,
      losses: thisGames.filter(g => g.result === 'Loss').length,
      ppg: thisPPG,
      rpg: parseFloat(avg(thisGames, 'rebounds')),
      apg: parseFloat(avg(thisGames, 'assists')),
      ppgDiff: thisPPG - lastPPG,
      totalActivities: thisGames.length + thisDrills.length,
      prevActivities: lastGames.length + lastDrills.length,
      bestGame: thisGames.length > 0 ? Math.max(...thisGames.map(g => g.points)) : null,
    }
  }, [games, drills])

  if (report.totalActivities === 0) return null

  const activityTrend = report.totalActivities - report.prevActivities

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
          <Trophy size={14} className="text-gold" />
          Weekly Report
        </h2>
        <span className="text-[10px] text-text-muted">This week</span>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center space-y-0.5">
          <p className="text-xl font-bold text-text-primary">{report.gamesPlayed}</p>
          <p className="text-[9px] text-text-muted uppercase">Games</p>
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-xl font-bold text-text-primary">{report.drillsDone}</p>
          <p className="text-[9px] text-text-muted uppercase">Drills</p>
        </div>
        <div className="text-center space-y-0.5">
          <div className="flex items-center justify-center gap-1">
            <p className="text-xl font-bold text-text-primary">{report.totalActivities}</p>
            {activityTrend !== 0 && (
              activityTrend > 0
                ? <TrendingUp size={14} className="text-success" />
                : <TrendingDown size={14} className="text-danger" />
            )}
          </div>
          <p className="text-[9px] text-text-muted uppercase">Total</p>
        </div>
      </div>

      {/* Game stats (if games played) */}
      {report.gamesPlayed > 0 && (
        <div className="border-t border-border pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-lg font-bold text-success">{report.wins}</p>
                <p className="text-[9px] text-text-muted uppercase">W</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-danger">{report.losses}</p>
                <p className="text-[9px] text-text-muted uppercase">L</p>
              </div>
            </div>
            {report.bestGame !== null && (
              <div className="text-right">
                <p className="text-lg font-bold text-gold">{report.bestGame}</p>
                <p className="text-[9px] text-text-muted uppercase">Best PTS</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 bg-bg-section rounded-lg p-3">
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">{report.ppg}</p>
              <p className="text-[9px] text-text-muted uppercase">PPG</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">{report.rpg}</p>
              <p className="text-[9px] text-text-muted uppercase">RPG</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-text-primary">{report.apg}</p>
              <p className="text-[9px] text-text-muted uppercase">APG</p>
            </div>
          </div>

          {report.ppgDiff !== 0 && (
            <p className="text-[10px] text-text-muted text-center">
              PPG is{' '}
              <span className={report.ppgDiff > 0 ? 'text-success font-medium' : 'text-danger font-medium'}>
                {report.ppgDiff > 0 ? '+' : ''}{report.ppgDiff.toFixed(1)}
              </span>{' '}
              vs last week
            </p>
          )}
        </div>
      )}
    </div>
  )
}
