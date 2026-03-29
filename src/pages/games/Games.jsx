import { useState, useMemo } from 'react'
import { Trophy, ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Target, Shield, Zap, Pencil, Share2 } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import useGames from '../../hooks/useGames'
import { useToast } from '../../context/ToastContext'

const GAME_TYPES = ['League', 'Tournament', 'Pickup', 'Practice', 'Scrimmage']
const RESULTS = ['Win', 'Loss', 'Draw']
const VENUE = [{ value: 'true', label: 'Home' }, { value: 'false', label: 'Away' }]

const heading = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }
const body = { fontFamily: "'DM Sans', sans-serif" }
const statNum = { ...heading, fontSize: '1.5rem', color: 'var(--text-primary)' }
const statLabel = { ...body, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }

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
      className="rounded-xl p-3 cursor-pointer transition-all duration-200 active:scale-[0.98]"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
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

function GameForm({ initial, onSave, onDelete, onBack, saving }) {
  const [form, setForm] = useState(initial ? { ...emptyForm, ...initial, is_home_game: String(initial.is_home_game ?? 'true') } : { ...emptyForm })
  const [errors, setErrors] = useState({})
  const isEdit = !!initial?.id

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const numSet = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value === '' ? '' : e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.game_date) errs.game_date = 'Required'
    if (!form.opponent?.trim()) errs.opponent = 'Required'
    if (!form.game_type) errs.game_type = 'Required'
    if (!form.result) errs.result = 'Required'
    const n = (v) => v === '' ? null : Number(v)
    if (n(form.points) !== null && (n(form.points) < 0 || n(form.points) > 200)) errs.points = '0-200'
    if (n(form.rebounds) !== null && (n(form.rebounds) < 0 || n(form.rebounds) > 100)) errs.rebounds = '0-100'
    if (n(form.assists) !== null && (n(form.assists) < 0 || n(form.assists) > 100)) errs.assists = '0-100'
    if (n(form.steals) !== null && (n(form.steals) < 0 || n(form.steals) > 50)) errs.steals = '0-50'
    if (n(form.blocks) !== null && (n(form.blocks) < 0 || n(form.blocks) > 50)) errs.blocks = '0-50'
    if (n(form.turnovers) !== null && (n(form.turnovers) < 0 || n(form.turnovers) > 50)) errs.turnovers = '0-50'
    if (n(form.fouls) !== null && (n(form.fouls) < 0 || n(form.fouls) > 10)) errs.fouls = '0-10'
    if (n(form.minutes_played) !== null && (n(form.minutes_played) < 0 || n(form.minutes_played) > 60)) errs.minutes_played = '0-60'
    if (n(form.field_goals_made) !== null && n(form.field_goals_attempted) !== null && n(form.field_goals_made) > n(form.field_goals_attempted)) errs.field_goals_made = 'Cannot exceed attempts'
    if (n(form.free_throws_made) !== null && n(form.free_throws_attempted) !== null && n(form.free_throws_made) > n(form.free_throws_attempted)) errs.free_throws_made = 'Cannot exceed attempts'
    if (n(form.three_pointers_made) !== null && n(form.three_pointers_attempted) !== null && n(form.three_pointers_made) > n(form.three_pointers_attempted)) errs.three_pointers_made = 'Cannot exceed attempts'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const data = { ...form, is_home_game: form.is_home_game === 'true' }
    Object.keys(data).forEach((k) => { if (data[k] === '') data[k] = null })
    ;['points','rebounds','assists','steals','blocks','turnovers','fouls','minutes_played',
      'field_goals_made','field_goals_attempted','free_throws_made','free_throws_attempted',
      'three_pointers_made','three_pointers_attempted'].forEach((k) => {
      if (data[k] !== null && data[k] !== undefined) data[k] = Number(data[k])
    })
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm self-start mb-2 bg-transparent border-0 cursor-pointer" style={{ color: 'var(--text-secondary)', ...body }}>
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
      <h2 className="text-2xl" style={{ ...heading, color: 'var(--text-primary)' }}>{isEdit ? 'Edit Game' : 'Log Game'}</h2>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={form.game_date} onChange={set('game_date')} error={errors.game_date} />
        <Input label="Opponent" value={form.opponent} onChange={set('opponent')} error={errors.opponent} placeholder="Opponent name" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Select label="Game Type" value={form.game_type} onChange={set('game_type')} options={GAME_TYPES} error={errors.game_type} placeholder="Type" />
        <Select label="Result" value={form.result} onChange={set('result')} options={RESULTS} error={errors.result} placeholder="Result" />
        <Select label="Venue" value={form.is_home_game} onChange={set('is_home_game')} options={VENUE} />
      </div>
      <Input label="Minutes Played" type="number" value={form.minutes_played} onChange={numSet('minutes_played')} error={errors.minutes_played} placeholder="0" />
      <div className="grid grid-cols-3 gap-3">
        <Input label="Points" type="number" value={form.points} onChange={numSet('points')} error={errors.points} placeholder="0" />
        <Input label="Rebounds" type="number" value={form.rebounds} onChange={numSet('rebounds')} error={errors.rebounds} placeholder="0" />
        <Input label="Assists" type="number" value={form.assists} onChange={numSet('assists')} error={errors.assists} placeholder="0" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input label="Steals" type="number" value={form.steals} onChange={numSet('steals')} error={errors.steals} placeholder="0" />
        <Input label="Blocks" type="number" value={form.blocks} onChange={numSet('blocks')} error={errors.blocks} placeholder="0" />
        <Input label="Turnovers" type="number" value={form.turnovers} onChange={numSet('turnovers')} error={errors.turnovers} placeholder="0" />
      </div>
      <Input label="Fouls" type="number" value={form.fouls} onChange={numSet('fouls')} error={errors.fouls} placeholder="0" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="FG Made" type="number" value={form.field_goals_made} onChange={numSet('field_goals_made')} error={errors.field_goals_made} placeholder="0" />
        <Input label="FG Attempted" type="number" value={form.field_goals_attempted} onChange={numSet('field_goals_attempted')} placeholder="0" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="FT Made" type="number" value={form.free_throws_made} onChange={numSet('free_throws_made')} error={errors.free_throws_made} placeholder="0" />
        <Input label="FT Attempted" type="number" value={form.free_throws_attempted} onChange={numSet('free_throws_attempted')} placeholder="0" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="3PT Made" type="number" value={form.three_pointers_made} onChange={numSet('three_pointers_made')} error={errors.three_pointers_made} placeholder="0" />
        <Input label="3PT Attempted" type="number" value={form.three_pointers_attempted} onChange={numSet('three_pointers_attempted')} placeholder="0" />
      </div>
      <Input label="Notes" value={form.notes} onChange={set('notes')} placeholder="Game notes..." />
      <div className="flex gap-3 mt-2">
        <Button type="submit" variant="primary" loading={saving} fullWidth>
          {isEdit ? 'Update Game' : 'Save Game'}
        </Button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={() => onDelete(initial.id)} style={{ color: 'var(--danger)' }}>
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

function GameResult({ game, seasonAvg, onDone, onEdit }) {
  const feedback = useMemo(() => generateFeedback(game, seasonAvg), [game, seasonAvg])
  const [shared, setShared] = useState(false)
  const pts = game.points || 0
  const reb = game.rebounds || 0
  const ast = game.assists || 0

  const resultColor = game.result === 'Win' ? '#22C55E' : game.result === 'Loss' ? '#EF4444' : 'var(--text-secondary)'
  const resultText = game.result === 'Win' ? 'Victory' : game.result === 'Loss' ? 'Tough Loss' : 'Draw'

  const handleShare = async () => {
    const text = buildShareText(game, feedback)
    if (navigator.share) {
      try {
        await navigator.share({ title: `Game Review — ${game.opponent || 'Game'}`, text })
        return
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch {
      // clipboard not available
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
  const openReview = (game) => { setSavedGame(game); setView('result') }
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
    return <GameResult game={savedGame} seasonAvg={seasonAverages} onDone={backToList} onEdit={editFromReview} />
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
            {games.map((g) => <GameCard key={g.id} game={g} onReview={openReview} />)}
          </div>
          {hasMore && (
            <Button variant="outline" onClick={loadMore} fullWidth>Load More</Button>
          )}
        </div>
      )}
    </PageWrapper>
  )
}
