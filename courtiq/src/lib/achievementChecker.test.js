import { describe, it, expect } from 'vitest'
import { checkAchievements, MILESTONES } from './achievementChecker'

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
      expect(m).toHaveProperty('body')
      expect(m).toHaveProperty('icon')
      expect(typeof m.check).toBe('function')
    })
  })
})

describe('checkAchievements', () => {
  const makeGame = (overrides = {}) => ({
    game_date: '2025-01-01',
    points: 0,
    rebounds: 0,
    assists: 0,
    result: 'Loss',
    ...overrides,
  })

  it('returns first-game achievement when 1 game is logged', () => {
    const games = [makeGame()]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('first-game')
  })

  it('does not return already earned achievements', () => {
    const games = [makeGame()]
    const earned = new Set(['first-game'])
    const result = checkAchievements(games, [], earned)
    const ids = result.map((r) => r.id)
    expect(ids).not.toContain('first-game')
  })

  it('returns 10-games milestone when 10 games are logged', () => {
    const games = Array.from({ length: 10 }, (_, i) =>
      makeGame({ game_date: `2025-01-${String(i + 1).padStart(2, '0')}` })
    )
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('10-games')
  })

  it('returns 20-pt-game achievement when a game has 20+ points', () => {
    const games = [makeGame({ points: 25 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('20-pt-game')
  })

  it('returns double-double achievement', () => {
    const games = [makeGame({ points: 15, rebounds: 12 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('double-double')
  })

  it('returns triple-double achievement', () => {
    const games = [makeGame({ points: 15, rebounds: 12, assists: 11 })]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('triple-double')
  })

  it('detects 3-game win streak', () => {
    const games = [
      makeGame({ game_date: '2025-01-01', result: 'Win' }),
      makeGame({ game_date: '2025-01-02', result: 'Win' }),
      makeGame({ game_date: '2025-01-03', result: 'Win' }),
    ]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('3-win-streak')
  })

  it('does not detect win streak when broken by a loss', () => {
    const games = [
      makeGame({ game_date: '2025-01-01', result: 'Win' }),
      makeGame({ game_date: '2025-01-02', result: 'Win' }),
      makeGame({ game_date: '2025-01-03', result: 'Loss' }),
    ]
    const result = checkAchievements(games, [], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).not.toContain('3-win-streak')
  })

  it('returns first-drill when 1 drill is logged', () => {
    const result = checkAchievements([], [{ id: 1 }], new Set())
    const ids = result.map((r) => r.id)
    expect(ids).toContain('first-drill')
  })

  it('returns empty array when no milestones are met', () => {
    const result = checkAchievements([], [], new Set())
    expect(result).toEqual([])
  })
})
