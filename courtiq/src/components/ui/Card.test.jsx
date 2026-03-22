import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Card content</p></Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<Card className="my-custom">Content</Card>)
    expect(container.firstChild).toHaveClass('my-custom')
  })

  it('calls onClick when provided and clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable</Card>)
    await user.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('has cursor-pointer class when onClick is provided', () => {
    const { container } = render(<Card onClick={() => {}}>Clickable</Card>)
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })

  it('does not have cursor-pointer class without onClick', () => {
    const { container } = render(<Card>Static</Card>)
    expect(container.firstChild).not.toHaveClass('cursor-pointer')
  })
})
