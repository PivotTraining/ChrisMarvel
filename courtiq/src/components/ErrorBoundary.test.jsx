import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

vi.mock('../lib/monitoring', () => ({
  trackError: vi.fn(),
}))

function ThrowingComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Child content</div>
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
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
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('Try Again button resets error state', () => {
    // Use a flag to control throwing behavior
    let shouldThrow = true

    function ConditionalThrower() {
      if (shouldThrow) {
        throw new Error('Test error')
      }
      return <div>Child content</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    // Stop throwing before clicking Try Again
    shouldThrow = false
    fireEvent.click(screen.getByText('Try Again'))

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('shows network error message for fetch errors', () => {
    function NetworkErrorComponent() {
      throw new TypeError('Failed to fetch')
    }

    render(
      <ErrorBoundary>
        <NetworkErrorComponent />
      </ErrorBoundary>
    )
    expect(screen.getByText('Connection problem')).toBeInTheDocument()
  })

  it('shows Refresh page button', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByText('Refresh page')).toBeInTheDocument()
  })
})
