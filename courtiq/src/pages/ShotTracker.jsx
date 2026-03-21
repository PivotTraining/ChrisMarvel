import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, X, Target, Percent, ChevronLeft, ChevronRight } from 'lucide-react'
import { useShots } from '../hooks/useShots'
import PageShell from '../components/ui/PageShell'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import CourtMap from '../components/CourtMap'

const SHOT_TYPES = ['Catch & Shoot', 'Off Dribble', 'Post Up', 'Free Throw', 'Floater', 'Hook Shot']
const CONTEXTS = ['Practice', 'Game', 'Warmup']

export default function ShotTracker() {
  const navigate = useNavigate()
  const todayStr = new Date().toISOString().split('T')[0]
  const [sessionDate, setSessionDate] = useState(todayStr)
  const { shots, stats, addShot } = useShots(sessionDate)
  const isToday = sessionDate === todayStr

  const [selectedZone, setSelectedZone] = useState('')
  const [shotType, setShotType] = useState('Catch & Shoot')
  const [context, setContext] = useState('Practice')
  const [logging, setLogging] = useState(false)

  function shiftDate(days) {
    const d = new Date(sessionDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    const iso = d.toISOString().split('T')[0]
    if (iso <= todayStr) setSessionDate(iso)
  }

  const zoneStats = useMemo(() => {
    const map = {}
    shots.forEach(s => {
      if (!map[s.zone_id]) map[s.zone_id] = { made: 0, total: 0 }
      map[s.zone_id].total++
      if (s.made) map[s.zone_id].made++
    })
    return map
  }, [shots])

  async function logShot(made) {
    if (!selectedZone) return
    setLogging(true)
    await addShot({
      session_date: sessionDate,
      zone_id: selectedZone,
      shot_type: shotType,
      made,
      context,
    })
    setLogging(false)
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-text-primary">Shot Tracker</h1>
            <p className="text-xs text-text-muted">Tap a zone, then log made or missed.</p>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="flex items-center justify-between bg-bg-card border border-border rounded-xl px-4 py-2.5">
          <button onClick={() => shiftDate(-1)} className="p-1 text-text-muted hover:text-text-primary transition-colors" aria-label="Previous day">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-text-primary">
              {isToday ? 'Today' : new Date(sessionDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
            {!isToday && <p className="text-[10px] text-text-muted">{sessionDate}</p>}
          </div>
          <button onClick={() => shiftDate(1)} disabled={isToday} className="p-1 text-text-muted hover:text-text-primary transition-colors disabled:opacity-30" aria-label="Next day">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Shots" value={stats.total} icon={Target} className="p-4" />
          <StatCard label="Made" value={stats.made} icon={Check} className="p-4" />
          <StatCard label="FG%" value={`${stats.percentage}%`} icon={Percent} className="p-4" />
        </div>

        {/* Court */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Select Zone
          </h2>
          <CourtMap
            selectedZone={selectedZone}
            onZoneSelect={setSelectedZone}
            zoneStats={zoneStats}
          />
        </section>

        {/* Shot Type */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Shot Type</h2>
          <div className="flex flex-wrap gap-2">
            {SHOT_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setShotType(type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  shotType === type
                    ? 'bg-blue text-white'
                    : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Card>

        {/* Context */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Context</h2>
          <div className="flex gap-2">
            {CONTEXTS.map(ctx => (
              <button
                key={ctx}
                type="button"
                onClick={() => setContext(ctx)}
                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  context === ctx
                    ? 'bg-blue text-white'
                    : 'bg-bg-section border border-border text-text-secondary hover:border-blue-border'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </Card>

        {/* Made / Missed buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => logShot(true)}
            disabled={!selectedZone || logging}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-success/10 border border-success/20 text-success font-bold text-sm transition-all duration-200 hover:bg-success/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Check size={20} />
            Made
          </button>
          <button
            type="button"
            onClick={() => logShot(false)}
            disabled={!selectedZone || logging}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-4 rounded-2xl bg-danger/10 border border-danger/20 text-danger font-bold text-sm transition-all duration-200 hover:bg-danger/20 disabled:opacity-40 disabled:pointer-events-none"
          >
            <X size={20} />
            Missed
          </button>
        </div>

        {/* Recent shots */}
        {shots.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">
              Recent Shots
            </h2>
            <div className="space-y-2">
              {shots.slice(0, 10).map(shot => (
                <div
                  key={shot.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-bg-card border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${shot.made ? 'bg-success' : 'bg-danger'}`} />
                    <span className="text-sm text-text-primary">{shot.zone_id.replace(/-/g, ' ')}</span>
                  </div>
                  <span className="text-xs text-text-muted">{shot.shot_type}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  )
}
