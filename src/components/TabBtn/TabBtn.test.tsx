import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { reorderLinkPages, updateLinkPage } from '@src/store/store'
import { LinkPage } from '@src/types/linkPage'

import TabBtn from './TabBtn'

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li {...props}>{children}</li>
    ),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

vi.mock('@src/store/store', () => ({
  reorderLinkPages: vi.fn(),
  updateLinkPage: vi.fn(),
}))

vi.mock('@src/types/colors', () => ({
  getColorLookup: () => ({
    text: 'text-black',
    background: 'bg-white',
    hoverColor: 'hover:bg-gray-100',
    border: 'border-black',
  }),
}))

vi.mock('@src/types/icons', () => ({
  iconTranslation: {
    'mdi-icon': 'path-data',
  },
}))

// Mock child components
vi.mock('@mdi/react', () => ({
  Icon: () => <div data-testid="mdi-icon" />,
}))

vi.mock('@comp/IconBtn/IconBtn', () => ({
  default: ({ onClick, tooltipText }: { onClick: () => void; tooltipText: string }) => (
    <button data-testid={`icon-btn-${tooltipText}`} onClick={onClick}>
      {tooltipText}
    </button>
  ),
}))

vi.mock('@comp/DashGroupDialog', () => ({
  default: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean
    onClose: (page?: LinkPage, group?: unknown, remove?: boolean) => void
  }) =>
    isOpen ? (
      <div data-testid="edit-dialog">
        <button
          data-testid="save-dialog"
          onClick={() => onClose({ name: 'Updated Page', groupList: [] } as LinkPage)}
        >
          Save
        </button>
        <button data-testid="delete-dialog" onClick={() => onClose(undefined, undefined, true)}>
          Delete
        </button>
        <button data-testid="cancel-dialog" onClick={() => onClose()}>
          Cancel
        </button>
      </div>
    ) : null,
}))

describe('TabBtn', () => {
  const mockDispatch = vi.fn()
  const mockTabSelect = vi.fn()
  const mockOnRemove = vi.fn()

  const defaultProps = {
    id: 0,
    linkPage: {
      name: 'Test Page',
      icon: 'mdi-icon',
      color: 'blue',
      groupList: [],
    } as LinkPage,
    chevronLeft: true,
    chevronRight: true,
    tabSelectFunc: mockTabSelect,
    onRemove: mockOnRemove,
    selected: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
  })

  test('renders correctly', () => {
    render(<TabBtn {...defaultProps} />)
    expect(screen.getByText('Test Page')).toBeInTheDocument()
    expect(screen.getByTestId('mdi-icon')).toBeInTheDocument()
  })

  test('calls tabSelectFunc on click', () => {
    render(<TabBtn {...defaultProps} />)
    fireEvent.click(screen.getByText('Test Page'))
    expect(mockTabSelect).toHaveBeenCalledWith(0)
  })

  test('does not show controls when not selected', () => {
    render(<TabBtn {...defaultProps} selected={false} />)
    expect(screen.queryByTestId('icon-btn-Show Controls')).not.toBeInTheDocument()
  })

  test('shows controls toggle when selected', () => {
    render(<TabBtn {...defaultProps} selected={true} />)
    expect(screen.getByTestId('icon-btn-Show Controls')).toBeInTheDocument()
  })

  test('toggles edit controls', () => {
    render(<TabBtn {...defaultProps} selected={true} />)

    // Open controls
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))

    expect(screen.getByTestId('icon-btn-Edit Dash')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Move Dash Left')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Move Dash Right')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Hide Controls')).toBeInTheDocument()

    // Close controls
    fireEvent.click(screen.getByTestId('icon-btn-Hide Controls'))
    expect(screen.queryByTestId('icon-btn-Edit Dash')).not.toBeInTheDocument()
  })

  test('handles move left', () => {
    render(<TabBtn {...defaultProps} selected={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))

    fireEvent.click(screen.getByTestId('icon-btn-Move Dash Left'))
    expect(reorderLinkPages).toHaveBeenCalledWith({ fromIndex: 0, toIndex: -1 })
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles move right', () => {
    render(<TabBtn {...defaultProps} selected={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))

    fireEvent.click(screen.getByTestId('icon-btn-Move Dash Right'))
    expect(reorderLinkPages).toHaveBeenCalledWith({ fromIndex: 0, toIndex: 1 })
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('opens edit dialog and saves', () => {
    render(<TabBtn {...defaultProps} selected={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))

    fireEvent.click(screen.getByTestId('icon-btn-Edit Dash'))
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('save-dialog'))
    expect(updateLinkPage).toHaveBeenCalledWith({
      index: 0,
      data: expect.objectContaining({ name: 'Updated Page' }),
    })
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles delete from dialog', () => {
    render(<TabBtn {...defaultProps} selected={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))
    fireEvent.click(screen.getByTestId('icon-btn-Edit Dash'))

    fireEvent.click(screen.getByTestId('delete-dialog'))
    expect(mockOnRemove).toHaveBeenCalledWith(0)
  })
})
