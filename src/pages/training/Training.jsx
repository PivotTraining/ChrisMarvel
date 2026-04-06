import { useState, useMemo } from 'react'
import { BookOpen, ArrowLeft, Bookmark, Check, Clock, Search, Zap, Target, Shield, TrendingUp, ChevronRight, Play, Lock } from 'lucide-react'
import PageWrapper from '../../components/layout/PageWrapper'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import SkeletonLoader from '../../components/ui/SkeletonLoader'
import { useToast } from '../../context/ToastContext'
import useContentLibrary from '../../hooks/useContentLibrary'
import useGames from '../../hooks/useGames'

/* ===== TRAINING PACKS DATA ===== */

const TRAINING_PACKS = [
  {
    id: 'pack-shooting',
    title: 'Shooter\'s Touch',
    subtitle: '30-Day Shooting Program',
    description: 'Build consistent shooting form and range. Progresses from form shooting to contested game shots.',
    icon: '🎯',
    color: '#FF6B35',
    duration: '30 days',
    sessionsPerWeek: 5,
    difficulty: 'Intermediate',
    weakness: 'shooting',
    drills: [
      { day: 1, title: 'Form Shooting', reps: '50 makes from 5 ft', duration: 15 },
      { day: 2, title: 'Elbow Jumpers', reps: '30 makes each elbow', duration: 20 },
      { day: 3, title: 'Free Throw Routine', reps: '5 sets of 10', duration: 15 },
      { day: 4, title: 'Catch & Shoot 3s', reps: '5 spots x 10 attempts', duration: 25 },
      { day: 5, title: 'Off-Dribble Pull-ups', reps: '20 makes each side', duration: 25 },
      { day: 6, title: 'Shot Fake Series', reps: '15 reps each move', duration: 20 },
      { day: 7, title: 'Rest & Visualize', reps: 'Watch film / visualize', duration: 10 },
    ],
    milestones: ['Make 70% from FT line', 'Hit 5 threes in a row', 'Shoot 45%+ in a game'],
  },
  {
    id: 'pack-handles',
    title: 'Handles Academy',
    subtitle: 'Ball Handling Mastery',
    description: 'Develop elite ball handling with progressive difficulty. From stationary drills to full-court live dribbling.',
    icon: '🏀',
    color: '#8B5CF6',
    duration: '21 days',
    sessionsPerWeek: 6,
    difficulty: 'Beginner',
    weakness: 'handles',
    drills: [
      { day: 1, title: 'Stationary Pounds', reps: '2 min each hand', duration: 10 },
      { day: 2, title: 'Figure 8s', reps: '3 sets of 30 sec', duration: 10 },
      { day: 3, title: 'Crossover Series', reps: '50 each direction', duration: 15 },
      { day: 4, title: 'Between the Legs', reps: '50 each direction', duration: 15 },
      { day: 5, title: 'Full Court Dribble Moves', reps: '5 trips each move', duration: 20 },
      { day: 6, title: 'Cone Agility', reps: '10 reps through course', duration: 20 },
      { day: 7, title: 'Active Rest', reps: 'Light ball handling + stretch', duration: 10 },
    ],
    milestones: ['Complete 30-sec figure 8 no drops', '5 crossover combos in a row', 'No turnovers in pickup game'],
  },
  {
    id: 'pack-defense',
    title: 'Lockdown D',
    subtitle: 'Defensive Intensity Program',
    description: 'Become a shutdown defender. Build lateral quickness, close-out technique, and defensive IQ.',
    icon: '🛡️',
    color: '#3B82F6',
    duration: '14 days',
    sessionsPerWeek: 5,
    difficulty: 'Intermediate',
    weakness: 'defense',
    drills: [
      { day: 1, title: 'Defensive Slides', reps: '4 sets x 30 sec', duration: 15 },
      { day: 2, title: 'Close-out Drills', reps: '20 reps', duration: 15 },
      { day: 3, title: 'Lateral Quick Feet', reps: '3 sets x 45 sec', duration: 12 },
      { day: 4, title: 'Help & Recover', reps: '15 reps each side', duration: 20 },
      { day: 5, title: 'On-Ball Pressure', reps: '1-on-1 live reps x 10', duration: 25 },
      { day: 6, title: 'Transition D Sprints', reps: '8 full-court sprints', duration: 18 },
      { day: 7, title: 'Film Study', reps: 'Watch defensive highlights', duration: 15 },
    ],
    milestones: ['Get 3+ steals in a game', 'Hold opponent under 10 pts', 'No blow-by drives in a quarter'],
  },
  {
    id: 'pack-finishing',
    title: 'At The Rim',
    subtitle: 'Finishing & Paint Scoring',
    description: 'Master finishing at the basket. Floaters, euro steps, reverse layups, and contact finishes.',
    icon: '💪',
    color: '#22C55E',
    duration: '14 days',
    sessionsPerWeek: 5,
    difficulty: 'Advanced',
    weakness: 'finishing',
    drills: [
      { day: 1, title: 'Mikan Drill', reps: '50 makes alternating', duration: 12 },
      { day: 2, title: 'Euro Step Layups', reps: '20 each side', duration: 15 },
      { day: 3, title: 'Floaters', reps: '30 makes from lane', duration: 20 },
      { day: 4, title: 'Reverse Layups', reps: '20 each side', duration: 15 },
      { day: 5, title: 'Contact Finishes', reps: '15 with pad contact', duration: 20 },
      { day: 6, title: 'Off-Hand Only', reps: '30 makes weak hand', duration: 20 },
      { day: 7, title: 'Game Speed Finishes', reps: 'Full-speed drive & finish x 20', duration: 25 },
    ],
    milestones: ['Make 10 left-hand layups in a row', 'Convert a euro step in a game', 'Shoot 60%+ in the paint'],
  },
  {
    id: 'pack-conditioning',
    title: '4th Quarter Ready',
    subtitle: 'Basketball Conditioning',
    description: 'Build elite endurance so you dominate when others fatigue. Game-specific conditioning circuits.',
    icon: '🔥',
    color: '#EF4444',
    duration: '21 days',
    sessionsPerWeek: 4,
    difficulty: 'Advanced',
    weakness: 'conditioning',
    drills: [
      { day: 1, title: 'Suicide Sprints', reps: '6 full sets', duration: 20 },
      { day: 2, title: '17s (Sideline to Sideline)', reps: '4 sets of 17', duration: 18 },
      { day: 3, title: 'Full Court Layup Shuttle', reps: '10 trips', duration: 15 },
      { day: 4, title: 'Defensive Slide Circuit', reps: '5 rounds', duration: 20 },
      { day: 5, title: 'Tempo Runs', reps: '8 x half court', duration: 15 },
      { day: 6, title: 'Game Simulation', reps: '4 x 3-min quarters', duration: 20 },
      { day: 7, title: 'Active Recovery', reps: 'Light jog + stretch', duration: 15 },
    ],
    milestones: ['Complete all suicides under time', 'No fatigue drop-off in stats', 'Play full game without subbing'],
  },
  {
    id: 'pack-playmaking',
    title: 'Court Vision',
    subtitle: 'Playmaking & Passing',
    description: 'See the floor like a point guard. Develop passing accuracy, court vision, and decision-making.',
    icon: '👁️',
    color: '#F59E0B',
    duration: '14 days',
    sessionsPerWeek: 5,
    difficulty: 'Intermediate',
    weakness: 'playmaking',
    drills: [
      { day: 1, title: 'Wall Passing (2 balls)', reps: '3 sets x 1 min', duration: 10 },
      { day: 2, title: 'Tennis Ball Dribble', reps: '5 min continuous', duration: 12 },
      { day: 3, title: 'Pick & Roll Reads', reps: '15 reps each coverage', duration: 25 },
      { day: 4, title: 'Skip Pass Accuracy', reps: '20 each direction', duration: 15 },
      { day: 5, title: 'Live 2-on-1 / 3-on-2', reps: '10 possessions each', duration: 25 },
      { day: 6, title: 'Film Study: PG Reads', reps: 'Study 10 PnR possessions', duration: 20 },
      { day: 7, title: 'Full Court Passing', reps: '3-man weave x 10 trips', duration: 15 },
    ],
    milestones: ['Get 6+ assists in a game', 'AST/TO ratio above 2.0', 'Complete a skip pass in traffic'],
  },
]

/* ===== WEAKNESS DETECTION ===== */

function detectWeaknesses(seasonAvg) {
  if (!seasonAvg || seasonAvg.gamesPlayed < 1) return []
  const weaknesses = []
  if (seasonAvg.fgPct < 42 || seasonAvg.threePct < 30) weaknesses.push('shooting')
  if (seasonAvg.topg > 3) weaknesses.push('handles')
  if (seasonAvg.spg < 0.5 && seasonAvg.bpg < 0.5) weaknesses.push('defense')
  if (seasonAvg.apg < 2) weaknesses.push('playmaking')
  // Always suggest conditioning and finishing as good add-ons
  if (weaknesses.length === 0) weaknesses.push('conditioning', 'finishing')
  return weaknesses
}

/* ===== COMPONENTS ===== */

const STORAGE_KEY = 'courtiq_pack_progress'

function loadPackProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}

function savePackProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function PackCard({ pack, recommended, progress, onTap }) {
  const completedDays = progress?.completedDays?.length || 0
  const totalDays = pack.drills.length
  const pctDone = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

  return (
    <div onClick={onTap} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onTap() }}
      style={{
        background: 'var(--color-card)', borderRadius: '20px',
        border: recommended ? `1.5px solid ${pack.color}40` : '1px solid var(--color-border)',
        padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden',
      }}>
      {recommended && (
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          background: `${pack.color}20`, borderRadius: '8px', padding: '4px 10px',
          fontSize: '10px', fontWeight: 700, color: pack.color, textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Recommended
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '16px',
          background: `${pack.color}15`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '24px', flexShrink: 0,
        }}>
          {pack.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '2px', letterSpacing: '-0.3px' }}>{pack.title}</h3>
          <p style={{ fontSize: '13px', color: pack.color, fontWeight: 600, marginBottom: '6px' }}>{pack.subtitle}</p>
          <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', lineHeight: 1.4 }}>{pack.description}</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>
              <Clock size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '3px' }} />{pack.duration}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>{pack.difficulty}</span>
          </div>
          {completedDays > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 600 }}>Progress</span>
                <span style={{ fontSize: '11px', color: pack.color, fontWeight: 700 }}>{completedDays}/{totalDays} days</span>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: '2px', width: `${pctDone}%`, background: pack.color, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PackDetail({ pack, progress, onBack, onComplete, showToast }) {
  const completedDays = new Set(progress?.completedDays || [])
  const startedAt = progress?.startedAt

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer"
        style={{ color: 'var(--color-text-sec)', marginBottom: '16px', fontFamily: 'inherit' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Hero */}
      <div style={{
        textAlign: 'center', padding: '28px 20px', borderRadius: '20px', marginBottom: '20px',
        background: `linear-gradient(135deg, ${pack.color}15, ${pack.color}08)`,
        border: `1px solid ${pack.color}25`,
      }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>{pack.icon}</div>
        <h1 className="t-title2" style={{ marginBottom: '4px' }}>{pack.title}</h1>
        <p style={{ fontSize: '14px', color: pack.color, fontWeight: 600, marginBottom: '8px' }}>{pack.subtitle}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-sec)', fontWeight: 600 }}>{pack.duration}</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-sec)', fontWeight: 600 }}>{pack.sessionsPerWeek}x / week</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-sec)', fontWeight: 600 }}>{pack.difficulty}</span>
        </div>
      </div>

      {/* Daily Drills */}
      <h2 className="section-label" style={{ marginBottom: 'var(--space-2)' }}>Daily Plan</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {pack.drills.map((drill, i) => {
          const done = completedDays.has(i)
          const isNext = !done && (i === 0 || completedDays.has(i - 1))
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              padding: '16px', borderRadius: '16px',
              background: done ? `${pack.color}10` : isNext ? 'var(--color-card)' : 'rgba(255,255,255,0.02)',
              border: isNext ? `1.5px solid ${pack.color}50` : '1px solid var(--color-border)',
              opacity: done ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}>
              {/* Day number */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? pack.color : isNext ? `${pack.color}25` : 'rgba(255,255,255,0.04)',
                color: done ? '#fff' : isNext ? pack.color : 'var(--color-text-sec)',
                fontSize: '13px', fontWeight: 800,
              }}>
                {done ? <Check size={16} /> : `D${i + 1}`}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{drill.title}</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-sec)' }}>{drill.reps} • {drill.duration} min</p>
              </div>
              {isNext && !done && (
                <button onClick={(e) => { e.stopPropagation(); onComplete(i) }}
                  style={{
                    padding: '10px 16px', borderRadius: '12px', border: 'none',
                    background: pack.color, color: '#fff', fontSize: '13px', fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px',
                    boxShadow: `0 4px 12px ${pack.color}40`,
                  }}>
                  <Play size={14} /> Start
                </button>
              )}
              {!isNext && !done && (
                <Lock size={14} style={{ color: 'var(--color-text-sec)', opacity: 0.4 }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Milestones */}
      <h2 className="section-label" style={{ marginBottom: 'var(--space-2)' }}>Milestones</h2>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pack.milestones.map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-border)',
              }}>
                <Target size={12} style={{ color: 'var(--color-text-sec)' }} />
              </div>
              <span style={{ fontSize: '14px', color: 'var(--color-text)', fontWeight: 500 }}>{m}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ===== CONTENT LIBRARY SECTION ===== */

const TYPE_COLORS = { Drill: 'var(--color-accent)', Recovery: 'var(--color-info)', Nutrition: 'var(--color-success)' }
const TYPES = ['All', 'Drill', 'Recovery', 'Nutrition']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Elite']
const DIFF_VARIANTS = { Beginner: 'beginner', Intermediate: 'intermediate', Advanced: 'elite', Elite: 'elite' }

function ContentCard({ item, saved, completed, onTap, onToggleSave }) {
  const color = TYPE_COLORS[item.content_type] || '#9CA3AF'
  return (
    <div onClick={onTap} role="button" tabIndex={0}
      style={{
        background: 'var(--color-card)', borderRadius: '16px',
        border: '1px solid var(--color-border)', padding: '16px',
        cursor: 'pointer', transition: 'all 0.2s ease',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.content_type}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {completed && <Check size={14} style={{ color: 'var(--color-success)' }} />}
          <button onClick={(e) => { e.stopPropagation(); onToggleSave() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: saved ? 'var(--color-accent)' : 'var(--color-text-sec)' }}>
            <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>{item.title}</h3>
      <p style={{ fontSize: '13px', color: 'var(--color-text-sec)', lineHeight: 1.4, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Badge variant={DIFF_VARIANTS[item.difficulty] || 'default'}>{item.difficulty}</Badge>
        {item.duration_minutes && (
          <span style={{ fontSize: '11px', color: 'var(--color-text-sec)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={11} />{item.duration_minutes}m
          </span>
        )}
      </div>
    </div>
  )
}

function DetailView({ item, saved, completed, onBack, onToggleSave, onComplete }) {
  const color = TYPE_COLORS[item.content_type] || '#9CA3AF'
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer"
        style={{ color: 'var(--color-text-sec)', marginBottom: '16px', fontFamily: 'inherit' }}>
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <span style={{ fontSize: '11px', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.content_type}</span>
      <h1 className="t-title2" style={{ marginTop: '4px', marginBottom: 'var(--space-1)' }}>{item.title}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Badge variant={DIFF_VARIANTS[item.difficulty] || 'default'}>{item.difficulty}</Badge>
        {item.duration_minutes && (
          <span style={{ fontSize: '12px', color: 'var(--color-text-sec)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} />{item.duration_minutes} min
          </span>
        )}
      </div>
      <p style={{ fontSize: '15px', color: 'var(--color-text-sec)', lineHeight: 1.6, marginBottom: '16px' }}>{item.description}</p>
      <Card style={{ borderLeft: `3px solid ${color}`, marginBottom: '16px' }}>
        <p style={{ fontSize: '14px', color: 'var(--color-text)' }}>
          <span style={{ color, fontWeight: 700 }}>Coaching Tip: </span>{item.coaching_cue}
        </p>
      </Card>
      {item.equipment_needed?.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h4 className="section-label" style={{ marginBottom: 'var(--space-1)' }}>Equipment</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {item.equipment_needed.map((e) => <Badge key={e}>{e}</Badge>)}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        {completed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-success)', fontWeight: 600 }}>
            <Check size={18} /> Completed
          </div>
        ) : (
          <Button onClick={onComplete}>Mark Complete</Button>
        )}
        <Button variant="outline" onClick={onToggleSave}>
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} style={{ marginRight: '4px' }} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </div>
  )
}

/* ===== MAIN TRAINING PAGE ===== */

export default function Training() {
  const { content, loading, fetchContent, savedIds, saveContent, unsaveContent, markCompleted, completedIds, activeFilter } = useContentLibrary()
  const { seasonAverages } = useGames()
  const { showToast } = useToast()
  const [view, setView] = useState('main') // 'main', 'packs', 'pack-detail', 'library', 'detail'
  const [selected, setSelected] = useState(null)
  const [selectedPack, setSelectedPack] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [packProgress, setPackProgress] = useState(loadPackProgress)

  const weaknesses = useMemo(() => detectWeaknesses(seasonAverages), [seasonAverages])

  const recommendedPacks = useMemo(() =>
    TRAINING_PACKS.filter((p) => weaknesses.includes(p.weakness)),
    [weaknesses]
  )

  const handleFilterType = (t) => {
    setTypeFilter(t)
    fetchContent({ contentType: t, difficulty: diffFilter, searchQuery: search })
  }
  const handleFilterDiff = (d) => {
    setDiffFilter(d)
    fetchContent({ contentType: typeFilter, difficulty: d, searchQuery: search })
  }
  const handleSearch = (e) => {
    setSearch(e.target.value)
    fetchContent({ contentType: typeFilter, difficulty: diffFilter, searchQuery: e.target.value })
  }

  const toggleSave = (id) => {
    if (savedIds.has(id)) { unsaveContent(id); showToast('Removed', 'info') }
    else { saveContent(id); showToast('Saved', 'success') }
  }
  const handleComplete = (id) => { markCompleted(id); showToast('Completed!', 'success') }

  const completePackDay = (packId, dayIndex) => {
    const prog = { ...packProgress }
    if (!prog[packId]) prog[packId] = { startedAt: new Date().toISOString(), completedDays: [] }
    if (!prog[packId].completedDays.includes(dayIndex)) {
      prog[packId].completedDays.push(dayIndex)
    }
    setPackProgress(prog)
    savePackProgress(prog)
    showToast('Day completed! Nice work.', 'success')
  }

  // Detail views
  if (view === 'detail' && selected) {
    return (
      <PageWrapper>
        <DetailView item={selected} saved={savedIds.has(selected.id)} completed={completedIds.has(selected.id)}
          onBack={() => { setSelected(null); setView('library') }}
          onToggleSave={() => toggleSave(selected.id)}
          onComplete={() => handleComplete(selected.id)} />
      </PageWrapper>
    )
  }

  if (view === 'pack-detail' && selectedPack) {
    return (
      <PageWrapper>
        <PackDetail pack={selectedPack} progress={packProgress[selectedPack.id]}
          onBack={() => { setSelectedPack(null); setView('packs') }}
          onComplete={(dayIndex) => completePackDay(selectedPack.id, dayIndex)}
          showToast={showToast} />
      </PageWrapper>
    )
  }

  // Library view
  if (view === 'library') {
    return (
      <PageWrapper>
        <button onClick={() => setView('main')} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer"
          style={{ color: 'var(--color-text-sec)', marginBottom: '16px', fontFamily: 'inherit' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="t-title2" style={{ marginBottom: 'var(--space-2)' }}>Drill Library</h1>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          {TYPES.map((t) => (
            <button key={t} onClick={() => handleFilterType(t)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none',
                background: typeFilter === t ? 'var(--color-accent)' : 'rgba(255,255,255,0.04)',
                color: typeFilter === t ? '#fff' : 'var(--color-text-sec)',
                fontSize: '13px', fontWeight: typeFilter === t ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
              {t === 'All' ? 'All' : `${t}s`}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => handleFilterDiff(d)}
              style={{
                padding: '8px 14px', borderRadius: '20px', border: 'none',
                background: diffFilter === d ? 'var(--color-info)' : 'rgba(255,255,255,0.04)',
                color: diffFilter === d ? '#fff' : 'var(--color-text-sec)',
                fontSize: '12px', fontWeight: diffFilter === d ? 700 : 500,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
              {d}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-sec)' }} />
          <input value={search} onChange={handleSearch} placeholder="Search drills..."
            style={{
              width: '100%', padding: '12px 14px 12px 40px', borderRadius: '14px',
              border: '1px solid var(--color-border)', background: 'var(--color-input-bg)',
              color: 'var(--color-text)', fontSize: '14px', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }} />
        </div>

        {loading ? <SkeletonLoader variant="card" count={4} /> :
          content.length === 0 ? <EmptyState icon={BookOpen} title="No Content Found" description="Try adjusting your filters." /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {content.map((item) => (
                <ContentCard key={item.id} item={item} saved={savedIds.has(item.id)} completed={completedIds.has(item.id)}
                  onTap={() => { setSelected(item); setView('detail') }}
                  onToggleSave={() => toggleSave(item.id)} />
              ))}
            </div>
          )
        }
      </PageWrapper>
    )
  }

  // Packs view
  if (view === 'packs') {
    return (
      <PageWrapper>
        <button onClick={() => setView('main')} className="flex items-center gap-1 text-sm bg-transparent border-0 cursor-pointer"
          style={{ color: 'var(--color-text-sec)', marginBottom: '16px', fontFamily: 'inherit' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="t-title2" style={{ marginBottom: '6px' }}>Training Packs</h1>
        <p style={{ fontSize: '14px', color: 'var(--color-text-sec)', marginBottom: '20px' }}>Structured programs to level up your game</p>

        {recommendedPacks.length > 0 && (
          <>
            <h2 className="section-label" style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>Recommended For You</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {recommendedPacks.map((p) => (
                <PackCard key={p.id} pack={p} recommended progress={packProgress[p.id]}
                  onTap={() => { setSelectedPack(p); setView('pack-detail') }} />
              ))}
            </div>
          </>
        )}

        <h2 className="section-label" style={{ marginBottom: 'var(--space-2)' }}>All Packs</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {TRAINING_PACKS.map((p) => (
            <PackCard key={p.id} pack={p} progress={packProgress[p.id]}
              onTap={() => { setSelectedPack(p); setView('pack-detail') }} />
          ))}
        </div>
      </PageWrapper>
    )
  }

  // Main training hub
  return (
    <PageWrapper>
      <h1 className="t-title1" style={{ marginBottom: 'var(--space-3)' }}>Training</h1>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div onClick={() => setView('packs')} role="button" tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(255,107,53,0.03))',
            border: '1px solid rgba(255,107,53,0.15)', borderRadius: 'var(--radius-card)', padding: 'var(--space-3)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
          <Zap size={24} style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-1)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>Training Packs</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-sec)' }}>Structured programs</p>
        </div>
        <div onClick={() => { setView('library'); fetchContent({ contentType: 'All', difficulty: 'All', searchQuery: '' }) }} role="button" tabIndex={0}
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.03))',
            border: '1px solid rgba(59,130,246,0.15)', borderRadius: 'var(--radius-card)', padding: 'var(--space-3)',
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
          <BookOpen size={24} style={{ color: 'var(--color-info)', marginBottom: 'var(--space-1)' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>Drill Library</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-sec)' }}>Browse all content</p>
        </div>
      </div>

      {/* Recommended Packs */}
      {recommendedPacks.length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h2 className="section-label">For You</h2>
            <button onClick={() => setView('packs')} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All <ChevronRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {recommendedPacks.slice(0, 2).map((p) => (
              <PackCard key={p.id} pack={p} recommended progress={packProgress[p.id]}
                onTap={() => { setSelectedPack(p); setView('pack-detail') }} />
            ))}
          </div>
        </>
      )}

      {/* Active Packs (in progress) */}
      {Object.keys(packProgress).length > 0 && (
        <>
          <h2 className="section-label" style={{ marginBottom: 'var(--space-2)' }}>In Progress</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {TRAINING_PACKS.filter((p) => packProgress[p.id]?.completedDays?.length > 0 && packProgress[p.id].completedDays.length < p.drills.length).map((p) => (
              <PackCard key={p.id} pack={p} progress={packProgress[p.id]}
                onTap={() => { setSelectedPack(p); setView('pack-detail') }} />
            ))}
          </div>
        </>
      )}

      {/* Quick Drills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h2 className="section-label">Quick Drills</h2>
        <button onClick={() => { setView('library'); fetchContent({ contentType: 'Drill', difficulty: 'All', searchQuery: '' }) }}
          style={{ background: 'none', border: 'none', color: 'var(--color-accent)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}>
          All Drills <ChevronRight size={14} />
        </button>
      </div>
      {loading ? <SkeletonLoader variant="card" count={3} /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {content.filter((c) => c.content_type === 'Drill').slice(0, 3).map((item) => (
            <ContentCard key={item.id} item={item} saved={savedIds.has(item.id)} completed={completedIds.has(item.id)}
              onTap={() => { setSelected(item); setView('detail') }}
              onToggleSave={() => toggleSave(item.id)} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
