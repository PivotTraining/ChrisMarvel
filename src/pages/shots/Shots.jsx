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
  if (stats.pct >= 35) return 'rgba(249,115,22,0.3)'
  return 'rgba(239,68,68,0.3)'
}

function CourtSVG({ zones, zoneStats, onZoneClick, interactive = true }) {
  return (
    <svg viewBox="0 0 100 92" style={{ width: '100%', maxWidth: 420, display: 'block', margin: '0 auto' }}>
      {/* Background */}
      <rect x="0" y="0" width="100" height="92" rx="2" fill="var(--bg-surface)" />

      {/* Court outline */}
      <rect x="2" y="2" width="96" height="88" rx="1" fill="none"
        stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

      {/* Paint / lane */}
      <rect x="34" y="62" width="32" height="28" fill="none"
        stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

      {/* Free throw circle */}
      <circle cx="50" cy="62" r="10" fill="none"
        stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

      {/* Free throw line */}
      <line x1="34" y1="62" x2="66" y2="62"
        stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />

      {/* Three-point arc */}
      <path
        d="M 10 90 L 10 68 Q 10 20, 50 15 Q 90 20, 90 68 L 90 90"
        fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"
      />

      {/* Restricted area arc */}
      <path
        d="M 44 90 Q 44 82, 50 80 Q 56 82, 56 90"
        fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4"
      />

      {/* Basket */}
      <circle cx="50" cy="88" r="1.2" fill="none"
        stroke="rgba(249,115,22,0.6)" strokeWidth="0.5" />

      {/* Backboard */}
      <line x1="47" y1="90" x2="53" y2="90"
        stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />

      {/* Half-court arc at top */}
      <path
        d="M 30 2 Q 50 14, 70 2"
        fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"
      />

      {/* Clickable zone overlays */}
      {zones.map((zone) => {
        const stats = zoneStats.get(zone.id)
        const fill = zoneColor(stats)
        const hasShotData = stats && stats.attempted > 0
        const textX = zone.x + zone.w / 2
        const textY = zone.y + zone.h / 2
        return (
          <g key={zone.id}
            onClick={interactive ? () => onZoneClick(zone) : undefined}
            style={interactive ? { cursor: 'pointer' } : undefined}
          >
            <rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h}
              rx="2" fill={fill} stroke="rgba(255,255,255,0.12)" strokeWidth="0.3"
            />
            {hasShotData && (
              <text
                x={textX} y={textY}
                textAnchor="middle" dominantBaseline="central"
                fill="white" fontSize="3.5"
                fontFamily="'Barlow Condensed', sans-serif" fontWeight="600"
              >
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
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '1.5rem', minWidth: 240, textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 4 }}>
          {zone.label}
        </p>
        <p style={{
          color: 'var(--text-primary)', fontFamily: "'Barlow Condensed',sans-serif",
          fontWeight: 700, fontSize: 20, marginBottom: 16,
        }}>
          Made or Missed?
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
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
      <h3 style={{
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
        fontSize: 20, color: 'var(--text-primary)', marginBottom: 12,
      }}>
        Session Summary
      </h3>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>Total</p>
          <p style={{
            color: 'var(--text-primary)', fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 700, fontSize: 28,
          }}>
            {summary.totalMade}/{summary.totalAttempted}
            <span style={{ fontSize: 16, color: 'var(--text-secondary)', marginLeft: 6 }}>{summary.pct}%</span>
          </p>
        </div>
        {bestZone && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>Best Zone</p>
            <p style={{ color: '#22c55e', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>
              {zoneLabel(bestZone.zoneId)} ({bestZone.pct}%)
            </p>
          </div>
        )}
        {worstZone && bestZone && worstZone.zoneId !== bestZone.zoneId && (
          <div>
            <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>Worst Zone</p>
            <p style={{ color: '#ef4444', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>
              {zoneLabel(worstZone.zoneId)} ({worstZone.pct}%)
            </p>
          </div>
        )}
      </div>
      {/* Shot distribution by type */}
      {Object.keys(summary.shotsByZone).length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 6 }}>
            By Zone
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(summary.shotsByZone).map(([zId, st]) => (
              <Badge key={zId} variant="default">
                {zoneLabel(zId)}: {st.made}/{st.attempted}
              </Badge>
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

  const handleZoneClick = (zone) => {
    setSelectedZone(zone)
  }

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
        <h1 style={{
          fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
          fontSize: 24, color: 'var(--text-primary)', marginBottom: 16,
        }}>
          Shot Tracker
        </h1>
        <SkeletonLoader variant="card" count={2} />
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <h1 style={{
        fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 700,
        fontSize: 24, color: 'var(--text-primary)', marginBottom: 16,
      }}>
        Shot Tracker
      </h1>

      {/* Session summary after ending */}
      {showSummary && lastSummary && (
        <SessionSummaryCard
          summary={lastSummary}
          zoneStats={lastZoneStats}
          onDone={() => setShowSummary(false)}
        />
      )}

      {/* Start session */}
      {!sessionActive && !showSummary && (
        <Card padding="md" className="mb-4">
          <p style={{
            color: 'var(--text-primary)', fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 600, fontSize: 18, marginBottom: 12,
          }}>
            New Session
          </p>
          <Select
            label="Context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            options={CONTEXT_OPTIONS}
            className="mb-4"
          />
          <Button fullWidth onClick={handleStartSession}>
            <Target className="w-4 h-4" /> Start Session
          </Button>
        </Card>
      )}

      {/* Active session */}
      {sessionActive && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <Badge variant="elite">{sessionContext}</Badge>
            <p style={{
              color: 'var(--text-secondary)', fontFamily: "'Barlow Condensed',sans-serif",
              fontWeight: 600, fontSize: 18,
            }}>
              {sessionSummary.totalMade}/{sessionSummary.totalAttempted}
              <span style={{ color: 'var(--text-muted)', fontSize: 14, marginLeft: 4 }}>
                ({sessionSummary.pct}%)
              </span>
            </p>
          </div>

          {/* Court */}
          <Card padding="sm" className="mb-4" style={{ background: 'var(--bg-surface)' }}>
            <CourtSVG
              zones={COURT_ZONES}
              zoneStats={zoneStats}
              onZoneClick={handleZoneClick}
            />
          </Card>

          {/* Shot type pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {SHOT_TYPES.map((st) => (
              <button
                key={st}
                onClick={() => setShotType(st)}
                style={{
                  padding: '4px 10px', borderRadius: 16, fontSize: 12,
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 500, border: 'none',
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: shotType === st ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                  color: shotType === st ? 'white' : 'var(--text-secondary)',
                }}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Zone breakdown */}
          {shots.length > 0 && (
            <Card padding="sm" className="mb-3">
              <p style={{ color: 'var(--text-muted)', fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 6 }}>
                Zone Breakdown
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {[...zoneStats.entries()].map(([zId, st]) => {
                  const label = COURT_ZONES.find((z) => z.id === zId)?.label || zId
                  return (
                    <Badge key={zId} variant="default">
                      {label}: {st.made}/{st.attempted} ({st.pct}%)
                    </Badge>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Session controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={handleUndo} disabled={shots.length === 0}>
              <Undo2 className="w-4 h-4" /> Undo
            </Button>
            <Button fullWidth onClick={handleEndSession}>End Session</Button>
          </div>
        </>
      )}

      {/* Shot result modal */}
      {selectedZone && (
        <ShotModal
          zone={selectedZone}
          onMade={() => handleShotResult(true)}
          onMissed={() => handleShotResult(false)}
          onClose={() => setSelectedZone(null)}
        />
      )}

      {/* All-time heat map */}
      {!sessionActive && (
        <div style={{ marginTop: 24 }}>
          <p style={{
            color: 'var(--text-secondary)', fontFamily: "'Barlow Condensed',sans-serif",
            fontWeight: 600, fontSize: 16, marginBottom: 8,
          }}>
            All-Time Shooting
          </p>
          {overallZoneStats.size > 0 ? (
            <Card padding="sm">
              <CourtSVG
                zones={COURT_ZONES}
                zoneStats={overallZoneStats}
                onZoneClick={() => {}}
                interactive={false}
              />
            </Card>
          ) : (
            <EmptyState
              icon={Activity}
              title="No Shot Data Yet"
              description="Start a shooting session to begin tracking your shots on the court."
            />
          )}
        </div>
      )}
    </PageWrapper>
  )
}
