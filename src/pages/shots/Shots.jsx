import { useState, useMemo } from 'react'
import { Target, Undo2, Activity } from 'lucide-react'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import PageWrapper from '../../components/layout/PageWrapper'
import { useToast } from '../../context/ToastContext'
import useShots, { COURT_ZONES } from '../../hooks/useShots'

const SHOT_TYPES = ['Catch & Shoot', 'Off Dribble', 'Post Up', 'Free Throw', 'Floater', 'Hook Shot']
const CONTEXT_OPTIONS = [
  { value: 'Practice', label: 'Practice' },
  { value: 'Game', label: 'Game' },
  { value: 'Warmup', label: 'Warmup' },
]

function zoneColor(stats) {
  if (!stats || stats.attempted === 0) return 'rgba(255,255,255,0.08)'
  if (stats.pct > 50) return 'rgba(34,197,94,0.3)'
  if (stats.pct >= 35) return 'rgba(255,107,53,0.3)'
  return 'rgba(239,68,68,0.3)'
}

function CourtSVG({ zones, zoneStats, onZoneClick, interactive = true }) {
  return (
    <svg viewBox="0 0 100 92" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
      <rect x="0" y="0" width="100" height="92" rx="2" fill="var(--color-card)" />
      <rect x="2" y="2" width="96" height="88" rx="1" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <rect x="34" y="62" width="32" height="28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <circle cx="50" cy="62" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <line x1="34" y1="62" x2="66" y2="62" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M 10 90 L 10 68 Q 10 20, 50 15 Q 90 20, 90 68 L 90 90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <path d="M 44 90 Q 44 82, 50 80 Q 56 82, 56 90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
      <circle cx="50" cy="88" r="1.2" fill="none" stroke="rgba(255,107,53,0.6)" strokeWidth="0.5" />
      <line x1="47" y1="90" x2="53" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
      <path d="M 30 2 Q 50 14, 70 2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
      {zones.map((zone) => {
        const stats = zoneStats.get(zone.id)
        const fill = zoneColor(stats)
        const hasShotData = stats && stats.attempted > 0
        const textX = zone.x + zone.w / 2
        const textY = zone.y + zone.h / 2
        return (
          <g key={zone.id} onClick={interactive ? () => onZoneClick(zone) : undefined} style={interactive ? { cursor: 'pointer' } : undefined}>
            <rect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="2" fill={fill} stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
            {hasShotData && (
              <text x={textX} y={textY} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="3.5" fontWeight="600">
                {stats.made}/{stats.attempted}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function ShotModal({ zone, onMade, onMissed, onClose }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-overlay)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-card)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-input)', padding: 'var(--space-3)', minWidth: 240, textAlign: 'center',
        }}
      >
        <p className="t-body" style={{ color: 'var(--color-text-sec)', marginBottom: '4px' }}>{zone.label}</p>
        <p className="t-title3" style={{ marginBottom: 'var(--space-2)' }}>Made or Missed?</p>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button fullWidth onClick={onMade}>Made</Button>
          <Button fullWidth variant="ghost" onClick={onMissed}>Missed</Button>
        </div>
      </div>
    </div>
  )
}

function SessionSummaryCard({ summary, zoneStats, onDone }) {
  const bestZone = useMemo(() => {
    let best = null
    for (const [zoneId, st] of zoneStats) {
      if (st.attempted >= 3 && (!best || st.pct > best.pct)) {
        best = { zoneId, ...st }
      }
    }
    return best
  }, [zoneStats])

  const worstZone = useMemo(() => {
    let worst = null
    for (const [zoneId, st] of zoneStats) {
      if (st.attempted >= 3 && (!worst || st.pct < worst.pct)) {
        worst = { zoneId, ...st }
      }
    }
    return worst
  }, [zoneStats])

  const zoneLabel = (id) => COURT_ZONES.find((z) => z.id === id)?.label || id

  return (
    <Card padding="md" className="mb-4">
      <h3 className="t-title3" style={{ marginBottom: 'var(--space-2)' }}>Session Summary</h3>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
        <div>
          <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Total</p>
          <p className="t-title2">
            {summary.totalMade}/{summary.totalAttempted}
            <span className="t-body" style={{ color: 'var(--color-text-sec)', marginLeft: '6px' }}>{summary.pct}%</span>
          </p>
        </div>
        {bestZone && (
          <div>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Best Zone</p>
            <p className="t-body" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
              {zoneLabel(bestZone.zoneId)} ({bestZone.pct}%)
            </p>
          </div>
        )}
        {worstZone && bestZone && worstZone.zoneId !== bestZone.zoneId && (
          <div>
            <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>Worst Zone</p>
            <p className="t-body" style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
              {zoneLabel(worstZone.zoneId)} ({worstZone.pct}%)
            </p>
          </div>
        )}
      </div>
      {Object.keys(summary.shotsByZone).length > 0 && (
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: '6px' }}>By Zone</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(summary.shotsByZone).map(([zId, st]) => (
              <Badge key={zId} variant="default">{zoneLabel(zId)}: {st.made}/{st.attempted}</Badge>
            ))}
          </div>
        </div>
      )}
      <Button fullWidth onClick={onDone}>Done</Button>
    </Card>
  )
}

export default function Shots() {
  const { showToast } = useToast()
  const {
    shots, loading, logShot, undoLastShot, clearSession,
    startSession, endSession, sessionActive, sessionContext,
    zoneStats, overallZoneStats, sessionSummary,
  } = useShots()

  const [context, setContext] = useState('Practice')
  const [shotType, setShotType] = useState('Catch & Shoot')
  const [selectedZone, setSelectedZone] = useState(null)
  const [showSummary, setShowSummary] = useState(false)
  const [lastSummary, setLastSummary] = useState(null)
  const [lastZoneStats, setLastZoneStats] = useState(new Map())

  const handleStartSession = () => {
    startSession(context)
    setShowSummary(false)
    setLastSummary(null)
  }

  const handleEndSession = () => {
    setLastSummary({ ...sessionSummary })
    setLastZoneStats(new Map(zoneStats))
    endSession()
    setShowSummary(true)
    showToast('Session complete', 'success')
  }

  const handleZoneClick = (zone) => setSelectedZone(zone)

  const handleShotResult = async (isMade) => {
    if (!selectedZone) return
    try {
      await logShot(selectedZone.id, isMade, shotType)
      showToast(isMade ? 'Shot made!' : 'Shot missed', isMade ? 'success' : 'info')
    } catch { /* noop */ }
    setSelectedZone(null)
  }

  const handleUndo = async () => {
    try {
      await undoLastShot()
      showToast('Last shot removed', 'info')
    } catch { /* noop */ }
  }

  if (loading) {
    return (
      <PageWrapper>
        <h1 className="t-title2" style={{ marginBottom: 'var(--space-2)' }}>Shot Tracker</h1>
        <SkeletonLoader variant="card" count={2} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 className="t-title2" style={{ marginBottom: 'var(--space-2)' }}>Shot Tracker</h1>

      {showSummary && lastSummary && (
        <SessionSummaryCard summary={lastSummary} zoneStats={lastZoneStats} onDone={() => setShowSummary(false)} />
      )}

      {!sessionActive && !showSummary && (
        <Card padding="md" className="mb-4">
          <p className="t-title3" style={{ marginBottom: 'var(--space-2)' }}>New Session</p>
          <Select label="Context" value={context} onChange={(e) => setContext(e.target.value)} options={CONTEXT_OPTIONS} className="mb-4" />
          <Button fullWidth onClick={handleStartSession}>
            <Target className="w-4 h-4" /> Start Session
          </Button>
        </Card>
      )}

      {sessionActive && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
            <Badge variant="elite">{sessionContext}</Badge>
            <p className="t-title3">
              {sessionSummary.totalMade}/{sessionSummary.totalAttempted}
              <span className="t-body" style={{ color: 'var(--color-text-sec)', marginLeft: '4px' }}>
                ({sessionSummary.pct}%)
              </span>
            </p>
          </div>

          <Card padding="sm" className="mb-4" style={{ background: 'var(--color-card)' }}>
            <CourtSVG zones={COURT_ZONES} zoneStats={zoneStats} onZoneClick={handleZoneClick} />
          </Card>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-2)' }}>
            {SHOT_TYPES.map((st) => (
              <button
                key={st}
                onClick={() => setShotType(st)}
                className="t-caption"
                style={{
                  padding: '6px 12px', borderRadius: 'var(--radius-btn)', border: 'none',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                  background: shotType === st ? 'var(--color-accent)' : 'rgba(255,255,255,0.06)',
                  color: shotType === st ? 'white' : 'var(--color-text-sec)',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {shots.length > 0 && (
            <Card padding="sm" className="mb-3">
              <p className="t-caption" style={{ color: 'var(--color-text-sec)', marginBottom: '6px' }}>Zone Breakdown</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {[...zoneStats.entries()].map(([zId, st]) => {
                  const label = COURT_ZONES.find((z) => z.id === zId)?.label || zId
                  return <Badge key={zId} variant="default">{label}: {st.made}/{st.attempted} ({st.pct}%)</Badge>
                })}
              </div>
            </Card>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
            <Button variant="ghost" onClick={handleUndo} disabled={shots.length === 0}>
              <Undo2 className="w-4 h-4" /> Undo
            </Button>
            <Button fullWidth onClick={handleEndSession}>End Session</Button>
          </div>
        </>
      )}

      {selectedZone && (
        <ShotModal
          zone={selectedZone}
          onMade={() => handleShotResult(true)}
          onMissed={() => handleShotResult(false)}
          onClose={() => setSelectedZone(null)}
        />
      )}

      {!sessionActive && (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <p className="section-label" style={{ marginBottom: 'var(--space-1)' }}>All-Time Shooting</p>
          {overallZoneStats.size > 0 ? (
            <Card padding="sm">
              <CourtSVG zones={COURT_ZONES} zoneStats={overallZoneStats} onZoneClick={() => {}} interactive={false} />
            </Card>
          ) : (
            <EmptyState icon={Activity} title="No Shot Data Yet" description="Start a shooting session to begin tracking your shots on the court." />
          )}
        </div>
      )}
    </PageWrapper>
  )
}
