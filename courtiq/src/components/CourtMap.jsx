import { hapticImpact } from '../lib/native'

const ZONES = [
  { id: 'paint', label: 'Paint', x: 35, y: 65, w: 30, h: 25 },
  { id: 'left-block', label: 'L Block', x: 10, y: 65, w: 22, h: 20 },
  { id: 'right-block', label: 'R Block', x: 68, y: 65, w: 22, h: 20 },
  { id: 'left-elbow', label: 'L Elbow', x: 10, y: 40, w: 22, h: 22 },
  { id: 'right-elbow', label: 'R Elbow', x: 68, y: 40, w: 22, h: 22 },
  { id: 'free-throw', label: 'FT', x: 35, y: 42, w: 30, h: 20 },
  { id: 'left-wing-3', label: 'L Wing', x: 2, y: 18, w: 24, h: 22 },
  { id: 'right-wing-3', label: 'R Wing', x: 74, y: 18, w: 24, h: 22 },
  { id: 'left-corner-3', label: 'L Corner', x: 2, y: 70, w: 8, h: 22 },
  { id: 'right-corner-3', label: 'R Corner', x: 90, y: 70, w: 8, h: 22 },
  { id: 'top-key-3', label: 'Top Key', x: 28, y: 8, w: 44, h: 20 },
]

export { ZONES }

export default function CourtMap({ selectedZone, onZoneSelect, zoneStats = {} }) {
  return (
    <div className="relative w-full aspect-[5/4] rounded-2xl bg-bg-section border border-border overflow-hidden">
      {/* Court lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 92" preserveAspectRatio="none">
        {/* Court outline */}
        <rect x="1" y="1" width="98" height="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" rx="2" />
        {/* Three-point arc */}
        <path d="M 10 92 L 10 55 Q 50 -10 90 55 L 90 92" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        {/* Free throw lane */}
        <rect x="30" y="55" width="40" height="37" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
        {/* Free throw circle */}
        <circle cx="50" cy="55" r="12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
        {/* Basket */}
        <circle cx="50" cy="88" r="2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
        <line x1="44" y1="92" x2="56" y2="92" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
      </svg>

      {/* Tappable zones */}
      {ZONES.map(zone => {
        const stat = zoneStats[zone.id]
        const isSelected = selectedZone === zone.id
        const pct = stat && stat.total > 0 ? Math.round((stat.made / stat.total) * 100) : null

        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => { hapticImpact('Light'); onZoneSelect(zone.id) }}
            className={`absolute flex flex-col items-center justify-center rounded-lg transition-all duration-200 text-center ${
              isSelected
                ? 'bg-blue/20 border-blue ring-1 ring-blue'
                : 'hover:bg-white/5'
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.w}%`,
              height: `${zone.h}%`,
            }}
          >
            <span className="text-[9px] font-medium text-text-muted leading-tight">{zone.label}</span>
            {pct !== null && (
              <span className={`text-[10px] font-bold leading-tight ${pct >= 50 ? 'text-success' : pct >= 35 ? 'text-warning' : 'text-danger'}`}>
                {pct}%
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
