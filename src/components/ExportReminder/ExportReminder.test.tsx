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

  it('asks before setting the reminder cookie when "Remind me later" is clicked', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)

    const dismissButton = screen.getByText(/Remind me later/i)
    fireEvent.click(dismissButton)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.cookie).not.toContain('last_export_reminder=true')

    fireEvent.click(screen.getByRole('button', { name: /Accept/i }))

    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).toContain('last_export_reminder=true')
  })

  it('does not save a cookie when consent is declined and shows the reminder after reload', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    const { unmount } = render(<ExportReminder />)

    fireEvent.click(screen.getByRole('button', { name: /Dismiss reminder/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Decline/i }))

    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).not.toContain('last_export_reminder=true')

    unmount()
    render(<ExportReminder />)
    expect(screen.getByText(/Backup your data/i)).toBeInTheDocument()
  })

  it('exports configuration and asks before setting the reminder cookie', () => {
    vi.mocked(useSelector).mockReturnValue(mockLinkPages)
    render(<ExportReminder />)

    const exportButton = screen.getByRole('button', { name: /Export/i })
    fireEvent.click(exportButton)

    expect(exportConfig).toHaveBeenCalledWith('QuickDashConfig', '.QDconfig', mockLinkPages)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(document.cookie).not.toContain('last_export_reminder=true')

    fireEvent.click(screen.getByRole('button', { name: /Accept/i }))
    expect(screen.queryByText(/Backup your data/i)).not.toBeInTheDocument()
    expect(document.cookie).toContain('last_export_reminder=true')
  })

  it('displays singular text for one page', () => {
    vi.mocked(useSelector).mockReturnValue([mockLinkPages[0]])
    render(<ExportReminder />)
    expect(screen.getByText(/You have 1 page configured/i)).toBeInTheDocument()
  })
})
