import { fireEvent, render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { exportConfig } from '@comp/ExportUtils'

import ExportReminder from './ExportReminder'

// Mock Redux hooks
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

// Mock export utility
vi.mock('@comp/ExportUtils', () => ({
  exportConfig: vi.fn(),
}))

describe('ExportReminder Component', () => {
  const mockLinkPages = [
    { id: '1', name: 'Page 1', columns: [] },
    { id: '2', name: 'Page 2', columns: [] },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })
  })

  it('does not render when there are no link pages', () => {
    vi.mocked(useSelector).mockReturnValue([])
    render(<ExportReminder />)
    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
  })

  it('does not render when the reminder cookie exists', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    document.cookie = 'last_export_reminder=true'
    render(<ExportReminder />)
    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
  })

  it('renders when there are link pages and no cookie', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)
    expect(screen.getByText(/Backup your data/i)).toBeInTheDocument()
    expect(screen.getByText(/You have 2 pages configured/i)).toBeInTheDocument()
  })

  it('dismisses the reminder when "Remind me later" is clicked', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)

    const dismissButton = screen.getByText(/Remind me later/i)
    fireEvent.click(dismissButton)

    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).toContain('last_export_reminder=true')
  })

  it('dismisses the reminder when the close icon is clicked', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)

    // The close icon button is the only button without text content in this component
    const buttons = screen.getAllByRole('button')
    const closeButton = buttons.find((btn) => !btn.textContent)

    expect(closeButton).toBeDefined()
    fireEvent.click(closeButton!)

    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).toContain('last_export_reminder=true')
  })

  it('exports configuration and dismisses when "Export" is clicked', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)

    const exportButton = screen.getByRole('button', { name: /Export/i })
    fireEvent.click(exportButton)

    expect(exportConfig).toHaveBeenCalledWith('QuickDashConfig', '.QDconfig', mockLinkPages)
    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).toContain('last_export_reminder=true')
  })

  it('displays singular text for one page', () => {
    vi.mocked(useSelector).mockReturnValue([mockLinkPages[0]])
    render(<ExportReminder />)
    expect(screen.getByText(/You have 1 page configured/i)).toBeInTheDocument()
  })
})
