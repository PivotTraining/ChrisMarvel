import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase before importing the module
const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockFrom = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('./supabase', () => ({
  supabase: {
    from: (table) => {
      mockFrom(table)
      return {
        select: (...args) => {
          mockSelect(...args)
          return {
            eq: (...eqArgs) => {
              mockEq(...eqArgs)
              return { single: mockSingle }
            },
          }
        },
        update: (data) => {
          mockUpdate(data)
          return {
            eq: vi.fn(),
          }
        },
      }
    },
  },
}))

import { updateStreak } from './streaks'

describe('updateStreak', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Fix "today" for deterministic tests
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-22T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does nothing if userId is falsy', async () => {
    await updateStreak(null)
    expect(mockFrom).not.toHaveBeenCalled()
  })

  it('does nothing if profile is not found', async () => {
    mockSingle.mockResolvedValue({ data: null })
    await updateStreak('user-1')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('does nothing if already logged today', async () => {
    mockSingle.mockResolvedValue({
      data: { current_streak: 5, longest_streak: 10, last_activity_date: '2026-03-22' },
    })
    await updateStreak('user-1')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('extends streak for consecutive day', async () => {
    mockSingle.mockResolvedValue({
      data: { current_streak: 3, longest_streak: 5, last_activity_date: '2026-03-21' },
    })
    await updateStreak('user-1')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_streak: 4,
        longest_streak: 5,
        last_activity_date: '2026-03-22',
      })
    )
  })

  it('resets streak to 1 after a gap', async () => {
    mockSingle.mockResolvedValue({
      data: { current_streak: 7, longest_streak: 10, last_activity_date: '2026-03-19' },
    })
    await updateStreak('user-1')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_streak: 1,
        longest_streak: 10,
      })
    )
  })

  it('updates longest_streak when current exceeds it', async () => {
    mockSingle.mockResolvedValue({
      data: { current_streak: 5, longest_streak: 5, last_activity_date: '2026-03-21' },
    })
    await updateStreak('user-1')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_streak: 6,
        longest_streak: 6,
      })
    )
  })

  it('starts at 1 when no previous activity date', async () => {
    mockSingle.mockResolvedValue({
      data: { current_streak: 0, longest_streak: 0, last_activity_date: null },
    })
    await updateStreak('user-1')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        current_streak: 1,
      })
    )
  })
})
