import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSelect = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnValue({
        eq: mockEq.mockReturnValue({
          single: mockSingle,
        }),
      }),
      update: mockUpdate.mockReturnValue({
        eq: vi.fn(),
      }),
    })),
  },
}))

import { updateStreak } from './streaks'

describe('updateStreak', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns early if no userId', async () => {
    await updateStreak(null)
    const { supabase } = await import('./supabase')
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('returns early if profile is not found', async () => {
    mockSingle.mockResolvedValue({ data: null })
    await updateStreak('user-123')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('returns early if already logged today', async () => {
    const today = new Date().toISOString().split('T')[0]
    mockSingle.mockResolvedValue({
      data: {
        current_streak: 5,
        longest_streak: 10,
        last_activity_date: today,
      },
    })
    await updateStreak('user-123')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('extends streak when last activity was yesterday', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    mockSingle.mockResolvedValue({
      data: {
        current_streak: 3,
        longest_streak: 10,
        last_activity_date: yesterdayStr,
      },
    })

    const updateEq = vi.fn()
    mockUpdate.mockReturnValue({ eq: updateEq })

    await updateStreak('user-123')

    expect(mockUpdate).toHaveBeenCalled()
    const updateArg = mockUpdate.mock.calls[0][0]
    expect(updateArg.current_streak).toBe(4)
  })

  it('resets streak to 1 when more than 1 day gap', async () => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const dateStr = threeDaysAgo.toISOString().split('T')[0]

    mockSingle.mockResolvedValue({
      data: {
        current_streak: 5,
        longest_streak: 10,
        last_activity_date: dateStr,
      },
    })

    const updateEq = vi.fn()
    mockUpdate.mockReturnValue({ eq: updateEq })

    await updateStreak('user-123')

    expect(mockUpdate).toHaveBeenCalled()
    const updateArg = mockUpdate.mock.calls[0][0]
    expect(updateArg.current_streak).toBe(1)
  })

  it('updates longest_streak when new streak exceeds it', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    mockSingle.mockResolvedValue({
      data: {
        current_streak: 9,
        longest_streak: 9,
        last_activity_date: yesterdayStr,
      },
    })

    const updateEq = vi.fn()
    mockUpdate.mockReturnValue({ eq: updateEq })

    await updateStreak('user-123')

    const updateArg = mockUpdate.mock.calls[0][0]
    expect(updateArg.current_streak).toBe(10)
    expect(updateArg.longest_streak).toBe(10)
  })
})
