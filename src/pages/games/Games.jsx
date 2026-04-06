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
  { id: 'stats', label: 'Stats', icon: BarChart3, color: '#22C55E' },
  { id: 'shooting', label: 'Shooting', icon: Crosshair, color: '#FF6B35' },
  { id: 'info', label: 'Game', icon: Info, color: '#3B82F6' },
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
  const [tab, setTab] = useState('stats')
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

// ─── Performance rating (0–100) ───────────────────────────────────────────────
function calcPerformanceRating(game, seasonAvg) {
  let score = 50
  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0
  const stl = game.steals || 0
  const blk = game.blocks || 0
  const tov = game.turnovers || 0

  // Points scoring (max +25)
  score += Math.min(pts * 0.6, 25)
  // Rebounds (+10 max)
  score += Math.min(reb * 0.8, 10)
  // Assists (+10 max)
  score += Math.min(ast * 0.9, 10)
  // Defense (+5 max)
  score += Math.min((stl * 2 + blk * 2), 5)
  // Turnovers penalty
  score -= tov * 2
  // FG efficiency bonus
  const fgPctVal = pct(game.field_goals_made, game.field_goals_attempted)
  if (fgPctVal !== null) {
    if (fgPctVal >= 55) score += 8
    else if (fgPctVal >= 45) score += 4
    else if (fgPctVal < 35) score -= 4
  }
  // Result bonus
  if (game.result === 'Win') score += 5
  if (game.result === 'Loss') score -= 3
  // Season comparison bonus
  if (seasonAvg && seasonAvg.gamesPlayed > 1) {
    const diff = pts - seasonAvg.ppg
    if (diff > 5) score += 5
    else if (diff < -5) score -= 3
  }
  return Math.max(0, Math.min(100, Math.round(score)))
}

function ratingLabel(r) {
  if (r >= 90) return { label: 'MVP', color: '#F59E0B' }
  if (r >= 80) return { label: 'Elite', color: '#22C55E' }
  if (r >= 70) return { label: 'Strong', color: '#3B82F6' }
  if (r >= 60) return { label: 'Solid', color: '#8B5CF6' }
  if (r >= 50) return { label: 'Average', color: 'var(--color-text-sec)' }
  return { label: 'Rough', color: '#EF4444' }
}

function ShootingBar({ label, made, attempted, thresholdGood = 45, thresholdGreat = 55 }) {
  const p = attempted > 0 ? (made / attempted) * 100 : null
  const barColor = p === null ? 'var(--color-border)' : p >= thresholdGreat ? '#22C55E' : p >= thresholdGood ? '#FF6B35' : '#EF4444'
  const barWidth = p === null ? 0 : Math.min(p, 100)
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          {p !== null && (
            <span style={{ fontSize: '20px', fontWeight: 900, color: barColor, letterSpacing: '-0.5px' }}>{p.toFixed(0)}%</span>
          )}
          <span style={{ fontSize: '13px', color: 'var(--color-text-sec)', fontWeight: 600 }}>
            {attempted > 0 ? `${made}/${attempted}` : '—'}
          </span>
        </div>
      </div>
      <div style={{ height: '6px', borderRadius: '6px', background: 'var(--color-border)', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: '6px',
            width: `${barWidth}%`,
            background: p !== null
              ? `linear-gradient(90deg, ${barColor}cc, ${barColor})`
              : 'transparent',
            transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>
    </div>
  )
}

function IQChip({ text, tone }) {
  const colors = {
    hot: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#F59E0B' },
    good: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', text: '#22C55E' },
    neutral: { bg: 'rgba(139,143,171,0.1)', border: 'rgba(139,143,171,0.2)', text: 'var(--color-text-sec)' },
    work: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', text: '#EF4444' },
  }
  const c = colors[tone] || colors.neutral
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '7px 12px',
      borderRadius: '24px',
      background: c.bg,
      border: `1px solid ${c.border}`,
      color: c.text,
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '0.1px',
      lineHeight: 1.3,
      fontFamily: 'inherit',
    }}>
      {text}
    </div>
  )
}

function GameResult({ game, seasonAvg, onDone, onEdit, showToast }) {
  const feedback = useMemo(() => generateFeedback(game, seasonAvg), [game, seasonAvg])
  const [shared, setShared] = useState(false)
  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0
  const stl = game.steals || 0
  const blk = game.blocks || 0
  const tov = game.turnovers || 0
  const fouls = game.fouls || 0
  const min = game.minutes_played || 0

  const rating = useMemo(() => calcPerformanceRating(game, seasonAvg), [game, seasonAvg])
  const { label: rLabel, color: rColor } = ratingLabel(rating)

  const isWin = game.result === 'Win'
  const isLoss = game.result === 'Loss'
  const resultGrad = isWin
    ? 'linear-gradient(135deg, #22C55E, #16A34A)'
    : isLoss
    ? 'linear-gradient(135deg, #EF4444, #DC2626)'
    : 'linear-gradient(135deg, #6B7280, #4B5563)'
  const resultText = isWin ? 'Victory' : isLoss ? 'Tough Loss' : 'Draw'
  const resultColor = isWin ? '#22C55E' : isLoss ? '#EF4444' : '#6B7280'

  const fgPctVal = pct(game.field_goals_made, game.field_goals_attempted)
  const threePctVal = pct(game.three_pointers_made, game.three_pointers_attempted)
  const ftPctVal = pct(game.free_throws_made, game.free_throws_attempted)

  // True Shooting %: pts / (2 * (fga + 0.44 * fta))
  const tsPct = useMemo(() => {
    const fga = game.field_goals_attempted || 0
    const fta = game.free_throws_attempted || 0
    if (!fga && !fta) return null
    return +((pts / (2 * (fga + 0.44 * fta))) * 100).toFixed(1)
  }, [game, pts])

  // eFG%: (fgm + 0.5 * 3pm) / fga
  const efgPct = useMemo(() => {
    const fgm = game.field_goals_made || 0
    const fga = game.field_goals_attempted || 0
    const tpm = game.three_pointers_made || 0
    if (!fga) return null
    return +((((fgm + 0.5 * tpm) / fga) * 100)).toFixed(1)
  }, [game])

  const atrRatio = ast > 0 && tov > 0 ? +(ast / tov).toFixed(1) : null
  const ptsPerMin = min > 0 ? +(pts / min).toFixed(1) : null

  // Avg diffs vs season
  const ppgDiff = seasonAvg && seasonAvg.gamesPlayed > 1 ? +(pts - seasonAvg.ppg).toFixed(1) : null
  const rpgDiff = seasonAvg && seasonAvg.gamesPlayed > 1 ? +(reb - seasonAvg.rpg).toFixed(1) : null
  const apgDiff = seasonAvg && seasonAvg.gamesPlayed > 1 ? +(ast - seasonAvg.apg).toFixed(1) : null

  const handleShare = async () => {
    const text = buildShareText(game, feedback)
    if (navigator.share) {
      try { await navigator.share({ title: `Game Review — ${game.opponent || 'Game'}`, text }); showToast?.('Shared!', 'success'); return } catch {}
    }
    try {
      await navigator.clipboard.writeText(text)
      setShared(true); showToast?.('Copied to clipboard', 'success'); setTimeout(() => setShared(false), 2000); return
    } catch {}
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      setShared(true); showToast?.('Copied to clipboard', 'success'); setTimeout(() => setShared(false), 2000)
    } catch { showToast?.('Could not copy', 'info') }
  }

  const cardStyle = { backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '20px', padding: '18px', marginBottom: '12px' }
  const sectionLabel = { fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }

  return (
    <PageWrapper>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button type="button" onClick={onDone} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--color-text-sec)', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
          <ArrowLeft size={16} /> Games
        </button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '12px', border: `1px solid ${shared ? '#22C55E' : 'var(--color-border)'}`, background: shared ? 'rgba(34,197,94,0.1)' : 'var(--color-card)', color: shared ? '#22C55E' : 'var(--color-text-sec)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            <Share2 size={14} />{shared ? 'Copied!' : 'Share'}
          </button>
          {onEdit && (
            <button type="button" onClick={() => onEdit(game)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'var(--color-card)', color: 'var(--color-text-sec)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              <Pencil size={14} />Edit
            </button>
          )}
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div style={{ background: resultGrad, borderRadius: '24px', padding: '24px 20px', marginBottom: '12px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,0,0,0.12)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              {game.is_home_game === true || game.is_home_game === 'true' ? 'HOME' : 'AWAY'} · {game.game_type || 'GAME'}
            </p>
            <h1 style={{ fontSize: '34px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1, marginBottom: '6px' }}>{resultText}</h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
              vs {game.opponent || 'Unknown'} · {fmtDate(game.game_date)}
            </p>
          </div>
          {/* Performance IQ Badge */}
          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.25)', borderRadius: '16px', padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
            <p style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>{rating}</p>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>IQ Score</p>
            <p style={{ fontSize: '11px', fontWeight: 700, color: rColor, marginTop: '2px' }}>{rLabel}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN STATS HERO ── */}
      <div style={{ ...cardStyle, padding: '20px' }}>
        <p style={sectionLabel}>Performance</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0' }}>
          {[
            { val: pts, label: 'PTS', diff: ppgDiff, color: '#FF6B35' },
            { val: reb, label: 'REB', diff: rpgDiff, color: '#3B82F6' },
            { val: ast, label: 'AST', diff: apgDiff, color: '#22C55E' },
          ].map(({ val, label, diff, color }, i) => (
            <div key={label} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid var(--color-border)' : 'none', paddingBottom: '4px' }}>
              <p style={{ fontSize: '38px', fontWeight: 900, color, letterSpacing: '-1.5px', lineHeight: 1 }}>{val}</p>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{label}</p>
              {diff !== null && (
                <p style={{ fontSize: '11px', fontWeight: 700, color: diff > 0 ? '#22C55E' : diff < 0 ? '#EF4444' : 'var(--color-text-sec)', marginTop: '3px' }}>
                  {diff > 0 ? `↑ +${diff}` : diff < 0 ? `↓ ${diff}` : '= avg'}
                </p>
              )}
            </div>
          ))}
        </div>
        {/* Secondary stats row */}
        {(stl > 0 || blk > 0 || tov > 0 || fouls > 0 || min > 0) && (
          <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '16px', paddingTop: '14px', display: 'flex', justifyContent: 'space-around' }}>
            {stl > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontSize: '18px', fontWeight: 800, color: '#22C55E' }}>{stl}</p><p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>STL</p></div>}
            {blk > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontSize: '18px', fontWeight: 800, color: '#3B82F6' }}>{blk}</p><p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>BLK</p></div>}
            {tov > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontSize: '18px', fontWeight: 800, color: '#EF4444' }}>{tov}</p><p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>TO</p></div>}
            {fouls > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontSize: '18px', fontWeight: 800, color: '#F59E0B' }}>{fouls}</p><p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>PF</p></div>}
            {min > 0 && <div style={{ textAlign: 'center' }}><p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)' }}>{min}</p><p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>MIN</p></div>}
          </div>
        )}
      </div>

      {/* ── SHOOTING EFFICIENCY ── */}
      {(game.field_goals_attempted > 0 || game.three_pointers_attempted > 0 || game.free_throws_attempted > 0) && (
        <div style={cardStyle}>
          <p style={sectionLabel}>Shooting Efficiency</p>
          {game.field_goals_attempted > 0 && (
            <ShootingBar label="Field Goal %" made={game.field_goals_made || 0} attempted={game.field_goals_attempted} thresholdGood={40} thresholdGreat={50} />
          )}
          {game.three_pointers_attempted > 0 && (
            <ShootingBar label="Three Point %" made={game.three_pointers_made || 0} attempted={game.three_pointers_attempted} thresholdGood={33} thresholdGreat={40} />
          )}
          {game.free_throws_attempted > 0 && (
            <ShootingBar label="Free Throw %" made={game.free_throws_made || 0} attempted={game.free_throws_attempted} thresholdGood={70} thresholdGreat={85} />
          )}
        </div>
      )}

      {/* ── ADVANCED EFFICIENCY ── */}
      {(tsPct !== null || efgPct !== null || atrRatio !== null || ptsPerMin !== null) && (
        <div style={cardStyle}>
          <p style={sectionLabel}>Advanced Metrics</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {tsPct !== null && (
              <div style={{ background: 'var(--color-input-bg)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 900, color: tsPct >= 60 ? '#22C55E' : tsPct >= 50 ? '#FF6B35' : '#EF4444', letterSpacing: '-0.5px' }}>{tsPct}%</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>True Shooting</p>
              </div>
            )}
            {efgPct !== null && (
              <div style={{ background: 'var(--color-input-bg)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 900, color: efgPct >= 55 ? '#22C55E' : efgPct >= 45 ? '#FF6B35' : '#EF4444', letterSpacing: '-0.5px' }}>{efgPct}%</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>Eff. FG%</p>
              </div>
            )}
            {atrRatio !== null && (
              <div style={{ background: 'var(--color-input-bg)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 900, color: atrRatio >= 3 ? '#22C55E' : atrRatio >= 2 ? '#FF6B35' : '#EF4444', letterSpacing: '-0.5px' }}>{atrRatio}</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>AST/TO</p>
              </div>
            )}
            {ptsPerMin !== null && (
              <div style={{ background: 'var(--color-input-bg)', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 900, color: ptsPerMin >= 1 ? '#22C55E' : ptsPerMin >= 0.6 ? '#FF6B35' : 'var(--color-text)', letterSpacing: '-0.5px' }}>{ptsPerMin}</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>Pts/Min</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── COURT IQ INSIGHTS ── */}
      {feedback.length > 0 && (
        <div style={cardStyle}>
          <p style={sectionLabel}>CourtIQ Breakdown</p>
          {/* Group by category */}
          {(['hot', 'good', 'neutral', 'work']).map((tone) => {
            const items = feedback.filter((f) => f.tone === tone)
            if (!items.length) return null
            const toneLabel = { hot: 'On Fire', good: 'Strong', neutral: 'Noted', work: 'Work On' }[tone]
            return (
              <div key={tone} style={{ marginBottom: '14px' }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: toneColors[tone], textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{toneLabel}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {items.map((item, i) => <IQChip key={i} text={item.text} tone={tone} />)}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── SEASON CONTEXT ── */}
      {seasonAvg && seasonAvg.gamesPlayed > 1 && (
        <div style={{ ...cardStyle, marginBottom: '20px' }}>
          <p style={sectionLabel}>Season Context</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { label: 'Season PPG', val: seasonAvg.ppg, curr: pts, color: '#FF6B35' },
              { label: 'Season RPG', val: seasonAvg.rpg, curr: reb, color: '#3B82F6' },
              { label: 'Season APG', val: seasonAvg.apg, curr: ast, color: '#22C55E' },
            ].map(({ label, val, curr, color }) => (
              <div key={label} style={{ background: 'var(--color-input-bg)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', fontWeight: 900, color, letterSpacing: '-0.3px' }}>{val}</p>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', marginTop: '2px' }}>{label}</p>
                <p style={{ fontSize: '11px', fontWeight: 700, color: curr > val ? '#22C55E' : curr < val ? '#EF4444' : 'var(--color-text-sec)', marginTop: '4px' }}>
                  This: {curr}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '10px 14px', background: 'var(--color-input-bg)', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 900, color: '#FF6B35' }}>{seasonAvg.fgPct ?? '—'}%</p>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>Avg FG%</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 900, color: '#8B5CF6' }}>{seasonAvg.threePct ?? '—'}%</p>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>Avg 3P%</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 900, color: '#22C55E' }}>{seasonAvg.winPct ?? '—'}%</p>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>Win%</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 900, color: 'var(--color-text)' }}>{seasonAvg.gamesPlayed}</p>
              <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>Games</p>
            </div>
          </div>
        </div>
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
