// Drills — a curated library of drills with cues, steps, focus points, and
// a Camera Mode button per drill. Each drill is a teaching unit, not a form.
// "Log Complete" wires into the existing useDrills hook so the streak, totals,
// and history still work.

import { useState, useMemo, lazy, Suspense } from 'react'
import {
  Target, Flame, ArrowLeft, Clock, CheckCircle, Camera, X, Play,
  Crosshair, Activity, Shield, Zap, Dumbbell,
} from 'lucide-react'

// Lazy-load the pose-tracking camera — TF.js backend is ~3-4 MB and should
// only be fetched when the user actually opens a drill camera session.
const DrillCamera = lazy(() => import('../../components/drills/DrillCamera'))
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../context/ToastContext'
import { useHaptics } from '../../hooks/useHaptics'
import useDrills from '../../hooks/useDrills'
import { usePremium } from '../../context/PremiumContext'

// ─── Drill library ───────────────────────────────────────────────────────────
// Each drill: id, name, category, difficulty (1-5), duration (minutes),
// focus tag, short description, numbered step cues, coaching tip.
const DRILL_LIBRARY = [
  {
    id: 'form-shooting',
    name: 'Form Shooting',
    category: 'Shooting',
    cameraMode: 'shooting-form',
    icon: Crosshair,
    difficulty: 1,
    duration: 10,
    focus: 'Mechanics',
    desc: 'Close-range single-hand shooting to groove your form before any session.',
    steps: [
      'Start 3 feet from the rim, feet square, ball in shooting pocket.',
      'Guide hand lifts off the ball — no thumb flick, just a ride.',
      'Elbow under the ball, snap the wrist, hold the follow-through.',
      'Swish 10 in a row, take one step back, repeat out to 8 feet.',
    ],
    tip: 'If the ball is rotating sideways, your guide hand is still pushing. Relax it.',
  },
  {
    id: 'mikan',
    name: 'Mikan Drill',
    category: 'Shooting',
    cameraMode: 'mikan',
    icon: Target,
    difficulty: 2,
    duration: 5,
    focus: 'Finishing',
    desc: 'Right-hand and left-hand finishes at the rim. The original big-man drill, useful for everyone.',
    steps: [
      'Stand on the right side of the rim, one foot out.',
      'Right-hand finish off the glass, rebound with two hands.',
      'Immediately step across, left-hand finish off the glass.',
      'Alternate sides for 60 seconds without letting the ball hit the ground.',
    ],
    tip: 'Eyes on the top corner of the square, not the rim.',
  },
  {
    id: 'spot-shooting',
    name: '5-Spot Shooting',
    category: 'Shooting',
    icon: Flame,
    difficulty: 3,
    duration: 15,
    focus: 'Mid-Range',
    desc: 'Shoot from five spots around the mid-range: corner, wing, top, opposite wing, opposite corner.',
    steps: [
      'Start at the right corner. Make 5 shots before moving.',
      'Slide to the right wing — 5 makes.',
      'Top of the key — 5 makes.',
      'Left wing — 5 makes.',
      'Left corner — 5 makes. Track your best time to 25.',
    ],
    tip: 'No hesitation between catch and shot. The rep counts, the time builds the pressure.',
  },
  {
    id: 'three-point-rainbow',
    name: '3-Point Rainbow',
    category: 'Shooting',
    icon: Flame,
    difficulty: 4,
    duration: 12,
    focus: 'Range',
    desc: 'Seven spots beyond the arc — corner, wing, top, wing, corner, plus two trail spots.',
    steps: [
      'From each spot, take 3 shots in a row.',
      'Move to next spot, continue around the arc.',
      'Log every make. Target: 12/21 your first session.',
    ],
    tip: 'Feet set before the catch. Don\'t shoot on the way up from gathering the ball.',
  },
  {
    id: 'pound-dribble',
    name: 'Pound Dribbles',
    category: 'Ball Handling',
    cameraMode: 'pound',
    icon: Activity,
    difficulty: 1,
    duration: 5,
    focus: 'Control',
    desc: 'Two-ball hard pound dribbles to build hand strength and low-dribble control.',
    steps: [
      'Athletic stance, one ball in each hand.',
      'Pound both balls simultaneously, hip-level, hard as you can, 30 seconds.',
      'Rest 15 seconds. Alternate hands, 30 seconds. Rest.',
      'Finish with 30 seconds of high-low (one ball hip, one ball ankle).',
    ],
    tip: 'Eyes up. If your eyes drop you have to start the rep over.',
  },
  {
    id: 'cone-crossover',
    name: 'Cone Crossover Series',
    category: 'Ball Handling',
    icon: Zap,
    difficulty: 3,
    duration: 10,
    focus: 'Change of Direction',
    desc: 'Cone-to-cone moves at full speed: crossover, between-the-legs, behind-the-back.',
    steps: [
      'Set cones 8 feet apart in a straight line.',
      'Sprint to first cone, attack crossover, explode to second cone.',
      'Repeat with between-the-legs, then behind-the-back.',
      'Finish with a shot or finish at the rim every pass.',
    ],
    tip: 'Low and hard on the first dribble after the move. That\'s the separation dribble.',
  },
  {
    id: 'defensive-slides',
    name: 'Defensive Slides',
    category: 'Defense',
    icon: Shield,
    difficulty: 2,
    duration: 8,
    focus: 'Footwork',
    desc: 'Lateral slides in a Z pattern, keeping a low stance the whole way.',
    steps: [
      'Start in a defensive stance at the baseline corner.',
      'Slide to the free-throw line — never cross your feet.',
      'Drop-step the other direction, slide to the half-court line.',
      'Push back, continue the Z. 3 round trips.',
    ],
    tip: 'Hands active. Knees over ankles, not past your toes.',
  },
  {
    id: 'closeouts',
    name: 'Closeout Drill',
    category: 'Defense',
    icon: Shield,
    difficulty: 3,
    duration: 6,
    focus: 'Recovery',
    desc: 'Sprint-to-slide closeouts simulating helping from the paint to a perimeter shooter.',
    steps: [
      'Start under the rim.',
      'Sprint toward the 3-point line with high hands.',
      'Break down into short choppy steps the last 4 feet.',
      'Contest with the high hand, recover to stance.',
      '10 reps total, 5 per side.',
    ],
    tip: 'The choppy steps are why you don\'t get blown by. Don\'t skip them.',
  },
  {
    id: 'suicides',
    name: 'Suicides',
    category: 'Conditioning',
    icon: Flame,
    difficulty: 4,
    duration: 6,
    focus: 'Aerobic',
    desc: 'Classic progressive-distance conditioning run.',
    steps: [
      'Baseline to free-throw line and back.',
      'Baseline to half-court and back.',
      'Baseline to far free-throw and back.',
      'Baseline to far baseline and back.',
      'Target: under 33 seconds for a full suicide.',
    ],
    tip: 'Touch the line every time. Cheating a suicide is cheating your game.',
  },
  {
    id: 'line-jumps',
    name: 'Line Jumps',
    category: 'Agility',
    cameraMode: 'conditioning',
    icon: Zap,
    difficulty: 2,
    duration: 4,
    focus: 'Explosiveness',
    desc: 'Two-foot line jumps — front-back, side-side, and diagonal — for fast-twitch.',
    steps: [
      'Stand over a court line.',
      '30 seconds: jump forward and back as fast as you can.',
      '30 seconds: jump side to side.',
      '30 seconds: jump in an X pattern.',
      'Rest 30 seconds. Repeat once.',
    ],
    tip: 'Barely leave the ground. Frequency, not height.',
  },
  {
    id: 'bounce-pass-wall',
    name: 'Wall Passing',
    category: 'Passing',
    icon: Target,
    difficulty: 1,
    duration: 5,
    focus: 'Ball Placement',
    desc: 'Two-handed and one-handed passes to a wall to groove accuracy.',
    steps: [
      'Stand 8 feet from a wall.',
      '25 chest passes to a target spot the size of a face.',
      '25 bounce passes to a spot 2 feet from the wall.',
      '25 right-hand push passes, 25 left-hand push passes.',
    ],
    tip: 'A good pass hits the receiver at chest height without them moving their hands.',
  },
  {
    id: 'ladder-inout',
    name: 'Ladder In-and-Out',
    category: 'Agility',
    icon: Activity,
    difficulty: 3,
    duration: 6,
    focus: 'Foot Speed',
    desc: 'Quick-feet ladder work to prime your first-step explosiveness.',
    steps: [
      'Lay an agility ladder on the floor.',
      'Two feet in every box — down and back.',
      'One foot in every box — down and back.',
      'In-in-out-out — down and back.',
      'Finish with lateral shuffles.',
    ],
    tip: 'Quiet feet. If you hear your heels slapping, slow down and clean it up.',
  },
  {
    id: 'pull-up-jumper',
    name: 'Pull-Up Jumper Series',
    category: 'Shooting',
    icon: Crosshair,
    difficulty: 4,
    duration: 12,
    focus: 'Off Dribble',
    desc: 'Dribble into a jumper from three spots. Builds the most-used scoring move in modern basketball.',
    steps: [
      'Start at the top of the key with the ball.',
      'Two hard dribbles right into a pull-up from the elbow.',
      'Rebound, reset. Two hard dribbles left into a pull-up.',
      'Alternate for 10 makes per side.',
      'Finish with three crossover pull-ups from each wing.',
    ],
    tip: 'Rise and shoot over the dribble — don\'t gather and shoot. The gather is what gets blocked.',
  },
  {
    id: 'wind-sprints',
    name: 'Wind Sprints',
    category: 'Conditioning',
    icon: Dumbbell,
    difficulty: 5,
    duration: 10,
    focus: 'Anaerobic',
    desc: 'Full-court sprint intervals for end-of-game legs.',
    steps: [
      'Sprint baseline to baseline.',
      'Rest 30 seconds.',
      'Repeat 10 times.',
      'Track the slowest sprint — if it\'s more than 2 seconds slower than your fastest, you\'re dogging it.',
    ],
    tip: 'The last two sprints are where games are won.',
  },
]

const CATEGORY_ORDER = ['Shooting', 'Ball Handling', 'Passing', 'Defense', 'Conditioning', 'Agility']
const CATEGORY_COLOR = {
  Shooting: '#FF6B35',
  'Ball Handling': '#A78BFA',
  Passing: '#22C55E',
  Defense: '#3B82F6',
  Conditioning: '#F59E0B',
  Agility: '#F97316',
}

function DifficultyDots({ level }) {
  return (
    <span style={{ display: 'inline-flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: i <= level ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </span>
  )
}

function DrillCard({ drill, onOpen }) {
  const Icon = drill.icon
  const color = CATEGORY_COLOR[drill.category] || 'var(--color-accent)'
  return (
    <button
      onClick={() => onOpen(drill)}
      style={{
        textAlign: 'left',
        width: '100%',
        padding: '14px',
        borderRadius: '16px',
        background: `linear-gradient(160deg, ${color}14, ${color}04)`,
        border: `1px solid ${color}28`,
        cursor: 'pointer',
        display: 'flex',
        gap: '14px',
        alignItems: 'center',
        fontFamily: 'inherit',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div
        style={{
          width: '48px', height: '48px', borderRadius: '14px', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}CC)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 14px ${color}40`,
        }}
      >
        <Icon size={22} style={{ color: '#fff' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '3px' }}>
          {drill.name}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-text-sec)', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {drill.focus} · {drill.duration} min
        </div>
        <DifficultyDots level={drill.difficulty} />
      </div>
    </button>
  )
}

function DrillDetail({ drill, onClose, onLog, onCamera }) {
  if (!drill) return null
  const Icon = drill.icon
  const color = CATEGORY_COLOR[drill.category] || 'var(--color-accent)'
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '520px',
          maxHeight: '92dvh', overflowY: 'auto',
          background: 'linear-gradient(180deg, #141827 0%, #0A0E1A 100%)',
          borderTop: `2px solid ${color}`,
          borderRadius: '20px 20px 0 0',
          padding: '18px 18px calc(18px + env(safe-area-inset-bottom, 0px))',
          boxShadow: '0 -24px 64px rgba(0,0,0,0.55)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div
            style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${color}, ${color}CC)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={22} style={{ color: '#fff' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', marginBottom: '2px' }}>{drill.name}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge>{drill.category}</Badge>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                <Clock size={10} style={{ display: 'inline', marginRight: '2px' }} /> {drill.duration} min
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '14px', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', marginBottom: '16px' }}>
          {drill.desc}
        </p>

        {/* Key focus */}
        <div
          style={{
            padding: '10px 14px', borderRadius: '12px',
            background: `${color}15`, border: `1px solid ${color}35`,
            display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px',
          }}
        >
          <Target size={14} style={{ color }} />
          <span style={{ fontSize: '12px', fontWeight: 800, color, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Key Focus:
          </span>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{drill.focus}</span>
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.8px', marginBottom: '8px', textTransform: 'uppercase' }}>
            Steps
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {drill.steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%',
                    background: `${color}30`, border: `1px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: 900, color,
                  }}
                >
                  {i + 1}
                </div>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--color-text)', margin: 0 }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Coach tip */}
        <div
          style={{
            padding: '12px 14px', borderRadius: '12px',
            background: 'rgba(255, 107, 53, 0.08)',
            borderLeft: '3px solid #FF6B35',
            marginBottom: '18px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#FF6B35', letterSpacing: '0.5px', marginBottom: '3px', textTransform: 'uppercase' }}>
            Coach Tip
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.5, margin: 0 }}>
            {drill.tip}
          </p>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onCamera(drill)}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '14px',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#60A5FA',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            }}
          >
            <Camera size={15} /> Camera Mode
          </button>
          <button
            onClick={() => onLog(drill)}
            style={{
              flex: 1.3,
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 900,
              fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 20px rgba(34,197,94,0.35)',
            }}
          >
            <CheckCircle size={15} /> Log Complete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Drills() {
  const { drills, addDrill, recentStreak } = useDrills()
  const { showToast } = useToast()
  const { impact, notification } = useHaptics()
  const { isPro, checkMonthlyQuota } = usePremium()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const [active, setActive] = useState(null)
  const [cameraDrill, setCameraDrill] = useState(null)

  const filtered = useMemo(() => {
    if (filter === 'All') return DRILL_LIBRARY
    return DRILL_LIBRARY.filter((d) => d.category === filter)
  }, [filter])

  const handleLog = async (drill) => {
    // Free tier: cap drill logs at the monthly limit.
    if (!isPro) {
      const quota = checkMonthlyQuota('drillsPerMonth', drills, 'session_date')
      if (!quota.ok) {
        notification('warning')
        showToast(`Free plan: ${quota.used}/${quota.limit} drills this month. Upgrade for unlimited.`, 'error')
        navigate('/premium')
        return
      }
    }
    const res = await addDrill({
      session_date: new Date().toISOString().split('T')[0],
      drill_name: drill.name,
      category: drill.category,
      duration_minutes: drill.duration,
      rating: null,
      notes: drill.focus,
      is_custom_drill: false,
    })
    if (res) {
      notification('success')
      showToast(`${drill.name} logged — ${drill.duration} min`, 'success')
      setActive(null)
    } else {
      notification('error')
      showToast('Failed to log drill', 'error')
    }
  }

  return (
    <PageWrapper>
      {/* Header */}
      <div style={{ padding: '6px 0 14px' }}>
        <h1 className="t-title2" style={{ marginBottom: '2px' }}>Drill Library</h1>
        <p className="t-caption" style={{ color: 'var(--color-text-sec)' }}>
          Coach-written drills with cues, steps, and live tracking.
        </p>
      </div>

      {/* Streak banner */}
      {recentStreak > 0 && (
        <Card padding="sm" style={{ marginBottom: '12px', border: '1px solid rgba(255,107,53,0.3)' }}>
          <div className="flex items-center gap-2">
            <Flame size={16} style={{ color: 'var(--color-accent)' }} />
            <span className="t-body" style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
              {recentStreak} day drill streak
            </span>
            <span className="t-caption" style={{ color: 'var(--color-text-sec)', marginLeft: 'auto' }}>
              Keep it alive
            </span>
          </div>
        </Card>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '14px' }} className="hide-scrollbar">
        {['All', ...CATEGORY_ORDER].map((cat) => {
          const isActive = filter === cat
          const color = CATEGORY_COLOR[cat] || 'var(--color-accent)'
          return (
            <button
              key={cat}
              onClick={() => { impact('light'); setFilter(cat) }}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '999px',
                border: isActive ? 'none' : '1px solid var(--color-border)',
                background: isActive ? color : 'transparent',
                color: isActive ? '#fff' : 'var(--color-text-sec)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Drill grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((drill) => (
          <DrillCard key={drill.id} drill={drill} onOpen={(d) => { impact('light'); setActive(d) }} />
        ))}
      </div>

      <div style={{ height: '96px' }} />

      {/* Detail modal */}
      <DrillDetail
        drill={active}
        onClose={() => setActive(null)}
        onLog={handleLog}
        onCamera={(d) => { setActive(null); setCameraDrill(d) }}
      />

      {/* Pose-tracking camera — real TF.js MoveNet */}
      {cameraDrill && (
        <Suspense fallback={null}>
          <DrillCamera
            drill={cameraDrill}
            onClose={() => setCameraDrill(null)}
            onComplete={async ({ reps, quality, feedback }) => {
              // Log the drill with camera metadata
              const noteBits = [cameraDrill.focus]
              if (reps > 0) noteBits.push(`${reps} tracked reps`)
              if (quality !== null && quality !== undefined) noteBits.push(`form ${quality}%`)
              if (feedback) noteBits.push(feedback)
              await addDrill({
                session_date: new Date().toISOString().split('T')[0],
                drill_name: cameraDrill.name,
                category: cameraDrill.category,
                duration_minutes: cameraDrill.duration,
                reps: reps || null,
                rating: quality != null ? Math.round(quality / 20) : null,
                notes: noteBits.join(' · '),
                is_custom_drill: false,
              })
              showToast(`${cameraDrill.name} logged · ${reps} reps`, 'success')
              setCameraDrill(null)
            }}
          />
        </Suspense>
      )}
    </PageWrapper>
  )
}
