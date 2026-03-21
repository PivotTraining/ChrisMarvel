import { useMemo } from 'react'

const SKILLS = [
  { key: 'scoring', label: 'Scoring' },
  { key: 'rebounds', label: 'Boards' },
  { key: 'playmaking', label: 'Passing' },
  { key: 'shooting', label: 'Shooting' },
  { key: 'training', label: 'Training' },
  { key: 'consistency', label: 'Consistency' },
]

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 75
const LEVELS = 5

function polarToCart(angle, radius) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

function computeSkills(games, drills, shots) {
  const skills = {}

  // Scoring: 0–100 based on PPG (0=0, 30+=100)
  if (games.length > 0) {
    const ppg = games.reduce((s, g) => s + (g.points || 0), 0) / games.length
    skills.scoring = Math.min(100, Math.round((ppg / 30) * 100))
  } else {
    skills.scoring = 0
  }

  // Rebounds: 0–100 based on RPG (0=0, 12+=100)
  if (games.length > 0) {
    const rpg = games.reduce((s, g) => s + (g.rebounds || 0), 0) / games.length
    skills.rebounds = Math.min(100, Math.round((rpg / 12) * 100))
  } else {
    skills.rebounds = 0
  }

  // Playmaking: 0–100 based on APG (0=0, 10+=100)
  if (games.length > 0) {
    const apg = games.reduce((s, g) => s + (g.assists || 0), 0) / games.length
    skills.playmaking = Math.min(100, Math.round((apg / 10) * 100))
  } else {
    skills.playmaking = 0
  }

  // Shooting: 0–100 based on FG% (0%=0, 60%+=100)
  if (shots.length >= 5) {
    const pct = shots.filter(s => s.made).length / shots.length
    skills.shooting = Math.min(100, Math.round((pct / 0.6) * 100))
  } else if (games.length > 0) {
    const totalFGA = games.reduce((s, g) => s + (g.fga || 0), 0)
    const totalFGM = games.reduce((s, g) => s + (g.fgm || 0), 0)
    if (totalFGA > 0) {
      skills.shooting = Math.min(100, Math.round(((totalFGM / totalFGA) / 0.6) * 100))
    } else {
      skills.shooting = 0
    }
  } else {
    skills.shooting = 0
  }

  // Training: 0–100 based on drill sessions in last 30 days (0=0, 20+=100)
  const cutoff30 = new Date()
  cutoff30.setDate(cutoff30.getDate() - 30)
  const cutoff30Str = cutoff30.toISOString().split('T')[0]
  const recentDrills = drills.filter(d => d.session_date >= cutoff30Str)
  skills.training = Math.min(100, Math.round((recentDrills.length / 20) * 100))

  // Consistency: 0–100 based on active days in last 14 days (0=0, 10+=100)
  const cutoff14 = new Date()
  cutoff14.setDate(cutoff14.getDate() - 14)
  const cutoff14Str = cutoff14.toISOString().split('T')[0]
  const activeDays = new Set([
    ...games.filter(g => g.game_date >= cutoff14Str).map(g => g.game_date),
    ...drills.filter(d => d.session_date >= cutoff14Str).map(d => d.session_date),
  ]).size
  skills.consistency = Math.min(100, Math.round((activeDays / 10) * 100))

  return skills
}

export default function SkillRadar({ games = [], drills = [], shots = [] }) {
  const skills = useMemo(() => computeSkills(games, drills, shots), [games, drills, shots])
  const angleStep = 360 / SKILLS.length

  // Grid rings
  const rings = Array.from({ length: LEVELS }, (_, i) => {
    const r = (RADIUS / LEVELS) * (i + 1)
    return SKILLS.map((_, j) => polarToCart(j * angleStep, r))
      .map(p => `${p.x},${p.y}`)
      .join(' ')
  })

  // Axis lines
  const axes = SKILLS.map((_, i) => polarToCart(i * angleStep, RADIUS))

  // Data polygon
  const dataPoints = SKILLS.map((skill, i) => {
    const value = (skills[skill.key] || 0) / 100
    const r = Math.max(value * RADIUS, 4)
    return polarToCart(i * angleStep, r)
  })
  const dataPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  // Labels
  const labels = SKILLS.map((skill, i) => {
    const p = polarToCart(i * angleStep, RADIUS + 18)
    return { ...p, label: skill.label, value: skills[skill.key] || 0 }
  })

  const overall = Math.round(SKILLS.reduce((s, sk) => s + (skills[sk.key] || 0), 0) / SKILLS.length)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Skill Radar</h2>
        <span className="text-xs font-bold text-blue">{overall} OVR</span>
      </div>
      <div className="flex justify-center">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[260px]">
          {/* Grid rings */}
          {rings.map((points, i) => (
            <polygon key={i} points={points} fill="none" stroke="var(--theme-border)" strokeWidth="0.5" opacity={0.6} />
          ))}

          {/* Axis lines */}
          {axes.map((p, i) => (
            <line key={i} x1={CENTER} y1={CENTER} x2={p.x} y2={p.y} stroke="var(--theme-border)" strokeWidth="0.5" opacity={0.4} />
          ))}

          {/* Data fill */}
          <polygon points={dataPath} fill="rgba(0,163,255,0.15)" stroke="#00A3FF" strokeWidth="1.5" strokeLinejoin="round" />

          {/* Data dots */}
          {dataPoints.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00A3FF" />
          ))}

          {/* Labels */}
          {labels.map((l, i) => (
            <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-medium" fill="var(--theme-text-secondary)">
              {l.label}
            </text>
          ))}
        </svg>
      </div>
      {/* Legend */}
      <div className="grid grid-cols-3 gap-2">
        {SKILLS.map(skill => (
          <div key={skill.key} className="text-center">
            <p className="text-xs font-bold text-text-primary">{skills[skill.key] || 0}</p>
            <p className="text-[9px] text-text-muted">{skill.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
