import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Undo2, Share2, Trash2, Check, ChevronLeft, Video, VideoOff } from 'lucide-react'
import useGames from '../../hooks/useGames'
import { useToast } from '../../context/ToastContext'
import { usePremium } from '../../context/PremiumContext'
import { useAuth } from '../../context/AuthContext'
import { useHaptics } from '../../hooks/useHaptics'
import UpgradePrompt from '../../components/ui/UpgradePrompt'
import GameShareCard from '../../components/ui/GameShareCard'

// ─── Game Film persistence (IndexedDB) ────────────────────────────────────
// Videos are big — we store them locally, keyed by game.id. No upload, no
// cloud bill. On iOS WKWebView, IndexedDB persists inside the app sandbox
// and survives restarts but will be cleared if the user deletes the app.
function openFilmDB() {
  return new Promise((resolve, reject) => {
    try {
      const req = indexedDB.open('courtiq_films', 1)
      req.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains('films')) db.createObjectStore('films')
      }
      req.onsuccess = (e) => resolve(e.target.result)
      req.onerror = (e) => reject(e.target.error)
    } catch (err) {
      reject(err)
    }
  })
}

async function persistFilm(gameId, blob) {
  try {
    const db = await openFilmDB()
    const tx = db.transaction('films', 'readwrite')
    tx.objectStore('films').put(
      { blob, savedAt: new Date().toISOString(), mimeType: blob.type || 'video/webm', sizeBytes: blob.size },
      `courtiq_film_${gameId}`
    )
    await new Promise((res, rej) => {
      tx.oncomplete = res
      tx.onerror = () => rej(tx.error)
    })
    // eslint-disable-next-line no-console
    console.info('[CourtIQ] Film saved for game', gameId, Math.round(blob.size / 1024), 'KB')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[CourtIQ] Failed to save film:', e?.message || e)
  }
}

// ─── Half-Court SVG ─────────────────────────────────────────────────────────
// viewBox: 500 wide × 470 tall (half court, basket at bottom)
const W = 500, H = 470
const BASKET_X = W / 2, BASKET_Y = H - 52  // (250, 418)
const PAINT_LEFT = 178, PAINT_RIGHT = 322, PAINT_TOP = H - 190, PAINT_BOTTOM = H - 20
const FT_Y = H - 190
// True circular arc centered on the basket. Visual rendering and the
// is3Pointer() check MUST share this radius so shots never misclassify.
const ARC_R = 232
const CORNER_3_X_LEFT = 60, CORNER_3_X_RIGHT = 440
const CORNER_3_Y = H - 40  // 430 — baseline of corner-3 lines
// Where the arc meets the vertical corner-3 lines (derived from basket + ARC_R):
// (BASKET_X - CORNER_3_X_LEFT)² + (BASKET_Y - BREAK_Y)² = ARC_R²
const CORNER_BREAK_Y = BASKET_Y - Math.sqrt(
  ARC_R * ARC_R - (BASKET_X - CORNER_3_X_LEFT) * (BASKET_X - CORNER_3_X_LEFT)
) // ≈ 285

function is3Pointer(x, y) {
  // Corner 3: outside the vertical corner lines and below the arc-break
  if (x <= CORNER_3_X_LEFT || x >= CORNER_3_X_RIGHT) {
    return y >= CORNER_BREAK_Y
  }
  // Arc 3: strictly beyond the arc radius from the basket
  const dx = x - BASKET_X, dy = y - BASKET_Y
  return (dx * dx + dy * dy) > ARC_R * ARC_R
}

function CourtSVG({ shots, onCourtTap }) {
  const svgRef = useRef(null)
  // Pointer-down anchor. If the pointer moves more than DRAG_THRESHOLD px
  // before release, we treat the gesture as a drag/scroll and ignore it
  // — that way the court can no longer eat accidental swipes.
  const downRef = useRef(null)
  const DRAG_THRESHOLD = 8 // CSS px, matches iOS scroll slop

  function clientXY(e) {
    const touch = e.changedTouches?.[0] || e.touches?.[0]
    return {
      x: touch ? touch.clientX : e.clientX,
      y: touch ? touch.clientY : e.clientY,
    }
  }

  function handlePointerDown(e) {
    const { x, y } = clientXY(e)
    downRef.current = { x, y }
  }

  function handlePointerUp(e) {
    const down = downRef.current
    downRef.current = null
    if (!down) return
    const { x: upX, y: upY } = clientXY(e)
    const dx = upX - down.x
    const dy = upY - down.y
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      // Treat as a drag/scroll — do not log a shot.
      return
    }
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const scaleX = W / rect.width
    const scaleY = H / rect.height
    const x = (upX - rect.left) * scaleX
    const y = (upY - rect.top) * scaleY
    onCourtTap(x, y)
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', display: 'block', cursor: 'crosshair', touchAction: 'pan-y', userSelect: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { downRef.current = null }}
    >
      {/* Court background */}
      <defs>
        <radialGradient id="courtGrad" cx="50%" cy="85%" r="75%">
          <stop offset="0%" stopColor="#0F1524" />
          <stop offset="100%" stopColor="#05070E" />
        </radialGradient>
        <radialGradient id="glowBasket" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
        </radialGradient>
        <filter id="neonGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#39FF88" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="neonRed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feFlood floodColor="#FF2D55" floodOpacity="1" />
          <feComposite in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Dark floor */}
      <rect x="0" y="0" width={W} height={H} rx="8" fill="url(#courtGrad)" />
      {/* Subtle ambient grid */}
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1="0" y1={i * 25} x2={W} y2={i * 25} stroke="rgba(255,255,255,0.015)" strokeWidth="1" />
      ))}

      {/* Court lines color */}
      {(() => {
        const L = 'rgba(100,200,255,0.55)'
        const lw = 2.5
        return (
          <g stroke={L} strokeWidth={lw} fill="none">
            {/* Boundary */}
            <rect x="18" y="10" width={W - 36} height={H - 20} rx="4" />
            {/* Paint / lane */}
            <rect x={PAINT_LEFT} y={PAINT_TOP} width={PAINT_RIGHT - PAINT_LEFT} height={PAINT_BOTTOM - PAINT_TOP} />
            {/* Free throw circle - top half */}
            <path d={`M ${PAINT_LEFT} ${FT_Y} A 72 72 0 0 1 ${PAINT_RIGHT} ${FT_Y}`} />
            {/* Free throw circle - bottom half dashed */}
            <path d={`M ${PAINT_LEFT} ${FT_Y} A 72 72 0 0 0 ${PAINT_RIGHT} ${FT_Y}`} strokeDasharray="8 6" />
            {/* 3-point arc — circular, centered on the basket (matches is3Pointer) */}
            <path
              d={`M ${CORNER_3_X_LEFT} ${CORNER_3_Y}
                  L ${CORNER_3_X_LEFT} ${CORNER_BREAK_Y}
                  A ${ARC_R} ${ARC_R} 0 0 1 ${CORNER_3_X_RIGHT} ${CORNER_BREAK_Y}
                  L ${CORNER_3_X_RIGHT} ${CORNER_3_Y}`}
            />
            {/* Restricted area arc */}
            <path d={`M ${BASKET_X - 48} ${H - 20} A 48 48 0 0 1 ${BASKET_X + 48} ${H - 20}`} />
            {/* Backboard */}
            <line x1={BASKET_X - 55} y1={H - 28} x2={BASKET_X + 55} y2={H - 28} strokeWidth={4} stroke="rgba(100,200,255,0.65)" />
          </g>
        )
      })()}

      {/* Basket glow */}
      <circle cx={BASKET_X} cy={BASKET_Y} r="40" fill="url(#glowBasket)" />
      {/* Basket rim */}
      <circle cx={BASKET_X} cy={BASKET_Y} r="14" fill="none" stroke="#FF6B35" strokeWidth="3.5" />
      <circle cx={BASKET_X} cy={BASKET_Y} r="3" fill="#FF6B35" />

      {/* Shot markers */}
      {shots.map((s, i) => (
        <g key={i}>
          {s.made ? (
            <g filter="url(#neonGreen)">
              <circle cx={s.x} cy={s.y} r="11" fill="#39FF88" stroke="#C8FFE0" strokeWidth="1.5" />
              <text x={s.x} y={s.y} textAnchor="middle" dominantBaseline="central" fill="#05070E" fontSize="11" fontWeight="900">
                {s.is3 ? '3' : '2'}
              </text>
            </g>
          ) : (
            <g filter="url(#neonRed)">
              <line x1={s.x - 8} y1={s.y - 8} x2={s.x + 8} y2={s.y + 8} stroke="#FF2D55" strokeWidth="3.5" strokeLinecap="round" />
              <line x1={s.x + 8} y1={s.y - 8} x2={s.x - 8} y2={s.y + 8} stroke="#FF2D55" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          )}
        </g>
      ))}
    </svg>
  )
}

// ─── Shot Popup ──────────────────────────────────────────────────────────────
function ShotPopup({ x, y, is3, onResult, onClose }) {
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

// ─── Stat Button ─────────────────────────────────────────────────────────────
function StatBtn({ label, value, color, onClick }) {
  const ref = useRef(null)
  return (
    <button
      ref={ref}
      onClick={() => {
        if (ref.current) {
          ref.current.style.transform = 'scale(0.9)'
          setTimeout(() => { if (ref.current) ref.current.style.transform = 'scale(1)' }, 120)
        }
        onClick()
      }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '12px 4px', borderRadius: '16px', border: `2px solid ${color}60`,
        background: `linear-gradient(160deg, ${color}18, ${color}08)`,
        cursor: 'pointer', transition: 'transform 0.12s ease',
        WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation',
        gap: '4px',
      }}
    >
      <span style={{ fontSize: '24px', fontWeight: 900, color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>{label}</span>
    </button>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Gametime() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addGame, updateGame } = useGames()
  const { showToast } = useToast()
  const { isPro, upgrade } = usePremium()
  const { profile } = useAuth()
  const { impact, notification, selection } = useHaptics()

  // Support resuming existing game via location state
  const resumeGame = location.state?.game || null

  const [opponent, setOpponent] = useState(resumeGame?.opponent || '')
  const [sessionType, setSessionType] = useState(resumeGame?.game_type || 'Game')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [savedGame, setSavedGame] = useState(null) // triggers GameShareCard after save
  const [shots, setShots] = useState(resumeGame?._shots || [])
  const [stats, setStats] = useState({
    assists: resumeGame?.assists || 0,
    blocks: resumeGame?.blocks || 0,
    steals: resumeGame?.steals || 0,
    turnovers: resumeGame?.turnovers || 0,
    free_throws_made: resumeGame?.free_throws_made || 0,
    free_throws_attempted: resumeGame?.free_throws_attempted || 0,
    rebounds: resumeGame?.rebounds || 0,
    fouls: resumeGame?.fouls || 0,
  })
  const [history, setHistory] = useState([])
  const [pending, setPending] = useState(null) // { x, y, is3 }
  const [saving, setSaving] = useState(false)
  const [showFT, setShowFT] = useState(false)

  // Game Film recording (Pro). Camera runs in the background while stats
  // are being logged, so users never have to choose between recording and
  // tracking. Film is stored locally in IndexedDB keyed by game.id.
  const [filming, setFilming] = useState(false)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const cameraStreamRef = useRef(null)
  const videoPreviewRef = useRef(null)

  // Derived shooting stats from shots array
  const fgm = shots.filter(s => s.made && !s.is3).length
  const fga = shots.filter(s => !s.is3).length
  const tpm = shots.filter(s => s.made && s.is3).length
  const tpa = shots.filter(s => s.is3).length
  const pts = fgm * 2 + tpm * 3 + stats.free_throws_made

  // Stop the MediaRecorder and resolve with the final Blob. Safe to call
  // when not recording — resolves with null in that case.
  const stopRecording = useCallback(() => new Promise((resolve) => {
    const recorder = mediaRecorderRef.current
    if (!recorder || recorder.state === 'inactive') { resolve(null); return }
    recorder.onstop = () => {
      const mime = recorder.mimeType || 'video/webm'
      const blob = new Blob(recordedChunksRef.current, { type: mime })
      recordedChunksRef.current = []
      resolve(blob.size > 0 ? blob : null)
    }
    try { recorder.stop() } catch { resolve(null) }
  }), [])

  const tearDownCamera = useCallback(() => {
    try { cameraStreamRef.current?.getTracks().forEach(t => t.stop()) } catch { /* noop */ }
    cameraStreamRef.current = null
    if (videoPreviewRef.current) {
      try { videoPreviewRef.current.srcObject = null } catch { /* noop */ }
    }
    mediaRecorderRef.current = null
    recordedChunksRef.current = []
  }, [])

  const startFilming = useCallback(async () => {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      showToast('Camera not supported on this device', 'error')
      return
    }
    if (typeof MediaRecorder === 'undefined') {
      showToast('Recording not supported on this device', 'error')
      return
    }
    try {
      // Request camera+mic. On iOS WKWebView, this triggers the native
      // permission prompt if not yet granted. The stream will contain
      // active tracks once the user taps Allow.
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      })
      cameraStreamRef.current = stream

      // Set filming=true FIRST so the PiP <video> element mounts in the
      // next render. Then connect the stream on the following tick so the
      // ref is live. This was the cause of the "black screen" — we were
      // setting srcObject on a ref that didn't exist yet because the
      // conditional rendering hadn't fired.
      setFilming(true)

      // Wait one tick for React to render the PiP video element.
      await new Promise((r) => setTimeout(r, 50))

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
        // play() must be called explicitly on iOS — autoplay alone is
        // insufficient in WKWebView even with muted+playsInline.
        try { await videoPreviewRef.current.play() } catch {
          // eslint-disable-next-line no-console
          console.warn('[CourtIQ] Video preview play() blocked — camera is still recording')
        }
      }

      // Prefer MP4 on iOS (native), fall back to WebM on web. Safari supports
      // MediaRecorder as of iOS 14.3 but only with MP4; Chrome prefers WebM.
      const candidates = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']
      const mimeType = candidates.find(t => MediaRecorder.isTypeSupported?.(t)) || ''
      recordedChunksRef.current = []
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mediaRecorderRef.current = recorder
      recorder.start(1000) // emit a chunk every second so we never lose > 1s on crash
      showToast('Recording game film', 'success')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[CourtIQ] Could not start recording:', e?.message || e)
      const msg = e?.name === 'NotAllowedError'
        ? 'Camera permission denied — check Settings → CourtIQ → Camera'
        : e?.name === 'NotFoundError'
          ? 'No camera found on this device'
          : `Camera error: ${e?.message || 'unknown'}`
      showToast(msg, 'error')
      setFilming(false)
      tearDownCamera()
    }
  }, [isPro, showToast, tearDownCamera])

  const stopFilmingDiscard = useCallback(async () => {
    await stopRecording()
    tearDownCamera()
    setFilming(false)
    showToast('Film discarded', 'info')
  }, [stopRecording, tearDownCamera, showToast])

  // Release the camera if the component unmounts mid-recording (e.g. user
  // navigates away). We never keep a hot camera stream around after unmount.
  useEffect(() => {
    return () => {
      try { cameraStreamRef.current?.getTracks().forEach(t => t.stop()) } catch { /* noop */ }
    }
  }, [])

  const push = useCallback((action) => {
    setHistory(h => [...h, action])
  }, [])

  const handleCourtTap = useCallback((x, y) => {
    const is3 = is3Pointer(x, y)
    impact('light')
    setPending({ x, y, is3 })
  }, [impact])

  const handleShotResult = useCallback((made) => {
    if (!pending) return
    const shot = { ...pending, made }
    setShots(s => [...s, shot])
    push({ type: 'shot', shot })
    setPending(null)
    if (made) notification('success')
    else impact('medium')
  }, [pending, push, notification, impact])

  const handleStat = useCallback((key, delta = 1) => {
    impact('light')
    setStats(prev => {
      const next = { ...prev, [key]: Math.max(0, (prev[key] || 0) + delta) }
      push({ type: 'stat', key, delta })
      return next
    })
  }, [push, impact])

  const handleFT = useCallback((made) => {
    setStats(prev => ({
      ...prev,
      free_throws_made: prev.free_throws_made + (made ? 1 : 0),
      free_throws_attempted: prev.free_throws_attempted + 1,
    }))
    push({ type: 'ft', made })
    setShowFT(false)
    if (made) notification('success')
    else impact('medium')
  }, [push, notification, impact])

  const handleUndo = useCallback(() => {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    if (last.type === 'shot') {
      setShots(s => s.filter((_, i) => i !== s.length - 1))
    } else if (last.type === 'stat') {
      setStats(prev => ({ ...prev, [last.key]: Math.max(0, (prev[last.key] || 0) - last.delta) }))
    } else if (last.type === 'ft') {
      setStats(prev => ({
        ...prev,
        free_throws_made: Math.max(0, prev.free_throws_made - (last.made ? 1 : 0)),
        free_throws_attempted: Math.max(0, prev.free_throws_attempted - 1),
      }))
    }
    showToast('Undone', 'info')
  }, [history, showToast])

  const handleClear = useCallback(() => {
    if (!window.confirm('Clear all stats for this game?')) return
    setShots([])
    setStats({ assists: 0, blocks: 0, steals: 0, turnovers: 0, free_throws_made: 0, free_throws_attempted: 0, rebounds: 0, fouls: 0 })
    setHistory([])
    showToast('Stats cleared', 'info')
  }, [showToast])

  const handleShare = useCallback(async () => {
    const fgPct = fga > 0 ? Math.round((fgm / fga) * 100) : 0
    const text = `🏀 ${opponent || 'Game'} — CourtIQ\n${pts} PTS | ${stats.rebounds} REB | ${stats.assists} AST\n${stats.steals} STL | ${stats.blocks} BLK | ${stats.turnovers} TO\nFG: ${fgm}/${fga} (${fgPct}%) | 3PT: ${tpm}/${tpa} | FT: ${stats.free_throws_made}/${stats.free_throws_attempted}`
    if (navigator.share) {
      try { await navigator.share({ title: 'My Game Stats', text }); return } catch {}
    }
    try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!', 'success') } catch { showToast('Could not share', 'info') }
  }, [pts, stats, fgm, fga, tpm, tpa, opponent, showToast])

  const handleSave = useCallback(async () => {
    setSaving(true)

    // Stop recording first so we can tag the film with the new game's id.
    // Keeping this BEFORE the DB write means we have the blob in hand by
    // the time we know the game id, so the IndexedDB key always lines up.
    let filmBlob = null
    if (filming) {
      filmBlob = await stopRecording()
      tearDownCamera()
      setFilming(false)
    }

    const gameData = {
      game_date: new Date().toISOString().split('T')[0],
      opponent: sessionType === 'Workout' ? opponent || 'Solo Workout' : opponent || 'Opponent',
      game_type: sessionType,
      result: sessionType === 'Game' ? 'Win' : null,
      is_home_game: sessionType === 'Game',
      points: pts,
      rebounds: stats.rebounds,
      assists: stats.assists,
      steals: stats.steals,
      blocks: stats.blocks,
      turnovers: stats.turnovers,
      fouls: stats.fouls,
      field_goals_made: fgm,
      field_goals_attempted: fga,
      three_pointers_made: tpm,
      three_pointers_attempted: tpa,
      free_throws_made: stats.free_throws_made,
      free_throws_attempted: stats.free_throws_attempted,
      _shots: shots,
      has_film: !!filmBlob, // surfaces "Watch Film" in review
    }
    try {
      let persistedId = null
      if (resumeGame?.id) {
        await updateGame(resumeGame.id, gameData)
        persistedId = resumeGame.id
        showToast('Game updated!', 'success')
      } else {
        const saved = await addGame(gameData)
        persistedId = saved?.id || null
        showToast('Game saved!', 'success')
      }

      // Persist the film blob against the game id. This is best-effort —
      // if IndexedDB write fails, the stats still save.
      if (filmBlob && persistedId) {
        await persistFilm(persistedId, filmBlob)
      }

      // Post-save: show shareable game card. The card's onClose handler
      // chains to the Pro upsell (free users) or navigates to /games (Pro).
      setSavedGame({ ...gameData, id: persistedId })
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }, [filming, stopRecording, tearDownCamera, pts, stats, fgm, fga, tpm, tpa, shots, opponent, resumeGame, addGame, updateGame, showToast])

  const handleShareCardClose = useCallback(() => {
    setSavedGame(null)
    if (!isPro) {
      setShowUpgrade(true)
    } else {
      navigate('/games')
    }
  }, [isPro, navigate])

  const fgPct = fga > 0 ? Math.round((fgm / fga) * 100) : 0

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#0D0D1A', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top, 0px))',
        background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)',
        gap: '10px',
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ChevronLeft size={20} />
        </button>
        <input
          value={opponent}
          onChange={e => setOpponent(e.target.value)}
          placeholder="Opponent (optional)"
          style={{
            flex: 1, maxWidth: '220px', textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px', padding: '8px 12px',
            color: '#fff', fontSize: '14px', fontWeight: 700,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button onClick={handleShare} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '4px' }}>
          <Share2 size={18} />
        </button>
      </div>

      {/* Session type + Film bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Session type chips */}
        {['Game', 'Practice', 'Workout'].map((t) => (
          <button
            key={t}
            onClick={() => { setSessionType(t); selection?.() }}
            style={{
              padding: '6px 14px', borderRadius: '20px',
              border: sessionType === t ? '1px solid var(--color-accent, #FF6B35)' : '1px solid rgba(255,255,255,0.1)',
              background: sessionType === t ? 'rgba(255,107,53,0.15)' : 'rgba(255,255,255,0.04)',
              color: sessionType === t ? '#FF6B35' : 'rgba(255,255,255,0.5)',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              fontFamily: 'inherit', letterSpacing: '0.3px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {t}
          </button>
        ))}

        {/* Film button — spacer pushes it right */}
        <div style={{ marginLeft: 'auto' }}>
          <button
            onClick={filming ? stopFilmingDiscard : startFilming}
            aria-label={filming ? 'Stop recording' : 'Record game film'}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px',
              background: filming
                ? 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(239,68,68,0.12))'
                : 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(255,107,53,0.06))',
              border: filming ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,107,53,0.4)',
              color: filming ? '#EF4444' : '#FF6B35',
              cursor: 'pointer', fontSize: '12px', fontWeight: 800,
              fontFamily: 'inherit', letterSpacing: '0.3px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {filming ? <VideoOff size={14} /> : <Video size={14} />}
            {filming ? 'Stop' : 'Film'}
            {filming && (
              <span style={{
                display: 'inline-block', width: '7px', height: '7px',
                borderRadius: '50%', background: '#EF4444',
                animation: 'courtiqRecordPulse 1.2s ease-in-out infinite',
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Keyframes for the recording dot pulse */}
      <style>{`@keyframes courtiqRecordPulse { 0%,100% { opacity:1 } 50% { opacity:0.25 } }`}</style>

      {/* Floating PiP preview while recording. Minimal and out of the way
          so it doesn't block the court. Tap to toggle size. */}
      {filming && (
        <div style={{
          position: 'fixed',
          top: 'calc(120px + env(safe-area-inset-top, 0px))',
          right: '10px',
          width: '96px', height: '128px', zIndex: 25,
          borderRadius: '12px', overflow: 'hidden',
          border: '2px solid #EF4444',
          boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
          background: '#000',
        }}>
          <video
            ref={videoPreviewRef}
            autoPlay muted playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', top: '6px', left: '6px',
            display: 'flex', alignItems: 'center', gap: '4px',
            padding: '2px 6px', borderRadius: '10px',
            background: 'rgba(0,0,0,0.55)',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#EF4444',
              animation: 'courtiqRecordPulse 1.2s ease-in-out infinite',
            }} />
            <span style={{ color: '#fff', fontSize: '9px', fontWeight: 800, letterSpacing: '0.5px' }}>REC</span>
          </div>
        </div>
      )}

      {/* Live stat bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-around', padding: '10px 16px',
        background: 'linear-gradient(90deg, rgba(255,107,53,0.12), rgba(59,130,246,0.08), rgba(34,197,94,0.08))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {[
          { label: 'PTS', value: pts, color: '#FF6B35' },
          { label: 'REB', value: stats.rebounds, color: '#3B82F6' },
          { label: 'AST', value: stats.assists, color: '#22C55E' },
          { label: 'STL', value: stats.steals, color: '#A78BFA' },
          { label: 'BLK', value: stats.blocks, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: s.color, letterSpacing: '-0.5px', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.8px', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Shooting line */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: '16px', padding: '6px 16px',
        background: 'rgba(0,0,0,0.2)',
      }}>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>FG <strong style={{ color: '#fff' }}>{fgm}/{fga}</strong> ({fgPct}%)</span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>3PT <strong style={{ color: '#3B82F6' }}>{tpm}/{tpa}</strong></span>
        <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px' }}>FT <strong style={{ color: '#F59E0B' }}>{stats.free_throws_made}/{stats.free_throws_attempted}</strong></span>
      </div>

      {/* Half court */}
      <div style={{ padding: '8px 12px', flex: '0 0 auto' }}>
        <div style={{
          borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)',
        }}>
          <CourtSVG shots={shots} onCourtTap={handleCourtTap} />
        </div>
      </div>

      {/* Stat buttons */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px',
        padding: '8px 12px',
      }}>
        <StatBtn label="AST" value={stats.assists} color="#22C55E" onClick={() => handleStat('assists')} />
        <StatBtn label="REB" value={stats.rebounds} color="#3B82F6" onClick={() => handleStat('rebounds')} />
        <StatBtn label="STL" value={stats.steals} color="#A78BFA" onClick={() => handleStat('steals')} />
        <StatBtn label="BLK" value={stats.blocks} color="#F59E0B" onClick={() => handleStat('blocks')} />
        <StatBtn label="TO" value={stats.turnovers} color="#EF4444" onClick={() => handleStat('turnovers')} />
        <StatBtn label="PF" value={stats.fouls} color="#F97316" onClick={() => handleStat('fouls')} />
        <div style={{ gridColumn: 'span 2' }}>
          <button
            onClick={() => setShowFT(true)}
            style={{
              width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '12px', borderRadius: '16px', border: '2px solid #F59E0B60',
              background: 'linear-gradient(160deg, #F59E0B18, #F59E0B08)',
              cursor: 'pointer', gap: '4px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#F59E0B', letterSpacing: '0.5px' }}>
              {stats.free_throws_made}/{stats.free_throws_attempted}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>Free Throw</span>
          </button>
        </div>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px 12px', paddingBottom: 'calc(96px + env(safe-area-inset-bottom, 0px))', marginTop: 'auto' }}>
        <button onClick={handleClear} style={{
          flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.08)', color: '#EF4444', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
        }}>
          <Trash2 size={15} /> Clear
        </button>
        <button onClick={handleUndo} disabled={history.length === 0} style={{
          flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: history.length > 0 ? '#fff' : 'rgba(255,255,255,0.25)',
          cursor: history.length > 0 ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 700, fontFamily: 'inherit',
        }}>
          <Undo2 size={15} /> Undo
        </button>
        <button onClick={handleSave} disabled={saving} style={{
          flex: 2, padding: '14px', borderRadius: '14px', border: 'none',
          background: saving ? 'rgba(255,107,53,0.4)' : 'linear-gradient(135deg, #FF6B35, #C8490A)',
          color: '#fff', cursor: saving ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          fontSize: '15px', fontWeight: 900, fontFamily: 'inherit',
          boxShadow: saving ? 'none' : '0 4px 20px rgba(255,107,53,0.35)',
        }}>
          <Check size={17} /> {saving ? 'Saving...' : 'Save Game'}
        </button>
      </div>

      {/* Free throw popup */}
      {showFT && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        }} onClick={() => setShowFT(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: 'linear-gradient(160deg, #1a1a2e, #16213e)',
            border: '1px solid #F59E0B40', borderRadius: '20px',
            padding: '28px 24px', textAlign: 'center', minWidth: '260px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 32px #F59E0B20',
          }}>
            <div style={{
              display: 'inline-block', padding: '6px 18px', borderRadius: '20px',
              background: 'rgba(245,158,11,0.2)', border: '1px solid #F59E0B50', marginBottom: '16px',
            }}>
              <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '14px', letterSpacing: '1px' }}>FREE THROW</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '20px' }}>Did it go in?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => handleFT(true)} style={{
                flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff',
                fontWeight: 900, fontSize: '17px', boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
              }}>MADE</button>
              <button onClick={() => handleFT(false)} style={{
                flex: 1, padding: '16px', borderRadius: '14px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff',
                fontWeight: 900, fontSize: '17px', boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
              }}>MISS</button>
            </div>
          </div>
        </div>
      )}

      {/* Shot popup */}
      {pending && (
        <ShotPopup
          x={pending.x} y={pending.y} is3={pending.is3}
          onResult={handleShotResult}
          onClose={() => setPending(null)}
        />
      )}

      {/* Post-save shareable game card */}
      {savedGame && (
        <GameShareCard
          player={profile}
          game={savedGame}
          onClose={handleShareCardClose}
        />
      )}

      {/* Post-save Pro upsell (shown after the user dismisses the share card) */}
      {showUpgrade && (
        <UpgradePrompt
          title="Great game!"
          subtitle={`You logged ${pts} points. Unlock advanced analytics, heat maps & more with Pro.`}
          onClose={() => { setShowUpgrade(false); navigate('/games') }}
          onUpgrade={() => { upgrade(); setShowUpgrade(false); navigate('/games') }}
        />
      )}
    </div>
  )
}
