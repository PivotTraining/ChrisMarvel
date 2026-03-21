// Demo mode mock data for previewing the app without a Supabase backend

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' ||
  (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder'))

export const demoProfile = {
  id: 'demo-user-001',
  full_name: 'Chris Marvel',
  email: 'chris@courtiq.app',
  position: 'SG',
  level: 12,
  xp: 2450,
  current_streak: 7,
  longest_streak: 14,
  last_activity_date: new Date().toISOString().split('T')[0],
  onboarding_completed: true,
  height: "6'2\"",
  weight: '185',
  graduation_year: 2026,
  school: 'Lincoln High School',
  city: 'Los Angeles',
  state: 'CA',
  jersey_number: '23',
  highlight_video_url: '',
  recruiting_bio: 'Two-way guard with a high motor. Team captain and 3-year starter. Looking to compete at the next level.',
  recruiting_slug: 'chris-marvel-x7k2',
  recruiting_profile_public: true,
  created_at: '2025-09-01T00:00:00Z',
  updated_at: new Date().toISOString(),
}

function randomDate(daysAgo) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

const opponents = ['Westside Prep', 'East Bay Academy', 'Mamba Elite', 'South Central Lions', 'Valley Hawks', 'Pacific Titans', 'Bay Area Select', 'Harbor City', 'Northridge Knights', 'Compton Magic']

export const demoGames = Array.from({ length: 25 }, (_, i) => {
  const pts = Math.floor(Math.random() * 25) + 8
  const fga = Math.floor(Math.random() * 12) + 8
  const fgm = Math.floor(fga * (0.35 + Math.random() * 0.25))
  const tpa = Math.floor(Math.random() * 8) + 2
  const tpm = Math.floor(tpa * (0.25 + Math.random() * 0.25))
  const fta = Math.floor(Math.random() * 8) + 1
  const ftm = Math.floor(fta * (0.6 + Math.random() * 0.3))
  return {
    id: `demo-game-${i}`,
    user_id: 'demo-user-001',
    game_date: randomDate(i * 3 + Math.floor(Math.random() * 3)),
    opponent: opponents[i % opponents.length],
    result: Math.random() > 0.4 ? 'Win' : 'Loss',
    points: pts,
    rebounds: Math.floor(Math.random() * 8) + 2,
    assists: Math.floor(Math.random() * 7) + 1,
    steals: Math.floor(Math.random() * 4),
    blocks: Math.floor(Math.random() * 3),
    turnovers: Math.floor(Math.random() * 4),
    fouls: Math.floor(Math.random() * 4),
    minutes: Math.floor(Math.random() * 12) + 24,
    fg_made: fgm,
    fg_attempted: fga,
    three_made: tpm,
    three_attempted: tpa,
    ft_made: ftm,
    ft_attempted: fta,
    notes: '',
    created_at: randomDate(i * 3),
  }
}).sort((a, b) => b.game_date.localeCompare(a.game_date))

const drillTypes = ['Ball Handling', 'Shooting Form', 'Free Throws', 'Defensive Slides', 'Crossovers', 'Pull-up Jumpers', 'Finishing at Rim', 'Catch & Shoot']

export const demoDrills = Array.from({ length: 18 }, (_, i) => ({
  id: `demo-drill-${i}`,
  user_id: 'demo-user-001',
  session_date: randomDate(i * 2 + Math.floor(Math.random() * 2)),
  drill_type: drillTypes[i % drillTypes.length],
  duration_minutes: Math.floor(Math.random() * 30) + 15,
  reps: Math.floor(Math.random() * 50) + 20,
  makes: Math.floor(Math.random() * 30) + 10,
  notes: '',
  drills: [{ name: drillTypes[i % drillTypes.length], duration: Math.floor(Math.random() * 15) + 5 }],
  rating: Math.floor(Math.random() * 3) + 3,
  created_at: randomDate(i * 2),
})).sort((a, b) => b.session_date.localeCompare(a.session_date))

const zones = ['paint', 'mid-left', 'mid-right', 'three-left', 'three-right', 'three-top', 'free-throw']

export const demoShots = Array.from({ length: 80 }, (_, i) => ({
  id: `demo-shot-${i}`,
  user_id: 'demo-user-001',
  zone: zones[i % zones.length],
  made: Math.random() > 0.45,
  session_date: randomDate(Math.floor(i / 10)),
  created_at: new Date(Date.now() - i * 600000).toISOString(),
}))

export const demoNotifications = [
  { id: 'n1', user_id: 'demo-user-001', type: 'achievement', title: 'First Blood!', body: 'You logged your first game!', icon: '🏀', read: false, created_at: randomDate(0) },
  { id: 'n2', user_id: 'demo-user-001', type: 'achievement', title: 'Sharpshooter', body: 'Hit 40% from three in a game!', icon: '🎯', read: false, created_at: randomDate(1) },
  { id: 'n3', user_id: 'demo-user-001', type: 'streak', title: '7-Day Streak!', body: 'You\'ve been active 7 days in a row!', icon: '🔥', read: true, created_at: randomDate(2) },
]
