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

  it('POSITIONS is an array of 5 basketball positions', () => {
    expect(POSITIONS).toEqual(['PG', 'SG', 'SF', 'PF', 'C'])
  })

  it('SKILL_LEVELS has 4 levels in order', () => {
    expect(SKILL_LEVELS).toEqual(['Beginner', 'Intermediate', 'Advanced', 'Elite'])
  })

  it('GAME_TYPES is a non-empty array of strings', () => {
    expect(Array.isArray(GAME_TYPES)).toBe(true)
    expect(GAME_TYPES.length).toBeGreaterThan(0)
    GAME_TYPES.forEach((t) => expect(typeof t).toBe('string'))
  })

  it('DRILL_CATEGORIES includes expected categories', () => {
    expect(DRILL_CATEGORIES).toContain('Shooting')
    expect(DRILL_CATEGORIES).toContain('Ball Handling')
    expect(DRILL_CATEGORIES).toContain('Defense')
    expect(DRILL_CATEGORIES).toContain('Custom')
  })

  it('SHOT_TYPES is a non-empty array', () => {
    expect(Array.isArray(SHOT_TYPES)).toBe(true)
    expect(SHOT_TYPES.length).toBeGreaterThanOrEqual(5)
  })

  it('SHOT_CONTEXTS contains Practice, Game, and Warmup', () => {
    expect(SHOT_CONTEXTS).toEqual(['Practice', 'Game', 'Warmup'])
  })

  it('NAV_ITEMS is an array of objects with label, path, and icon', () => {
    expect(Array.isArray(NAV_ITEMS)).toBe(true)
    NAV_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('label')
      expect(item).toHaveProperty('path')
      expect(item).toHaveProperty('icon')
    })
  })
})
