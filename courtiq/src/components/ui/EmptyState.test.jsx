import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import EmptyState from './EmptyState'

function MockIcon(props) {
  return <svg data-testid="mock-icon" {...props} />
}

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data found" />)
    expect(screen.getByText('No data found')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Nothing to show here" />)
    expect(screen.getByText('Nothing to show here')).toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<EmptyState icon={MockIcon} title="Empty" />)
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('does not render icon when not provided', () => {
    render(<EmptyState title="No icon" />)
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument()
  })

  it('renders action when provided', () => {
    render(<EmptyState title="Empty" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="Title only" />)
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs.length).toBe(0)
  })
})
