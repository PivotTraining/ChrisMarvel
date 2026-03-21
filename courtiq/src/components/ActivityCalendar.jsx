import { useMemo } from 'react'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function ActivityCalendar({ games = [], drills = [] }) {
  const { weeks, activityMap, month, year, today } = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    const firstDay = new Date(y, m, 1).getDay()
    const daysInMonth = new Date(y, m + 1, 0).getDate()
    const monthStr = `${y}-${String(m + 1).padStart(2, '0')}`

    // Build activity map
    const map = {}
    games.forEach(g => {
      if (g.game_date?.startsWith(monthStr)) {
        const day = parseInt(g.game_date.split('-')[2], 10)
        map[day] = (map[day] || 0) + 2
      }
    })
    drills.forEach(s => {
      if (s.session_date?.startsWith(monthStr)) {
        const day = parseInt(s.session_date.split('-')[2], 10)
        map[day] = (map[day] || 0) + 1
      }
    })

    // Build weeks grid
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)

    const w = []
    for (let i = 0; i < cells.length; i += 7) {
      w.push(cells.slice(i, i + 7))
    }

    return {
      weeks: w,
      activityMap: map,
      month: now.toLocaleDateString('en-US', { month: 'long' }),
      year: y,
      today: now.getDate(),
    }
  }, [games, drills])

  function intensityClass(count) {
    if (!count) return 'bg-bg-section border border-border'
    if (count === 1) return 'bg-blue/20 border border-blue/30'
    if (count === 2) return 'bg-blue/40 border border-blue/50'
    return 'bg-blue/70 border border-blue/80'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
          {month} {year}
        </h2>
        <div className="flex items-center gap-1.5 text-[9px] text-text-muted">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-bg-section border border-border" />
          <div className="w-2.5 h-2.5 rounded-sm bg-blue/20 border border-blue/30" />
          <div className="w-2.5 h-2.5 rounded-sm bg-blue/40 border border-blue/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-blue/70 border border-blue/80" />
          <span>More</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[9px] font-medium text-text-muted py-1">
            {d}
          </div>
        ))}
        {weeks.flat().map((day, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-medium transition-colors ${
              day === null
                ? ''
                : day === today
                  ? `ring-1 ring-blue ${intensityClass(activityMap[day])} text-text-primary`
                  : `${intensityClass(activityMap[day])} ${activityMap[day] ? 'text-text-primary' : 'text-text-muted'}`
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
