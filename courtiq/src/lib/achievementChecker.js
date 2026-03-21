// Checks game/drill data against milestones and returns new achievements
const MILESTONES = [
  // Game milestones
  { id: 'first-game', type: 'milestone', check: (g) => g.length >= 1, title: 'First Game Logged', body: 'Welcome to CourtIQ! Your journey starts now.', icon: 'trophy' },
  { id: '10-games', type: 'milestone', check: (g) => g.length >= 10, title: '10 Games Logged', body: 'Double digits! You\'re building a real track record.', icon: 'trophy' },
  { id: '25-games', type: 'milestone', check: (g) => g.length >= 25, title: '25 Games', body: 'Quarter century of games. Serious commitment.', icon: 'trophy' },
  { id: '50-games', type: 'milestone', check: (g) => g.length >= 50, title: '50 Games!', body: 'Half a hundred games logged. That\'s elite dedication.', icon: 'star' },
  { id: '100-games', type: 'milestone', check: (g) => g.length >= 100, title: 'Century Club', body: '100 games! You\'re a CourtIQ legend.', icon: 'star' },

  // Scoring milestones
  { id: '20-pt-game', type: 'achievement', check: (g) => g.some(x => x.points >= 20), title: '20-Point Game', body: 'Dropped 20+ in a game. Bucket getter!', icon: 'zap' },
  { id: '30-pt-game', type: 'achievement', check: (g) => g.some(x => x.points >= 30), title: '30-Point Explosion', body: '30+ points in a single game. Unstoppable.', icon: 'zap' },
  { id: '40-pt-game', type: 'achievement', check: (g) => g.some(x => x.points >= 40), title: '40-Piece', body: '40+ points! You were in a different zone.', icon: 'flame' },

  // Double-double / triple-double
  { id: 'double-double', type: 'achievement', check: (g) => g.some(x => {
    const stats = [x.points, x.rebounds, x.assists].filter(v => v >= 10)
    return stats.length >= 2
  }), title: 'Double-Double', body: 'Double digits in two stat categories. All-around player.', icon: 'award' },
  { id: 'triple-double', type: 'achievement', check: (g) => g.some(x => {
    const stats = [x.points, x.rebounds, x.assists].filter(v => v >= 10)
    return stats.length >= 3
  }), title: 'Triple-Double!', body: 'The rarest stat line. You did everything tonight.', icon: 'award' },

  // Win streaks
  { id: '3-win-streak', type: 'streak', check: (g) => {
    let streak = 0
    for (const x of g) { if (x.result === 'Win') { streak++; if (streak >= 3) return true } else streak = 0 }
    return false
  }, title: '3-Game Win Streak', body: 'Three in a row! Momentum is building.', icon: 'flame' },
  { id: '5-win-streak', type: 'streak', check: (g) => {
    let streak = 0
    for (const x of g) { if (x.result === 'Win') { streak++; if (streak >= 5) return true } else streak = 0 }
    return false
  }, title: '5-Game Win Streak!', body: 'Five straight wins. You\'re on fire!', icon: 'flame' },
  { id: '10-win-streak', type: 'streak', check: (g) => {
    let streak = 0
    for (const x of g) { if (x.result === 'Win') { streak++; if (streak >= 10) return true } else streak = 0 }
    return false
  }, title: '10-Game Win Streak!', body: 'Ten consecutive wins. Legendary run!', icon: 'flame' },

  // Drill milestones
  { id: 'first-drill', type: 'milestone', check: (g, d) => d.length >= 1, title: 'First Drill Logged', body: 'Training starts now. Greatness is built in practice.', icon: 'target' },
  { id: '50-drills', type: 'milestone', check: (g, d) => d.length >= 50, title: '50 Drills Completed', body: '50 training sessions! Discipline breeds success.', icon: 'target' },
  { id: '100-drills', type: 'milestone', check: (g, d) => d.length >= 100, title: '100 Drills', body: 'A hundred drills. You\'re putting in serious work.', icon: 'star' },
]

// Returns array of newly unlocked achievements (not yet in earnedSet)
export function checkAchievements(games, drills, earnedSet) {
  const sortedGames = [...games].sort((a, b) => a.game_date.localeCompare(b.game_date))
  const newUnlocks = []

  for (const milestone of MILESTONES) {
    if (earnedSet.has(milestone.id)) continue
    if (milestone.check(sortedGames, drills)) {
      newUnlocks.push(milestone)
    }
  }

  return newUnlocks
}

export { MILESTONES }
