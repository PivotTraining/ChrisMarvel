import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import NotFound from './NotFound'

vi.mock('../lib/native', () => ({
  hapticImpact: vi.fn(),
  isNative: false,
}))

describe('NotFound', () => {
  const renderNotFound = () =>
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )

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
    expect(
      screen.getByText(/doesn't exist or has been moved/i)
    ).toBeInTheDocument()
  })

  it('renders a Back to Home button', () => {
    renderNotFound()
    expect(screen.getByText('Back to Home')).toBeInTheDocument()
  })
})
