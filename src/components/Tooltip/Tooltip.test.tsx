import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import Tooltip from './Tooltip'

describe('Tooltip Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders children correctly', () => {
    render(
      <Tooltip text="Tooltip Text">
        <button>Hover me</button>
      </Tooltip>,
    )
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on mouse enter and hides on mouse leave', async () => {
    render(
      <Tooltip text="Tooltip Text">
        <button>Hover me</button>
      </Tooltip>,
    )

    const button = screen.getByText('Hover me')

    // Tooltip should not be visible initially
    expect(screen.queryByText('Tooltip Text')).not.toBeInTheDocument()

    // Mouse enter
    fireEvent.mouseEnter(button)
    expect(await screen.findByText('Tooltip Text')).toBeInTheDocument()

    // Mouse leave
    fireEvent.mouseLeave(button)
    expect(screen.queryByText('Tooltip Text')).not.toBeInTheDocument()
  })

  it('does not show tooltip when disabled', () => {
    render(
      <Tooltip text="Tooltip Text" disabled>
        <button>Hover me</button>
      </Tooltip>,
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)
    expect(screen.queryByText('Tooltip Text')).not.toBeInTheDocument()
  })

  it('does not show tooltip when text is not provided', () => {
    render(
      <Tooltip>
        <button>Hover me</button>
      </Tooltip>,
    )

    const button = screen.getByText('Hover me')
    fireEvent.mouseEnter(button)
    // We can't search by text if there is no text, but we can check if portal content is rendered.
    // However, the component logic is: {showTooltip && text && createPortal(...)}
    // So if text is undefined, createPortal is not called.
    // We can verify nothing with tooltip class exists.
    const tooltip = document.querySelector('.fixed.px-2.py-1')
    expect(tooltip).not.toBeInTheDocument()
  })

  it('calls original onMouseEnter and onMouseLeave handlers', () => {
    const onMouseEnter = vi.fn()
    const onMouseLeave = vi.fn()

    render(
      <Tooltip text="Tooltip Text">
        <button onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          Hover me
        </button>
      </Tooltip>,
    )

    const button = screen.getByText('Hover me')

    fireEvent.mouseEnter(button)
    expect(onMouseEnter).toHaveBeenCalled()

    fireEvent.mouseLeave(button)
    expect(onMouseLeave).toHaveBeenCalled()
  })
})
