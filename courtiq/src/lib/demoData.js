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
  subscription_tier: 'free',
  stripe_customer_id: null,
  subscription_expires_at: null,
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

export const demoWorkoutTemplates = [
  {
    id: 'wt-1', user_id: 'demo-user-001', name: 'Mamba Mentality Shooting', category: 'Shooting',
    description: 'Mid-range and pull-up jumper workout inspired by the pros.',
    estimated_minutes: 45,
    drills: [
      { name: 'Elbow jumpers (both sides)', duration: '5 min' },
      { name: 'Baseline pull-ups', duration: '5 min' },
      { name: 'Free throw line jumpers', duration: '5 min' },
      { name: 'Wing catch & shoot', duration: '10 min' },
      { name: 'Off-screen curls', duration: '10 min' },
      { name: 'Contested fadeaways', duration: '10 min' },
    ],
    created_at: '2026-01-15T00:00:00Z', updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'wt-2', user_id: 'demo-user-001', name: 'Point Guard Handles', category: 'Ball Handling',
    description: 'Build tight handles with this progressive ball handling session.',
    estimated_minutes: 30,
    drills: [
      { name: 'Stationary crossovers', duration: '3 min' },
      { name: 'Between the legs (walk)', duration: '3 min' },
      { name: 'Behind the back (walk)', duration: '3 min' },
      { name: 'Full-court speed dribble', duration: '5 min' },
      { name: 'Combo moves (cross-between-behind)', duration: '8 min' },
      { name: 'Tennis ball dribbling', duration: '8 min' },
    ],
    created_at: '2026-01-14T00:00:00Z', updated_at: '2026-01-14T00:00:00Z',
  },
  {
    id: 'wt-3', user_id: 'demo-user-001', name: 'Free Throw Routine', category: 'Shooting',
    description: 'Consistent free throw practice with pressure reps.',
    estimated_minutes: 20,
    drills: [
      { name: 'Warm-up free throws (no count)', duration: '3 min' },
      { name: '10 in a row challenge', duration: '7 min' },
      { name: 'Free throws after sprints', duration: '5 min' },
      { name: 'Eyes closed visualization + shoot', duration: '5 min' },
    ],
    created_at: '2026-01-13T00:00:00Z', updated_at: '2026-01-13T00:00:00Z',
  },
  {
    id: 'wt-4', user_id: 'demo-user-001', name: 'Finishing at the Rim', category: 'Finishing',
    description: 'Work on layups, floaters, and contact finishes.',
    estimated_minutes: 35,
    drills: [
      { name: 'Mikan drill', duration: '5 min' },
      { name: 'Reverse layups (both hands)', duration: '5 min' },
      { name: 'Euro step finishes', duration: '5 min' },
      { name: 'Floaters from the lane', duration: '5 min' },
      { name: 'Power finishes through contact', duration: '5 min' },
      { name: 'Up-and-under moves', duration: '5 min' },
      { name: 'Spin move finishes', duration: '5 min' },
    ],
    created_at: '2026-01-12T00:00:00Z', updated_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'wt-5', user_id: 'demo-user-001', name: 'Defensive Slide Circuit', category: 'Defense',
    description: 'Quick feet and lateral movement drills.',
    estimated_minutes: 25,
    drills: [
      { name: 'Lateral slides (baseline to baseline)', duration: '5 min' },
      { name: 'Close-out drill', duration: '5 min' },
      { name: 'Zig-zag slides', duration: '5 min' },
      { name: 'Drop step & recover', duration: '5 min' },
      { name: 'Mirror drill (react to partner)', duration: '5 min' },
    ],
    created_at: '2026-01-11T00:00:00Z', updated_at: '2026-01-11T00:00:00Z',
  },
  {
    id: 'wt-6', user_id: 'demo-user-001', name: 'Three-Point Blitz', category: 'Shooting',
    description: 'High-volume three-point shooting from all five spots.',
    estimated_minutes: 40,
    drills: [
      { name: 'Corner threes (left)', duration: '5 min' },
      { name: 'Corner threes (right)', duration: '5 min' },
      { name: 'Wing threes (left)', duration: '5 min' },
      { name: 'Wing threes (right)', duration: '5 min' },
      { name: 'Top of key threes', duration: '5 min' },
      { name: 'Catch & shoot off screens', duration: '8 min' },
      { name: 'Step-back threes', duration: '7 min' },
    ],
    created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'wt-7', user_id: 'demo-user-001', name: 'Full Court Conditioning', category: 'Conditioning',
    description: 'Game-speed conditioning to build endurance.',
    estimated_minutes: 30,
    drills: [
      { name: '17s (sideline to sideline)', duration: '6 min' },
      { name: 'Full court layups (sprint back)', duration: '6 min' },
      { name: 'Suicide sprints', duration: '6 min' },
      { name: 'Defensive slide full court', duration: '6 min' },
      { name: 'Cool-down jog', duration: '6 min' },
    ],
    created_at: '2026-01-09T00:00:00Z', updated_at: '2026-01-09T00:00:00Z',
  },
  {
    id: 'wt-8', user_id: 'demo-user-001', name: 'Passing Precision', category: 'Passing',
    description: 'Sharpen your court vision and passing accuracy.',
    estimated_minutes: 25,
    drills: [
      { name: 'Chest passes (wall)', duration: '3 min' },
      { name: 'Bounce passes (wall)', duration: '3 min' },
      { name: 'One-hand push passes', duration: '4 min' },
      { name: 'Outlet pass drill', duration: '5 min' },
      { name: 'Skip passes across court', duration: '5 min' },
      { name: 'Behind-the-back passes', duration: '5 min' },
    ],
    created_at: '2026-01-08T00:00:00Z', updated_at: '2026-01-08T00:00:00Z',
  },
  {
    id: 'wt-9', user_id: 'demo-user-001', name: 'Pick & Roll Scoring', category: 'Shooting',
    description: 'Score out of ball screens like a pro.',
    estimated_minutes: 35,
    drills: [
      { name: 'Pull-up off high screen', duration: '7 min' },
      { name: 'Floater off screen', duration: '7 min' },
      { name: 'Split the screen layup', duration: '7 min' },
      { name: 'Reject screen & attack', duration: '7 min' },
      { name: 'Step-back three off screen', duration: '7 min' },
    ],
    created_at: '2026-01-07T00:00:00Z', updated_at: '2026-01-07T00:00:00Z',
  },
  {
    id: 'wt-10', user_id: 'demo-user-001', name: 'Quick Feet Ladder', category: 'Conditioning',
    description: 'Agility ladder drills for faster footwork.',
    estimated_minutes: 20,
    drills: [
      { name: 'Two feet in each box', duration: '3 min' },
      { name: 'Lateral shuffle through', duration: '3 min' },
      { name: 'In-out hops', duration: '3 min' },
      { name: 'Ickey shuffle', duration: '3 min' },
      { name: 'Single-leg hops', duration: '4 min' },
      { name: 'Crossover steps', duration: '4 min' },
    ],
    created_at: '2026-01-06T00:00:00Z', updated_at: '2026-01-06T00:00:00Z',
  },
  {
    id: 'wt-11', user_id: 'demo-user-001', name: 'Post Moves', category: 'Finishing',
    description: 'Develop a complete post game with footwork and touch.',
    estimated_minutes: 35,
    drills: [
      { name: 'Drop step baseline', duration: '5 min' },
      { name: 'Drop step middle', duration: '5 min' },
      { name: 'Face-up jumper', duration: '5 min' },
      { name: 'Hook shot (both sides)', duration: '5 min' },
      { name: 'Up-and-under', duration: '5 min' },
      { name: 'Pump fake & drive', duration: '5 min' },
      { name: 'Dream shake combo', duration: '5 min' },
    ],
    created_at: '2026-01-05T00:00:00Z', updated_at: '2026-01-05T00:00:00Z',
  },
  {
    id: 'wt-12', user_id: 'demo-user-001', name: 'Ball Screen Defense', category: 'Defense',
    description: 'Learn to fight over and under screens.',
    estimated_minutes: 25,
    drills: [
      { name: 'Chase & recover over screen', duration: '5 min' },
      { name: 'Ice / push sideline', duration: '5 min' },
      { name: 'Switch & communicate', duration: '5 min' },
      { name: 'Trap & rotate', duration: '5 min' },
      { name: 'Show & recover (hedge)', duration: '5 min' },
    ],
    created_at: '2026-01-04T00:00:00Z', updated_at: '2026-01-04T00:00:00Z',
  },
  {
    id: 'wt-13', user_id: 'demo-user-001', name: 'Warm-Up Routine', category: 'Conditioning',
    description: 'Dynamic warm-up before any practice or game.',
    estimated_minutes: 15,
    drills: [
      { name: 'Jog (2 laps)', duration: '2 min' },
      { name: 'High knees', duration: '2 min' },
      { name: 'Butt kicks', duration: '2 min' },
      { name: 'Leg swings', duration: '2 min' },
      { name: 'Karaoke / grapevine', duration: '2 min' },
      { name: 'Form shooting (close range)', duration: '5 min' },
    ],
    created_at: '2026-01-03T00:00:00Z', updated_at: '2026-01-03T00:00:00Z',
  },
  {
    id: 'wt-14', user_id: 'demo-user-001', name: 'Iso Moves Package', category: 'Ball Handling',
    description: 'Master 1-on-1 moves to create your own shot.',
    estimated_minutes: 30,
    drills: [
      { name: 'Jab step & go', duration: '5 min' },
      { name: 'Crossover pull-up', duration: '5 min' },
      { name: 'Hesi step-back', duration: '5 min' },
      { name: 'In-and-out drive', duration: '5 min' },
      { name: 'Shamgod', duration: '5 min' },
      { name: 'Between the legs step-back', duration: '5 min' },
    ],
    created_at: '2026-01-02T00:00:00Z', updated_at: '2026-01-02T00:00:00Z',
  },
  {
    id: 'wt-15', user_id: 'demo-user-001', name: 'Transition Scoring', category: 'Conditioning',
    description: 'Score in the open court on the fast break.',
    estimated_minutes: 25,
    drills: [
      { name: 'Outlet & sprint layup', duration: '5 min' },
      { name: '2-on-1 fast break', duration: '5 min' },
      { name: '3-on-2 fast break', duration: '5 min' },
      { name: 'Rim run & finish', duration: '5 min' },
      { name: 'Pull-up three in transition', duration: '5 min' },
    ],
    created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'wt-16', user_id: 'demo-user-001', name: 'Catch & Shoot', category: 'Shooting',
    description: 'Get shots off quickly on the catch.',
    estimated_minutes: 30,
    drills: [
      { name: 'Spot up corners', duration: '5 min' },
      { name: 'Spot up wings', duration: '5 min' },
      { name: 'Spot up top of key', duration: '5 min' },
      { name: 'Relocate & shoot', duration: '5 min' },
      { name: 'One dribble pull-up', duration: '5 min' },
      { name: 'Contested catch & shoot', duration: '5 min' },
    ],
    created_at: '2025-12-31T00:00:00Z', updated_at: '2025-12-31T00:00:00Z',
  },
  {
    id: 'wt-17', user_id: 'demo-user-001', name: 'Weak Hand Development', category: 'Ball Handling',
    description: 'Strengthen your non-dominant hand.',
    estimated_minutes: 25,
    drills: [
      { name: 'Weak hand stationary dribble', duration: '5 min' },
      { name: 'Weak hand full-court dribble', duration: '5 min' },
      { name: 'Weak hand layups (Mikan)', duration: '5 min' },
      { name: 'Weak hand crossover into drive', duration: '5 min' },
      { name: 'Weak hand floaters', duration: '5 min' },
    ],
    created_at: '2025-12-30T00:00:00Z', updated_at: '2025-12-30T00:00:00Z',
  },
  {
    id: 'wt-18', user_id: 'demo-user-001', name: 'Rebounding Drills', category: 'Defense',
    description: 'Crash the glass and control the boards.',
    estimated_minutes: 25,
    drills: [
      { name: 'Box out & grab', duration: '5 min' },
      { name: 'Tip drill (self toss)', duration: '5 min' },
      { name: 'Outlet after rebound', duration: '5 min' },
      { name: 'Offensive rebound putbacks', duration: '5 min' },
      { name: 'Chase-down rebound drill', duration: '5 min' },
    ],
    created_at: '2025-12-29T00:00:00Z', updated_at: '2025-12-29T00:00:00Z',
  },
  {
    id: 'wt-19', user_id: 'demo-user-001', name: 'Vertical Jump Training', category: 'Conditioning',
    description: 'Explosive plyometrics to increase your vertical.',
    estimated_minutes: 30,
    drills: [
      { name: 'Box jumps', duration: '5 min' },
      { name: 'Depth jumps', duration: '5 min' },
      { name: 'Single-leg bounds', duration: '5 min' },
      { name: 'Tuck jumps', duration: '5 min' },
      { name: 'Approach jump (practice dunking)', duration: '5 min' },
      { name: 'Rim touches', duration: '5 min' },
    ],
    created_at: '2025-12-28T00:00:00Z', updated_at: '2025-12-28T00:00:00Z',
  },
  {
    id: 'wt-20', user_id: 'demo-user-001', name: 'Shooting Off the Dribble', category: 'Shooting',
    description: 'Create your own shot with dribble combos into jumpers.',
    estimated_minutes: 35,
    drills: [
      { name: 'Crossover pull-up mid', duration: '7 min' },
      { name: 'Between the legs pull-up', duration: '7 min' },
      { name: 'Step-back three', duration: '7 min' },
      { name: 'Hesi pull-up jimbo', duration: '7 min' },
      { name: 'Side step three', duration: '7 min' },
    ],
    created_at: '2025-12-27T00:00:00Z', updated_at: '2025-12-27T00:00:00Z',
  },
  {
    id: 'wt-21', user_id: 'demo-user-001', name: 'Court Vision & IQ', category: 'Passing',
    description: 'Read the defense and make the right pass.',
    estimated_minutes: 25,
    drills: [
      { name: 'Hit the open man (3-on-3 read)', duration: '5 min' },
      { name: 'Drive & kick', duration: '5 min' },
      { name: 'Entry pass into post', duration: '5 min' },
      { name: 'Lob pass drill', duration: '5 min' },
      { name: 'No-look / wrap-around passes', duration: '5 min' },
    ],
    created_at: '2025-12-26T00:00:00Z', updated_at: '2025-12-26T00:00:00Z',
  },
  {
    id: 'wt-22', user_id: 'demo-user-001', name: 'Closeout & Contest', category: 'Defense',
    description: 'Sprint to the shooter and contest without fouling.',
    estimated_minutes: 20,
    drills: [
      { name: 'Sprint closeout to shooter', duration: '5 min' },
      { name: 'Closeout & slide', duration: '5 min' },
      { name: 'Contest & box out', duration: '5 min' },
      { name: 'Help & recover', duration: '5 min' },
    ],
    created_at: '2025-12-25T00:00:00Z', updated_at: '2025-12-25T00:00:00Z',
  },
  {
    id: 'wt-23', user_id: 'demo-user-001', name: 'Pre-Game Shootaround', category: 'Shooting',
    description: 'Quick shooting warm-up before game time.',
    estimated_minutes: 15,
    drills: [
      { name: 'Form shooting (paint)', duration: '3 min' },
      { name: 'Elbow jumpers', duration: '3 min' },
      { name: 'Spot up threes (5 spots)', duration: '5 min' },
      { name: 'Free throws (10 makes)', duration: '4 min' },
    ],
    created_at: '2025-12-24T00:00:00Z', updated_at: '2025-12-24T00:00:00Z',
  },
  {
    id: 'wt-24', user_id: 'demo-user-001', name: 'Two-Ball Dribbling', category: 'Ball Handling',
    description: 'Advanced handle work with two basketballs.',
    estimated_minutes: 20,
    drills: [
      { name: 'Two-ball stationary pound', duration: '3 min' },
      { name: 'Two-ball alternating', duration: '3 min' },
      { name: 'Two-ball crossovers', duration: '4 min' },
      { name: 'Two-ball full court', duration: '5 min' },
      { name: 'Two-ball between the legs', duration: '5 min' },
    ],
    created_at: '2025-12-23T00:00:00Z', updated_at: '2025-12-23T00:00:00Z',
  },
  {
    id: 'wt-25', user_id: 'demo-user-001', name: 'Mid-Range Mastery', category: 'Shooting',
    description: 'Own the mid-range game with a variety of shots.',
    estimated_minutes: 30,
    drills: [
      { name: 'Elbow jumpers', duration: '5 min' },
      { name: 'Free throw line pull-up', duration: '5 min' },
      { name: 'Baseline turnaround', duration: '5 min' },
      { name: 'High post face-up', duration: '5 min' },
      { name: 'Off-dribble mid-range', duration: '5 min' },
      { name: 'Fadeaway mid-range', duration: '5 min' },
    ],
    created_at: '2025-12-22T00:00:00Z', updated_at: '2025-12-22T00:00:00Z',
  },
  {
    id: 'wt-26', user_id: 'demo-user-001', name: 'Full Body Strength', category: 'Conditioning',
    description: 'Basketball-specific strength training.',
    estimated_minutes: 40,
    drills: [
      { name: 'Goblet squats', duration: '5 min' },
      { name: 'Lunges (walking)', duration: '5 min' },
      { name: 'Push-ups (3 sets of 15)', duration: '5 min' },
      { name: 'Plank holds', duration: '5 min' },
      { name: 'Lateral band walks', duration: '5 min' },
      { name: 'Single-leg RDL', duration: '5 min' },
      { name: 'Medicine ball slams', duration: '5 min' },
      { name: 'Core rotations', duration: '5 min' },
    ],
    created_at: '2025-12-21T00:00:00Z', updated_at: '2025-12-21T00:00:00Z',
  },
  {
    id: 'wt-27', user_id: 'demo-user-001', name: 'Screen Setting & Slipping', category: 'Finishing',
    description: 'Be a better screener and learn to slip for easy buckets.',
    estimated_minutes: 20,
    drills: [
      { name: 'Proper screen angle (walk-through)', duration: '5 min' },
      { name: 'Slip to basket finish', duration: '5 min' },
      { name: 'Pop for mid-range after screen', duration: '5 min' },
      { name: 'Roll to basket finish', duration: '5 min' },
    ],
    created_at: '2025-12-20T00:00:00Z', updated_at: '2025-12-20T00:00:00Z',
  },
  {
    id: 'wt-28', user_id: 'demo-user-001', name: 'Combo Move Gauntlet', category: 'Ball Handling',
    description: 'Chain together multiple moves at game speed.',
    estimated_minutes: 25,
    drills: [
      { name: 'Cross-between-behind combo', duration: '5 min' },
      { name: 'Hesi-cross-spin', duration: '5 min' },
      { name: 'In-and-out to behind the back', duration: '5 min' },
      { name: 'Double cross pull-up', duration: '5 min' },
      { name: 'Game speed 1-on-0 combos', duration: '5 min' },
    ],
    created_at: '2025-12-19T00:00:00Z', updated_at: '2025-12-19T00:00:00Z',
  },
  {
    id: 'wt-29', user_id: 'demo-user-001', name: 'Steal & Deflection Drill', category: 'Defense',
    description: 'Active hands and anticipation on the defensive end.',
    estimated_minutes: 20,
    drills: [
      { name: 'Passing lane deflections', duration: '5 min' },
      { name: 'On-ball rip through', duration: '5 min' },
      { name: 'Help-side steal rotation', duration: '5 min' },
      { name: 'Full court press drill', duration: '5 min' },
    ],
    created_at: '2025-12-18T00:00:00Z', updated_at: '2025-12-18T00:00:00Z',
  },
  {
    id: 'wt-30', user_id: 'demo-user-001', name: 'Game Day Prep', category: 'Custom',
    description: 'Complete warm-up and mental prep for game day.',
    estimated_minutes: 30,
    drills: [
      { name: 'Dynamic stretching', duration: '5 min' },
      { name: 'Form shooting (close range)', duration: '5 min' },
      { name: 'Spot up shooting (3 spots)', duration: '5 min' },
      { name: 'Layup lines (both hands)', duration: '5 min' },
      { name: 'Free throws (10 makes)', duration: '5 min' },
      { name: 'Visualization & deep breaths', duration: '5 min' },
    ],
    created_at: '2025-12-17T00:00:00Z', updated_at: '2025-12-17T00:00:00Z',
  },
]

export const demoNotifications = [
  { id: 'n1', user_id: 'demo-user-001', type: 'achievement', title: 'First Blood!', body: 'You logged your first game!', icon: '🏀', read: false, created_at: randomDate(0) },
  { id: 'n2', user_id: 'demo-user-001', type: 'achievement', title: 'Sharpshooter', body: 'Hit 40% from three in a game!', icon: '🎯', read: false, created_at: randomDate(1) },
  { id: 'n3', user_id: 'demo-user-001', type: 'streak', title: '7-Day Streak!', body: 'You\'ve been active 7 days in a row!', icon: '🔥', read: true, created_at: randomDate(2) },
]
