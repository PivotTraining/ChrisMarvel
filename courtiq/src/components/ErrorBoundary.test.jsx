import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

// Mock monitoring module
vi.mock('../lib/monitoring', () => ({
  trackError: vi.fn(),
}))

// Component that throws on demand
function ThrowingChild({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Child content</div>
}

// Suppress React error boundary console noise
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('shows fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('shows network error message for network errors', () => {
    function NetworkErrorChild() {
      throw new Error('Failed to fetch')
    }
    render(
      <ErrorBoundary>
        <NetworkErrorChild />
      </ErrorBoundary>
    )
    expect(screen.getByText('Connection problem')).toBeInTheDocument()
  })

  it('recovers when Try Again is clicked', async () => {
    const user = userEvent.setup()
    let shouldThrow = true

    function ConditionalThrow() {
      if (shouldThrow) throw new Error('Boom')
      return <div>Recovered</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    shouldThrow = false
    await user.click(screen.getByText('Try Again'))

    expect(screen.getByText('Recovered')).toBeInTheDocument()
  })
})
