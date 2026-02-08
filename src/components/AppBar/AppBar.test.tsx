import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { setFontSize, setNumberOfColumns } from '@src/store/store'
import { LinkPage } from '@src/types/linkPage'

import { exportConfig } from '@comp/ExportUtils'

import AppBar from './AppBar'

// Mock dependencies
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(),
}))

vi.mock('@src/store/store', () => ({
  setNumberOfColumns: vi.fn(),
  setFontSize: vi.fn(),
}))

vi.mock('@comp/ExportReminder', () => ({
  default: () => <div data-testid="export-reminder" />,
}))

vi.mock('@comp/ExportUtils', () => ({
  exportConfig: vi.fn(),
}))

vi.mock('@comp/FileImportDialog', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="import-dialog">
        Import Dialog
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}))

vi.mock('@comp/IconBtn', () => ({
  default: ({
    onClick,
    tooltipText,
    disabled,
  }: {
    onClick: () => void
    tooltipText: string
    disabled?: boolean
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={tooltipText}>
      {tooltipText}
    </button>
  ),
}))

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

describe('AppBar Component', () => {
  const mockDispatch = vi.fn()
  const mockLinkPages: LinkPage[] = [{ name: 'Page 1', groupList: [] }]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
    // Default selector return
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: {
          numberOfColumns: 3,
          fontSize: 16,
        },
      }),
    )
  })

  test('renders correctly', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    expect(screen.getByText('QuickDash')).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
  })

  test('toggles settings dropdown', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    const settingsBtn = screen.getByLabelText('Settings')

    // Open
    fireEvent.click(settingsBtn)
    expect(screen.getByText('Import')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()

    // Close
    fireEvent.click(settingsBtn)
    expect(screen.queryByText('Import')).not.toBeInTheDocument()
  })

  test('handles column increase', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const increaseBtn = screen.getByLabelText('Increase Columns')
    fireEvent.click(increaseBtn)

    expect(setNumberOfColumns).toHaveBeenCalledWith(4)
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles column decrease', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const decreaseBtn = screen.getByLabelText('Decrease Columns')
    fireEvent.click(decreaseBtn)

    expect(setNumberOfColumns).toHaveBeenCalledWith(2)
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('respects column limits (max)', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { numberOfColumns: 6, fontSize: 16 },
      }),
    )

    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const increaseBtn = screen.getByLabelText('Increase Columns')
    expect(increaseBtn).toBeDisabled()
    fireEvent.click(increaseBtn)
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  test('respects column limits (min)', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { numberOfColumns: 1, fontSize: 16 },
      }),
    )

    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const decreaseBtn = screen.getByLabelText('Decrease Columns')
    expect(decreaseBtn).toBeDisabled()
    fireEvent.click(decreaseBtn)
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  test('handles font size increase', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const increaseBtn = screen.getByLabelText('Larger Text')
    fireEvent.click(increaseBtn)

    expect(setFontSize).toHaveBeenCalledWith(17)
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles font size decrease', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const decreaseBtn = screen.getByLabelText('Smaller Text')
    fireEvent.click(decreaseBtn)

    expect(setFontSize).toHaveBeenCalledWith(15)
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles export', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const exportBtn = screen.getByText('Export')
    fireEvent.click(exportBtn)

    expect(exportConfig).toHaveBeenCalledWith('QuickDashConfig', '.QDconfig', mockLinkPages)
    expect(screen.queryByText('Export')).not.toBeInTheDocument()
  })

  test('handles import dialog', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    fireEvent.click(screen.getByLabelText('Settings'))

    const importBtn = screen.getByText('Import')
    fireEvent.click(importBtn)

    expect(screen.getByTestId('import-dialog')).toBeInTheDocument()

    // Close import
    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByTestId('import-dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Import')).not.toBeInTheDocument()
  })

  test('closes dropdown when clicking outside', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <AppBar linkPages={mockLinkPages} />
      </div>,
    )

    fireEvent.click(screen.getByLabelText('Settings'))
    expect(screen.getByText('Import')).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(screen.queryByText('Import')).not.toBeInTheDocument()
  })

  test('updates document font size effect', () => {
    render(<AppBar linkPages={mockLinkPages} />)
    expect(document.documentElement.style.fontSize).toBe('16px')
  })
})
