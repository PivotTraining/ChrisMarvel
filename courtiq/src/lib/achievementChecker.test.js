import { describe, it, expect } from 'vitest'
import { checkAchievements, MILESTONES } from './achievementChecker'

function makeGame(overrides = {}) {
  return {
    game_date: '2026-01-01',
    points: 10,
    rebounds: 4,
    assists: 3,
    result: 'Win',
    ...overrides,
  }
}

describe('MILESTONES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(MILESTONES)).toBe(true)
    expect(MILESTONES.length).toBeGreaterThan(0)
  })

  it('each milestone has required properties', () => {
    MILESTONES.forEach((m) => {
      expect(m).toHaveProperty('id')
      expect(m).toHaveProperty('type')
      expect(m).toHaveProperty('check')
      expect(m).toHaveProperty('title')
      expect(typeof m.check).toBe('function')
    })
  })
})

describe('checkAchievements', () => {
  it('returns first-game milestone for 1 game', () => {
    const games = [makeGame()]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('first-game')
  })

  it('returns 10-games milestone when 10 games logged', () => {
    const games = Array.from({ length: 10 }, (_, i) =>
      makeGame({ game_date: `2026-01-${String(i + 1).padStart(2, '0')}` })
    )
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('10-games')
  })

  it('does not return already earned achievements', () => {
    const games = [makeGame()]
    const earned = new Set(['first-game'])
    const result = checkAchievements(games, [], earned)
    const ids = result.map((r) => r.id)
    expect(ids).not.toContain('first-game')
  })

  it('detects 20-point game achievement', () => {
    const games = [makeGame({ points: 25 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('20-pt-game')
  })

  it('detects double-double', () => {
    const games = [makeGame({ points: 15, rebounds: 12, assists: 5 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('double-double')
  })

  it('detects triple-double', () => {
    const games = [makeGame({ points: 15, rebounds: 12, assists: 10 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('triple-double')
  })

  it('detects 3-game win streak', () => {
    const games = [
      makeGame({ game_date: '2026-01-01', result: 'Win' }),
      makeGame({ game_date: '2026-01-02', result: 'Win' }),
      makeGame({ game_date: '2026-01-03', result: 'Win' }),
    ]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('3-win-streak')
  })

  it('does not detect 3-win-streak when streak is broken', () => {
    const games = [
      makeGame({ game_date: '2026-01-01', result: 'Win' }),
      makeGame({ game_date: '2026-01-02', result: 'Loss' }),
      makeGame({ game_date: '2026-01-03', result: 'Win' }),
    ]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).not.toContain('3-win-streak')
  })

  it('detects first-drill milestone', () => {
    const drills = [{ id: 1 }]
    const result = checkAchievements([], drills, new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('first-drill')
  })

  it('returns empty array when no milestones met', () => {
    const result = checkAchievements([], [], new Set())
    expect(result).toEqual([])
  })
})
