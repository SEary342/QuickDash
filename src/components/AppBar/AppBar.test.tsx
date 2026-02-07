import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockLinkPages } from '@src/tests/MockData'

import AppBar from './AppBar'

// Mock Redux hooks
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

// Mock ExportReminder to avoid store access
vi.mock('@comp/ExportReminder', () => ({
  default: () => null,
}))

describe('AppBar Component', () => {
  beforeEach(() => {
    render(<AppBar linkPages={mockLinkPages} />)
  })

  it('renders the AppBar with QuickDash title', () => {
    expect(screen.getByText('QuickDash')).toBeInTheDocument()
  })

  it('renders the Settings button', () => {
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders the Export button', () => {
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)
    expect(screen.getByText('Export')).toBeInTheDocument()
  })

  it('renders the Import button', () => {
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)
    expect(screen.getByText('Import')).toBeInTheDocument()
  })

  it('renders the Columns section', () => {
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)
    expect(screen.getByText('Columns')).toBeInTheDocument()
  })

  it('renders the App Version text', () => {
    const settingsButton = screen.getByRole('button')
    fireEvent.click(settingsButton)
    expect(screen.getByText(/App Version/i)).toBeInTheDocument()
  })
})
