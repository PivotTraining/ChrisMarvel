import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timer, Target, RotateCcw, Play, Pause, Check, Plus, Minus, Flame, Crosshair, Dumbbell, X } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProGate from '../../components/ui/ProGate'
import useShots, { COURT_ZONES } from '../../hooks/useShots'
import useDrills from '../../hooks/useDrills'
import { useToast } from '../../context/ToastContext'

const WORKOUT_TEMPLATES = [
  {
    id: 'spot-shooter',
    name: 'Spot Shooter',
    icon: '🎯',
    description: 'Hit target makes from 5 spots',
    type: 'shooting',
    exercises: [
      { name: 'Left Corner 3', zone: 'left-corner-3', targetMakes: 10, rest: 30 },
      { name: 'Left Wing 3', zone: 'left-wing-3', targetMakes: 10, rest: 30 },
      { name: 'Top of Key 3', zone: 'top-key-3', targetMakes: 10, rest: 30 },
      { name: 'Right Wing 3', zone: 'right-wing-3', targetMakes: 10, rest: 30 },
      { name: 'Right Corner 3', zone: 'right-corner-3', targetMakes: 10, rest: 30 },
    ],
  },
  {
    id: 'mid-range-master',
    name: 'Mid-Range Master',
    icon: '🏀',
    description: 'Dominate the mid-range game',
    type: 'shooting',
    exercises: [
      { name: 'Free Throw Line', zone: 'free-throw', targetMakes: 15, rest: 20 },
      { name: 'Mid Left', zone: 'mid-left', targetMakes: 10, rest: 30 },
      { name: 'Mid Top (Elbow)', zone: 'mid-top', targetMakes: 10, rest: 30 },
      { name: 'Mid Right', zone: 'mid-right', targetMakes: 10, rest: 30 },
      { name: 'Paint Finishes', zone: 'paint', targetMakes: 15, rest: 20 },
    ],
  },
  {
    id: 'free-throw-grind',
    name: 'Free Throw Grind',
    icon: '🔥',
    description: 'Groove your free throw routine',
    type: 'shooting',
    exercises: [
      { name: 'Set 1: 20 FTs', zone: 'free-throw', targetMakes: 15, rest: 60 },
      { name: 'Set 2: 20 FTs', zone: 'free-throw', targetMakes: 15, rest: 60 },
      { name: 'Set 3: Pressure FTs', zone: 'free-throw', targetMakes: 18, rest: 0 },
    ],
  },
  {
    id: 'rep-builder',
    name: 'Rep Builder',
    icon: '💪',
    description: 'High-volume reps with rest timers',
    type: 'reps',
    exercises: [
      { name: 'Ball Handling (Crossovers)', reps: 50, sets: 3, rest: 60 },
      { name: 'Mikan Drill', reps: 20, sets: 3, rest: 45 },
      { name: 'Form Shooting (Close)', reps: 30, sets: 2, rest: 30 },
      { name: 'Defensive Slides', reps: 10, sets: 4, rest: 45 },
      { name: 'Free Throws', reps: 20, sets: 2, rest: 30 },
    ],
  },
  {
    id: 'conditioning',
    name: 'Court Conditioning',
    icon: '🏃',
    description: 'Get game-ready with intervals',
    type: 'reps',
    exercises: [
      { name: 'Suicide Sprints', reps: 5, sets: 3, rest: 90 },
      { name: 'Defensive Slides (Full Court)', reps: 4, sets: 3, rest: 60 },
      { name: 'Backpedal Sprints', reps: 6, sets: 2, rest: 60 },
      { name: 'Lane Agility', reps: 8, sets: 3, rest: 45 },
      { name: 'Box Jumps', reps: 10, sets: 3, rest: 60 },
    ],
  },
]

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function RestTimer({ seconds, onComplete }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) { onComplete(); return }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(id)
  }, [remaining, onComplete])

  const pct = ((seconds - remaining) / seconds) * 100

  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-4) var(--space-3)' }}>
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-2)',
          position: 'relative',
          background: `conic-gradient(var(--color-accent) ${pct}%, transparent ${pct}%)`,
        }}
      >
        <div
          style={{
            width: '104px',
            height: '104px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="t-stat" style={{ color: 'var(--color-accent)' }}>{remaining}</span>
        </div>
      </div>
      <p className="t-body" style={{ color: 'var(--color-text-sec)', fontWeight: 600 }}>Rest</p>
      <button
        onClick={onComplete}
        className="btn-ghost"
        style={{ marginTop: 'var(--space-2)' }}
      >
        Skip Rest
      </button>
    </div>
  )
}

function ShootingExercise({ exercise, onComplete }) {
  const [makes, setMakes] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const target = exercise.targetMakes
  const pct = attempts > 0 ? Math.round((makes / attempts) * 100) : 0
  const done = makes >= target

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete({ makes, attempts, pct }), 800)
      return () => clearTimeout(t)
    }
  }, [done, makes, attempts, pct, onComplete])

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 className="t-title3" style={{ marginBottom: '4px' }}>{exercise.name}</h3>
      <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
        Make {target} shots
      </p>

      {/* Progress ring */}
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-3)',
          position: 'relative',
          background: `conic-gradient(${done ? 'var(--color-success)' : 'var(--color-accent)'} ${(makes / target) * 100}%, transparent ${(makes / target) * 100}%)`,
        }}
      >
        <div
          style={{
            width: '124px',
            height: '124px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {done ? (
            <Check size={48} style={{ color: 'var(--color-success)' }} />
          ) : (
            <>
              <span className="t-stat" style={{ color: 'var(--color-accent)' }}>{makes}</span>
              <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>/ {target}</span>
            </>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6" style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="t-title3" style={{ color: 'var(--color-text)' }}>{attempts}</div>
          <div className="section-label">Attempts</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div className="t-title3" style={{ color: pct >= 50 ? 'var(--color-success)' : pct >= 35 ? 'var(--color-accent)' : 'var(--color-danger)' }}>{pct}%</div>
          <div className="section-label">Accuracy</div>
        </div>
      </div>

      {/* Make / Miss buttons */}
      {!done && (
        <div className="flex gap-3" style={{ maxWidth: '320px', margin: '0 auto' }}>
          <button
            onClick={() => { setAttempts((a) => a + 1) }}
            style={{
              flex: 1,
              padding: '20px',
              borderRadius: '16px',
              border: '2px solid var(--color-danger)',
              backgroundColor: 'var(--color-danger-tint)',
              color: 'var(--color-danger)',
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: 'inherit',
              cursor: 'pointer',
              touchAction: 'manipulation',
              userSelect: 'none',
            }}
          >
            MISS
          </button>
          <button
            onClick={() => { setMakes((m) => m + 1); setAttempts((a) => a + 1) }}
            style={{
              flex: 1,
              padding: '20px',
              borderRadius: '16px',
              border: '2px solid var(--color-success)',
              backgroundColor: 'var(--color-success-tint)',
              color: 'var(--color-success)',
              fontSize: '18px',
              fontWeight: 900,
              fontFamily: 'inherit',
              cursor: 'pointer',
              touchAction: 'manipulation',
              userSelect: 'none',
            }}
          >
            MAKE
          </button>
        </div>
      )}
    </div>
  )
}

function RepExercise({ exercise, setIndex, totalSets, onComplete }) {
  const [currentRep, setCurrentRep] = useState(0)
  const target = exercise.reps
  const done = currentRep >= target

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => onComplete({ reps: currentRep }), 600)
      return () => clearTimeout(t)
    }
  }, [done, currentRep, onComplete])

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 className="t-title3" style={{ marginBottom: '4px' }}>{exercise.name}</h3>
      <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
        Set {setIndex + 1} of {totalSets} — {target} reps
      </p>

      {/* Progress ring */}
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--space-3)',
          position: 'relative',
          background: `conic-gradient(${done ? 'var(--color-success)' : 'var(--color-info)'} ${(currentRep / target) * 100}%, transparent ${(currentRep / target) * 100}%)`,
        }}
      >
        <div
          style={{
            width: '124px',
            height: '124px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {done ? (
            <Check size={48} style={{ color: 'var(--color-success)' }} />
          ) : (
            <>
              <span className="t-stat" style={{ color: 'var(--color-info)' }}>{currentRep}</span>
              <span className="t-caption" style={{ color: 'var(--color-text-sec)' }}>/ {target}</span>
            </>
          )}
        </div>
      </div>

      {/* Rep counter button */}
      {!done && (
        <button
          onClick={() => setCurrentRep((r) => r + 1)}
          style={{
            width: '200px',
            padding: '20px',
            borderRadius: '20px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--color-info), #2563EB)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 900,
            fontFamily: 'inherit',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
            touchAction: 'manipulation',
            userSelect: 'none',
          }}
        >
          TAP FOR REP
        </button>
      )}
    </div>
  )
}

function PracticeContent() {
  const navigate = useNavigate()
  const { addDrill } = useDrills()
  const { showToast } = useToast()
  const { logShot, startSession, endSession } = useShots()

  const [selectedWorkout, setSelectedWorkout] = useState(null)
  const [workoutActive, setWorkoutActive] = useState(false)
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [setIndex, setSetIndex] = useState(0)
  const [resting, setResting] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [sessionRunning, setSessionRunning] = useState(false)
  const [results, setResults] = useState([])
  const [complete, setComplete] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (sessionRunning) {
      timerRef.current = setInterval(() => setSessionTimer((t) => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [sessionRunning])

  const workout = selectedWorkout
  const exercises = workout?.exercises || []
  const currentExercise = exercises[exerciseIndex]
  const totalSets = currentExercise?.sets || 1

  const startWorkout = useCallback((w) => {
    setSelectedWorkout(w)
    setWorkoutActive(true)
    setExerciseIndex(0)
    setSetIndex(0)
    setResting(false)
    setResults([])
    setComplete(false)
    setSessionTimer(0)
    setSessionRunning(true)
    if (w.type === 'shooting') startSession('Practice')
  }, [startSession])

  const handleExerciseComplete = useCallback((result) => {
    setResults((prev) => [...prev, { exercise: currentExercise.name, setIndex, ...result }])

    // Check if more sets for this exercise
    if (setIndex + 1 < totalSets) {
      if (currentExercise.rest > 0) {
        setResting(true)
      } else {
        setSetIndex((s) => s + 1)
      }
      return
    }

    // Move to next exercise
    if (exerciseIndex + 1 < exercises.length) {
      if (currentExercise.rest > 0) {
        setResting(true)
      } else {
        setExerciseIndex((i) => i + 1)
        setSetIndex(0)
      }
    } else {
      // Workout complete
      setSessionRunning(false)
      setComplete(true)
      if (workout.type === 'shooting') endSession()
    }
  }, [currentExercise, setIndex, totalSets, exerciseIndex, exercises.length, workout, endSession])

  const handleRestComplete = useCallback(() => {
    setResting(false)
    if (setIndex + 1 < totalSets) {
      setSetIndex((s) => s + 1)
    } else {
      setExerciseIndex((i) => i + 1)
      setSetIndex(0)
    }
  }, [setIndex, totalSets])

  const saveWorkout = async () => {
    const drillData = {
      drill_date: new Date().toISOString().split('T')[0],
      drill_name: workout.name,
      category: workout.type === 'shooting' ? 'Shooting' : 'Conditioning',
      duration: Math.round(sessionTimer / 60) || 1,
      reps: results.reduce((sum, r) => sum + (r.reps || r.attempts || 0), 0),
      sets: results.length,
      rating: 5,
      is_custom: false,
      notes: `Practice Mode: ${workout.name}. ${results.length} exercises completed in ${formatTime(sessionTimer)}.`,
    }
    await addDrill(drillData)
    showToast('Practice saved!', 'success')
    navigate('/drills')
  }

  // Workout selection
  if (!workoutActive) {
    return (
      <PageWrapper>
        <h1 className="t-title1" style={{ marginBottom: '4px' }}>Practice Mode</h1>
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginBottom: 'var(--space-3)' }}>
          Pick a workout, hit your targets, track every rep.
        </p>

        {/* Shooting workouts */}
        <h2 className="section-label" style={{ marginBottom: 'var(--space-1)', marginTop: 'var(--space-2)' }}>
          <Crosshair size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Shooting Workouts
        </h2>
        {WORKOUT_TEMPLATES.filter((w) => w.type === 'shooting').map((w) => (
          <Card key={w.id} padding="md" hover onClick={() => startWorkout(w)} style={{ marginBottom: 'var(--space-1)' }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '28px' }}>{w.icon}</span>
              <div className="flex-1">
                <h3 className="t-body" style={{ fontWeight: 700 }}>{w.name}</h3>
                <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{w.description}</p>
                <p className="t-caption" style={{ color: 'var(--color-accent)', marginTop: '2px' }}>
                  {w.exercises.length} exercises • {w.exercises.reduce((s, e) => s + (e.targetMakes || 0), 0)} total makes
                </p>
              </div>
            </div>
          </Card>
        ))}

        {/* Rep workouts */}
        <h2 className="section-label" style={{ marginBottom: 'var(--space-1)', marginTop: 'var(--space-3)' }}>
          <Dumbbell size={14} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
          Rep & Conditioning
        </h2>
        {WORKOUT_TEMPLATES.filter((w) => w.type === 'reps').map((w) => (
          <Card key={w.id} padding="md" hover onClick={() => startWorkout(w)} style={{ marginBottom: 'var(--space-1)' }}>
            <div className="flex items-center gap-3">
              <span style={{ fontSize: '28px' }}>{w.icon}</span>
              <div className="flex-1">
                <h3 className="t-body" style={{ fontWeight: 700 }}>{w.name}</h3>
                <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{w.description}</p>
                <p className="t-caption" style={{ color: 'var(--color-info)', marginTop: '2px' }}>
                  {w.exercises.length} exercises • {w.exercises.reduce((s, e) => s + (e.reps || 0) * (e.sets || 1), 0)} total reps
                </p>
              </div>
            </div>
          </Card>
        ))}
      </PageWrapper>
    )
  }

  // Workout complete screen
  if (complete) {
    const totalMakes = results.reduce((s, r) => s + (r.makes || 0), 0)
    const totalAttempts = results.reduce((s, r) => s + (r.attempts || 0), 0)
    const totalReps = results.reduce((s, r) => s + (r.reps || 0), 0)
    const overallPct = totalAttempts > 0 ? Math.round((totalMakes / totalAttempts) * 100) : null

    return (
      <PageWrapper>
        <div style={{ textAlign: 'center', padding: 'var(--space-3) 0' }}>
          <div style={{ fontSize: '48px', marginBottom: 'var(--space-2)' }}>🔥</div>
          <h1 className="t-title1" style={{ marginBottom: '4px' }}>Workout Complete!</h1>
          <p className="t-body" style={{ color: 'var(--color-text-sec)' }}>{workout.name} — {formatTime(sessionTimer)}</p>
        </div>

        <Card padding="md" style={{ marginBottom: 'var(--space-2)' }}>
          <div className="grid grid-cols-3 gap-3" style={{ textAlign: 'center' }}>
            <div>
              <div className="t-title3" style={{ color: 'var(--color-accent)' }}>{formatTime(sessionTimer)}</div>
              <div className="section-label">Duration</div>
            </div>
            <div>
              <div className="t-title3" style={{ color: 'var(--color-success)' }}>{results.length}</div>
              <div className="section-label">Sets</div>
            </div>
            {overallPct !== null ? (
              <div>
                <div className="t-title3" style={{ color: overallPct >= 50 ? 'var(--color-success)' : 'var(--color-accent)' }}>{overallPct}%</div>
                <div className="section-label">Accuracy</div>
              </div>
            ) : (
              <div>
                <div className="t-title3" style={{ color: 'var(--color-info)' }}>{totalReps}</div>
                <div className="section-label">Total Reps</div>
              </div>
            )}
          </div>
        </Card>

        {/* Exercise breakdown */}
        <Card padding="md" style={{ marginBottom: 'var(--space-3)' }}>
          <h3 className="section-label" style={{ marginBottom: 'var(--space-2)' }}>Breakdown</h3>
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between"
              style={{
                padding: '8px 0',
                borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <span className="t-body" style={{ color: 'var(--color-text)' }}>{r.exercise}</span>
              <span className="t-body" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
                {r.makes !== undefined ? `${r.makes}/${r.attempts} (${r.pct}%)` : `${r.reps} reps`}
              </span>
            </div>
          ))}
        </Card>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => { setWorkoutActive(false); setSelectedWorkout(null) }} fullWidth>
            Back
          </Button>
          <Button variant="primary" onClick={saveWorkout} fullWidth>
            <Check size={18} /> Save Workout
          </Button>
        </div>
      </PageWrapper>
    )
  }

  // Active workout UI
  const progress = ((exerciseIndex * totalSets + setIndex) / (exercises.length * totalSets)) * 100

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: 'var(--color-bg)',
        padding: 'var(--space-2)',
        paddingBottom: '32px',
      }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
        <button
          onClick={() => { if (window.confirm('Quit workout?')) { setWorkoutActive(false); setSelectedWorkout(null); setSessionRunning(false) } }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-sec)', padding: '8px' }}
        >
          <X size={20} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <p className="t-caption" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{workout.name}</p>
          <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>{formatTime(sessionTimer)}</p>
        </div>
        <div className="t-caption" style={{ color: 'var(--color-text-sec)', padding: '8px' }}>
          {exerciseIndex + 1}/{exercises.length}
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: '4px',
          borderRadius: '2px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          marginBottom: 'var(--space-3)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: 'var(--color-accent)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Current exercise or rest */}
      {resting ? (
        <RestTimer seconds={currentExercise.rest} onComplete={handleRestComplete} />
      ) : currentExercise?.zone ? (
        <ShootingExercise exercise={currentExercise} onComplete={handleExerciseComplete} />
      ) : (
        <RepExercise
          exercise={currentExercise}
          setIndex={setIndex}
          totalSets={totalSets}
          onComplete={handleExerciseComplete}
        />
      )}
    </div>
  )
}

export default function Practice() {
  return (
    <ProGate feature="practiceMode">
      <PracticeContent />
    </ProGate>
  )
}
