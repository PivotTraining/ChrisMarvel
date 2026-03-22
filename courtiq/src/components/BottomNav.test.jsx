import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import BottomNav from './BottomNav'

vi.mock('../lib/native', () => ({
  hapticSelection: vi.fn(),
  isNative: false,
}))

describe('BottomNav', () => {
  const renderNav = () =>
    render(
      <MemoryRouter>
        <BottomNav />
      </MemoryRouter>
    )

  it('renders 5 navigation items', () => {
    renderNav()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('renders correct labels', () => {
    renderNav()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Log')).toBeInTheDocument()
    expect(screen.getByText('Train')).toBeInTheDocument()
    expect(screen.getByText('Stats')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('has a navigation landmark', () => {
    renderNav()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders links with correct aria-labels', () => {
    renderNav()
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('Log')).toBeInTheDocument()
    expect(screen.getByLabelText('Train')).toBeInTheDocument()
    expect(screen.getByLabelText('Stats')).toBeInTheDocument()
    expect(screen.getByLabelText('Profile')).toBeInTheDocument()
  })
})
