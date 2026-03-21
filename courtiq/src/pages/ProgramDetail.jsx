import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, Clock, Dumbbell, ChevronDown, ChevronUp, Trophy, Flame } from 'lucide-react'
import { usePrograms, useProgramDays } from '../hooks/usePrograms'
import { useToast } from '../contexts/ToastContext'
import { generateProgramDays, generateCustomDays } from '../lib/programTemplates'
import { hapticNotification } from '../lib/native'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function ProgramDetail() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { programs, updateProgram } = usePrograms()
  const { days, loading, toggleComplete, bulkAddDays } = useProgramDays(id)

  const [selectedWeek, setSelectedWeek] = useState(1)
  const [initialized, setInitialized] = useState(false)

  const program = programs.find(p => p.id === id)

  // Auto-generate days from template or custom on first load
  useEffect(() => {
    if (initialized || loading || days.length > 0) return
    setInitialized(true)

    const templateId = searchParams.get('template')
    const customDaysPerWeek = searchParams.get('custom')

    if (templateId) {
      const generatedDays = generateProgramDays(templateId, id)
      if (generatedDays.length > 0) {
        bulkAddDays(generatedDays).then(() => toast('Program days generated!'))
      }
    } else if (customDaysPerWeek) {
      const weeks = program?.duration_weeks || 4
      const generated = generateCustomDays(id, weeks, parseInt(customDaysPerWeek))
      if (generated.length > 0) {
        bulkAddDays(generated).then(() => toast('Program days created!'))
      }
    }
  }, [initialized, loading, days.length, searchParams, id, program, bulkAddDays, toast])

  // Compute progress
  const progress = useMemo(() => {
    if (days.length === 0) return { total: 0, completed: 0, pct: 0 }
    const completed = days.filter(d => d.completed).length
    return { total: days.length, completed, pct: Math.round((completed / days.length) * 100) }
  }, [days])

  // Group days by week
  const weeks = useMemo(() => {
    const map = {}
    days.forEach(d => {
      if (!map[d.week_number]) map[d.week_number] = []
      map[d.week_number].push(d)
    })
    return map
  }, [days])

  const weekNumbers = Object.keys(weeks).map(Number).sort((a, b) => a - b)

  // Week progress
  const weekProgress = useMemo(() => {
    const map = {}
    weekNumbers.forEach(w => {
      const weekDays = weeks[w] || []
      const done = weekDays.filter(d => d.completed).length
      map[w] = { total: weekDays.length, done, pct: weekDays.length > 0 ? Math.round((done / weekDays.length) * 100) : 0 }
    })
    return map
  }, [weeks, weekNumbers])

  async function handleToggleDay(dayId) {
    const day = days.find(d => d.id === dayId)
    const willComplete = !day?.completed
    await toggleComplete(dayId)
    if (willComplete) {
      hapticNotification('SUCCESS')
      // Check if program is fully complete
      const newCompleted = days.filter(d => d.completed).length + 1
      if (newCompleted === days.length) {
        await updateProgram(id, { status: 'completed', completed_at: new Date().toISOString() })
        toast('Program complete!')
      }
    }
  }

  // Auto-select the current week (first incomplete)
  useEffect(() => {
    if (weekNumbers.length === 0) return
    const firstIncomplete = weekNumbers.find(w => {
      const wp = weekProgress[w]
      return wp && wp.done < wp.total
    })
    if (firstIncomplete) setSelectedWeek(firstIncomplete)
  }, [weekNumbers.length]) // eslint-disable-line

  const currentWeekDays = weeks[selectedWeek] || []

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/programs')} className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors" aria-label="Go back">
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary truncate">{program?.name || 'Program'}</h1>
            <p className="text-xs text-text-muted">{program?.duration_weeks} weeks · {program?.difficulty}</p>
          </div>
        </div>

        {/* Overall Progress */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Progress</h2>
            <span className="text-sm font-bold text-blue">{progress.pct}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-bg-section overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progress.pct === 100 ? 'bg-success' : 'bg-blue'}`}
              style={{ width: `${progress.pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-text-muted">
            <span>{progress.completed} / {progress.total} workouts</span>
            {progress.pct === 100 && (
              <span className="text-success font-semibold flex items-center gap-1">
                <Trophy size={10} /> Complete!
              </span>
            )}
          </div>
        </Card>

        {/* Week selector */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {weekNumbers.map(w => {
                const wp = weekProgress[w]
                const isComplete = wp && wp.done === wp.total
                const isCurrent = w === selectedWeek
                return (
                  <button
                    key={w}
                    onClick={() => setSelectedWeek(w)}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                      isCurrent
                        ? 'bg-blue text-white'
                        : isComplete
                          ? 'bg-success/10 border border-success/20 text-success'
                          : 'bg-bg-section border border-border text-text-secondary'
                    }`}
                  >
                    <span>W{w}</span>
                    <span className="text-[9px] opacity-70">{wp?.done}/{wp?.total}</span>
                  </button>
                )
              })}
            </div>

            {/* Week days */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
                Week {selectedWeek}
                {weekProgress[selectedWeek]?.pct === 100 && (
                  <span className="text-success ml-2">
                    <Flame size={12} className="inline" />
                  </span>
                )}
              </h2>
              {currentWeekDays.map(day => (
                <DayCard key={day.id} day={day} onToggle={handleToggleDay} />
              ))}
              {currentWeekDays.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">No workouts for this week yet.</p>
              )}
            </section>
          </>
        )}
      </div>
    </PageShell>
  )
}

function DayCard({ day, onToggle }) {
  const [expanded, setExpanded] = useState(false)
  const drills = day.drills || []

  return (
    <Card className={`space-y-2 transition-all ${day.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <button onClick={() => onToggle(day.id)} className="mt-0.5 shrink-0">
          {day.completed
            ? <CheckCircle2 size={20} className="text-success" />
            : <Circle size={20} className="text-text-muted" />
          }
        </button>
        <div className="flex-1 min-w-0" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center justify-between">
            <p className={`text-sm font-semibold ${day.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
              Day {day.day_number}: {day.title}
            </p>
            {drills.length > 0 && (
              expanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />
            )}
          </div>
          {day.description && (
            <p className="text-xs text-text-muted mt-0.5">{day.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Clock size={10} /> {day.duration_minutes} min
            </span>
            <span className="text-[10px] text-text-muted flex items-center gap-1">
              <Dumbbell size={10} /> {drills.length} drill{drills.length !== 1 ? 's' : ''}
            </span>
            {day.completed && day.completed_at && (
              <span className="text-[10px] text-success">
                {new Date(day.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded drill list */}
      {expanded && drills.length > 0 && (
        <div className="ml-8 space-y-2 pt-2 border-t border-border">
          {drills.map((drill, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue shrink-0" />
                <span className="text-xs text-text-primary">{drill.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-text-muted">
                {drill.reps > 0 && <span>{drill.reps} reps</span>}
                {drill.duration > 0 && <span>{drill.duration} min</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
