/**
 * RadarChart — 6-axis player profile visualization.
 *
 * Shared between the per-game review in Games.jsx and the season-level
 * profile in MyIQ (Shots.jsx). Takes an array of 6 numbers (0..100) in the
 * order: Scoring, Shooting, Playmaking, Defense, Hustle, Efficiency.
 *
 * The title prop lets callers distinguish per-game vs season context
 * ("Game Profile" vs "Season Profile").
 */
export default function RadarChart({ data, title = 'Player Profile' }) {
  const labels = ['Scoring', 'Shooting', 'Playmaking', 'Defense', 'Hustle', 'Efficiency']
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 75
  const angleStep = (2 * Math.PI) / 6

  const point = (i, pct) => {
    const a = angleStep * i - Math.PI / 2
    return {
      x: cx + r * (pct / 100) * Math.cos(a),
      y: cy + r * (pct / 100) * Math.sin(a),
    }
  }

  const gridLevels = [33, 66, 100]
  const dataPoints = data.map((v, i) => point(i, Math.min(100, Math.max(0, v))))
  const poly = dataPoints.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div>
      <p className="section-label" style={{ marginBottom: 'var(--space-2)' }}>{title}</p>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: '280px', display: 'block', margin: '0 auto' }}>
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={Array.from({ length: 6 }, (_, i) => point(i, lvl)).map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={point(i, 100).x}
            y2={point(i, 100).y}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="0.5"
          />
        ))}
        <polygon points={poly} fill="rgba(255,107,53,0.18)" stroke="var(--color-accent)" strokeWidth="1.5" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="var(--color-accent)" />
        ))}
        {labels.map((l, i) => {
          const p = point(i, 118)
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--color-text-sec)"
              fontSize="7"
              fontWeight="600"
            >
              {l}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
