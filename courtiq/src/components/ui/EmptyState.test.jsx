import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EmptyState from './EmptyState'

// Simple mock icon component
function MockIcon(props) {
  return <svg data-testid="mock-icon" {...props} />
}

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data yet" />)
    expect(screen.getByText('No data yet')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Start by adding items" />)
    expect(screen.getByText('Start by adding items')).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Empty" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })

  it('renders icon when provided', () => {
    render(<EmptyState icon={MockIcon} title="Empty" />)
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })
})
