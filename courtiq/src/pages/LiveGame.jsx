import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Play, Pause, RotateCcw, Save, Clock, Target, Zap, Shield, Hand, X as XIcon, Check, ChevronUp, ChevronDown } from 'lucide-react'
import { useGames } from '../hooks/useGames'
import { useToast } from '../contexts/ToastContext'
import { hapticImpact, hapticNotification } from '../lib/native'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4', 'OT']

const STAT_BUTTONS = [
  { key: '2pt', label: '+2', stat: 'points', value: 2, color: 'bg-blue', icon: Target },
  { key: '3pt', label: '+3', stat: 'points', value: 3, color: 'bg-success', icon: Zap },
  { key: 'ft', label: 'FT', stat: 'points', value: 1, color: 'bg-warning', icon: Target },
  { key: 'reb', label: 'REB', stat: 'rebounds', value: 1, color: 'bg-blue/70', icon: Shield },
  { key: 'ast', label: 'AST', stat: 'assists', value: 1, color: 'bg-success/70', icon: Hand },
  { key: 'stl', label: 'STL', stat: 'steals', value: 1, color: 'bg-gold/80', icon: Zap },
  { key: 'blk', label: 'BLK', stat: 'blocks', value: 1, color: 'bg-danger/70', icon: Shield },
  { key: 'to', label: 'TO', stat: 'turnovers', value: 1, color: 'bg-danger', icon: XIcon },
]

function formatClock(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function LiveGame() {
  const navigate = useNavigate()
  const { addGame } = useGames()
  const toast = useToast()

  // Game setup
  const [started, setStarted] = useState(false)
  const [opponent, setOpponent] = useState('')
  const [gameType, setGameType] = useState('League')
  const [quarterLength, setQuarterLength] = useState(480) // 8 min default

  // Live game state
  const [quarter, setQuarter] = useState(0) // index into QUARTERS
  const [clock, setClock] = useState(480)
  const [running, setRunning] = useState(false)
  const [stats, setStats] = useState({
    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: 0,
    fg_made: 0, fg_attempted: 0, three_made: 0, three_attempted: 0, ft_made: 0, ft_attempted: 0,
  })
  const [events, setEvents] = useState([]) // play-by-play log
  const [teamScore, setTeamScore] = useState(0)
  const [oppScore, setOppScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saving, setSaving] = useState(false)

  const intervalRef = useRef(null)

  // Clock management
  const startClock = useCallback(() => {
    if (clock <= 0) return
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setClock(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setRunning(false)
          hapticNotification('SUCCESS')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [clock])

  const stopClock = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function startGame() {
    setClock(quarterLength)
    setStarted(true)
  }

  function nextQuarter() {
    stopClock()
    if (quarter < QUARTERS.length - 1) {
      setQuarter(prev => prev + 1)
      setClock(quarterLength)
      addEvent('quarter', `${QUARTERS[quarter + 1]} started`)
    }
  }

  function endGame() {
    stopClock()
    setFinished(true)
    hapticNotification('SUCCESS')
  }

  function addEvent(type, label) {
    setEvents(prev => [{
      id: Date.now(),
      type,
      label,
      quarter: QUARTERS[quarter],
      clock: formatClock(clock),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }, ...prev])
  }

  function logStat(btn) {
    hapticImpact('Medium')

    setStats(prev => {
      const updated = { ...prev }
      updated[btn.stat] = (updated[btn.stat] || 0) + btn.value

      // Update shooting stats
      if (btn.key === '2pt') {
        updated.fg_made += 1
        updated.fg_attempted += 1
      } else if (btn.key === '3pt') {
        updated.fg_made += 1
        updated.fg_attempted += 1
        updated.three_made += 1
        updated.three_attempted += 1
      } else if (btn.key === 'ft') {
        updated.ft_made += 1
        updated.ft_attempted += 1
      }

      return updated
    })

    // Update my score
    if (btn.stat === 'points') {
      setTeamScore(prev => prev + btn.value)
    }

    addEvent(btn.key, `${btn.label} ${btn.stat === 'points' ? '— scored' : ''}`)
  }

  function logMiss(type) {
    hapticImpact('Light')
    setStats(prev => {
      const updated = { ...prev }
      if (type === '2pt') {
        updated.fg_attempted += 1
      } else if (type === '3pt') {
        updated.fg_attempted += 1
        updated.three_attempted += 1
      } else if (type === 'ft') {
        updated.ft_attempted += 1
      }
      return updated
    })
    addEvent('miss', `Missed ${type === '3pt' ? '3-pointer' : type === 'ft' ? 'free throw' : '2-pointer'}`)
  }

  function logFoul() {
    hapticImpact('Light')
    setStats(prev => ({ ...prev, fouls: prev.fouls + 1 }))
    addEvent('foul', 'Personal foul')
  }

  async function saveGame() {
    setSaving(true)
    const result = teamScore > oppScore ? 'Win' : teamScore < oppScore ? 'Loss' : 'Draw'
    const totalMinutes = Math.round(((quarter + 1) * quarterLength) / 60)

    const notes = events.slice(0, 20).map(e => `[${e.quarter} ${e.clock}] ${e.label}`).join('\n')

    const { error } = await addGame({
      game_date: new Date().toISOString().split('T')[0],
      opponent: opponent.trim() || null,
      game_type: gameType,
      result,
      minutes_played: totalMinutes,
      ...stats,
      energy_level: 7,
      performance_rating: 7,
      notes: `Live Game — ${teamScore}-${oppScore}\n${notes}`.trim() || null,
      location: null,
    })

    setSaving(false)
    if (error) {
      toast(error.message || 'Failed to save')
    } else {
      toast('Game saved!')
      navigate('/log', { replace: true })
    }
  }

  // ── Pre-game setup ──
  if (!started) {
    return (
      <PageShell>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-text-primary">Live Game</h1>
              <p className="text-xs text-text-muted">Track stats in real time.</p>
            </div>
          </div>

          <Card className="space-y-5">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Game Setup</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={opponent}
                onChange={e => setOpponent(e.target.value)}
                placeholder="Opponent (optional)"
                className="w-full rounded-xl bg-bg-section border border-border px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-blue-border transition-colors"
              />
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted">Game Type</p>
                <div className="flex flex-wrap gap-2">
                  {['League', 'Tournament', 'Pickup', 'Scrimmage'].map(t => (
                    <button key={t} type="button" onClick={() => setGameType(t)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${gameType === t ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-text-muted">Quarter Length</p>
                <div className="flex gap-2">
                  {[{ label: '6 min', sec: 360 }, { label: '8 min', sec: 480 }, { label: '10 min', sec: 600 }, { label: '12 min', sec: 720 }].map(q => (
                    <button key={q.sec} type="button" onClick={() => setQuarterLength(q.sec)} className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${quarterLength === q.sec ? 'bg-blue text-white' : 'bg-bg-section border border-border text-text-secondary'}`}>
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Button fullWidth size="lg" onClick={startGame}>
            <Play size={18} />
            Start Game
          </Button>
        </div>
      </PageShell>
    )
  }

  // ── Post-game summary ──
  if (finished) {
    const result = teamScore > oppScore ? 'Win' : teamScore < oppScore ? 'Loss' : 'Draw'
    const fgPct = stats.fg_attempted > 0 ? Math.round((stats.fg_made / stats.fg_attempted) * 100) : 0

    return (
      <PageShell>
        <div className="flex flex-col gap-8">
          <div className="text-center space-y-2">
            <p className={`text-4xl font-black ${result === 'Win' ? 'text-success' : result === 'Loss' ? 'text-danger' : 'text-warning'}`}>
              {result === 'Win' ? 'VICTORY' : result === 'Loss' ? 'DEFEAT' : 'DRAW'}
            </p>
            <p className="text-2xl font-bold text-text-primary">{teamScore} - {oppScore}</p>
            {opponent && <p className="text-sm text-text-muted">vs {opponent}</p>}
          </div>

          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Your Stats</h2>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'PTS', value: stats.points },
                { label: 'REB', value: stats.rebounds },
                { label: 'AST', value: stats.assists },
                { label: 'STL', value: stats.steals },
                { label: 'BLK', value: stats.blocks },
                { label: 'TO', value: stats.turnovers },
                { label: 'FLS', value: stats.fouls },
                { label: 'FG%', value: `${fgPct}%` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center space-y-1">
                  <p className="text-lg font-bold text-text-primary">{value}</p>
                  <p className="text-[9px] text-text-muted uppercase">{label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Shooting breakdown */}
          <Card className="space-y-3">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shooting</h2>
            <div className="space-y-2">
              {[
                { label: 'FG', made: stats.fg_made, att: stats.fg_attempted },
                { label: '3PT', made: stats.three_made, att: stats.three_attempted },
                { label: 'FT', made: stats.ft_made, att: stats.ft_attempted },
              ].map(({ label, made, att }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-text-muted w-8">{label}</span>
                  <div className="flex-1 mx-3 h-2 bg-bg-section rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue rounded-full transition-all"
                      style={{ width: att > 0 ? `${(made / att) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-xs font-bold text-text-primary w-16 text-right">{made}/{att} ({att > 0 ? Math.round((made / att) * 100) : 0}%)</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Play-by-play */}
          {events.length > 0 && (
            <Card className="space-y-3">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Play-by-Play</h2>
              <div className="max-h-48 overflow-y-auto space-y-1.5">
                {events.slice(0, 30).map(event => (
                  <div key={event.id} className="flex items-center gap-2 text-[10px]">
                    <span className="text-text-muted w-6 shrink-0 font-mono">{event.quarter}</span>
                    <span className="text-text-muted w-10 shrink-0 font-mono">{event.clock}</span>
                    <span className="text-text-secondary">{event.label}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex gap-3">
            <Button fullWidth size="lg" onClick={saveGame} disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Game'}
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/log')}>
              Discard
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }

  // ── Live game UI ──
  const fgPct = stats.fg_attempted > 0 ? Math.round((stats.fg_made / stats.fg_attempted) * 100) : 0

  return (
    <PageShell>
      <div className="flex flex-col gap-5">
        {/* Scoreboard */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-3xl font-black text-blue">{teamScore}</p>
              <p className="text-[10px] text-text-muted uppercase">You</p>
            </div>
            <div className="text-center px-4 space-y-1">
              <p className="text-xs font-bold text-blue">{QUARTERS[quarter]}</p>
              <p className={`text-2xl font-mono font-bold tabular-nums ${clock <= 30 && running ? 'text-danger animate-pulse' : 'text-text-primary'}`}>
                {formatClock(clock)}
              </p>
            </div>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-1">
                <button onClick={() => setOppScore(Math.max(0, oppScore - 1))} className="p-1 text-text-muted hover:text-text-primary">
                  <ChevronDown size={14} />
                </button>
                <p className="text-3xl font-black text-danger">{oppScore}</p>
                <button onClick={() => setOppScore(oppScore + 1)} className="p-1 text-text-muted hover:text-text-primary">
                  <ChevronUp size={14} />
                </button>
              </div>
              <p className="text-[10px] text-text-muted uppercase">{opponent || 'Opp'}</p>
            </div>
          </div>

          {/* Clock controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={running ? stopClock : startClock}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                running ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-blue text-white'
              }`}
            >
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? 'Stop' : 'Start'}
            </button>
            <button onClick={nextQuarter} className="px-4 py-2 rounded-xl bg-bg-section border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
              Next Qtr
            </button>
            <button onClick={endGame} className="px-4 py-2 rounded-xl bg-success/10 border border-success/20 text-xs font-semibold text-success hover:bg-success/20 transition-colors">
              End Game
            </button>
          </div>
        </Card>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'PTS', value: stats.points },
            { label: 'REB', value: stats.rebounds },
            { label: 'AST', value: stats.assists },
            { label: 'FG%', value: `${fgPct}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-bg-card border border-border rounded-xl p-2.5 text-center">
              <p className="text-lg font-bold text-text-primary">{value}</p>
              <p className="text-[9px] text-text-muted uppercase">{label}</p>
            </div>
          ))}
        </div>

        {/* Scoring buttons */}
        <Card className="space-y-3">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Made Shot</h2>
          <div className="grid grid-cols-3 gap-2">
            {STAT_BUTTONS.filter(b => ['2pt', '3pt', 'ft'].includes(b.key)).map(btn => (
              <button
                key={btn.key}
                onClick={() => logStat(btn)}
                className={`${btn.color} text-white rounded-xl py-4 text-center transition-all active:scale-95`}
              >
                <p className="text-xl font-black">{btn.label}</p>
                <p className="text-[9px] opacity-80 uppercase">{btn.key === 'ft' ? 'Free Throw' : btn.key === '3pt' ? 'Three' : 'Two'}</p>
              </button>
            ))}
          </div>

          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Missed Shot</h2>
          <div className="grid grid-cols-3 gap-2">
            {['2pt', '3pt', 'ft'].map(type => (
              <button
                key={`miss-${type}`}
                onClick={() => logMiss(type)}
                className="bg-bg-section border border-border text-text-secondary rounded-xl py-3 text-center transition-all active:scale-95"
              >
                <p className="text-sm font-bold">Miss</p>
                <p className="text-[9px] text-text-muted">{type === 'ft' ? 'FT' : type === '3pt' ? '3PT' : '2PT'}</p>
              </button>
            ))}
          </div>
        </Card>

        {/* Other stats */}
        <Card className="space-y-3">
          <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Other Stats</h2>
          <div className="grid grid-cols-5 gap-2">
            {STAT_BUTTONS.filter(b => !['2pt', '3pt', 'ft'].includes(b.key)).map(btn => (
              <button
                key={btn.key}
                onClick={() => logStat(btn)}
                className="bg-bg-section border border-border rounded-xl py-3 text-center transition-all active:scale-95"
              >
                <p className="text-sm font-bold text-text-primary">{stats[btn.stat]}</p>
                <p className="text-[9px] text-text-muted">{btn.label}</p>
              </button>
            ))}
            <button
              onClick={logFoul}
              className="bg-bg-section border border-border rounded-xl py-3 text-center transition-all active:scale-95"
            >
              <p className="text-sm font-bold text-text-primary">{stats.fouls}</p>
              <p className="text-[9px] text-text-muted">FLS</p>
            </button>
          </div>
        </Card>

        {/* Recent events */}
        {events.length > 0 && (
          <Card className="space-y-2">
            <h2 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Recent</h2>
            <div className="space-y-1">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center gap-2 text-[10px]">
                  <span className="text-text-muted font-mono w-10">{event.clock}</span>
                  <span className="text-text-secondary">{event.label}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
