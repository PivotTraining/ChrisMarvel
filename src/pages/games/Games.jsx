import { useState, useMemo } from 'react'
import { Trophy, ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Zap, Pencil, Share2, Crosshair, BarChart3, Info, Plus, Minus, X, Copy } from 'lucide-react'
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
  three_pointers_attempted: '', notes: '', paint_touches: 0, drives: 0,
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
  const handleClick = () => { if (onReview && game) onReview(game) }
  return (
    <div role="button" tabIndex={0} onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      className="rounded-xl cursor-pointer transition-all duration-200 active:scale-[0.98]"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', padding: '0.875rem 1rem', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation', userSelect: 'none' }}>
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
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.points ?? 0} <span style={statLabel}>PTS</span></span>
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.rebounds ?? 0} <span style={statLabel}>REB</span></span>
        <span style={{ ...heading, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{game.assists ?? 0} <span style={statLabel}>AST</span></span>
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
    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px' }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button key={tab.id} type="button" onClick={() => onChange(tab.id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '14px 8px', borderRadius: '14px', border: 'none', minHeight: '48px',
              background: isActive ? tab.color : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-sec)',
              fontSize: '13px', fontWeight: isActive ? 800 : 600,
              cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: isActive ? `0 4px 16px ${tab.color}50` : 'none',
              fontFamily: 'inherit', transform: isActive ? 'scale(1.02)' : 'scale(1)',
            }}>
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
      <input type="number" inputMode="numeric" value={value} onChange={onChange} placeholder="0"
        style={{
          width: '100%', padding: '14px 8px', borderRadius: '14px',
          border: error ? '1px solid var(--color-danger)' : '1.5px solid var(--color-border)',
          background: 'var(--color-input-bg)', color: 'var(--color-text)',
          fontSize: '20px', fontWeight: 800, textAlign: 'center', outline: 'none',
          fontFamily: 'inherit', letterSpacing: '-0.5px', boxSizing: 'border-box',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => { e.target.style.borderColor = color || 'var(--color-accent)'; e.target.style.boxShadow = `0 0 0 3px ${color || 'var(--color-accent)'}25` }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      />
      {error && <p style={{ fontSize: '10px', color: 'var(--color-danger)', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

function CounterInput({ label, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button type="button" onClick={() => onChange(Math.max(0, (value || 0) - 1))}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: 'var(--color-input-bg)', color: 'var(--color-text-sec)',
            fontSize: '20px', fontWeight: 700, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
          }}>
          <Minus size={18} />
        </button>
        <span style={{ fontSize: '24px', fontWeight: 900, color: color || 'var(--color-text)', minWidth: '36px', textAlign: 'center', letterSpacing: '-0.5px' }}>
          {value || 0}
        </span>
        <button type="button" onClick={() => onChange((value || 0) + 1)}
          style={{
            width: '44px', height: '44px', borderRadius: '50%', border: 'none',
            background: `linear-gradient(135deg, ${color}, ${color}CC)`,
            color: '#fff', fontSize: '20px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s', boxShadow: `0 4px 12px ${color}40`,
          }}>
          <Plus size={18} />
        </button>
      </div>
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
          <button key={val} type="button" onClick={() => onChange(val)}
            style={{
              padding: '12px 22px', borderRadius: '22px', minHeight: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: isActive ? 'none' : '1.5px solid var(--color-border)',
              background: isActive ? color : 'transparent',
              color: isActive ? '#fff' : 'var(--color-text-sec)',
              fontSize: '15px', fontWeight: isActive ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit',
              boxShadow: isActive ? `0 4px 14px ${color}35` : 'none',
            }}>
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
          <g key={zone.id} onClick={() => onZoneClick?.(zone)} style={{ cursor: onZoneClick ? 'pointer' : 'default' }}>
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
  const [shotType, setShotType] = useState('catch')
  if (!zone) return null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: '24px',
        padding: '28px', minWidth: '280px', textAlign: 'center',
        animation: 'modalIn 0.2s ease', transform: 'scale(1)',
      }}>
        <p style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>{zone.label}</p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', marginBottom: '16px' }}>Record your shot</p>

        {/* Shot Type Toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px' }}>
          {[{ id: 'catch', label: 'Catch & Shoot' }, { id: 'dribble', label: 'Off Dribble' }].map((t) => (
            <button key={t.id} type="button" onClick={() => setShotType(t.id)}
              style={{
                flex: 1, padding: '10px 8px', borderRadius: '10px', border: 'none',
                background: shotType === t.id ? '#FF6B35' : 'transparent',
                color: shotType === t.id ? '#fff' : 'var(--color-text-sec)',
                fontSize: '12px', fontWeight: shotType === t.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => onRecord(zone.id, true, shotType)}
            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #22C55E, #16A34A)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.3)', fontFamily: 'inherit' }}>
            Made
          </button>
          <button onClick={() => onRecord(zone.id, false, shotType)}
            style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #EF4444, #DC2626)', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', fontFamily: 'inherit' }}>
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

  const courtTotals = useMemo(() => {
    let fgm = 0, fga = 0, tpm = 0, tpa = 0, ftm = 0, fta = 0
    Object.entries(shotData).forEach(([zoneId, d]) => {
      if (zoneId === 'free-throw') { ftm += d.made; fta += d.attempted }
      else if (zoneId.includes('3') || zoneId.includes('corner') || zoneId.includes('wing') || zoneId.includes('top-key')) { tpm += d.made; tpa += d.attempted; fgm += d.made; fga += d.attempted }
      else { fgm += d.made; fga += d.attempted }
    })
    return { fgm, fga, tpm, tpa, ftm, fta }
  }, [shotData])

  function handleShotRecord(zoneId, made, shotType) {
    setShotData((prev) => {
      const z = prev[zoneId] || { made: 0, attempted: 0, catchShoot: { made: 0, attempted: 0 }, offDribble: { made: 0, attempted: 0 } }
      const typeKey = shotType === 'catch' ? 'catchShoot' : 'offDribble'
      const typeData = z[typeKey] || { made: 0, attempted: 0 }
      return {
        ...prev,
        [zoneId]: {
          made: z.made + (made ? 1 : 0),
          attempted: z.attempted + 1,
          catchShoot: typeKey === 'catchShoot' ? { made: typeData.made + (made ? 1 : 0), attempted: typeData.attempted + 1 } : (z.catchShoot || { made: 0, attempted: 0 }),
          offDribble: typeKey === 'offDribble' ? { made: typeData.made + (made ? 1 : 0), attempted: typeData.attempted + 1 } : (z.offDribble || { made: 0, attempted: 0 }),
        }
      }
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
    if (!data.points && courtTotals.fga > 0) {
      const twos = (courtTotals.fgm - courtTotals.tpm) * 2
      data.points = twos + courtTotals.tpm * 3 + courtTotals.ftm
    }
    // Attach shot data for post-game analysis
    data._shotData = shotData
    Object.keys(data).forEach((k) => { if (data[k] === '' && k !== '_shotData') data[k] = null })
    ;['points','rebounds','assists','steals','blocks','turnovers','fouls','minutes_played',
      'field_goals_made','field_goals_attempted','free_throws_made','free_throws_attempted',
      'three_pointers_made','three_pointers_attempted','paint_touches','drives'].forEach((k) => {
      if (data[k] !== null && data[k] !== undefined) data[k] = Number(data[k])
    })
    onSave(data)
  }

  const totalShots = Object.values(shotData).reduce((s, d) => s + d.attempted, 0)
  const totalMade = Object.values(shotData).reduce((s, d) => s + d.made, 0)

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer" style={{ color: 'var(--color-text-sec)', marginBottom: '12px', fontFamily: 'inherit' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--color-text)', marginBottom: '16px', letterSpacing: '-0.5px' }}>{isEdit ? 'Edit Game' : 'Track Game'}</h2>

      <TabBar tabs={FORM_TABS} active={tab} onChange={setTab} />

      {/* TAB: Stats (FIRST) */}
      {tab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#22C55E', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Scoring & Playmaking</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <NumInput label="PTS" value={form.points} onChange={numSet('points')} color="#FF6B35" />
              <NumInput label="REB" value={form.rebounds} onChange={numSet('rebounds')} color="#3B82F6" />
              <NumInput label="AST" value={form.assists} onChange={numSet('assists')} color="#22C55E" />
            </div>
          </Card>
          <Card>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#3B82F6', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Defense & Hustle</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
              <NumInput label="STL" value={form.steals} onChange={numSet('steals')} color="#22C55E" />
              <NumInput label="BLK" value={form.blocks} onChange={numSet('blocks')} color="#3B82F6" />
              <NumInput label="TO" value={form.turnovers} onChange={numSet('turnovers')} color="#EF4444" />
              <NumInput label="PF" value={form.fouls} onChange={numSet('fouls')} color="#F59E0B" />
            </div>
          </Card>
          <Card>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#8B5CF6', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Activity</p>
            <CounterInput label="Paint Touches" value={form.paint_touches} onChange={(v) => setVal('paint_touches', v)} color="#8B5CF6" />
            <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
            <CounterInput label="Drives" value={form.drives} onChange={(v) => setVal('drives', v)} color="#F59E0B" />
          </Card>
          <Card>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Minutes</p>
            <NumInput label="MIN" value={form.minutes_played} onChange={numSet('minutes_played')} />
          </Card>
        </div>
      )}

      {/* TAB: Shooting (SECOND) */}
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
                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#8B5CF6' }}>{Math.round((courtTotals.tpm / courtTotals.tpa) * 100)}%</p>
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

      {/* TAB: Game Info (LAST) */}
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

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
        <button type="submit" disabled={saving}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '16px', borderRadius: '16px', border: 'none', minHeight: '52px',
            background: 'linear-gradient(135deg, #FF6B35, #E85A2A)', color: '#fff',
            fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 4px 16px rgba(255,107,53,0.35)', opacity: saving ? 0.7 : 1,
            transition: 'all 0.2s',
          }}>
          <Trophy size={18} />
          {saving ? 'Saving...' : isEdit ? 'Update Game' : 'Save Game'}
        </button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={() => onDelete(initial.id)} style={{ color: 'var(--color-danger)', borderColor: 'rgba(239,68,68,0.3)' }}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}

/* ---- Analytics Helpers ---- */

function pct(made, att) {
  if (!att || att === 0) return null
  return +((made / att) * 100).toFixed(1)
}

function calcPerformanceRating(game, seasonAvg) {
  const pts = game.points || 0
  const ast = game.assists || 0
  const reb = game.rebounds || 0
  const stl = game.steals || 0
  const blk = game.blocks || 0
  const tov = game.turnovers || 0
  const min = game.minutes_played || 1
  const fga = game.field_goals_attempted || 0
  const fta = game.free_throws_attempted || 0
  const fgm = game.field_goals_made || 0
  const tpm = game.three_pointers_made || 0

  // Scoring score (0-100): based on pts, weighted towards 25+ as elite
  const scoringScore = Math.min(100, (pts / 30) * 100)

  // Playmaking score: AST/TO ratio scaled, bonus for high assists
  const atr = tov > 0 ? ast / tov : ast > 0 ? ast * 3 : 0
  const playScore = Math.min(100, (atr / 3) * 60 + (ast / 10) * 40)

  // Defense score: STL + BLK weighted
  const defScore = Math.min(100, ((stl + blk) / 5) * 100)

  // Efficiency score: TS% scaled (league avg ~56%)
  let tsRaw = 0
  if (fga > 0 || fta > 0) tsRaw = (pts / (2 * (fga + 0.44 * fta))) * 100
  const effScore = Math.min(100, (tsRaw / 65) * 100)

  const rating = Math.min(100, Math.round(scoringScore * 0.35 + playScore * 0.25 + defScore * 0.2 + effScore * 0.2))

  // Bonus for win
  const winBonus = game.result === 'Win' ? 5 : 0
  return Math.min(99, rating + winBonus)
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

  // Categorized feedback
  // Scoring
  if (pts >= 30) lines.push({ cat: 'Scoring', icon: Zap, text: `${pts} points — dominant scoring output`, tone: 'hot' })
  else if (pts >= 20) lines.push({ cat: 'Scoring', icon: TrendingUp, text: `${pts} points — strong scoring game`, tone: 'good' })
  else if (pts >= 10) lines.push({ cat: 'Scoring', icon: Target, text: `${pts} points — solid contribution`, tone: 'neutral' })
  else if (pts > 0) lines.push({ cat: 'Improve', icon: Target, text: `${pts} points — look for more shot opportunities`, tone: 'work' })
  else lines.push({ cat: 'Improve', icon: TrendingDown, text: `0 points — find ways to attack the basket`, tone: 'work' })

  // Efficiency
  if (fgPct !== null) {
    if (fgPct >= 55) lines.push({ cat: 'Efficiency', icon: Target, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — very efficient`, tone: 'hot' })
    else if (fgPct >= 45) lines.push({ cat: 'Efficiency', icon: Target, text: `${fgPct}% FG (${game.field_goals_made}/${game.field_goals_attempted}) — solid shooting`, tone: 'good' })
    else if (fgPct >= 35) lines.push({ cat: 'Improve', icon: Target, text: `${fgPct}% FG — work on shot selection`, tone: 'work' })
    else lines.push({ cat: 'Improve', icon: TrendingDown, text: `${fgPct}% FG — focus on higher percentage shots`, tone: 'work' })
  }

  if (threePct !== null && game.three_pointers_attempted > 0) {
    if (threePct >= 40) lines.push({ cat: 'Efficiency', icon: Zap, text: `${threePct}% from 3 (${game.three_pointers_made}/${game.three_pointers_attempted}) — lights out`, tone: 'hot' })
    else if (threePct >= 33) lines.push({ cat: 'Efficiency', icon: Target, text: `${threePct}% from 3 — respectable from range`, tone: 'good' })
    else lines.push({ cat: 'Improve', icon: TrendingDown, text: `${threePct}% from 3 — be more selective`, tone: 'work' })
  }

  if (ftPct !== null && game.free_throws_attempted > 0) {
    if (ftPct >= 80) lines.push({ cat: 'Efficiency', icon: Target, text: `${ftPct}% FT — reliable at the line`, tone: 'good' })
    else if (ftPct < 65) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${ftPct}% FT — free throws need work`, tone: 'work' })
  }

  // Playmaking
  if (ast >= 10) lines.push({ cat: 'Playmaking', icon: Zap, text: `${ast} assists — elite playmaking`, tone: 'hot' })
  else if (ast >= 6) lines.push({ cat: 'Playmaking', icon: TrendingUp, text: `${ast} assists — great court vision`, tone: 'good' })
  else if (ast >= 3) lines.push({ cat: 'Playmaking', icon: TrendingUp, text: `${ast} assists — good ball movement`, tone: 'neutral' })

  if (ast > 0 && tov > 0) {
    const atr = +(ast / tov).toFixed(1)
    if (atr >= 3) lines.push({ cat: 'Playmaking', icon: Zap, text: `${atr} AST/TO ratio — exceptional decisions`, tone: 'hot' })
    else if (atr >= 2) lines.push({ cat: 'Playmaking', icon: TrendingUp, text: `${atr} AST/TO ratio — smart with the ball`, tone: 'good' })
    else if (atr < 1) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${atr} AST/TO ratio — too many turnovers`, tone: 'work' })
  }

  // Defense
  if (reb >= 12) lines.push({ cat: 'Defense', icon: Shield, text: `${reb} rebounds — beast on the boards`, tone: 'hot' })
  else if (reb >= 8) lines.push({ cat: 'Defense', icon: Shield, text: `${reb} rebounds — strong on the glass`, tone: 'good' })
  else if (reb >= 4) lines.push({ cat: 'Defense', icon: Shield, text: `${reb} rebounds — decent effort`, tone: 'neutral' })

  if (stl + blk >= 5) lines.push({ cat: 'Defense', icon: Shield, text: `${stl} STL, ${blk} BLK — game-changing defense`, tone: 'hot' })
  else if (stl + blk >= 3) lines.push({ cat: 'Defense', icon: Shield, text: `${stl} STL, ${blk} BLK — active on defense`, tone: 'good' })
  else if (stl + blk > 0) lines.push({ cat: 'Defense', icon: Shield, text: `${stl} STL, ${blk} BLK — some defensive impact`, tone: 'neutral' })

  // Ball Security
  if (tov === 0 && min > 0) lines.push({ cat: 'Playmaking', icon: Shield, text: `0 turnovers — perfect ball security`, tone: 'hot' })
  else if (tov >= 5) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${tov} turnovers — protect the ball better`, tone: 'work' })
  else if (tov >= 3) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${tov} turnovers — limit careless passes`, tone: 'work' })

  if (fouls >= 5) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${fouls} fouls — foul trouble limited impact`, tone: 'work' })

  // Milestones
  const ddCats = [pts >= 10, reb >= 10, ast >= 10, stl >= 10, blk >= 10].filter(Boolean).length
  if (ddCats >= 3) lines.push({ cat: 'Scoring', icon: Zap, text: `Triple-double! Complete all-around game`, tone: 'hot' })
  else if (ddCats >= 2) lines.push({ cat: 'Scoring', icon: Zap, text: `Double-double — impactful in multiple areas`, tone: 'hot' })

  // Season comparison
  if (seasonAvg && seasonAvg.gamesPlayed > 1) {
    const ppgDiff = +(pts - seasonAvg.ppg).toFixed(1)
    if (ppgDiff > 5) lines.push({ cat: 'Scoring', icon: TrendingUp, text: `+${ppgDiff} above your ${seasonAvg.ppg} PPG average`, tone: 'good' })
    else if (ppgDiff < -5) lines.push({ cat: 'Improve', icon: TrendingDown, text: `${ppgDiff} below your ${seasonAvg.ppg} PPG average`, tone: 'work' })
  }

  return lines
}

const toneColors = { hot: '#F59E0B', good: '#22C55E', neutral: 'var(--color-text-sec)', work: '#EF4444' }
const toneBg = { hot: 'rgba(245,158,11,0.12)', good: 'rgba(34,197,94,0.12)', neutral: 'rgba(255,255,255,0.04)', work: 'rgba(239,68,68,0.12)' }

function buildShareText(game, feedback) {
  const venue = game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'
  const header = `${game.result} — ${venue} ${game.opponent || 'Unknown'} (${fmtDate(game.game_date)})`
  const stats = `${game.points || 0} PTS / ${game.rebounds || 0} REB / ${game.assists || 0} AST`
  const splits = []
  if (game.field_goals_attempted > 0) splits.push(`FG: ${game.field_goals_made}/${game.field_goals_attempted}`)
  if (game.three_pointers_attempted > 0) splits.push(`3PT: ${game.three_pointers_made}/${game.three_pointers_attempted}`)
  if (game.free_throws_attempted > 0) splits.push(`FT: ${game.free_throws_made}/${game.free_throws_attempted}`)
  let text = `${header}\n${stats}`
  if (splits.length) text += `\n${splits.join(' | ')}`
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

/* ---- Efficiency Bar Component ---- */
function EffBar({ label, made, attempted, thresholds }) {
  const val = attempted > 0 ? (made / attempted) * 100 : 0
  const color = val >= thresholds[0] ? '#22C55E' : val >= thresholds[1] ? '#FF6B35' : '#EF4444'
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>{label}</span>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-sec)' }}>{made}/{attempted}</span>
      </div>
      <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '4px', width: `${Math.min(100, val)}%`,
          background: `linear-gradient(90deg, ${color}, ${color}CC)`,
          transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: `0 0 8px ${color}40`,
        }} />
      </div>
      <div style={{ textAlign: 'right', marginTop: '4px' }}>
        <span style={{ fontSize: '16px', fontWeight: 900, color, letterSpacing: '-0.5px' }}>{val.toFixed(1)}%</span>
      </div>
    </div>
  )
}

/* ---- Circular Rating Ring ---- */
function RatingRing({ rating }) {
  const size = 100
  const stroke = 6
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (rating / 100) * circ
  const color = rating >= 80 ? '#22C55E' : rating >= 60 ? '#FF6B35' : rating >= 40 ? '#F59E0B' : '#EF4444'
  const label = rating >= 80 ? 'Elite' : rating >= 60 ? 'Strong' : rating >= 40 ? 'Average' : 'Developing'
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div style={{ marginTop: '-72px', marginBottom: '28px' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, color, letterSpacing: '-1px' }}>{rating}</div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      </div>
    </div>
  )
}

/* ---- Mini Metric Card ---- */
function MetricCard({ label, value, unit, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '14px 10px',
      textAlign: 'center', border: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ fontSize: '22px', fontWeight: 900, color: color || 'var(--color-text)', letterSpacing: '-0.5px' }}>
        {value}{unit || ''}
      </div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>
        {label}
      </div>
    </div>
  )
}

/* ---- Last 5 Games Sparkline ---- */
function TrendBars({ games, currentPts }) {
  if (!games || games.length < 2) return null
  const last5 = games.slice(0, 5).reverse()
  const max = Math.max(...last5.map(g => g.points || 0), currentPts || 0, 1)
  return (
    <Card>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        Scoring Trend — Last {last5.length} Games
      </p>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '60px' }}>
        {last5.map((g, i) => {
          const h = Math.max(4, ((g.points || 0) / max) * 56)
          const isLast = i === last5.length - 1
          return (
            <div key={g.id || i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: isLast ? '#FF6B35' : 'var(--color-text-sec)' }}>{g.points || 0}</span>
              <div style={{
                width: '100%', maxWidth: '32px', height: `${h}px`, borderRadius: '4px',
                background: isLast ? 'linear-gradient(180deg, #FF6B35, #E85A2A)' : 'rgba(255,255,255,0.1)',
                transition: 'height 0.5s ease',
              }} />
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ---- Radar Chart ---- */
function RadarChart({ data }) {
  const labels = ['Scoring', 'Shooting', 'Playmaking', 'Defense', 'Hustle', 'Efficiency']
  const size = 200
  const cx = size / 2, cy = size / 2, r = 75
  const angleStep = (2 * Math.PI) / 6
  const point = (i, pct) => {
    const a = angleStep * i - Math.PI / 2
    return { x: cx + r * (pct / 100) * Math.cos(a), y: cy + r * (pct / 100) * Math.sin(a) }
  }
  const gridLevels = [33, 66, 100]
  const dataPoints = data.map((v, i) => point(i, Math.min(100, Math.max(0, v))))
  const poly = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <Card>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Player Profile</p>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: '280px', display: 'block', margin: '0 auto' }}>
        {gridLevels.map((lvl) => (
          <polygon key={lvl}
            points={Array.from({ length: 6 }, (_, i) => point(i, lvl)).map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={cx} y1={cy} x2={point(i, 100).x} y2={point(i, 100).y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
        ))}
        <polygon points={poly} fill="rgba(255,107,53,0.18)" stroke="#FF6B35" strokeWidth="1.5" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#FF6B35" />
        ))}
        {labels.map((l, i) => {
          const p = point(i, 118)
          return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" fill="var(--color-text-sec)" fontSize="7" fontWeight="600">{l}</text>
        })}
      </svg>
    </Card>
  )
}

/* ---- Player Archetype ---- */
const ARCHETYPES = [
  { id: 'sniper', name: 'Sniper', icon: '\u{1F3AF}', desc: 'Deadly from beyond the arc', color: '#FF6B35', match: (g) => g.three_pointers_attempted > 3 && (g.three_pointers_made / g.three_pointers_attempted) > 0.38 },
  { id: 'bucket', name: 'Bucket Getter', icon: '\u{1F525}', desc: 'Scores at will from anywhere', color: '#EF4444', match: (g) => (g.points || 0) >= 25 },
  { id: 'floor-general', name: 'Floor General', icon: '\u{1F441}', desc: 'Controls the game with vision', color: '#F59E0B', match: (g) => (g.assists || 0) >= 6 && (g.turnovers > 0 ? g.assists / g.turnovers >= 2 : true) },
  { id: 'two-way', name: 'Two-Way Force', icon: '\u26A1', desc: 'Dominant on both ends', color: '#8B5CF6', match: (g) => (g.steals || 0) + (g.blocks || 0) >= 3 && (g.points || 0) >= 15 },
  { id: 'rim-protector', name: 'Rim Protector', icon: '\u{1F6E1}', desc: 'Anchors the defense inside', color: '#3B82F6', match: (g) => (g.blocks || 0) >= 2 && (g.rebounds || 0) >= 8 },
  { id: 'sharpshooter', name: 'Sharpshooter', icon: '\u{1F4AB}', desc: 'Efficient scoring machine', color: '#22C55E', match: (g) => g.field_goals_attempted > 5 && (g.field_goals_made / g.field_goals_attempted) > 0.5 && (g.points || 0) >= 20 },
  { id: 'playmaker', name: 'Playmaker', icon: '\u{1F3C0}', desc: 'Creates for self and others', color: '#FF6B35', match: (g) => (g.assists || 0) >= 4 && (g.points || 0) >= 15 },
  { id: 'slasher', name: 'Slasher', icon: '\u{1F4AA}', desc: 'Attacks the rim relentlessly', color: '#EF4444', match: (g) => (g.paint_touches || 0) >= 5 || (g.drives || 0) >= 4 },
  { id: 'energy', name: 'Energy Guy', icon: '\u26A1', desc: 'Hustle plays and heart', color: '#22C55E', match: (g) => (g.rebounds || 0) + (g.steals || 0) + (g.blocks || 0) >= 8 },
  { id: 'balanced', name: 'All-Around', icon: '\u2B50', desc: 'Solid across the board', color: '#8B8FAB', match: () => true },
]

function getArchetype(game) {
  for (const arch of ARCHETYPES) {
    if (arch.match(game)) return arch
  }
  return ARCHETYPES[ARCHETYPES.length - 1]
}

function ArchetypeCard({ game }) {
  const arch = getArchetype(game)
  return (
    <div style={{ padding: '20px', borderRadius: '20px', textAlign: 'center', background: `linear-gradient(135deg, ${arch.color}12, ${arch.color}06)`, border: `1px solid ${arch.color}20` }}>
      <div style={{ fontSize: '40px', marginBottom: '8px' }}>{arch.icon}</div>
      <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>You played like a</p>
      <h3 style={{ fontSize: '22px', fontWeight: 900, color: arch.color, marginBottom: '4px', letterSpacing: '-0.5px' }}>{arch.name}</h3>
      <p style={{ fontSize: '14px', color: 'var(--color-text-sec)' }}>{arch.desc}</p>
    </div>
  )
}

/* ---- Streak & Consistency ---- */
function StreakConsistency({ allGames }) {
  if (!allGames || allGames.length < 2) return null
  const ptsArr = allGames.map(g => g.points || 0)
  const avg = ptsArr.reduce((s, v) => s + v, 0) / ptsArr.length
  const variance = ptsArr.reduce((s, v) => s + (v - avg) ** 2, 0) / ptsArr.length
  const stdDev = Math.sqrt(variance)
  const consistency = avg > 0 ? Math.max(0, Math.round(100 - (stdDev / avg) * 100)) : 50
  const consLabel = consistency >= 80 ? 'Elite' : consistency >= 60 ? 'Steady' : consistency >= 40 ? 'Variable' : 'Volatile'
  const consColor = consistency >= 80 ? '#22C55E' : consistency >= 60 ? '#FF6B35' : consistency >= 40 ? '#F59E0B' : '#EF4444'
  const sorted = [...allGames].sort((a, b) => (b.game_date || '').localeCompare(a.game_date || ''))
  let winStreak = 0, lossStreak = 0, scoringStreak = 0
  for (const g of sorted) { if (g.result === 'Win') winStreak++; else break }
  if (winStreak === 0) { for (const g of sorted) { if (g.result === 'Loss') lossStreak++; else break } }
  for (const g of sorted) { if ((g.points || 0) > avg) scoringStreak++; else break }

  return (
    <Card>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Consistency & Streaks</p>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>Consistency</span>
          <span style={{ fontSize: '13px', fontWeight: 800, color: consColor }}>{consLabel}</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)' }}>
          <div style={{ height: '100%', borderRadius: '3px', width: `${consistency}%`, background: consColor, transition: 'width 0.8s ease' }} />
        </div>
        <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', marginTop: '4px' }}>Avg {avg.toFixed(1)} PPG (±{stdDev.toFixed(1)})</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {winStreak >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)' }}><span>🔥</span><span style={{ fontSize: '14px', fontWeight: 700, color: '#22C55E' }}>{winStreak}-Game Win Streak</span></div>}
        {lossStreak >= 2 && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)' }}><span>📉</span><span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>{lossStreak}-Game Losing Streak</span></div>}
        {scoringStreak >= 3 && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,107,53,0.1)' }}><span>📈</span><span style={{ fontSize: '14px', fontWeight: 700, color: '#FF6B35' }}>{scoringStreak} games above average</span></div>}
        {winStreak < 2 && lossStreak < 2 && scoringStreak < 3 && <p style={{ fontSize: '13px', color: 'var(--color-text-sec)' }}>No active streaks — keep grinding!</p>}
      </div>
    </Card>
  )
}

/* ---- Share Card Modal ---- */
function ShareCardModal({ game, rating, onClose }) {
  const resultColor = game.result === 'Win' ? '#22C55E' : game.result === 'Loss' ? '#EF4444' : '#8B8FAB'
  const venue = game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'
  const fgPctVal = game.field_goals_attempted > 0 ? ((game.field_goals_made / game.field_goals_attempted) * 100).toFixed(0) : null
  const threePctVal = game.three_pointers_attempted > 0 ? ((game.three_pointers_made / game.three_pointers_attempted) * 100).toFixed(0) : null
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '320px', borderRadius: '24px', overflow: 'hidden', animation: 'modalIn 0.25s ease' }}>
        <div style={{ background: `linear-gradient(160deg, #1A1D2E, ${resultColor}15)`, padding: '28px 24px', textAlign: 'center', border: `1px solid ${resultColor}25`, borderRadius: '24px' }}>
          <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-sec)', letterSpacing: '1px', marginBottom: '20px' }}>COURT<span style={{ color: '#FF6B35' }}>IQ</span></p>
          <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: '10px', background: resultColor, marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '1.5px' }}>{game.result === 'Win' ? 'VICTORY' : game.result === 'Loss' ? 'LOSS' : 'DRAW'}</span>
          </div>
          <p style={{ fontSize: '15px', color: 'var(--color-text-sec)', marginBottom: '20px' }}>{venue} {game.opponent || 'Unknown'} — {fmtDate(game.game_date)}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '20px' }}>
            {[{ val: game.points || 0, label: 'PTS', color: '#FF6B35' }, { val: game.rebounds || 0, label: 'REB', color: '#3B82F6' }, { val: game.assists || 0, label: 'AST', color: '#22C55E' }].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: s.color, letterSpacing: '-1px' }}>{s.val}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: rating >= 70 ? '#22C55E' : '#FF6B35' }}>{rating}</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-sec)' }}>IQ Rating</span>
          </div>
          {(fgPctVal || threePctVal) && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
              {fgPctVal && <span style={{ fontSize: '13px', color: 'var(--color-text-sec)' }}><strong style={{ color: 'var(--color-text)' }}>{fgPctVal}%</strong> FG</span>}
              {threePctVal && <span style={{ fontSize: '13px', color: 'var(--color-text-sec)' }}><strong style={{ color: 'var(--color-text)' }}>{threePctVal}%</strong> 3PT</span>}
            </div>
          )}
          <p style={{ fontSize: '10px', color: 'var(--color-text-sec)', opacity: 0.5 }}>Screenshot to share</p>
        </div>
      </div>
      <button onClick={onClose} style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', padding: '14px 32px', borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', backdropFilter: 'blur(8px)' }}>Close</button>
    </div>
  )
}


/* ===== NBA-LEVEL POST-GAME IQ SCREEN ===== */

function GameResult({ game, seasonAvg, allGames, onDone, onEdit, showToast }) {
  const feedback = useMemo(() => generateFeedback(game, seasonAvg), [game, seasonAvg])
  const rating = useMemo(() => calcPerformanceRating(game, seasonAvg), [game, seasonAvg])
  const [shared, setShared] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0
  const fga = game.field_goals_attempted || 0
  const fgm = game.field_goals_made || 0
  const fta = game.free_throws_attempted || 0
  const ftm = game.free_throws_made || 0
  const tpa = game.three_pointers_attempted || 0
  const tpm = game.three_pointers_made || 0
  const min = game.minutes_played || 0

  const resultColor = game.result === 'Win' ? '#22C55E' : game.result === 'Loss' ? '#EF4444' : '#8B8FAB'
  const resultGrad = game.result === 'Win' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : game.result === 'Loss' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #6B7280, #4B5563)'
  const resultText = game.result === 'Win' ? 'VICTORY' : game.result === 'Loss' ? 'TOUGH LOSS' : 'DRAW'

  // Advanced metrics
  const tsRaw = (fga > 0 || fta > 0) ? (pts / (2 * (fga + 0.44 * fta))) * 100 : null
  const efgRaw = fga > 0 ? ((fgm + 0.5 * tpm) / fga) * 100 : null
  const atr = game.turnovers > 0 ? +(ast / game.turnovers).toFixed(1) : ast > 0 ? `${ast}:0` : '0:0'
  const ppm = min > 0 ? +(pts / min).toFixed(1) : null

  // Radar chart data
  const radarData = useMemo(() => {
    const scoring = Math.min(100, (pts / 30) * 100)
    const shooting = tsRaw !== null ? Math.min(100, (tsRaw / 70) * 100) : 30
    const playmaking = Math.min(100, (ast / 10) * 100)
    const defense = Math.min(100, (((game.steals || 0) + (game.blocks || 0)) / 5) * 100)
    const hustle = Math.min(100, ((reb + (game.paint_touches || 0) / 2) / 15) * 100)
    const efficiency = efgRaw !== null ? Math.min(100, (efgRaw / 65) * 100) : 30
    return [scoring, shooting, playmaking, defense, hustle, efficiency]
  }, [pts, ast, reb, tsRaw, efgRaw, game])

  // Categorize feedback
  const categories = {}
  feedback.forEach((f) => {
    if (!categories[f.cat]) categories[f.cat] = []
    categories[f.cat].push(f)
  })

  // Shot type aggregation from _shotData
  const shotData = game._shotData || {}
  const csTotal = { made: 0, attempted: 0 }
  const odTotal = { made: 0, attempted: 0 }
  Object.values(shotData).forEach((z) => {
    if (z.catchShoot) { csTotal.made += z.catchShoot.made; csTotal.attempted += z.catchShoot.attempted }
    if (z.offDribble) { odTotal.made += z.offDribble.made; odTotal.attempted += z.offDribble.attempted }
  })

  const handleShare = async () => {
    const text = buildShareText(game, feedback)
    if (navigator.share) {
      try { await navigator.share({ title: `Game Review — ${game.opponent || 'Game'}`, text }); showToast?.('Shared successfully', 'success'); return } catch {}
    }
    try { await navigator.clipboard.writeText(text); setShared(true); showToast?.('Stats copied to clipboard', 'success'); setTimeout(() => setShared(false), 2000); return } catch {}
    try {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;left:-9999px'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      setShared(true); showToast?.('Stats copied to clipboard', 'success'); setTimeout(() => setShared(false), 2000)
    } catch { showToast?.('Could not copy', 'info') }
  }

  return (
    <PageWrapper>
      {/* Top Bar */}
      <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
        <button type="button" onClick={onDone} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer" style={{ color: 'var(--color-text-sec)', fontFamily: 'inherit' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border cursor-pointer"
            style={{ color: shared ? '#22C55E' : 'var(--color-text-sec)', borderColor: shared ? '#22C55E' : 'var(--color-border)', fontFamily: 'inherit' }}>
            <Share2 className="w-3.5 h-3.5" /> {shared ? 'Copied!' : 'Share'}
          </button>
          {onEdit && (
            <button type="button" onClick={() => onEdit(game)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border cursor-pointer"
              style={{ color: 'var(--color-text-sec)', borderColor: 'var(--color-border)', fontFamily: 'inherit' }}>
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>
      </div>

      {/* ===== HERO: Result + Rating ===== */}
      <div style={{
        textAlign: 'center', padding: '24px 16px', borderRadius: '20px', marginBottom: '16px',
        background: 'var(--color-card)', border: '1px solid var(--color-border)',
      }}>
        <div style={{
          display: 'inline-block', padding: '8px 24px', borderRadius: '12px',
          background: resultGrad, marginBottom: '12px',
          boxShadow: `0 4px 16px ${resultColor}40`,
        }}>
          <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff', letterSpacing: '2px' }}>{resultText}</span>
        </div>
        <p style={{ fontSize: '15px', color: 'var(--color-text-sec)', marginBottom: '20px', fontWeight: 500 }}>
          {game.is_home_game === true || game.is_home_game === 'true' ? 'vs' : '@'} {game.opponent || 'Unknown'} — {fmtDate(game.game_date)}
        </p>
        <RatingRing rating={rating} />
        <p style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance IQ</p>
      </div>

      {/* ===== STAT HERO ROW ===== */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px',
      }}>
        {[
          { val: pts, label: 'PTS', avg: seasonAvg?.ppg, color: '#FF6B35' },
          { val: reb, label: 'REB', avg: seasonAvg?.rpg, color: '#3B82F6' },
          { val: ast, label: 'AST', avg: seasonAvg?.apg, color: '#22C55E' },
        ].map((s) => {
          const diff = s.avg && seasonAvg?.gamesPlayed > 1 ? +(s.val - s.avg).toFixed(1) : null
          return (
            <div key={s.label} style={{
              textAlign: 'center', padding: '16px 8px', borderRadius: '16px',
              background: 'var(--color-card)', border: '1px solid var(--color-border)',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: s.color, letterSpacing: '-1px', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-sec)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>{s.label}</div>
              {diff !== null && diff !== 0 && (
                <div style={{ fontSize: '11px', fontWeight: 700, color: diff > 0 ? '#22C55E' : '#EF4444', marginTop: '4px' }}>
                  {diff > 0 ? '▲' : '▼'} {Math.abs(diff)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ===== SHOOTING EFFICIENCY BARS ===== */}
      {(fga > 0 || tpa > 0 || fta > 0) && (
        <Card>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Shooting Efficiency</p>
          {fga > 0 && <EffBar label="FG%" made={fgm} attempted={fga} thresholds={[50, 42]} />}
          {tpa > 0 && <EffBar label="3PT%" made={tpm} attempted={tpa} thresholds={[38, 30]} />}
          {fta > 0 && <EffBar label="FT%" made={ftm} attempted={fta} thresholds={[78, 65]} />}
        </Card>
      )}

      {/* ===== ADVANCED METRICS ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        {tsRaw !== null && (
          <MetricCard label="True Shooting" value={tsRaw.toFixed(1)} unit="%"
            color={tsRaw >= 58 ? '#22C55E' : tsRaw >= 50 ? '#FF6B35' : '#EF4444'} />
        )}
        {efgRaw !== null && (
          <MetricCard label="Effective FG" value={efgRaw.toFixed(1)} unit="%"
            color={efgRaw >= 55 ? '#22C55E' : efgRaw >= 47 ? '#FF6B35' : '#EF4444'} />
        )}
        <MetricCard label="AST / TO" value={typeof atr === 'number' ? atr : atr}
          color={typeof atr === 'number' && atr >= 2 ? '#22C55E' : typeof atr === 'number' && atr >= 1 ? '#FF6B35' : 'var(--color-text-sec)'} />
        {ppm !== null && (
          <MetricCard label="PTS / MIN" value={ppm} color={ppm >= 0.7 ? '#22C55E' : ppm >= 0.4 ? '#FF6B35' : 'var(--color-text-sec)'} />
        )}
      </div>

      {/* ===== SHOT TYPE BREAKDOWN ===== */}
      {(csTotal.attempted > 0 || odTotal.attempted > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
          {csTotal.attempted > 0 && (
            <div style={{ background: 'rgba(59,130,246,0.08)', borderRadius: '14px', padding: '14px', textAlign: 'center', border: '1px solid rgba(59,130,246,0.15)' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#3B82F6' }}>{csTotal.attempted > 0 ? Math.round((csTotal.made / csTotal.attempted) * 100) : 0}%</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-sec)', marginTop: '2px' }}>{csTotal.made}/{csTotal.attempted}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Catch & Shoot</div>
            </div>
          )}
          {odTotal.attempted > 0 && (
            <div style={{ background: 'rgba(139,92,246,0.08)', borderRadius: '14px', padding: '14px', textAlign: 'center', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#8B5CF6' }}>{odTotal.attempted > 0 ? Math.round((odTotal.made / odTotal.attempted) * 100) : 0}%</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-sec)', marginTop: '2px' }}>{odTotal.made}/{odTotal.attempted}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Off Dribble</div>
            </div>
          )}
        </div>
      )}

      {/* ===== SHOT CHART (if zone data) ===== */}
      {Object.keys(shotData).length > 0 && (
        <Card style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Shot Chart</p>
          <MiniCourtSVG shotData={shotData} />
        </Card>
      )}

      {/* ===== DEFENSE & EXTRA STATS ===== */}
      {(game.steals > 0 || game.blocks > 0 || game.turnovers > 0 || game.paint_touches > 0 || game.drives > 0 || min > 0) && (
        <Card style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Box Score</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '12px' }}>
            {game.steals > 0 && <StatBox value={game.steals} label="STL" />}
            {game.blocks > 0 && <StatBox value={game.blocks} label="BLK" />}
            {game.turnovers > 0 && <StatBox value={game.turnovers} label="TO" />}
            {game.fouls > 0 && <StatBox value={game.fouls} label="PF" />}
            {min > 0 && <StatBox value={min} label="MIN" />}
            {game.paint_touches > 0 && <StatBox value={game.paint_touches} label="PAINT" />}
            {game.drives > 0 && <StatBox value={game.drives} label="DRIVES" />}
          </div>
        </Card>
      )}

      {/* ===== SCORING TREND ===== */}
      <div style={{ marginTop: '16px' }}>
        <TrendBars games={allGames} currentPts={pts} />
      </div>

      {/* ===== INTELLIGENCE CALLOUTS ===== */}
      {feedback.length > 0 && (
        <Card style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-sec)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Game Intelligence</p>
          {Object.entries(categories).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: cat === 'Improve' ? '#EF4444' : '#FF6B35', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cat === 'Improve' ? 'Areas to Improve' : cat}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '12px',
                      background: toneBg[item.tone],
                      border: `1px solid ${toneColors[item.tone]}15`,
                    }}>
                      <Icon size={14} style={{ color: toneColors[item.tone], flexShrink: 0 }} />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* ===== RADAR CHART ===== */}
      <div style={{ marginTop: '16px' }}><RadarChart data={radarData} /></div>

      {/* ===== PLAYER ARCHETYPE ===== */}
      <div style={{ marginTop: '16px' }}><ArchetypeCard game={game} /></div>

      {/* ===== STREAK & CONSISTENCY ===== */}
      <div style={{ marginTop: '16px' }}><StreakConsistency allGames={allGames} /></div>

      {showShareCard && <ShareCardModal game={game} rating={rating} onClose={() => setShowShareCard(false)} />}

      {/* Action buttons */}
      <div style={{ marginTop: '20px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
        <button type="button" onClick={() => setShowShareCard(true)}
          style={{ flex: 1, padding: '16px', borderRadius: '16px', border: '1.5px solid var(--color-border)', background: 'transparent', color: 'var(--color-text)', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Share2 size={16} /> Share Card
        </button>
        <button type="button" onClick={onDone}
          style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: 'linear-gradient(135deg, #FF6B35, #E85A2A)', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(255,107,53,0.35)' }}>
          Done
        </button>
      </div>
    </PageWrapper>
  )
}

/* ===== MAIN GAMES PAGE ===== */

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
  const editFromReview = (game) => { setEditGame(game); setView('form') }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (editGame?.id) {
        const updated = await updateGame(editGame.id, data)
        showToast('Game updated', 'success')
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
    return <GameResult game={savedGame} seasonAvg={seasonAverages} allGames={games} onDone={backToList} onEdit={editFromReview} showToast={showToast} />
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
              <SwipeableRow key={g.id} onDelete={async () => { await deleteGame(g.id); showToast('Game deleted', 'success') }}>
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
