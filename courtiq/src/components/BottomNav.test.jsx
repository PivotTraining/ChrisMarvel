import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import BottomNav from './BottomNav'

// Mock native haptics
vi.mock('../lib/native', () => ({
  hapticSelection: vi.fn(),
}))

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <BottomNav />
    </MemoryRouter>
  )
}

describe('BottomNav', () => {
  it('renders a navigation element', () => {
    renderWithRouter()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('renders 5 navigation items', () => {
    renderWithRouter()
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(5)
  })

  it('renders correct labels', () => {
    renderWithRouter()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Log')).toBeInTheDocument()
    expect(screen.getByText('Train')).toBeInTheDocument()
    expect(screen.getByText('Stats')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
  })

  it('has aria-label on each nav link', () => {
    renderWithRouter()
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByLabelText('Log')).toBeInTheDocument()
    expect(screen.getByLabelText('Train')).toBeInTheDocument()
    expect(screen.getByLabelText('Stats')).toBeInTheDocument()
    expect(screen.getByLabelText('Profile')).toBeInTheDocument()
  })

  it('renders links with correct hrefs', () => {
    renderWithRouter()
    expect(screen.getByLabelText('Home')).toHaveAttribute('href', '/')
    expect(screen.getByLabelText('Log')).toHaveAttribute('href', '/log')
    expect(screen.getByLabelText('Train')).toHaveAttribute('href', '/train')
    expect(screen.getByLabelText('Stats')).toHaveAttribute('href', '/analytics')
    expect(screen.getByLabelText('Profile')).toHaveAttribute('href', '/profile')
  })
})
