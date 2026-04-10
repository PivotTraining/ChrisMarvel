import { useState, useCallback, useRef, useEffect } from 'react'
import { Undo2, Trash2, Check, Share2 } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import useShots from '../../hooks/useShots'

// ─── Half-Court SVG (matches QuickGame) ───────────────────────────────────────
const W = 500, H = 470
const BASKET_X = W / 2, BASKET_Y = H - 52
const PAINT_LEFT = 178, PAINT_RIGHT = 322, PAINT_TOP = H - 190, PAINT_BOTTOM = H - 20
const FT_Y = H - 190
const ARC_RADIUS = 238
const CORNER_3_Y = H - 40
const CORNER_3_X_LEFT = 60, CORNER_3_X_RIGHT = 440

function is3Pointer(x, y) {
  const dx = x - BASKET_X, dy = y - BASKET_Y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (x < CORNER_3_X_LEFT || x > CORNER_3_X_RIGHT) return true
  return dist > ARC_RADIUS * 0.72
}

// Map a tap position into one of the hook's zone IDs so heatmap/stats persist
function zoneFromPosition(x, y) {
  const dx = x - BASKET_X, dy = y - BASKET_Y
  const dist = Math.sqrt(dx * dx + dy * dy)

  // Corner 3s
  if (x < CORNER_3_X_LEFT) return y > H - 140 ? 'left-corner-3' : 'left-wing-3'
  if (x > CORNER_3_X_RIGHT) return y > H - 140 ? 'right-corner-3' : 'right-wing-3'

  // Inside the paint
  if (x >= PAINT_LEFT && x <= PAINT_RIGHT && y >= PAINT_TOP && y <= PAINT_BOTTOM) return 'paint'

  // Beyond the 3pt arc
  if (dist > ARC_RADIUS * 0.72) {
    if (x < PAINT_LEFT) return 'left-wing-3'
    if (x > PAINT_RIGHT) return 'right-wing-3'
    return 'top-key-3'
  }

  // Mid-range
  if (x < PAINT_LEFT) return 'mid-left'
  if (x > PAINT_RIGHT) return 'mid-right'
  return 'mid-top'
}

function CourtSVG({ shots, onCourtTap }) {
  const svgRef = useRef(null)

  function handleTap(e) {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    onCourtTap(x, y)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', display: 'block', cursor: 'crosshair', touchAction: 'none', userSelect: 'none' }}
      onClick={handleTap}
      onTouchEnd={handleTap}
    >
      <defs>
        <radialGradient id="courtGradShots" cx="50%" cy="85%" r="75%">
          <stop offset="0%" stopColor="#0F1524" />
          <stop offset="100%" stopColor="#05070E" />
        </radialGradient>
        <radialGradient id="glowBasketShots" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="neonGreenShots" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#39FF88" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="neonRedShots" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#FF2D55" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={W} height={H} rx="8" fill="url(#courtGradShots)" />
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1="0" y1={i * 25} x2={W} y2={i * 25} stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
      ))}

      {(() => {
        const L = 'rgba(100,200,255,0.55)'
        const lw = 2.5
        return (
          <g stroke={L} strokeWidth={lw} fill="none">
            <rect x="18" y="10" width={W - 36} height={H - 20} rx="4" />
            <rect x={PAINT_LEFT} y={PAINT_TOP} width={PAINT_RIGHT - PAINT_LEFT} height={PAINT_BOTTOM - PAINT_TOP} />
            <path d={`M ${PAINT_LEFT} ${FT_Y} A 72 72 0 0 1 ${PAINT_RIGHT} ${FT_Y}`} />
            <path d={`M ${PAINT_LEFT} ${FT_Y} A 72 72 0 0 0 ${PAINT_RIGHT} ${FT_Y}`} strokeDasharray="8 6" />
            <path
              d={`M ${CORNER_3_X_LEFT} ${CORNER_3_Y}
                  L ${CORNER_3_X_LEFT} ${H - 185}
                  A ${ARC_RADIUS * 0.72} ${ARC_RADIUS * 0.72} 0 0 1 ${CORNER_3_X_RIGHT} ${H - 185}
                  L ${CORNER_3_X_RIGHT} ${CORNER_3_Y}`}
            />
            <path d={`M ${BASKET_X - 48} ${H - 20} A 48 48 0 0 1 ${BASKET_X + 48} ${H - 20}`} />
            <line x1={BASKET_X - 55} y1={H - 28} x2={BASKET_X + 55} y2={H - 28} strokeWidth={4} stroke="rgba(100,200,255,0.65)" />
          </g>
        )
      })()}

      <circle cx={BASKET_X} cy={BASKET_Y} r="40" fill="url(#glowBasketShots)" />
      <circle cx={BASKET_X} cy={BASKET_Y} r="14" fill="none" stroke="#FF6B35" strokeWidth="3.5" />
      <circle cx={BASKET_X} cy={BASKET_Y} r="3" fill="#FF6B35" />

      {shots.map((s, i) => (
        <g key={i}>
          {s.made ? (
            <g filter="url(#neonGreenShots)">
              <circle cx={s.x} cy={s.y} r="11" fill="#39FF88" stroke="#C8FFE0" strokeWidth="1.5" />
              <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central" fill="#05070E" fontSize="11" fontWeight="900">
                {s.is3 ? '3' : '2'}
              </text>
            </g>
          ) : (
            <g filter="url(#neonRedShots)">
              <line x1={s.x - 8} y1={s.y - 8} x2={s.x + 8} y2={s.y + 8} stroke="#FF2D55" strokeWidth="3.5" strokeLinecap="round" />
              <line x1={s.x + 8} y1={s.y - 8} x2={s.x - 8} y2={s.y + 8} stroke="#FF2D55" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}

function ShotPopup({ is3, onResult, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'linear-gradient(160deg, #1a1a2e, #16213e)',
        border: `1px solid ${is3 ? '#3B82F6' : '#22C55E'}40`,
        borderRadius: '20px', padding: '28px 24px', textAlign: 'center',
        minWidth: '260px', boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 32px ${is3 ? '#3B82F6' : '#22C55E'}20`,
      }}>
        <div style={{
          display: 'inline-block', padding: '6px 18px', borderRadius: '20px',
          background: is3 ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)',
          border: `1px solid ${is3 ? '#3B82F6' : '#22C55E'}50`,
          marginBottom: '16px',
        }}>
          <span style={{ color: is3 ? '#3B82F6' : '#22C55E', fontWeight: 800, fontSize: '14px', letterSpacing: '1px' }}>
            {is3 ? '3-POINTER' : '2-POINTER'}
          </span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '20px' }}>Did it go in?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onResult(true)} style={{
            flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            color: '#fff', fontWeight: 900, fontSize: '17px',
            boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
          }}>MADE</button>
          <button onClick={() => onResult(false)} style={{
            flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            color: '#fff', fontWeight: 900, fontSize: '17px',
            boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
          }}>MISS</button>
        </div>
      </div>
    </div>
  )
}

export default function Shots() {
  const { showToast } = useToast()
  const { logShot, undoLastShot, clearSession, startSession, sessionActive } = useShots()

  // Local mirror of shots with x/y coords (the hook only stores zone_id)
  const [localShots, setLocalShots] = useState([])
  const [pending, setPending] = useState(null)

  // Auto-start session on first mount
  useEffect(() => {
    if (!sessionActive) startSession('Practice')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCourtTap = useCallback((x, y) => {
    const is3 = is3Pointer(x, y)
    setPending({ x, y, is3 })
  }, [])

  const handleShotResult = useCallback(async (made) => {
    if (!pending) return
    const shot = { ...pending, made }
    setLocalShots(s => [...s, shot])
    const zoneId = zoneFromPosition(pending.x, pending.y)
    try { await logShot(zoneId, made, 'Catch & Shoot') } catch { /* noop */ }
    setPending(null)
  }, [pending, logShot])

  const handleUndo = useCallback(async () => {
    if (localShots.length === 0) return
    setLocalShots(s => s.slice(0, -1))
    try { await undoLastShot() } catch { /* noop */ }
    showToast('Undone', 'info')
  }, [localShots, undoLastShot, showToast])

  const handleClear = useCallback(async () => {
    if (!window.confirm('Clear all shots?')) return
    setLocalShots([])
    try { await clearSession() } catch { /* noop */ }
    showToast('Cleared', 'info')
  }, [clearSession, showToast])

  const made = localShots.filter(s => s.made).length
  const total = localShots.length
  const pct = total > 0 ? Math.round((made / total) * 100) : 0
  const twos = localShots.filter(s => !s.is3)
  const threes = localShots.filter(s => s.is3)
  const twosPct = twos.length > 0 ? Math.round((twos.filter(s => s.made).length / twos.length) * 100) : 0
  const threesPct = threes.length > 0 ? Math.round((threes.filter(s => s.made).length / threes.length) * 100) : 0

  const handleShare = useCallback(async () => {
    const text = `🏀 Shot Tracker — CourtIQ\n${made}/${total} (${pct}%)\n2PT: ${twos.filter(s => s.made).length}/${twos.length} (${twosPct}%)\n3PT: ${threes.filter(s => s.made).length}/${threes.length} (${threesPct}%)`
    if (navigator.share) {
      try { await navigator.share({ title: 'My Shooting Session', text }); return } catch { /* noop */ }
    }
    try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!', 'success') } catch { showToast('Could not share', 'info') }
  }, [made, total, pct, twos, threes, twosPct, threesPct, showToast])

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0D0D1A', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: 28 }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>Shot Tracker</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '0.5px' }}>TAP COURT TO RECORD SHOTS</div>
        </div>
        <button onClick={handleShare} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
          <Share2 size={18} />
        </button>
      </div>

      {/* Live shooting line */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', padding: '12px 16px',
        background: 'linear-gradient(90deg, rgba(255,107,53,0.12), rgba(59,130,246,0.08), rgba(34,197,94,0.08))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF6B35', letterSpacing: '-0.5px', lineHeight: 1 }}>{made}/{total}</div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', marginTop: '3px' }}>TOTAL ({pct}%)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#22C55E', letterSpacing: '-0.5px', lineHeight: 1 }}>{twos.filter(s => s.made).length}/{twos.length}</div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', marginTop: '3px' }}>2PT ({twosPct}%)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#3B82F6', letterSpacing: '-0.5px', lineHeight: 1 }}>{threes.filter(s => s.made).length}/{threes.length}</div>
          <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', marginTop: '3px' }}>3PT ({threesPct}%)</div>
        </div>
      </div>

      {/* Half court */}
      <div style={{ padding: '12px 12px', flex: '0 0 auto' }}>
        <div style={{
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        }}>
          <CourtSVG shots={localShots} onCourtTap={handleCourtTap} />
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px 12px 96px', marginTop: 'auto' }}>
        <button onClick={handleClear} style={{
          flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
        }}>
          <Trash2 size={15} /> Clear
        </button>
        <button onClick={handleUndo} disabled={localShots.length === 0} style={{
          flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: localShots.length > 0 ? '#fff' : 'rgba(255,255,255,0.25)',
          cursor: localShots.length > 0 ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
        }}>
          <Undo2 size={15} /> Undo
        </button>
        <button onClick={handleShare} style={{
          flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
          background: 'linear-gradient(135deg, #FF6B35, #C8490A)',
          color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '15px', fontWeight: 900, fontFamily: 'inherit',
          boxShadow: '0 4px 20px rgba(255,107,53,0.35)',
        }}>
          <Check size={17} /> Share Session
        </button>
      </div>

      {pending && (
        <ShotPopup
          is3={pending.is3}
          onResult={handleShotResult}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  )
}
