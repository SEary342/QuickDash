import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LinkAdd from './LinkAdd'
import { addLinkData } from '../../store/store'

// Mock react-redux
const mockDispatch = vi.fn()
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

// Mock LinkDialog
vi.mock('../LinkDialog', () => ({
  default: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean
    onClose: (data?: { text: string; url: string }) => void
  }) =>
    isOpen ? (
      <div data-testid="mock-link-dialog">
        <button
          onClick={() =>
            onClose({ text: 'Test Link', url: 'https://test.com' })
          }
        >
          Save
        </button>
        <button onClick={() => onClose()}>Cancel</button>
      </div>
    ) : null,
}))

// Mock store actions
vi.mock('../../store/store', () => ({
  addLinkData: vi.fn(() => ({ type: 'addLinkData' })),
}))

describe('LinkAdd Component', () => {
  const pageId = 1
  const panelId = 2

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the Add Link button', () => {
    render(<LinkAdd pageId={pageId} panelId={panelId} />)
    expect(screen.getByText('Add Link')).toBeInTheDocument()
  })

  it('opens the dialog when clicked', () => {
    render(<LinkAdd pageId={pageId} panelId={panelId} />)

    expect(screen.queryByTestId('mock-link-dialog')).not.toBeInTheDocument()

    fireEvent.click(screen.getByText('Add Link'))

    expect(screen.getByTestId('mock-link-dialog')).toBeInTheDocument()
  })

  it('dispatches addLinkData when saving from dialog', () => {
    render(<LinkAdd pageId={pageId} panelId={panelId} />)

    fireEvent.click(screen.getByText('Add Link'))
    fireEvent.click(screen.getByText('Save'))

    expect(addLinkData).toHaveBeenCalledWith({
      pageIndex: pageId,
      groupIndex: panelId,
      link: { text: 'Test Link', url: 'https://test.com' },
    })
    expect(mockDispatch).toHaveBeenCalled()
    expect(screen.queryByTestId('mock-link-dialog')).not.toBeInTheDocument()
  })

  it('does not dispatch addLinkData when cancelling dialog', () => {
    render(<LinkAdd pageId={pageId} panelId={panelId} />)

    fireEvent.click(screen.getByText('Add Link'))
    fireEvent.click(screen.getByText('Cancel'))

    expect(addLinkData).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(screen.queryByTestId('mock-link-dialog')).not.toBeInTheDocument()
  })
})