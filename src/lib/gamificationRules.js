export const XP_VALUES = {
  game_logged: 50,
  drill_completed: 30,
  shot_logged: 5,
  journal_entry: 25,
  badge_earned: 100,
  challenge_completed: 0, // uses dynamic xp_reward from challenge
  streak_bonus_7day: 50,
  streak_bonus_30day: 200,
}

export const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  xpRequired: i * 500,
  title: getLevelTitle(i + 1),
}))

function getLevelTitle(level) {
  if (level <= 3) return 'Rookie'
  if (level <= 6) return 'Starter'
  if (level <= 10) return 'Sixth Man'
  if (level <= 15) return 'Starter'
  if (level <= 20) return 'All-Star'
  if (level <= 30) return 'All-Pro'
  if (level <= 40) return 'MVP'
  return 'Hall of Famer'
}

export const BADGE_CRITERIA = {
  'First Game': { type: 'count', feature: 'games', threshold: 1 },
  '5 Game Streak': { type: 'count', feature: 'games', threshold: 5 },
  'Sharpshooter': { type: 'count', feature: 'shots', threshold: 100 },
  'Gym Rat': { type: 'count', feature: 'drills', threshold: 10 },
  'Mind Over Matter': { type: 'count', feature: 'journal', threshold: 5 },
  '30 Piece': { type: 'stat', feature: 'maxPoints', threshold: 30 },
  'Double Double': { type: 'special', feature: 'hasDoubleDouble' },
  'Iron Man': { type: 'streak', threshold: 7 },
  'Scholar': { type: 'count', feature: 'contentCompleted', threshold: 5 },
  'All-Around': { type: 'special', feature: 'allFeatures' },
}

export const STREAK_RULES = {
  freezePerWeek: 1,
  freezeCooldownDays: 7,
}

export default {
  XP_VALUES,
  LEVEL_THRESHOLDS,
  BADGE_CRITERIA,
  STREAK_RULES,
}
