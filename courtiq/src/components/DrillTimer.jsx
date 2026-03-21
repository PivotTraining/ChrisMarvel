import { useState, useRef, useCallback, useEffect } from 'react'
import { Play, Pause, RotateCcw, Timer } from 'lucide-react'

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '5m', seconds: 300 },
]

export default function DrillTimer() {
  const [mode, setMode] = useState('countdown') // 'countdown' | 'stopwatch'
  const [totalSeconds, setTotalSeconds] = useState(60)
  const [remaining, setRemaining] = useState(60)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef(null)

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }, [])

  const start = useCallback(() => {
    if (mode === 'countdown' && remaining <= 0) return
    setRunning(true)
    setFinished(false)
    intervalRef.current = setInterval(() => {
      if (mode === 'countdown') {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setRunning(false)
            setFinished(true)
            return 0
          }
          return prev - 1
        })
      } else {
        setElapsed(prev => prev + 1)
      }
    }, 1000)
  }, [mode, remaining])

  const reset = useCallback(() => {
    stop()
    setRemaining(totalSeconds)
    setElapsed(0)
    setFinished(false)
  }, [stop, totalSeconds])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  function selectPreset(seconds) {
    stop()
    setTotalSeconds(seconds)
    setRemaining(seconds)
    setFinished(false)
  }

  function switchMode(newMode) {
    stop()
    setMode(newMode)
    setRemaining(totalSeconds)
    setElapsed(0)
    setFinished(false)
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const displayTime = mode === 'countdown' ? remaining : elapsed
  const progress = mode === 'countdown' && totalSeconds > 0
    ? ((totalSeconds - remaining) / totalSeconds) * 100
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Timer size={14} className="text-blue" />
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Drill Timer</h2>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-1 bg-bg-section rounded-lg p-0.5">
        <button
          onClick={() => switchMode('countdown')}
          className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === 'countdown' ? 'bg-blue text-white' : 'text-text-secondary'
          }`}
        >
          Countdown
        </button>
        <button
          onClick={() => switchMode('stopwatch')}
          className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
            mode === 'stopwatch' ? 'bg-blue text-white' : 'text-text-secondary'
          }`}
        >
          Stopwatch
        </button>
      </div>

      {/* Presets (countdown only) */}
      {mode === 'countdown' && !running && (
        <div className="flex gap-2">
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => selectPreset(p.seconds)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                totalSeconds === p.seconds
                  ? 'bg-blue/10 text-blue border border-blue-border'
                  : 'bg-bg-section border border-border text-text-secondary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Timer Display */}
      <div className="flex flex-col items-center py-4 space-y-3">
        {/* Progress ring for countdown */}
        {mode === 'countdown' && (
          <div className="w-full h-1.5 rounded-full bg-bg-section overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${finished ? 'bg-success' : 'bg-blue'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <p className={`text-4xl font-bold tabular-nums ${
          finished ? 'text-success' : running ? 'text-blue' : 'text-text-primary'
        }`}>
          {formatTime(displayTime)}
        </p>

        {finished && (
          <p className="text-xs font-semibold text-success animate-pulse">Done!</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="w-10 h-10 rounded-xl bg-bg-section border border-border flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={running ? stop : start}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95 ${
            running
              ? 'bg-danger/10 border border-danger/20 text-danger'
              : 'bg-blue text-white shadow-lg shadow-blue/20'
          }`}
          aria-label={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <div className="w-10" /> {/* spacer for symmetry */}
      </div>
    </div>
  )
}
