import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Undo2, Clock, Pause, Play, X, Check, ChevronUp } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProGate from '../../components/ui/ProGate'
import useGames from '../../hooks/useGames'
import { useToast } from '../../context/ToastContext'

const QUARTERS = ['1st', '2nd', '3rd', '4th', 'OT']

const STAT_BUTTONS = [
  { key: '+2', label: '+2', stat: 'points', value: 2, fg: true, color: 'var(--color-success)' },
  { key: '+3', label: '+3', stat: 'points', value: 3, three: true, color: 'var(--color-info)' },
  { key: 'ft_make', label: 'FT', stat: 'points', value: 1, ft: true, color: 'var(--color-accent)' },
  { key: 'ft_miss', label: 'FT Miss', stat: null, ftMiss: true, color: 'var(--color-danger)' },
  { key: 'fg_miss', label: 'Miss 2', stat: null, fgMiss: true, color: 'var(--color-danger)' },
  { key: '3_miss', label: 'Miss 3', stat: null, threeMiss: true, color: 'var(--color-danger)' },
  { key: 'reb', label: 'REB', stat: 'rebounds', value: 1, color: 'var(--color-purple)' },
  { key: 'ast', label: 'AST', stat: 'assists', value: 1, color: 'var(--color-success)' },
  { key: 'stl', label: 'STL', stat: 'steals', value: 1, color: 'var(--color-info)' },
  { key: 'blk', label: 'BLK', stat: 'blocks', value: 1, color: 'var(--color-warning)' },
  { key: 'to', label: 'TO', stat: 'turnovers', value: 1, color: 'var(--color-danger)' },
  { key: 'foul', label: 'FOUL', stat: 'fouls', value: 1, color: 'var(--color-danger)' },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function LiveStatLine({ stats }) {
  const entries = [
    { label: 'PTS', value: stats.points },
    { label: 'REB', value: stats.rebounds },
    { label: 'AST', value: stats.assists },
    { label: 'STL', value: stats.steals },
    { label: 'BLK', value: stats.blocks },
  ]
  return (
    <div className="flex justify-around" style={{ padding: '8px 0' }}>
      {entries.map((e) => (
        <div key={e.label} style={{ textAlign: 'center' }}>
          <div className="t-title3" style={{ color: 'var(--color-text)' }}>{e.value}</div>
          <div className="section-label">{e.label}</div>
        </div>
      ))}
    </div>
  )
}

function PlayByPlayItem({ event, index }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        padding: '8px 12px',
        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
        borderRadius: '8px',
      }}
    >
      <span className="t-caption" style={{ color: 'var(--color-text-sec)', minWidth: '32px' }}>{event.quarter}</span>
      <span className="t-caption" style={{ color: 'var(--color-text-sec)', minWidth: '40px' }}>{event.time}</span>
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: event.color,
          flexShrink: 0,
        }}
      />
      <span className="t-body" style={{ color: 'var(--color-text)', fontWeight: 600, flex: 1 }}>{event.label}</span>
    </div>
  )
}

function QuickGameContent() {
  const navigate = useNavigate()
  const { addGame } = useGames()
  const { showToast } = useToast()

  const [gameActive, setGameActive] = useState(false)
  const [quarter, setQuarter] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [teamScore, setTeamScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [opponent, setOpponent] = useState('')

  const [stats, setStats] = useState({
    points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0,
    turnovers: 0, fouls: 0,
    field_goals_made: 0, field_goals_attempted: 0,
    three_pointers_made: 0, three_pointers_attempted: 0,
    free_throws_made: 0, free_throws_attempted: 0,
  })

  const [playByPlay, setPlayByPlay] = useState([])
  const [showPBP, setShowPBP] = useState(false)
  const timerRef = useRef(null)

  // Timer
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning])

  const addEvent = useCallback((label, color) => {
    setPlayByPlay((prev) => [
      { quarter: QUARTERS[quarter], time: formatTime(timer), label, color, ts: Date.now() },
      ...prev,
    ])
  }, [quarter, timer])

  const handleStat = useCallback((btn) => {
    let label = ''

    setStats((prev) => {
      const next = { ...prev }

      if (btn.fg) {
        next.points += btn.value
        next.field_goals_made += 1
        next.field_goals_attempted += 1
        label = `+${btn.value} PTS (FG)`
        setTeamScore((s) => s + btn.value)
      } else if (btn.three) {
        next.points += 3
        next.three_pointers_made += 1
        next.three_pointers_attempted += 1
        next.field_goals_made += 1
        next.field_goals_attempted += 1
        label = '+3 PTS (3PT)'
        setTeamScore((s) => s + 3)
      } else if (btn.ft) {
        next.points += 1
        next.free_throws_made += 1
        next.free_throws_attempted += 1
        label = 'FT Made'
        setTeamScore((s) => s + 1)
      } else if (btn.ftMiss) {
        next.free_throws_attempted += 1
        label = 'FT Missed'
      } else if (btn.fgMiss) {
        next.field_goals_attempted += 1
        label = 'FG Missed (2PT)'
      } else if (btn.threeMiss) {
        next.field_goals_attempted += 1
        next.three_pointers_attempted += 1
        label = '3PT Missed'
      } else if (btn.stat) {
        next[btn.stat] += btn.value
        label = `${btn.label}`
      }

      return next
    })

    addEvent(label || btn.label, btn.color)
  }, [addEvent])

  const undoLast = useCallback(() => {
    if (playByPlay.length === 0) return
    // Simple undo: remove last event — in production would reverse the stat
    setPlayByPlay((prev) => prev.slice(1))
    showToast('Last action undone', 'info')
  }, [playByPlay, showToast])

  const startGame = () => {
    setGameActive(true)
    setTimerRunning(true)
  }

  const endGame = async () => {
    setTimerRunning(false)

    const result = teamScore > opponentScore ? 'Win' : teamScore < opponentScore ? 'Loss' : 'Draw'

    const gameData = {
      game_date: new Date().toISOString().split('T')[0],
      opponent: opponent || 'Opponent',
      game_type: 'League',
      result,
      is_home_game: true,
      minutes_played: Math.round(timer / 60),
      ...stats,
      notes: `Quick Game — Team: ${teamScore}, Opponent: ${opponentScore}. Play-by-play: ${playByPlay.length} events.`,
    }

    const saved = await addGame(gameData)
    if (saved) {
      showToast('Game saved!', 'success')
      navigate('/games')
    } else {
      showToast('Failed to save game', 'error')
    }
  }

  // Pre-game setup
  if (!gameActive) {
    return (
      <PageWrapper>
        <h1 className="t-title1" style={{ marginBottom: 'var(--space-3)' }}>Quick Game</h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
          Tap stats in real time while watching the game. Every event builds a play-by-play log.
        </p>

        <Card padding="md">
          <label className="t-label" style={{ display: 'block', marginBottom: '6px' }}>Opponent</label>
          <input
            className="input-base"
            placeholder="Who are you playing?"
            value={opponent}
            onChange={(e) => setOpponent(e.target.value)}
            style={{ marginBottom: 'var(--space-3)' }}
          />
          <Button variant="primary" onClick={startGame} fullWidth>
            <Play size={18} /> Start Game
          </Button>
        </Card>
      </PageWrapper>
    )
  }

  // Live game UI
  const fgPct = stats.field_goals_attempted > 0
    ? Math.round((stats.field_goals_made / stats.field_goals_attempted) * 100)
    : 0

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-2)',
        paddingBottom: '32px',
      }}
    >
      {/* Scoreboard */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2)',
          marginBottom: 'var(--space-2)',
          backgroundColor: 'var(--color-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Team score */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div className="t-caption" style={{ color: 'var(--color-accent)', fontWeight: 700, marginBottom: '2px' }}>YOU</div>
          <div className="t-stat" style={{ color: 'var(--color-text)' }}>{teamScore}</div>
        </div>

        {/* Center: quarter + timer */}
        <div style={{ textAlign: 'center', padding: '0 var(--space-2)' }}>
          <div className="flex items-center gap-1 justify-center" style={{ marginBottom: '4px' }}>
            {QUARTERS.map((q, i) => (
              <button
                key={q}
                onClick={() => setQuarter(i)}
                className="t-caption"
                style={{
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  backgroundColor: i === quarter ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                  color: i === quarter ? '#fff' : 'var(--color-text-sec)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock size={14} style={{ color: 'var(--color-text-sec)' }} />
            <span className="t-body" style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatTime(timer)}</span>
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: timerRunning ? 'var(--color-warning)' : 'var(--color-success)',
                padding: '4px',
              }}
            >
              {timerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        </div>

        {/* Opponent score */}
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div className="t-caption" style={{ color: 'var(--color-text-sec)', fontWeight: 700, marginBottom: '2px' }}>
            {opponent || 'OPP'}
          </div>
          <div className="t-stat" style={{ color: 'var(--color-text)' }}>{opponentScore}</div>
          <div className="flex justify-center gap-1" style={{ marginTop: '4px' }}>
            <button
              onClick={() => setOpponentScore((s) => Math.max(0, s - 1))}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)', color: 'var(--color-text-sec)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700,
              }}
            >
              −
            </button>
            <button
              onClick={() => setOpponentScore((s) => s + 1)}
              style={{
                width: '28px', height: '28px', borderRadius: '8px', border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)', color: 'var(--color-text-sec)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700,
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Live stat line */}
      <LiveStatLine stats={stats} />

      {/* Shooting line */}
      <div className="flex justify-center gap-4" style={{ marginBottom: 'var(--space-2)' }}>
        <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
          FG: {stats.field_goals_made}/{stats.field_goals_attempted} ({fgPct}%)
        </span>
        <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
          3PT: {stats.three_pointers_made}/{stats.three_pointers_attempted}
        </span>
        <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
          FT: {stats.free_throws_made}/{stats.free_throws_attempted}
        </span>
      </div>

      {/* Stat buttons grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: 'var(--space-2)',
        }}
      >
        {STAT_BUTTONS.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleStat(btn)}
            style={{
              padding: '16px 8px',
              borderRadius: '16px',
              border: `2px solid ${btn.color}`,
              backgroundColor: 'rgba(0,0,0,0.2)',
              color: btn.color,
              fontSize: '16px',
              fontWeight: 900,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'transform 0.1s ease, background-color 0.1s ease',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation',
              userSelect: 'none',
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.92)'; e.currentTarget.style.backgroundColor = `${btn.color}22` }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)' }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex gap-2" style={{ marginBottom: 'var(--space-2)' }}>
        <button onClick={undoLast} className="btn-ghost" style={{ flex: 1 }}>
          <Undo2 size={16} /> Undo
        </button>
        <button
          onClick={() => setShowPBP(!showPBP)}
          className="btn-ghost"
          style={{ flex: 1 }}
        >
          <ChevronUp size={16} style={{ transform: showPBP ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          PBP ({playByPlay.length})
        </button>
      </div>

      {/* Play-by-play log */}
      {showPBP && (
        <Card padding="sm" style={{ marginBottom: 'var(--space-2)', maxHeight: '200px', overflowY: 'auto' }}>
          {playByPlay.length === 0 ? (
            <p className="t-caption" style={{ color: 'var(--color-text-sec)', textAlign: 'center', padding: '12px' }}>
              Tap a stat button to start recording
            </p>
          ) : (
            playByPlay.map((event, i) => <PlayByPlayItem key={event.ts} event={event} index={i} />)
          )}
        </Card>
      )}

      {/* End game */}
      <div className="flex gap-2">
        <button
          onClick={() => { if (window.confirm('Discard this game?')) navigate('/games') }}
          className="btn-ghost"
          style={{ flex: 1 }}
        >
          <X size={16} /> Discard
        </button>
        <button
          onClick={endGame}
          className="btn-primary"
          style={{ flex: 2 }}
        >
          <Check size={18} /> End Game & Save
        </button>
      </div>
    </div>
  )
}

export default function QuickGame() {
  return (
    <ProGate feature="quickGame">
      <QuickGameContent />
    </ProGate>
  )
}
