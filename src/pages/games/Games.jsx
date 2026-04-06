import { useState, useMemo } from 'react'
import { Trophy, ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Zap, Pencil, Share2, Crosshair, BarChart3, Info } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import SwipeableRow from '../../components/ui/SwipeableRow'
import useGames from '../../hooks/useGames'
import { useToast } from '../../context/ToastContext'

const GAME_TYPES = ['League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage']
const RESULTS = ['Win', 'Loss', 'Draw']

const heading = { fontWeight: 800, letterSpacing: '-0.3px' }
const body = { fontFamily: 'inherit' }
const statNum = { ...heading, fontSize: '1.5rem', color: 'var(--color-text)' }
const statLabel = { ...body, fontSize: '0.75rem', color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.2px' }

const emptyForm = {
  game_date: '', opponent: '', game_type: '', result: '', is_home_game: 'true',
  minutes_played: '', points: '', rebounds: '', assists: '', steals: '', blocks: '',
  turnovers: '', fouls: '', field_goals_made: '', field_goals_attempted: '',
  free_throws_made: '', free_throws_attempted: '', three_pointers_made: '',
  three_pointers_attempted: '', notes: '',
}

const resultBadge = (r) => {
  if (r === 'Win') return 'beginner'
  if (r === 'Loss') return 'elite'
  return 'default'
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function StatBox({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={statNum}>{value ?? '—'}</div>
      <div style={statLabel}>{label}</div>
    </div>
  )
}

function SeasonAverages({ avg }) {
  if (!avg) return null
  return (
    <Card padding="md">
      <h3 className="text-sm mb-3" style={{ ...body, color: 'var(--text-secondary)', fontWeight: 600 }}>Season Averages</h3>
      <div className="grid grid-cols-3 gap-4">
        <StatBox value={avg.ppg} label="PPG" />
        <StatBox value={avg.rpg} label="RPG" />
        <StatBox value={avg.apg} label="APG" />
        <StatBox value={avg.fgPct} label="FG%" />
        <StatBox value={avg.threePct} label="3P%" />
        <StatBox value={avg.winPct} label="Win%" />
      </div>
    </Card>
  )
}

function GameCard({ game, onReview }) {
  const handleClick = () => {
    if (onReview && game) onReview(game)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      className="rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98]"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '0.875rem 1rem',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
        userSelect: 'none',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs" style={{ ...body, color: 'var(--text-muted)' }}>{fmtDate(game.game_date)}</span>
        <Badge variant={resultBadge(game.result)}>{game.result}</Badge>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold" style={{ ...body, color: 'var(--text-primary)' }}>
          {game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'} {game.opponent || 'Unknown'}
        </span>
        {game.game_type && <Badge>{game.game_type}</Badge>}
      </div>
      <div className="flex gap-6">
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.points ?? 0} <span style={{ ...statLabel }}>PTS</span></span>
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.rebounds ?? 0} <span style={{ ...statLabel }}>REB</span></span>
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.assists ?? 0} <span style={{ ...statLabel }}>AST</span></span>
        <ChevronRight className="ml-auto w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </div>
    </div>
  )
}

/* ---- Tabbed Game Form ---- */

const FORM_TABS = [
  { id: 'info', label: 'Game', icon: Info, color: '#3B82F6' },
  { id: 'stats', label: 'Stats', icon: BarChart3, color: '#22C55E' },
  { id: 'shooting', label: 'Shooting', icon: Crosshair, color: '#FF6B35' },
]

const SHOT_ZONES = [
  { id: 'paint', label: 'Paint', x: 42, y: 70, w: 16, h: 22 },
  { id: 'mid-left', label: 'Mid L', x: 10, y: 50, w: 20, h: 25 },
  { id: 'mid-right', label: 'Mid R', x: 70, y: 50, w: 20, h: 25 },
  { id: 'mid-top', label: 'Mid Top', x: 30, y: 40, w: 40, h: 15 },
  { id: 'left-corner-3', label: 'L Corner 3', x: 2, y: 70, w: 12, h: 22 },
  { id: 'right-corner-3', label: 'R Corner 3', x: 86, y: 70, w: 12, h: 22 },
  { id: 'left-wing-3', label: 'L Wing 3', x: 5, y: 30, w: 20, h: 22 },
  { id: 'right-wing-3', label: 'R Wing 3', x: 75, y: 30, w: 20, h: 22 },
  { id: 'top-key-3', label: 'Top 3', x: 30, y: 15, w: 40, h: 18 },
  { id: 'free-throw', label: 'FT Line', x: 40, y: 55, w: 20, h: 10 },
]

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px 8px',
              borderRadius: '14px',
              border: 'none',
              background: isActive ? tab.color : 'var(--color-card)',
              color: isActive ? '#fff' : 'var(--color-text-sec)',
              fontSize: '13px',
              fontWeight: isActive ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? `0 4px 14px ${tab.color}40` : 'none',
              fontFamily: 'inherit',
            }}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function NumInput({ label, value, onChange, error, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: color || 'var(--color-text-sec)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={onChange}
        placeholder="0"
        style={{
          width: '100%',
          padding: '14px 8px',
          borderRadius: '14px',
          border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
          background: 'var(--color-input-bg)',
          color: 'var(--color-text)',
          fontSize: '20px',
          fontWeight: 800,
          textAlign: 'center',
          outline: 'none',
          fontFamily: 'inherit',
          letterSpacing: '-0.5px',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s',
        }}
        onFocus={(e) => { e.target.style.borderColor = color || 'var(--color-accent)'; e.target.style.boxShadow = `0 0 0 3px ${color || 'var(--color-accent)'}20` }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p style={{ fontSize: '10px', color: 'var(--color-danger)', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function ChipSelect({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const isActive = value === val
        return (
          <button
            key={val}
            type="button"
            onClick={() => onChange(val)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: isActive ? `1.5px solid ${color}` : '1px solid var(--color-border)',
              background: isActive ? `${color}15` : 'var(--color-input-bg)',
              color: isActive ? color : 'var(--color-text-sec)',
              fontSize: '14px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

function MiniCourtSVG({ shotData, onZoneClick }) {
  return (
    <svg viewBox="0 0 100 92" style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }}>
      <rect x="0" y="0" width="100" height="92" rx="4" fill="var(--color-court-bg)" />
      <rect x="2" y="2" width="96" height="88" rx="2" fill="none" stroke="var(--color-court-line)" strokeWidth="0.5" />
      <rect x="34" y="62" width="32" height="28" fill="none" stroke="var(--color-court-line)" strokeWidth="0.5" />
      <circle cx="50" cy="62" r="10" fill="none" stroke="var(--color-court-line)" strokeWidth="0.5" />
      <line x1="34" y1="62" x2="66" y2="62" stroke="var(--color-court-line)" strokeWidth="0.5" />
      <path d="M 10 90 L 10 68 Q 10 20, 50 15 Q 90 20, 90 68 L 90 90" fill="none" stroke="var(--color-court-line)" strokeWidth="0.5" />
      <path d="M 44 90 Q 44 82, 50 80 Q 56 82, 56 90" fill="none" stroke="var(--color-court-line)" strokeWidth="0.4" />
      <circle cx="50" cy="88" r="1.2" fill="none" stroke="rgba(255,107,53,0.6)" strokeWidth="0.5" />
      <line x1="47" y1="90" x2="53" y2="90" stroke="var(--color-court-line)" strokeWidth="0.5" />
      {SHOT_ZONES.map((zone) => {
        const data = shotData?.[zone.id]
        const made = data?.made || 0
        const att = data?.attempted || 0
        const pct = att > 0 ? (made / att) * 100 : -1
        const fill = pct < 0 ? 'rgba(255,255,255,0.04)' : pct > 50 ? 'rgba(34,197,94,0.35)' : pct >= 33 ? 'rgba(255,107,53,0.35)' : 'rgba(239,68,68,0.35)'
        return (
          <g key={zone.id} onClick={() => onZoneClick(zone)} style={{ cursor: 'pointer' }}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="2" fill={fill} stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" />
            {att > 0 && (
              <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="3.5" fontWeight="700">
                {made}/{att}
              </text>
            )}
            {att === 0 && (
              <text x={zone.x + zone.w / 2} y={zone.y + zone.h / 2} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,0.25)" fontSize="2.8" fontWeight="600">
                {zone.label}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function ShotZoneModal({ zone, onRecord, onClose }) {
  if (!zone) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '24px', padding: '28px', minWidth: '260px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>{zone.label}</p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', marginBottom: '20px' }}>Record your shot</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => onRecord(zone.id, true)}
            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.3)', fontFamily: 'inherit' }}
          >
            Made
          </button>
          <button
            onClick={() => onRecord(zone.id, false)}
            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', fontFamily: 'inherit' }}
          >
            Missed
          </button>
        </div>
      </div>
    </div>
  )
}

function GameForm({ initial, onSave, onDelete, onBack, saving }) {
  const [form, setForm] = useState(initial ? { ...emptyForm, ...initial, is_home_game: String(initial.is_home_game ?? 'true') } : { ...emptyForm })
  const [errors, setErrors] = useState({})
  const [tab, setTab] = useState('info')
  const [shotData, setShotData] = useState({})
  const [activeZone, setActiveZone] = useState(null)
  const isEdit = !!initial?.id

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setVal = (field, val) => setForm((f) => ({ ...f, [field]: val }))
  const numSet = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value === '' ? '' : e.target.value }))

  // Auto-calculate shooting totals from court taps
  const courtTotals = useMemo(() => {
    let fgm = 0, fga = 0, tpm = 0, tpa = 0, ftm = 0, fta = 0
    Object.entries(shotData).forEach(([zoneId, d]) => {
      if (zoneId === 'free-throw') { ftm += d.made; fta += d.attempted }
      else if (zoneId.includes('3') || zoneId.includes('corner') || zoneId.includes('wing') || zoneId.includes('top-key')) { tpm += d.made; tpa += d.attempted; fgm += d.made; fga += d.attempted }
      else { fgm += d.made; fga += d.attempted }
    })
    return { fgm, fga, tpm, tpa, ftm, fta }
  }, [shotData])

  function handleShotRecord(zoneId, made) {
    setShotData((prev) => {
      const z = prev[zoneId] || { made: 0, attempted: 0 }
      return { ...prev, [zoneId]: { made: z.made + (made ? 1 : 0), attempted: z.attempted + 1 } }
    })
    setActiveZone(null)
  }

  const validate = () => {
    const errs = {}
    if (!form.game_date) errs.game_date = 'Date required'
    if (!form.opponent?.trim()) errs.opponent = 'Opponent required'
    if (!form.result) errs.result = 'Result required'
    setErrors(errs)
    if (Object.keys(errs).length > 0) setTab('info')
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, is_home_game: form.is_home_game === 'true' }
    // Apply court totals if user tapped shots
    if (courtTotals.fga > 0) {
      data.field_goals_made = courtTotals.fgm
      data.field_goals_attempted = courtTotals.fga
      data.three_pointers_made = courtTotals.tpm
      data.three_pointers_attempted = courtTotals.tpa
    }
    if (courtTotals.fta > 0) {
      data.free_throws_made = courtTotals.ftm
      data.free_throws_attempted = courtTotals.fta
    }
    // Auto-calculate points if not set
    if (!data.points && courtTotals.fga > 0) {
      const twos = (courtTotals.fgm - courtTotals.tpm) * 2
      const threes = courtTotals.tpm * 3
      const fts = courtTotals.ftm
      data.points = twos + threes + fts
    }
    Object.keys(data).forEach((k) => { if (data[k] === '') data[k] = null })
    ;['points','rebounds','assists','steals','blocks','turnovers','fouls','minutes_played',
      'field_goals_made','field_goals_attempted','free_throws_made','free_throws_attempted',
      'three_pointers_made','three_pointers_attempted'].forEach((k) => {
      if (data[k] !== null && data[k] !== undefined) data[k] = Number(data[k])
    })
    onSave(data)
  }

  const totalShots = Object.values(shotData).reduce((s, d) => s + d.attempted, 0)
  const totalMade = Object.values(shotData).reduce((s, d) => s + d.made, 0)

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer" style={{ color: 'var(--color-text-sec)', marginBottom: '16px', fontFamily: 'inherit' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h2 className="t-title2" style={{ color: 'var(--color-text)', marginBottom: '16px' }}>{isEdit ? 'Edit Game' : 'Log Game'}</h2>

      <TabBar tabs={FORM_TABS} active={tab} onChange={setTab} />

      {/* TAB: Game Info */}
      {tab === 'info' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '6px' }}>Date</label>
            <input type="date" value={form.game_date} onChange={set('game_date')} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: errors.game_date ? '1px solid var(--color-danger)' : '1px solid var(--color-border)', background: 'var(--color-input-bg)', color: 'var(--color-text)', fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
            {errors.game_date && <p style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>{errors.game_date}</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '6px' }}>Opponent</label>
            <input value={form.opponent} onChange={set('opponent')} placeholder="Team name" style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: errors.opponent ? '1px solid var(--color-danger)' : '1px solid var(--color-border)', background: 'var(--color-input-bg)', color: 'var(--color-text)', fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }} />
            {errors.opponent && <p style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>{errors.opponent}</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '8px' }}>Result</label>
            <ChipSelect options={RESULTS} value={form.result} onChange={(v) => setVal('result', v)} color="#3B82F6" />
            {errors.result && <p style={{ fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>{errors.result}</p>}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '8px' }}>Game Type</label>
            <ChipSelect options={GAME_TYPES} value={form.game_type} onChange={(v) => setVal('game_type', v)} color="#8B5CF6" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '8px' }}>Venue</label>
            <ChipSelect options={[{ value: 'true', label: 'Home' }, { value: 'false', label: 'Away' }]} value={form.is_home_game} onChange={(v) => setVal('is_home_game', v)} color="#FF6B35" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '6px' }}>Notes</label>
            <textarea value={form.notes} onChange={set('notes')} placeholder="How did the game go?" rows={3} style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: '1px solid var(--color-border)', background: 'var(--color-input-bg)', color: 'var(--color-text)', fontSize: '15px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
          </div>
        </div>
      )}

      {/* TAB: Stats */}
      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Card>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#22C55E', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Scoring & Playmaking</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <NumInput label="PTS" value={form.points} onChange={numSet('points')} error={errors.points} color="#FF6B35" />
              <NumInput label="REB" value={form.rebounds} onChange={numSet('rebounds')} error={errors.rebounds} color="#3B82F6" />
              <NumInput label="AST" value={form.assists} onChange={numSet('assists')} error={errors.assists} color="#22C55E" />
            </div>
          </Card>
          <Card>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#3B82F6', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Defense & Hustle</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
              <NumInput label="STL" value={form.steals} onChange={numSet('steals')} color="#22C55E" />
              <NumInput label="BLK" value={form.blocks} onChange={numSet('blocks')} color="#3B82F6" />
              <NumInput label="TO" value={form.turnovers} onChange={numSet('turnovers')} color="#EF4444" />
              <NumInput label="PF" value={form.fouls} onChange={numSet('fouls')} color="#F59E0B" />
            </div>
          </Card>
          <Card>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Minutes</p>
            <NumInput label="MIN" value={form.minutes_played} onChange={numSet('minutes_played')} />
          </Card>
        </div>
      )}

      {/* TAB: Shooting (Court) */}
      {tab === 'shooting' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '14px', color: 'var(--color-text-sec)', textAlign: 'center' }}>
            Tap a zone to record makes & misses
          </p>
          <MiniCourtSVG shotData={shotData} onZoneClick={setActiveZone} />
          {totalShots > 0 && (
            <Card padding="sm">
              <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#22C55E' }}>{totalMade}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>MADE</p>
                </div>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#EF4444' }}>{totalShots - totalMade}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>MISSED</p>
                </div>
                <div>
                  <p style={{ fontSize: '22px', fontWeight: 900, color: '#FF6B35' }}>{totalShots > 0 ? Math.round((totalMade / totalShots) * 100) : 0}%</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>FG%</p>
                </div>
                {courtTotals.tpa > 0 && (
                  <div>
                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#8B5CF6' }}>{courtTotals.tpa > 0 ? Math.round((courtTotals.tpm / courtTotals.tpa) * 100) : 0}%</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>3PT%</p>
                  </div>
                )}
              </div>
            </Card>
          )}
          {totalShots > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--color-text-sec)', textAlign: 'center' }}>
              Auto-calculated: ~{(() => { const twos = (courtTotals.fgm - courtTotals.tpm) * 2; return twos + courtTotals.tpm * 3 + courtTotals.ftm })()} PTS from court data
            </p>
          )}
          <ShotZoneModal zone={activeZone} onRecord={handleShotRecord} onClose={() => setActiveZone(null)} />
        </div>
      )}

      {/* Save button always visible */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <Button type="submit" variant="primary" loading={saving} fullWidth>
          {isEdit ? 'Update Game' : 'Save Game'}
        </Button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={() => onDelete(initial.id)} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}

function pct(made, att) {
  if (!att || att === 0) return null
  return +((made / att) * 100).toFixed(1)
}

function generateFeedback(game, seasonAvg) {
  const lines = []
  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0
  const stl = game.steals || 0
  const blk = game.blocks || 0
  const tov = game.turnovers || 0
  const fouls = game.fouls || 0
  const min = game.minutes_played || 0

  const fgPct = pct(game.field_goals_made, game.field_goals_attempted)
  const ftPct = pct(game.free_throws_made, game.free_throws_attempted)
  const threePct = pct(game.three_pointers_made, game.three_pointers_attempted)

  // Scoring feedback based on actual numbers
  if (pts >= 30) lines.push({ icon: Zap, text: `${pts} points — dominant scoring output`, tone: 'hot' })
  else if (pts >= 20) lines.push({ icon: TrendingUp, text: `${pts} points — strong scoring game`, tone: 'good' })
  else if (pts >= 10) lines.push({ icon: Target, text: `${pts} points — solid contribution`, tone: 'neutral' })
  else if (pts > 0) lines.push({ icon: Target, text: `${pts} points — look for more shot opportunities`, tone: 'work' })
  else lines.push({ icon: TrendingDown, text: `0 points — find ways to attack the basket`, tone: 'work' })

  // FG% feedback — only if they actually shot
  if (fgPct !== null) {
    if (fgPct >= 55) lines.push({ icon: Target, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — very efficient from the field`, tone: 'hot' })
    else if (fgPct >= 45) lines.push({ icon: Target, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — solid shooting efficiency`, tone: 'good' })
    else if (fgPct >= 35) lines.push({ icon: Target, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — work on shot selection`, tone: 'work' })
    else lines.push({ icon: TrendingDown, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — focus on higher percentage shots`, tone: 'work' })
  }

  // 3PT feedback — only if they shot threes
  if (threePct !== null && game.three_pointers_attempted > 0) {
    if (threePct >= 40) lines.push({ icon: Zap, text: `${threePct}% from 3 (${game.three_pointers_made}/${game.three_pointers_attempted}) — lights out from deep`, tone: 'hot' })
    else if (threePct >= 33) lines.push({ icon: Target, text: `${threePct}% from 3 (${game.three_pointers_made}/${game.three_pointers_attempted}) — respectable from range`, tone: 'good' })
    else lines.push({ icon: TrendingDown, text: `${threePct}% from 3 (${game.three_pointers_made}/${game.three_pointers_attempted}) — be more selective with threes`, tone: 'work' })
  }

  // FT feedback — only if they shot free throws
  if (ftPct !== null && game.free_throws_attempted > 0) {
    if (ftPct >= 80) lines.push({ icon: Target, text: `${ftPct}% FT (${game.free_throws_made}/${game.free_throws_attempted}) — reliable at the line`, tone: 'good' })
    else if (ftPct >= 65) lines.push({ icon: Target, text: `${ftPct}% FT (${game.free_throws_made}/${game.free_throws_attempted}) — room to improve at the line`, tone: 'neutral' })
    else lines.push({ icon: TrendingDown, text: `${ftPct}% FT (${game.free_throws_made}/${game.free_throws_attempted}) — free throws need work`, tone: 'work' })
  }

  // Rebounds
  if (reb >= 12) lines.push({ icon: Shield, text: `${reb} rebounds — beast on the boards`, tone: 'hot' })
  else if (reb >= 8) lines.push({ icon: Shield, text: `${reb} rebounds — strong presence on the glass`, tone: 'good' })
  else if (reb >= 4) lines.push({ icon: Shield, text: `${reb} rebounds — decent effort on the boards`, tone: 'neutral' })

  // Assists
  if (ast >= 10) lines.push({ icon: Zap, text: `${ast} assists — elite playmaking`, tone: 'hot' })
  else if (ast >= 6) lines.push({ icon: TrendingUp, text: `${ast} assists — great court vision`, tone: 'good' })
  else if (ast >= 3) lines.push({ icon: TrendingUp, text: `${ast} assists — good ball movement`, tone: 'neutral' })

  // Defensive stats — only mention if they recorded any
  if (stl + blk >= 5) lines.push({ icon: Shield, text: `${stl} steals, ${blk} blocks — game-changing defense`, tone: 'hot' })
  else if (stl + blk >= 3) lines.push({ icon: Shield, text: `${stl} steals, ${blk} blocks — active on defense`, tone: 'good' })
  else if (stl + blk > 0) lines.push({ icon: Shield, text: `${stl} steals, ${blk} blocks — some defensive impact`, tone: 'neutral' })

  // Turnovers — always relevant
  if (tov === 0 && min > 0) lines.push({ icon: Shield, text: `0 turnovers — took care of the ball perfectly`, tone: 'hot' })
  else if (tov >= 5) lines.push({ icon: TrendingDown, text: `${tov} turnovers — need to protect the ball better`, tone: 'work' })
  else if (tov >= 3) lines.push({ icon: TrendingDown, text: `${tov} turnovers — limit careless passes`, tone: 'work' })

  // Assist-to-turnover ratio if both exist
  if (ast > 0 && tov > 0) {
    const atr = +(ast / tov).toFixed(1)
    if (atr >= 3) lines.push({ icon: Zap, text: `${atr} AST/TO ratio — exceptional decision-making`, tone: 'hot' })
    else if (atr >= 2) lines.push({ icon: TrendingUp, text: `${atr} AST/TO ratio — smart with the ball`, tone: 'good' })
    else if (atr < 1) lines.push({ icon: TrendingDown, text: `${atr} AST/TO ratio — too many turnovers relative to assists`, tone: 'work' })
  }

  // Foul trouble
  if (fouls >= 5) lines.push({ icon: TrendingDown, text: `${fouls} fouls — foul trouble limited your impact`, tone: 'work' })

  // Double-double / triple-double detection
  const ddCats = [pts >= 10, reb >= 10, ast >= 10, stl >= 10, blk >= 10].filter(Boolean).length
  if (ddCats >= 3) lines.push({ icon: Zap, text: `Triple-double! A complete all-around game`, tone: 'hot' })
  else if (ddCats >= 2) lines.push({ icon: Zap, text: `Double-double — impactful in multiple areas`, tone: 'hot' })

  // Compare to season averages if they have prior games
  if (seasonAvg && seasonAvg.gamesPlayed > 1) {
    const ppgDiff = +(pts - seasonAvg.ppg).toFixed(1)
    if (ppgDiff > 5) lines.push({ icon: TrendingUp, text: `+${ppgDiff} points above your season average (${seasonAvg.ppg} PPG)`, tone: 'good' })
    else if (ppgDiff < -5) lines.push({ icon: TrendingDown, text: `${ppgDiff} points below your season average (${seasonAvg.ppg} PPG)`, tone: 'work' })
  }

  return lines
}

const toneColors = {
  hot: '#F59E0B',
  good: '#22C55E',
  neutral: 'var(--text-secondary)',
  work: '#EF4444',
}

function buildShareText(game, feedback) {
  const venue = game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'
  const header = `${game.result} — ${venue} ${game.opponent || 'Unknown'} (${fmtDate(game.game_date)})`
  const stats = `${game.points || 0} PTS / ${game.rebounds || 0} REB / ${game.assists || 0} AST`

  const splits = []
  if (game.field_goals_attempted > 0) splits.push(`FG: ${game.field_goals_made}/${game.field_goals_attempted}`)
  if (game.three_pointers_attempted > 0) splits.push(`3PT: ${game.three_pointers_made}/${game.three_pointers_attempted}`)
  if (game.free_throws_attempted > 0) splits.push(`FT: ${game.free_throws_made}/${game.free_throws_attempted}`)

  const extras = []
  if (game.steals > 0) extras.push(`${game.steals} STL`)
  if (game.blocks > 0) extras.push(`${game.blocks} BLK`)
  if (game.turnovers > 0) extras.push(`${game.turnovers} TO`)

  let text = `${header}\n${stats}`
  if (splits.length) text += `\n${splits.join(' | ')}`
  if (extras.length) text += `\n${extras.join(' / ')}`

  if (feedback.length) {
    text += `\n\nBreakdown:`
    feedback.forEach((f) => {
      const marker = f.tone === 'hot' || f.tone === 'good' ? '+' : f.tone === 'work' ? '-' : ' '
      text += `\n${marker} ${f.text}`
    })
  }

  text += `\n\n— CourtIQ`
  return text
}

function GameResult({ game, seasonAvg, onDone, onEdit, showToast }) {
  const feedback = useMemo(() => generateFeedback(game, seasonAvg), [game, seasonAvg])
  const [shared, setShared] = useState(false)
  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0

  const resultColor = game.result === 'Win' ? '#22C55E' : game.result === 'Loss' ? '#EF4444' : 'var(--text-secondary)'
  const resultText = game.result === 'Win' ? 'Victory' : game.result === 'Loss' ? 'Tough Loss' : 'Draw'

  const handleShare = async () => {
    const text = buildShareText(game, feedback)
    // Try native share first (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title: `Game Review — ${game.opponent || 'Game'}`, text })
        showToast?.('Shared successfully', 'success')
        return
      } catch {
        // user cancelled or not supported, fall through
      }
    }
    // Try clipboard
    try {
      await navigator.clipboard.writeText(text)
      setShared(true)
      showToast?.('Stats copied to clipboard', 'success')
      setTimeout(() => setShared(false), 2000)
      return
    } catch {
      // clipboard not available
    }
    // Final fallback: select text in a temporary textarea
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setShared(true)
      showToast?.('Stats copied to clipboard', 'success')
      setTimeout(() => setShared(false), 2000)
    } catch {
      showToast?.('Could not copy — long press to select text manually', 'info')
    }
  }

  return (
    <PageWrapper>
      {/* Back + actions row */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onDone}
          className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer"
          style={{ color: 'var(--text-secondary)', ...body }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border cursor-pointer transition-all duration-200"
            style={{
              color: shared ? 'var(--success)' : 'var(--text-secondary)',
              borderColor: shared ? 'var(--success)' : 'var(--border-subtle)',
              ...body,
            }}
          >
            <Share2 className="w-3.5 h-3.5" />
            {shared ? 'Copied!' : 'Share'}
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(game)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border cursor-pointer transition-all duration-200"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-subtle)', ...body }}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* ===== TEAM RESULT ===== */}
      <div className="flex flex-col items-center text-center mb-6">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: `${resultColor}15` }}
        >
          <Trophy className="w-8 h-8" style={{ color: resultColor }} />
        </div>
        <h1 className="text-3xl mb-1" style={{ ...heading, color: resultColor }}>
          {resultText}
        </h1>
        <p className="text-sm" style={{ ...body, color: 'var(--text-muted)' }}>
          {game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'}{' '}
          {game.opponent || 'Unknown'} — {fmtDate(game.game_date)}
        </p>
      </div>

      <Card padding="sm" className="mb-4">
        <h3 className="text-xs font-semibold mb-2" style={{ ...body, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Game Info
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div style={{ ...heading, fontSize: '1rem', color: resultColor }}>{game.result || '—'}</div>
            <div style={statLabel}>Result</div>
          </div>
          <div className="text-center">
            <div style={{ ...heading, fontSize: '1rem', color: 'var(--text-primary)' }}>{game.game_type || '—'}</div>
            <div style={statLabel}>Type</div>
          </div>
          <div className="text-center">
            <div style={{ ...heading, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {game.is_home_game === true || game.is_home_game === 'true' ? 'Home' : 'Away'}
            </div>
            <div style={statLabel}>Venue</div>
          </div>
        </div>
      </Card>

      {/* ===== PLAYER STATS ===== */}
      <h3 className="text-xs font-semibold mb-2 mt-2" style={{ ...body, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Player Stats
      </h3>

      <Card padding="md" className="mb-4">
        <div className="grid grid-cols-3 gap-4">
          <StatBox value={pts} label="PTS" />
          <StatBox value={reb} label="REB" />
          <StatBox value={ast} label="AST" />
        </div>
      </Card>

      {/* Shooting splits */}
      {(game.field_goals_attempted > 0 || game.free_throws_attempted > 0 || game.three_pointers_attempted > 0) && (
        <Card padding="sm" className="mb-4">
          <h3 className="text-xs font-semibold mb-2" style={{ ...body, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Shooting Splits
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {game.field_goals_attempted > 0 && (
              <div className="text-center">
                <div style={{ ...heading, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {game.field_goals_made}/{game.field_goals_attempted}
                </div>
                <div style={statLabel}>FG</div>
              </div>
            )}
            {game.three_pointers_attempted > 0 && (
              <div className="text-center">
                <div style={{ ...heading, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {game.three_pointers_made}/{game.three_pointers_attempted}
                </div>
                <div style={statLabel}>3PT</div>
              </div>
            )}
            {game.free_throws_attempted > 0 && (
              <div className="text-center">
                <div style={{ ...heading, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  {game.free_throws_made}/{game.free_throws_attempted}
                </div>
                <div style={statLabel}>FT</div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Defensive & extra stats */}
      {(game.steals > 0 || game.blocks > 0 || game.turnovers > 0 || game.fouls > 0 || game.minutes_played > 0) && (
        <Card padding="sm" className="mb-4">
          <h3 className="text-xs font-semibold mb-2" style={{ ...body, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Defense & Other
          </h3>
          <div className="flex justify-around">
            {game.steals > 0 && <StatBox value={game.steals} label="STL" />}
            {game.blocks > 0 && <StatBox value={game.blocks} label="BLK" />}
            {game.turnovers > 0 && <StatBox value={game.turnovers} label="TO" />}
            {game.fouls > 0 && <StatBox value={game.fouls} label="PF" />}
            {game.minutes_played > 0 && <StatBox value={game.minutes_played} label="MIN" />}
          </div>
        </Card>
      )}

      {/* Feedback */}
      {feedback.length > 0 && (
        <Card padding="md" className="mb-4">
          <h3 className="text-xs font-semibold mb-3" style={{ ...body, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Game Breakdown
          </h3>
          <div className="flex flex-col gap-2.5">
            {feedback.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-start gap-2.5">
                  <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: toneColors[item.tone] }} />
                  <p className="text-sm" style={{ ...body, color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    {item.text}
                  </p>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Button variant="primary" fullWidth onClick={onDone}>
        Done
      </Button>
    </PageWrapper>
  )
}

export default function Games() {
  const { games, loading, addGame, updateGame, deleteGame, seasonAverages, loadMore, hasMore } = useGames()
  const { showToast } = useToast()
  const [view, setView] = useState('list')
  const [editGame, setEditGame] = useState(null)
  const [savedGame, setSavedGame] = useState(null)
  const [saving, setSaving] = useState(false)

  const openForm = (game = null) => { setEditGame(game); setView('form') }
  const openReview = (game) => {
    if (!game) return
    setSavedGame({ ...game })
    setView('result')
  }
  const backToList = () => { setEditGame(null); setSavedGame(null); setView('list') }

  // From the review screen, tap Edit → go to edit form, then back to review after save
  const editFromReview = (game) => { setEditGame(game); setView('form') }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editGame?.id) {
        const updated = await updateGame(editGame.id, data)
        showToast('Game updated', 'success')
        // Return to the review screen with the updated data
        setSavedGame(updated || { ...editGame, ...data })
        setEditGame(null)
        setView('result')
      } else {
        const created = await addGame(data)
        setSavedGame(created || data)
        setView('result')
      }
    } catch {
      showToast('Failed to save game', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setSaving(true)
    try {
      await deleteGame(id)
      showToast('Game deleted', 'success')
      backToList()
    } catch {
      showToast('Failed to delete game', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (view === 'result' && savedGame) {
    return <GameResult game={savedGame} seasonAvg={seasonAverages} onDone={backToList} onEdit={editFromReview} showToast={showToast} />
  }

  if (view === 'form') {
    return (
      <PageWrapper>
        <GameForm
          initial={editGame}
          onSave={handleSave}
          onDelete={handleDelete}
          onBack={savedGame ? () => { setView('result') } : backToList}
          saving={saving}
        />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl mb-4" style={{ ...heading, color: 'var(--text-primary)' }}>Game Stats</h1>

      {loading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : !games || games.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Games Logged"
          description="Start tracking your game stats"
          actionLabel="Log Your First Game"
          onAction={() => openForm()}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <SeasonAverages avg={seasonAverages} />
          <Button variant="primary" onClick={() => openForm()} fullWidth>Log Game</Button>
          <div className="flex flex-col gap-3">
            {games.map((g) => (
              <SwipeableRow
                key={g.id}
                onDelete={async () => {
                  await deleteGame(g.id)
                  showToast('Game deleted', 'success')
                }}
              >
                <GameCard game={g} onReview={openReview} />
              </SwipeableRow>
            ))}
          </div>
          {hasMore && (
            <Button variant="outline" onClick={loadMore} fullWidth>Load More</Button>
          )}
        </div>
      )}
    </PageWrapper>
  )
}
