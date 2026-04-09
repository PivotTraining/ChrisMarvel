import { COURT_ZONES } from '../../hooks/useShots'

function heatColor(pct, attempts) {
  if (attempts === 0) return 'rgba(255,255,255,0.04)'
  if (pct >= 60) return 'rgba(34, 197, 94, 0.55)'
  if (pct >= 50) return 'rgba(34, 197, 94, 0.35)'
  if (pct >= 40) return 'rgba(255, 107, 53, 0.45)'
  if (pct >= 30) return 'rgba(255, 107, 53, 0.3)'
  if (pct >= 20) return 'rgba(239, 68, 68, 0.4)'
  return 'rgba(239, 68, 68, 0.55)'
}

function heatTextColor(pct, attempts) {
  if (attempts === 0) return 'rgba(255,255,255,0.2)'
  if (pct >= 50) return '#22C55E'
  if (pct >= 35) return '#FF6B35'
  return '#EF4444'
}

export default function HeatMap({ zoneStats, title = 'Shot Heat Map', showLegend = true, size = 'md' }) {
  const maxW = size === 'lg' ? 440 : size === 'sm' ? 300 : 380

  return (
    <div>
      {title && (
        <h3 className="section-label" style={{ marginBottom: 'var(--space-1)', textAlign: 'center' }}>
          {title}
        </h3>
      )}

      <svg viewBox="0 0 100 92" style={{ width: '100%', maxWidth: maxW, display: 'block', margin: '0 auto' }}>
        {/* Court background */}
        <rect x="0" y="0" width="100" height="92" rx="3" fill="var(--color-card)" />

        {/* Court lines */}
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none">
          {/* Boundary */}
          <rect x="2" y="2" width="96" height="88" rx="1" />
          {/* Paint */}
          <rect x="34" y="62" width="32" height="28" />
          {/* Free throw circle */}
          <circle cx="50" cy="62" r="10" />
          {/* Free throw line */}
          <line x1="34" y1="62" x2="66" y2="62" />
          {/* 3-point arc */}
          <path d="M 10 90 L 10 68 Q 10 20, 50 15 Q 90 20, 90 68 L 90 90" />
          {/* Restricted area */}
          <path d="M 44 90 Q 44 82, 50 80 Q 56 82, 56 90" strokeWidth="0.4" />
          {/* Center court rim */}
          <circle cx="50" cy="88" r="1.2" stroke="rgba(255,107,53,0.5)" />
          {/* Backboard */}
          <line x1="47" y1="90" x2="53" y2="90" stroke="rgba(255,255,255,0.3)" />
          {/* Half-court arc */}
          <path d="M 30 2 Q 50 14, 70 2" strokeWidth="0.4" />
        </g>

        {/* Heat zones */}
        {COURT_ZONES.map((zone) => {
          const stats = zoneStats.get(zone.id)
          const made = stats?.made || 0
          const attempted = stats?.attempted || 0
          const pct = attempted > 0 ? Math.round((made / attempted) * 100) : 0
          const fill = heatColor(pct, attempted)
          const textColor = heatTextColor(pct, attempted)
          const cx = zone.x + zone.w / 2
          const cy = zone.y + zone.h / 2

          return (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                rx="2"
                fill={fill}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.3"
              />
              {attempted > 0 && (
                <>
                  <text
                    x={cx}
                    y={cy - 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={textColor}
                    fontSize="4"
                    fontWeight="900"
                  >
                    {pct}%
                  </text>
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(255,255,255,0.5)"
                    fontSize="2.5"
                    fontWeight="600"
                  >
                    {made}/{attempted}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex items-center justify-center gap-3" style={{ marginTop: 'var(--space-1)' }}>
          {[
            { color: 'rgba(239, 68, 68, 0.5)', label: 'Cold (<35%)' },
            { color: 'rgba(255, 107, 53, 0.4)', label: 'Warm (35-50%)' },
            { color: 'rgba(34, 197, 94, 0.45)', label: 'Hot (>50%)' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
              <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
