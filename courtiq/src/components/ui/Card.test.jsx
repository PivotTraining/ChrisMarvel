import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('calls onClick when provided and clicked', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable card</Card>)
    fireEvent.click(screen.getByText('Clickable card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has cursor-pointer class when onClick is provided', () => {
    const { container } = render(<Card onClick={() => {}}>Clickable</Card>)
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })

  it('does not have cursor-pointer class when onClick is not provided', () => {
    const { container } = render(<Card>Static</Card>)
    expect(container.firstChild).not.toHaveClass('cursor-pointer')
  })
})
