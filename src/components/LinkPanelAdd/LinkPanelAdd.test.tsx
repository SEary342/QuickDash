import { fireEvent, render, screen } from '@testing-library/react'
import { useDispatch } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { addLinkGroup } from '@src/store/store'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import LinkPanelAdd from './LinkPanelAdd'

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('@src/store/store', () => ({
  addLinkGroup: vi.fn(),
}))

vi.mock('@src/types/colors', () => ({
  getColorLookup: () => ({
    text: 'text-black',
    background: 'bg-white',
    hoverColor: 'hover:bg-gray-100',
  }),
}))

// Mock child components
vi.mock('@comp/IconBtn', () => ({
  default: ({ onClick, tooltipText }: { onClick: () => void; tooltipText: string }) => (
    <button data-testid="add-group-btn" onClick={onClick}>
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
    onClose: (page?: LinkPage, group?: LinkGroup) => void
  }) =>
    isOpen ? (
      <div data-testid="group-dialog">
        <button
          data-testid="save-group"
          onClick={() => onClose(undefined, { name: 'New Group', linkList: [] } as LinkGroup)}
        >
          Save
        </button>
        <button data-testid="cancel-group" onClick={() => onClose()}>
          Cancel
        </button>
      </div>
    ) : null,
}))

describe('LinkPanelAdd', () => {
  const mockDispatch = vi.fn()
  const pageId = 1

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
  })

  test('renders correctly', () => {
    render(<LinkPanelAdd pageId={pageId} />)
    expect(screen.getByText('Add Group', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByTestId('add-group-btn')).toBeInTheDocument()
  })

  test('opens dialog on button click', () => {
    render(<LinkPanelAdd pageId={pageId} />)
    expect(screen.queryByTestId('group-dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('add-group-btn'))
    expect(screen.getByTestId('group-dialog')).toBeInTheDocument()
  })

  test('dispatches addLinkGroup when dialog saves', () => {
    render(<LinkPanelAdd pageId={pageId} />)
    fireEvent.click(screen.getByTestId('add-group-btn'))

    fireEvent.click(screen.getByTestId('save-group'))

    expect(addLinkGroup).toHaveBeenCalledWith({
      pageIndex: pageId,
      group: expect.objectContaining({ name: 'New Group' }),
    })
    expect(mockDispatch).toHaveBeenCalled()
    expect(screen.queryByTestId('group-dialog')).not.toBeInTheDocument()
  })

  test('closes dialog without dispatching on cancel', () => {
    render(<LinkPanelAdd pageId={pageId} />)
    fireEvent.click(screen.getByTestId('add-group-btn'))

    fireEvent.click(screen.getByTestId('cancel-group'))

    expect(addLinkGroup).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(screen.queryByTestId('group-dialog')).not.toBeInTheDocument()
  })
})
