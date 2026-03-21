import { useMemo } from 'react'
import { ZONES } from './CourtMap'

function heatColor(pct, total) {
  if (total === 0) return 'rgba(255,255,255,0.03)'
  if (pct >= 55) return 'rgba(34,197,94,0.4)'   // green - hot
  if (pct >= 45) return 'rgba(34,197,94,0.2)'    // light green
  if (pct >= 35) return 'rgba(234,179,8,0.25)'   // yellow - warm
  if (pct >= 25) return 'rgba(239,68,68,0.2)'    // light red
  return 'rgba(239,68,68,0.35)'                   // red - cold
}

function borderColor(pct, total) {
  if (total === 0) return 'rgba(255,255,255,0.06)'
  if (pct >= 45) return 'rgba(34,197,94,0.4)'
  if (pct >= 35) return 'rgba(234,179,8,0.4)'
  return 'rgba(239,68,68,0.4)'
}

export default function ShotHeatmap({ shots = [] }) {
  const zoneStats = useMemo(() => {
    const stats = {}
    shots.forEach(s => {
      if (!stats[s.zone_id]) stats[s.zone_id] = { made: 0, total: 0 }
      stats[s.zone_id].total++
      if (s.made) stats[s.zone_id].made++
    })
    return stats
  }, [shots])

  const totalShots = shots.length
  if (totalShots === 0) return null

  return (
    <div className="space-y-3">
      <div className="relative w-full aspect-[5/4] rounded-2xl bg-bg-section border border-border overflow-hidden">
        {/* Court lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 92" preserveAspectRatio="none">
          <rect x="1" y="1" width="98" height="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="2" />
          <path d="M 10 92 L 10 55 Q 50 -10 90 55 L 90 92" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
          <rect x="30" y="55" width="40" height="37" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
          <circle cx="50" cy="55" r="12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
          <circle cx="50" cy="88" r="2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
          <line x1="44" y1="92" x2="56" y2="92" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        </svg>

        {/* Heatmap zones */}
        {ZONES.map(zone => {
          const stat = zoneStats[zone.id] || { made: 0, total: 0 }
          const pct = stat.total > 0 ? Math.round((stat.made / stat.total) * 100) : 0

          return (
            <div
              key={zone.id}
              className="absolute flex flex-col items-center justify-center rounded-lg transition-all duration-300"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                backgroundColor: heatColor(pct, stat.total),
                border: `1px solid ${borderColor(pct, stat.total)}`,
              }}
            >
              {stat.total > 0 && (
                <>
                  <span className={`text-[11px] font-bold leading-tight ${
                    pct >= 45 ? 'text-success' : pct >= 35 ? 'text-warning' : 'text-danger'
                  }`}>
                    {pct}%
                  </span>
                  <span className="text-[8px] text-text-muted leading-tight">
                    {stat.made}/{stat.total}
                  </span>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[9px] text-text-muted">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(239,68,68,0.35)' }} />
          <span>&lt;35%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(234,179,8,0.25)' }} />
          <span>35-44%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(34,197,94,0.4)' }} />
          <span>45%+</span>
        </div>
      </div>
    </div>
  )
}
