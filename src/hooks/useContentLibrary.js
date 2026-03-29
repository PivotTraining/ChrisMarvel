import { useState, useEffect, useCallback } from 'react'
import { supabase, BYPASS_AUTH } from '../lib/supabase'

const SEED_CONTENT = [
  // Drills
  {
    id: 'drill-001', content_type: 'Drill', title: 'Mikan Drill',
    description: 'Classic layup drill alternating left and right hands under the basket. Builds touch around the rim and develops ambidextrous finishing ability.',
    coaching_cue: 'Keep the ball above your head and use the backboard on every attempt.',
    category: 'Finishing', difficulty: 'Beginner', duration_minutes: 10,
    equipment_needed: ['Basketball', 'Hoop'], age_restricted: false, min_age: null,
    tags: ['layups', 'finishing', 'fundamentals'],
  },
  {
    id: 'drill-002', content_type: 'Drill', title: 'Ball Handling Figure 8',
    description: 'Weave the ball in a figure-8 pattern around and through your legs. Develops hand speed, coordination, and low dribble control under pressure.',
    coaching_cue: 'Stay low in an athletic stance and keep your eyes up the entire time.',
    category: 'Ball Handling', difficulty: 'Beginner', duration_minutes: 8,
    equipment_needed: ['Basketball'], age_restricted: false, min_age: null,
    tags: ['handles', 'coordination', 'warmup'],
  },
  {
    id: 'drill-003', content_type: 'Drill', title: 'Defensive Slides',
    description: 'Lateral slide drill across the lane focusing on quick feet and low hip position. Essential for on-ball defense and closeout recovery.',
    coaching_cue: 'Never let your feet click together and keep your chest facing the offensive player.',
    category: 'Defense', difficulty: 'Intermediate', duration_minutes: 12,
    equipment_needed: ['Cones'], age_restricted: false, min_age: null,
    tags: ['defense', 'footwork', 'conditioning'],
  },
  {
    id: 'drill-004', content_type: 'Drill', title: '3-Man Weave Passing',
    description: 'Three players run the court weaving and passing without dribbling. Builds court vision, passing accuracy, and transition offense timing.',
    coaching_cue: 'Make crisp chest passes and sprint to the outside after every pass.',
    category: 'Passing', difficulty: 'Intermediate', duration_minutes: 15,
    equipment_needed: ['Basketball', 'Full Court'], age_restricted: false, min_age: null,
    tags: ['passing', 'transition', 'teamwork'],
  },
  {
    id: 'drill-005', content_type: 'Drill', title: 'Suicide Sprints',
    description: 'Sprint to each court line and back for maximum conditioning. Develops game-speed endurance and mental toughness for fourth-quarter play.',
    coaching_cue: 'Touch the line with your hand every rep and push through the last set.',
    category: 'Conditioning', difficulty: 'Advanced', duration_minutes: 20,
    equipment_needed: ['Full Court'], age_restricted: false, min_age: null,
    tags: ['conditioning', 'speed', 'endurance'],
  },
  {
    id: 'drill-006', content_type: 'Drill', title: 'Cone Agility',
    description: 'Navigate a cone pattern using crossovers, between-the-legs, and behind-the-back moves. Simulates game-speed changes of direction with the ball.',
    coaching_cue: 'Attack each cone at full speed and make your move before you reach it.',
    category: 'Ball Handling', difficulty: 'Intermediate', duration_minutes: 15,
    equipment_needed: ['Basketball', 'Cones'], age_restricted: false, min_age: null,
    tags: ['agility', 'handles', 'quickness'],
  },
  // Recovery
  {
    id: 'recovery-001', content_type: 'Recovery', title: 'Foam Rolling Routine',
    description: 'Full-body foam rolling session targeting quads, IT band, calves, and upper back. Reduces muscle soreness and improves recovery between sessions.',
    coaching_cue: 'Spend extra time on any spot that feels tender and roll slowly.',
    category: 'Soft Tissue', difficulty: 'Beginner', duration_minutes: 15,
    equipment_needed: ['Foam Roller'], age_restricted: false, min_age: null,
    tags: ['recovery', 'mobility', 'soreness'],
  },
  {
    id: 'recovery-002', content_type: 'Recovery', title: 'Dynamic Stretching',
    description: 'Pre-game dynamic stretch routine covering hip openers, leg swings, and arm circles. Prepares muscles and joints for explosive basketball movements.',
    coaching_cue: 'Move through each stretch with control — never bounce or force the range.',
    category: 'Stretching', difficulty: 'Beginner', duration_minutes: 10,
    equipment_needed: [], age_restricted: false, min_age: null,
    tags: ['warmup', 'flexibility', 'prevention'],
  },
  {
    id: 'recovery-003', content_type: 'Recovery', title: 'Ice Bath Protocol',
    description: 'Cold immersion protocol at 50-59°F for 10-15 minutes post-game. Reduces inflammation and accelerates recovery from high-intensity play.',
    coaching_cue: 'Control your breathing and enter slowly — the first two minutes are the hardest.',
    category: 'Cold Therapy', difficulty: 'Advanced', duration_minutes: 15,
    equipment_needed: ['Ice Bath', 'Thermometer'], age_restricted: false, min_age: null,
    tags: ['recovery', 'inflammation', 'postgame'],
  },
  {
    id: 'recovery-004', content_type: 'Recovery', title: 'Yoga for Basketball',
    description: 'Basketball-specific yoga flow focusing on hip mobility, hamstring flexibility, and core stability. Helps prevent common basketball injuries.',
    coaching_cue: 'Focus on your breath and hold each pose for at least five deep breaths.',
    category: 'Mobility', difficulty: 'Intermediate', duration_minutes: 30,
    equipment_needed: ['Yoga Mat'], age_restricted: false, min_age: null,
    tags: ['yoga', 'flexibility', 'core'],
  },
  {
    id: 'recovery-005', content_type: 'Recovery', title: 'Sleep Optimization',
    description: 'Guide to optimizing sleep for peak athletic performance. Covers room environment, screen habits, and pre-sleep routines for basketball players.',
    coaching_cue: 'Aim for 8-10 hours and keep your room cool, dark, and phone-free.',
    category: 'Rest', difficulty: 'Beginner', duration_minutes: null,
    equipment_needed: [], age_restricted: false, min_age: null,
    tags: ['sleep', 'recovery', 'performance'],
  },
  // Nutrition
  {
    id: 'nutrition-001', content_type: 'Nutrition', title: 'Pre-Game Meal Guide',
    description: 'Balanced meal plan 3-4 hours before tip-off with ideal carb-to-protein ratios. Ensures sustained energy without feeling heavy on the court.',
    coaching_cue: 'Stick to familiar foods and avoid anything high in fat or fiber before a game.',
    category: 'Meal Planning', difficulty: 'Beginner', duration_minutes: null,
    equipment_needed: [], age_restricted: false, min_age: null,
    tags: ['nutrition', 'pregame', 'energy'],
  },
  {
    id: 'nutrition-002', content_type: 'Nutrition', title: 'Hydration Strategy',
    description: 'Comprehensive hydration plan covering pre-game, in-game, and post-game fluid intake. Includes electrolyte timing and sweat rate calculation.',
    coaching_cue: 'Drink 16-20 oz two hours before game time and sip every dead ball.',
    category: 'Hydration', difficulty: 'Beginner', duration_minutes: null,
    equipment_needed: ['Water Bottle'], age_restricted: false, min_age: null,
    tags: ['hydration', 'electrolytes', 'performance'],
  },
  {
    id: 'nutrition-003', content_type: 'Nutrition', title: 'Post-Workout Shake',
    description: 'Recovery shake recipe with optimal protein-to-carb ratio for muscle repair. Best consumed within 30 minutes of finishing your workout.',
    coaching_cue: 'Use whey protein and a banana for the fastest absorption window.',
    category: 'Recipes', difficulty: 'Beginner', duration_minutes: 5,
    equipment_needed: ['Blender'], age_restricted: false, min_age: null,
    tags: ['protein', 'recovery', 'recipes'],
  },
  {
    id: 'nutrition-004', content_type: 'Nutrition', title: 'In-Season Nutrition Plan',
    description: 'Week-by-week nutrition framework for maintaining weight and energy during a competitive season. Adjusts macros based on game schedule.',
    coaching_cue: 'Increase carbs on game days and focus on protein on recovery days.',
    category: 'Meal Planning', difficulty: 'Intermediate', duration_minutes: null,
    equipment_needed: [], age_restricted: false, min_age: null,
    tags: ['nutrition', 'season', 'macros'],
  },
  {
    id: 'nutrition-005', content_type: 'Nutrition', title: 'Game Day Fueling',
    description: 'Hour-by-hour fueling timeline for game days from morning to post-game. Covers snack timing, caffeine use, and halftime nutrition.',
    coaching_cue: 'Have a light carb snack 60-90 minutes before warmups start.',
    category: 'Game Day', difficulty: 'Intermediate', duration_minutes: null,
    equipment_needed: [], age_restricted: false, min_age: null,
    tags: ['gameday', 'energy', 'timing'],
  },
  // Advanced Drills
  {
    id: 'drill-007', content_type: 'Drill', title: 'Pick & Roll Reads',
    description: 'Two-man pick and roll decision-making drill with live defense. Practice reading the coverage and making the correct pass or scoring decision.',
    coaching_cue: 'Read the big defender — if they hedge, split; if they drop, pull up.',
    category: 'Offense', difficulty: 'Advanced', duration_minutes: 25,
    equipment_needed: ['Basketball', 'Hoop', 'Partners'], age_restricted: false, min_age: null,
    tags: ['pick-and-roll', 'decision-making', 'offense'],
  },
  {
    id: 'drill-008', content_type: 'Drill', title: 'Shot Fake Series',
    description: 'Progressive shot fake drill series from triple threat. Includes shot fake to drive, shot fake to step-back, and shot fake to pull-up.',
    coaching_cue: 'Sell the fake with your eyes and the ball — make the defender bite.',
    category: 'Shooting', difficulty: 'Advanced', duration_minutes: 20,
    equipment_needed: ['Basketball', 'Hoop'], age_restricted: false, min_age: null,
    tags: ['shooting', 'moves', 'deception'],
  },
  {
    id: 'drill-009', content_type: 'Drill', title: 'Close-Out Drills',
    description: 'Defensive close-out technique drill emphasizing choppy steps and active hands. Teaches how to contest without fouling or getting blown by.',
    coaching_cue: 'Sprint the first two-thirds, then chop your feet to stay balanced on the close.',
    category: 'Defense', difficulty: 'Elite', duration_minutes: 18,
    equipment_needed: ['Basketball', 'Cones', 'Partners'], age_restricted: false, min_age: null,
    tags: ['defense', 'closeout', 'technique'],
  },
  {
    id: 'drill-010', content_type: 'Drill', title: 'Transition Offense',
    description: 'Five-man transition offense drill with numbered spots and outlet passing. Develops fast break execution and early offense decision-making.',
    coaching_cue: 'Fill the lanes wide and make the first pass ahead — never sideways.',
    category: 'Offense', difficulty: 'Elite', duration_minutes: 25,
    equipment_needed: ['Basketball', 'Full Court', 'Partners'], age_restricted: false, min_age: null,
    tags: ['transition', 'fast-break', 'team'],
  },
]

const LS_SAVED = 'courtiq_content_saved'
const LS_HISTORY = 'courtiq_content_history'

function loadJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback }
}

export default function useContentLibrary() {
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [savedIds, setSavedIds] = useState(new Set())
  const [completedIds, setCompletedIds] = useState(new Set())
  const [activeFilter, setActiveFilter] = useState({ contentType: 'All', difficulty: 'All', searchQuery: '' })

  // Load saved/completed from localStorage on mount
  useEffect(() => {
    setSavedIds(new Set(loadJson(LS_SAVED, [])))
    setCompletedIds(new Set(loadJson(LS_HISTORY, []).map(h => h.content_id)))
  }, [])

  const fetchContent = useCallback(async (filters = {}) => {
    setLoading(true)
    const f = { ...activeFilter, ...filters }
    setActiveFilter(f)

    if (BYPASS_AUTH) {
      let result = [...SEED_CONTENT]
      if (f.contentType && f.contentType !== 'All') {
        result = result.filter(c => c.content_type === f.contentType)
      }
      if (f.difficulty && f.difficulty !== 'All') {
        result = result.filter(c => c.difficulty === f.difficulty)
      }
      if (f.searchQuery) {
        const q = f.searchQuery.toLowerCase()
        result = result.filter(c =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q))
        )
      }
      setContent(result)
      setLoading(false)
      return result
    }

    // Supabase path
    try {
      let query = supabase.from('training_content').select('*')
      if (f.contentType && f.contentType !== 'All') query = query.eq('content_type', f.contentType)
      if (f.difficulty && f.difficulty !== 'All') query = query.eq('difficulty', f.difficulty)
      if (f.searchQuery) query = query.ilike('title', `%${f.searchQuery}%`)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setContent(data || [])
      return data
    } catch (err) {
      console.error('Failed to fetch content:', err)
      setContent([])
      return []
    } finally {
      setLoading(false)
    }
  }, [activeFilter])

  // Initial load
  useEffect(() => { fetchContent() }, [])

  const saveContent = useCallback((contentId) => {
    const next = new Set(savedIds)
    next.add(contentId)
    setSavedIds(next)
    if (BYPASS_AUTH) {
      localStorage.setItem(LS_SAVED, JSON.stringify([...next]))
    } else {
      supabase.from('user_saved_content').insert({ content_id: contentId }).then()
    }
  }, [savedIds])

  const unsaveContent = useCallback((contentId) => {
    const next = new Set(savedIds)
    next.delete(contentId)
    setSavedIds(next)
    if (BYPASS_AUTH) {
      localStorage.setItem(LS_SAVED, JSON.stringify([...next]))
    } else {
      supabase.from('user_saved_content').delete().eq('content_id', contentId).then()
    }
  }, [savedIds])

  const markCompleted = useCallback((contentId, notes = '') => {
    const next = new Set(completedIds)
    next.add(contentId)
    setCompletedIds(next)
    if (BYPASS_AUTH) {
      const history = loadJson(LS_HISTORY, [])
      history.push({ content_id: contentId, completed_at: new Date().toISOString(), notes })
      localStorage.setItem(LS_HISTORY, JSON.stringify(history))
    } else {
      supabase.from('user_content_history').insert({ content_id: contentId, notes }).then()
    }
  }, [completedIds])

  return {
    content,
    loading,
    fetchContent,
    savedIds,
    saveContent,
    unsaveContent,
    markCompleted,
    completedIds,
    activeFilter,
    setActiveFilter,
  }
}
