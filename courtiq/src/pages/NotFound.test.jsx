import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NotFound from './NotFound'

// Mock native haptics (used by Button)
vi.mock('../lib/native', () => ({
  hapticImpact: vi.fn(),
}))

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  )
}

describe('NotFound', () => {
  it('renders 404 text', () => {
    renderNotFound()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders "Page not found" message', () => {
    renderNotFound()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('renders a description', () => {
    renderNotFound()
    expect(screen.getByText(/doesn't exist or has been moved/)).toBeInTheDocument()
  })

  it('renders a Back to Home button', () => {
    renderNotFound()
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument()
  })
})
