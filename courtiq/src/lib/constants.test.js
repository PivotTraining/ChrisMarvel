import { describe, it, expect } from 'vitest'
import {
  APP_NAME,
  POSITIONS,
  SKILL_LEVELS,
  GAME_TYPES,
  DRILL_CATEGORIES,
  SHOT_TYPES,
  SHOT_CONTEXTS,
  NAV_ITEMS,
} from './constants'

describe('constants', () => {
  it('APP_NAME is CourtIQ', () => {
    expect(APP_NAME).toBe('CourtIQ')
  })

  it('POSITIONS contains 5 basketball positions', () => {
    expect(POSITIONS).toHaveLength(5)
    expect(POSITIONS).toContain('PG')
    expect(POSITIONS).toContain('C')
  })

  it('SKILL_LEVELS is an array of 4 levels', () => {
    expect(SKILL_LEVELS).toHaveLength(4)
    expect(SKILL_LEVELS).toContain('Beginner')
    expect(SKILL_LEVELS).toContain('Elite')
  })

  it('GAME_TYPES is a non-empty array', () => {
    expect(Array.isArray(GAME_TYPES)).toBe(true)
    expect(GAME_TYPES.length).toBeGreaterThan(0)
  })

  it('DRILL_CATEGORIES includes common categories', () => {
    expect(DRILL_CATEGORIES).toContain('Shooting')
    expect(DRILL_CATEGORIES).toContain('Ball Handling')
    expect(DRILL_CATEGORIES).toContain('Defense')
  })

  it('SHOT_TYPES is a non-empty array of strings', () => {
    expect(SHOT_TYPES.length).toBeGreaterThan(0)
    SHOT_TYPES.forEach((type) => {
      expect(typeof type).toBe('string')
    })
  })

  it('SHOT_CONTEXTS includes Practice and Game', () => {
    expect(SHOT_CONTEXTS).toContain('Practice')
    expect(SHOT_CONTEXTS).toContain('Game')
  })

  it('NAV_ITEMS is an array of objects with label, path, icon', () => {
    expect(Array.isArray(NAV_ITEMS)).toBe(true)
    NAV_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('path')
      expect(item).toHaveProperty('icon')
    })
  })
})
