// Pre-built training program templates
const TEMPLATES = [
  {
    id: 'shooting-4w',
    name: 'Shooting Fundamentals',
    description: 'Build a consistent shooting form and improve accuracy from all spots on the court.',
    difficulty: 'Beginner',
    duration_weeks: 4,
    focus_areas: ['Shooting', 'Form'],
    weekPlan: (week) => {
      const intensity = ['Light', 'Medium', 'Medium', 'High'][week - 1] || 'Medium'
      const reps = 20 + (week - 1) * 10
      return [
        { day: 1, title: 'Form Shooting', description: `Close-range form work. ${reps} makes from each elbow.`, drills: [{ name: 'Elbow Form Shots', reps, duration: 15 }, { name: 'Free Throw Routine', reps: reps, duration: 10 }], duration_minutes: 30 },
        { day: 2, title: 'Mid-Range', description: `Mid-range pull-ups and catch & shoot. Intensity: ${intensity}.`, drills: [{ name: 'Mid-Range Pull-Up', reps, duration: 15 }, { name: 'Catch & Shoot Spots', reps: Math.round(reps * 0.8), duration: 15 }], duration_minutes: 35 },
        { day: 3, title: 'Rest / Film', description: 'Watch shooting film or light stretching.', drills: [{ name: 'Film Study', reps: 0, duration: 20 }], duration_minutes: 20 },
        { day: 4, title: 'Three-Point Work', description: `Spot-up threes from 5 spots. ${reps} attempts per spot.`, drills: [{ name: 'Spot-Up Threes', reps: reps * 5, duration: 25 }, { name: 'Off-Screen Threes', reps: Math.round(reps * 0.6), duration: 10 }], duration_minutes: 40 },
        { day: 5, title: 'Game Shots', description: 'Simulate game situations with movement.', drills: [{ name: 'Dribble Pull-Up 3s', reps: Math.round(reps * 0.7), duration: 15 }, { name: 'Step-Back Jumpers', reps: Math.round(reps * 0.5), duration: 10 }, { name: 'Free Throws Under Fatigue', reps: 20, duration: 10 }], duration_minutes: 40 },
      ]
    },
  },
  {
    id: 'handles-4w',
    name: 'Ball Handling Mastery',
    description: 'Develop elite handles with progressive dribbling drills and combo moves.',
    difficulty: 'Intermediate',
    duration_weeks: 4,
    focus_areas: ['Ball Handling', 'Agility'],
    weekPlan: (week) => {
      const seconds = 30 + (week - 1) * 10
      return [
        { day: 1, title: 'Stationary Handles', description: `Pound dribble series. ${seconds}s each hand.`, drills: [{ name: 'Pound Dribbles', reps: 0, duration: 10 }, { name: 'Crossovers (Stationary)', reps: 0, duration: 10 }, { name: 'Between the Legs', reps: 0, duration: 10 }], duration_minutes: 35 },
        { day: 2, title: 'Full Court Moves', description: 'Attack dribbles baseline to baseline.', drills: [{ name: 'Speed Dribble', reps: 10, duration: 10 }, { name: 'Crossover Attack', reps: 10, duration: 10 }, { name: 'Hesitation Move', reps: 10, duration: 10 }], duration_minutes: 35 },
        { day: 3, title: 'Rest / Recovery', description: 'Stretching and grip strengthening.', drills: [{ name: 'Tennis Ball Dribbling', reps: 0, duration: 15 }], duration_minutes: 15 },
        { day: 4, title: 'Combo Moves', description: 'Chain 2-3 moves together.', drills: [{ name: 'Double Cross', reps: 10, duration: 10 }, { name: 'Behind Back to Cross', reps: 10, duration: 10 }, { name: 'In-and-Out to Spin', reps: 10, duration: 10 }], duration_minutes: 35 },
        { day: 5, title: 'Pressure Handles', description: 'Drills with a defender or cone.', drills: [{ name: 'Cone Attack Series', reps: 12, duration: 15 }, { name: '1v1 Isolation', reps: 10, duration: 15 }], duration_minutes: 35 },
      ]
    },
  },
  {
    id: 'complete-6w',
    name: 'Complete Player Program',
    description: 'All-around development: shooting, handles, finishing, defense, and conditioning.',
    difficulty: 'Advanced',
    duration_weeks: 6,
    focus_areas: ['Shooting', 'Ball Handling', 'Defense', 'Conditioning'],
    weekPlan: (week) => {
      const phase = week <= 2 ? 'Foundation' : week <= 4 ? 'Build' : 'Peak'
      return [
        { day: 1, title: `Shooting (${phase})`, description: 'Form, mid-range, and three-point work.', drills: [{ name: 'Form Shooting', reps: 30 + week * 5, duration: 10 }, { name: 'Spot-Up Threes', reps: 25 + week * 5, duration: 15 }, { name: 'Free Throws', reps: 20, duration: 5 }], duration_minutes: 45 },
        { day: 2, title: `Ball Handling (${phase})`, description: 'Progressive handle work.', drills: [{ name: 'Stationary Series', reps: 0, duration: 10 }, { name: 'Full Court Moves', reps: 10, duration: 15 }, { name: 'Finishing Package', reps: 10, duration: 15 }], duration_minutes: 45 },
        { day: 3, title: `Defense & Conditioning`, description: 'Defensive slides, closeouts, and cardio.', drills: [{ name: 'Defensive Slides', reps: 0, duration: 10 }, { name: 'Closeout Drill', reps: 10, duration: 10 }, { name: 'Sprint Intervals', reps: 8 + week, duration: 15 }], duration_minutes: 40 },
        { day: 4, title: 'Rest', description: 'Active recovery — stretching and film.', drills: [{ name: 'Stretching & Film', reps: 0, duration: 20 }], duration_minutes: 20 },
        { day: 5, title: `Game Simulation (${phase})`, description: 'Full game-speed work.', drills: [{ name: '1v1 Live', reps: 10, duration: 15 }, { name: 'Transition Finishing', reps: 10, duration: 10 }, { name: 'Clutch Free Throws', reps: 20, duration: 10 }], duration_minutes: 45 },
        { day: 6, title: 'Pickup / Scrimmage', description: 'Apply skills in live play.', drills: [{ name: 'Pickup Game', reps: 0, duration: 60 }], duration_minutes: 60 },
      ]
    },
  },
  {
    id: 'explosiveness-3w',
    name: 'Explosiveness & Finishing',
    description: 'Boost your first step, vertical, and finishing ability at the rim.',
    difficulty: 'Advanced',
    duration_weeks: 3,
    focus_areas: ['Athleticism', 'Finishing'],
    weekPlan: (week) => {
      const sets = 2 + week
      return [
        { day: 1, title: 'Plyometrics', description: `Box jumps, bounds, and depth jumps. ${sets} sets each.`, drills: [{ name: 'Box Jumps', reps: 8 * sets, duration: 15 }, { name: 'Bounding', reps: 6 * sets, duration: 10 }], duration_minutes: 30 },
        { day: 2, title: 'Finishing at the Rim', description: 'Euro steps, reverse layups, floaters.', drills: [{ name: 'Euro Step Package', reps: 10, duration: 10 }, { name: 'Reverse Layups', reps: 10, duration: 10 }, { name: 'Floaters', reps: 15, duration: 10 }], duration_minutes: 35 },
        { day: 3, title: 'Rest', description: 'Recovery day. Foam roll and stretch.', drills: [{ name: 'Recovery', reps: 0, duration: 20 }], duration_minutes: 20 },
        { day: 4, title: 'Speed & Agility', description: 'Ladder drills and cone work.', drills: [{ name: 'Agility Ladder', reps: 0, duration: 15 }, { name: 'Cone Drills', reps: 0, duration: 15 }], duration_minutes: 35 },
        { day: 5, title: 'Contact Finishing', description: 'Finish through contact with power.', drills: [{ name: 'Power Layups', reps: 12, duration: 10 }, { name: 'And-1 Finishes', reps: 10, duration: 10 }, { name: 'Vertical Jumps', reps: 15, duration: 10 }], duration_minutes: 35 },
      ]
    },
  },
]

export function getTemplates() {
  return TEMPLATES.map(({ weekPlan, ...t }) => t)
}

export function generateProgramDays(templateId, programId) {
  const template = TEMPLATES.find(t => t.id === templateId)
  if (!template) return []

  const allDays = []
  for (let week = 1; week <= template.duration_weeks; week++) {
    const weekDays = template.weekPlan(week)
    weekDays.forEach(d => {
      allDays.push({
        program_id: programId,
        week_number: week,
        day_number: d.day,
        title: d.title,
        description: d.description,
        drills: d.drills,
        duration_minutes: d.duration_minutes,
        completed: false,
      })
    })
  }
  return allDays
}

export function generateCustomDays(programId, weeks, daysPerWeek) {
  const allDays = []
  for (let week = 1; week <= weeks; week++) {
    for (let day = 1; day <= daysPerWeek; day++) {
      allDays.push({
        program_id: programId,
        week_number: week,
        day_number: day,
        title: `Week ${week} - Day ${day}`,
        description: '',
        drills: [],
        duration_minutes: 45,
        completed: false,
      })
    }
  }
  return allDays
}
