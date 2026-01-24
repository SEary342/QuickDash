/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import Link from './Link'
import { LinkData } from '../../types/linkData'
import * as storeActions from '../../store/store'

// Mock dependencies
const dispatchMock = vi.fn()
vi.mock('react-redux', () => ({
  useDispatch: () => dispatchMock,
}))

vi.mock('../../store/store', () => ({
  deleteLinkData: vi.fn(),
  reorderLinkData: vi.fn(),
  updateLinkData: vi.fn(),
}))

vi.mock('../../types/colors', () => ({
  getColorLookup: () => ({
    text: 'text-class',
    background: 'bg-class',
    outlineText: 'outline-text-class',
    outlineBorder: 'outline-border-class',
    hoverColor: 'hover-class',
  }),
}))

vi.mock('../../types/icons', () => ({
  iconTranslation: {
    'test-icon': 'path-data',
  },
}))

vi.mock('@mdi/react', () => ({
  default: () => <div data-testid="mdi-icon" />,
}))

vi.mock('../IconBtn', () => ({
  default: ({ onClick, tooltipText }: any) => (
    <button onClick={onClick} data-testid={`icon-btn-${tooltipText}`}>
      {tooltipText}
    </button>
  ),
}))

vi.mock('../LinkDialog', () => ({
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="link-dialog">
        <button data-testid="save-dialog" onClick={() => onClose({ text: 'Updated' })}>
          Save
        </button>
        <button data-testid="delete-dialog" onClick={() => onClose(undefined, true)}>
          Delete
        </button>
        <button data-testid="close-dialog" onClick={() => onClose()}>
          Cancel
        </button>
      </div>
    ) : null,
}))

vi.mock('../Tooltip/Tooltip', () => ({
  default: ({ children, text }: any) => (
    <div data-testid="tooltip" title={text}>
      {children}
    </div>
  ),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('Link Component', () => {
  const mockLinkData: LinkData = {
    text: 'Test Link',
    url: 'https://example.com',
    color: 'blue',
    outline: false,
    icon: 'test-icon',
    description: 'Test Description',
  }

  const defaultProps = {
    pageId: 0,
    panelId: 0,
    id: 0,
    item: mockLinkData,
    upArrow: true,
    downArrow: true,
    editMode: false,
  }

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('renders link correctly', () => {
    render(<Link {...defaultProps} />)
    const linkElement = screen.getByText('Test Link')
    expect(linkElement).toBeInTheDocument()
    // Check if Tooltip wrapper is present
    expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Test Description')
  })

  it('opens link in new tab on click', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    render(<Link {...defaultProps} />)
    const linkElement = screen.getByText('Test Link')
    fireEvent.click(linkElement)
    expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener noreferrer')
    openSpy.mockRestore()
  })

  it('shows edit controls when editMode is true', () => {
    render(<Link {...defaultProps} editMode={true} />)
    expect(screen.getByTestId('icon-btn-Move Up')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Move Down')).toBeInTheDocument()
    expect(screen.getByTestId('icon-btn-Edit Link')).toBeInTheDocument()
  })

  it('does not show edit controls when editMode is false', () => {
    render(<Link {...defaultProps} editMode={false} />)
    expect(screen.queryByTestId('icon-btn-Move Up')).not.toBeInTheDocument()
  })

  it('dispatches reorderLinkData when move up is clicked', () => {
    render(<Link {...defaultProps} editMode={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Move Up'))
    expect(storeActions.reorderLinkData).toHaveBeenCalledWith({
      pageIndex: 0,
      groupIndex: 0,
      fromIndex: 0,
      toIndex: -1,
    })
    expect(dispatchMock).toHaveBeenCalled()
  })

  it('opens edit dialog when edit button is clicked', () => {
    render(<Link {...defaultProps} editMode={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Edit Link'))
    expect(screen.getByTestId('link-dialog')).toBeInTheDocument()
  })

  it('dispatches deleteLinkData when dialog deletes', () => {
    render(<Link {...defaultProps} editMode={true} />)
    fireEvent.click(screen.getByTestId('icon-btn-Edit Link'))
    fireEvent.click(screen.getByTestId('delete-dialog'))

    expect(storeActions.deleteLinkData).toHaveBeenCalledWith({
      pageIndex: 0,
      groupIndex: 0,
      linkIndex: 0,
    })
    expect(dispatchMock).toHaveBeenCalled()
    expect(screen.queryByTestId('link-dialog')).not.toBeInTheDocument()
  })
})