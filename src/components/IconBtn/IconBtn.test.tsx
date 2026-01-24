import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import IconBtn from './IconBtn'
import { mdiPlus, mdiMinus } from '@mdi/js'
import { TooltipProps } from '../Tooltip/Tooltip'

// Mock Tooltip to isolate IconBtn testing
vi.mock('../Tooltip/Tooltip', () => ({
  default: ({ children, text, position, disabled }: TooltipProps) => (
    <div
      data-testid="tooltip-mock"
      data-text={text}
      data-position={position}
      data-disabled={disabled ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
}))

describe('IconBtn Component', () => {
  const onClickMock = vi.fn()
  const defaultProps = {
    path: mdiPlus,
    tooltipText: 'Add Item',
    color: 'text-blue-500',
    onClick: onClickMock,
  }

  beforeEach(() => {
    onClickMock.mockClear()
  })

  it('renders correctly with required props', () => {
    render(<IconBtn {...defaultProps} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('cursor-pointer')

    // Check if icon is rendered
    const svg = button.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('text-blue-500')
    const path = svg?.querySelector('path')
    expect(path).toHaveAttribute('d', mdiPlus)
  })

  it('renders auxiliary icon when auxPath is provided', () => {
    render(<IconBtn {...defaultProps} auxPath={mdiMinus} />)
    const button = screen.getByRole('button')
    const svgs = button.querySelectorAll('svg')
    expect(svgs).toHaveLength(2)
    expect(svgs[1].querySelector('path')).toHaveAttribute('d', mdiMinus)
  })

  it('applies custom className', () => {
    render(<IconBtn {...defaultProps} className="custom-test-class" />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-test-class')
  })

  it('handles click events', () => {
    render(<IconBtn {...defaultProps} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('does not fire click event when disabled', () => {
    render(<IconBtn {...defaultProps} disabled={true} />)
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
    expect(button).not.toHaveClass('cursor-pointer')

    fireEvent.click(button)
    expect(onClickMock).not.toHaveBeenCalled()
  })

  it('passes correct props to Tooltip', () => {
    render(<IconBtn {...defaultProps} tooltipPosition="left" disabled={true} />)
    const tooltip = screen.getByTestId('tooltip-mock')

    expect(tooltip).toHaveAttribute('data-text', 'Add Item')
    expect(tooltip).toHaveAttribute('data-position', 'left')
    expect(tooltip).toHaveAttribute('data-disabled', 'true')
  })

  it('uses default tooltip position if not provided', () => {
    render(<IconBtn {...defaultProps} />)
    const tooltip = screen.getByTestId('tooltip-mock')
    expect(tooltip).toHaveAttribute('data-position', 'top')
  })
})