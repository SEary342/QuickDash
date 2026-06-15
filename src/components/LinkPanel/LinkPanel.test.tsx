import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { deleteLinkGroup, reorderLinkGroups, updateLinkGroup } from '@src/store/store'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import LinkPanel from './LinkPanel'

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      // Filter out motion props to avoid React warnings
      initial, // eslint-disable-line @typescript-eslint/no-unused-vars
      animate, // eslint-disable-line @typescript-eslint/no-unused-vars
      exit, // eslint-disable-line @typescript-eslint/no-unused-vars
      transition, // eslint-disable-line @typescript-eslint/no-unused-vars
      layout, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      exit?: unknown
      transition?: unknown
      layout?: unknown
    }) => <div {...props}>{children}</div>,
  },
}))

vi.mock('@src/store/store', () => ({
  deleteLinkGroup: vi.fn(),
  reorderLinkGroups: vi.fn(),
  updateLinkGroup: vi.fn(),
}))

vi.mock('@src/types/colors', () => ({
  getColorLookup: () => ({
    text: 'text-black',
    background: 'bg-white',
    hoverColor: 'hover:bg-gray-100',
    focus: 'focus:ring',
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

vi.mock('@comp/IconBtn', () => ({
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
    onClose: (page?: LinkPage, group?: LinkGroup, remove?: boolean) => void
  }) =>
    isOpen ? (
      <div data-testid="panel-dialog">
        <button
          data-testid="dialog-save"
          onClick={() => onClose(undefined, { name: 'Updated Group', linkList: [] }, false)}
        >
          Save
        </button>
        <button data-testid="dialog-delete" onClick={() => onClose(undefined, undefined, true)}>
          Delete
        </button>
        <button data-testid="dialog-cancel" onClick={() => onClose()}>
          Cancel
        </button>
      </div>
    ) : null,
}))

vi.mock('@comp/Link', () => ({
  default: ({ item }: { item: { text: string } }) => <div>{item.text}</div>,
}))

vi.mock('@comp/LinkAdd', () => ({
  default: () => <div data-testid="link-add">Add Link</div>,
}))

describe('LinkPanel', () => {
  const mockDispatch = vi.fn()
  const defaultProps = {
    pageId: 0,
    panelId: 1,
    linkGroup: {
      name: 'Test Group',
      linkList: [
        { text: 'Link 1', url: 'http://test.com', color: 'red', icon: 'icon', outline: false },
      ],
      icon: 'mdi-icon',
      color: 'blue',
    } as LinkGroup,
    moveUp: true,
    moveDown: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
  })

  test('renders correctly', () => {
    render(<LinkPanel {...defaultProps} />)
    expect(screen.getByText('Test Group')).toBeInTheDocument()
    expect(screen.getByText('Link 1')).toBeInTheDocument()
    expect(screen.getByTestId('mdi-icon')).toBeInTheDocument()
  })

  test('toggles edit controls', () => {
    render(<LinkPanel {...defaultProps} />)

    // Initially edit controls are hidden (except the toggle button)
    expect(screen.queryByTestId('icon-btn-Edit Group')).not.toBeInTheDocument()

    const toggleBtn = screen.getByTestId('icon-btn-Show Controls')
    fireEvent.click(toggleBtn)

    expect(screen.getByTestId('icon-btn-Edit Group')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Move Up')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Move Down')).toBeInTheDocument()
    expect(screen.getByTestId('link-add')).toBeInTheDocument()

    // Toggle back
    const hideBtn = screen.getByTestId('icon-btn-Hide Controls')
    fireEvent.click(hideBtn)

    expect(screen.queryByTestId('icon-btn-Edit Group')).not.toBeInTheDocument()
  })

  test('opens edit dialog and handles update', () => {
    render(<LinkPanel {...defaultProps} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))
    fireEvent.click(screen.getByTestId('icon-btn-Edit Group'))

    expect(screen.getByTestId('panel-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('dialog-save'))
    expect(updateLinkGroup).toHaveBeenCalledWith({
      pageIndex: 0,
      groupIndex: 1,
      group: expect.objectContaining({ name: 'Updated Group' }),
    })
  })

  test('handles group deletion', () => {
    render(<LinkPanel {...defaultProps} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))
    fireEvent.click(screen.getByTestId('icon-btn-Edit Group'))

    fireEvent.click(screen.getByTestId('dialog-delete'))
    expect(deleteLinkGroup).toHaveBeenCalledWith({ pageIndex: 0, groupIndex: 1 })
  })

  test('handles reordering', () => {
    render(<LinkPanel {...defaultProps} />)
    fireEvent.click(screen.getByTestId('icon-btn-Show Controls'))

    fireEvent.click(screen.getByTestId('icon-btn-Move Up'))
    expect(reorderLinkGroups).toHaveBeenCalledWith({ pageIndex: 0, fromIndex: 1, toIndex: 0 })

    fireEvent.click(screen.getByTestId('icon-btn-Move Down'))
    expect(reorderLinkGroups).toHaveBeenCalledWith({ pageIndex: 0, fromIndex: 1, toIndex: 2 })
  })
})
