import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Mock, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import { addLinkPage, deleteLinkPage, setSelectedDash } from '@src/store/store'
import { LinkPage } from '@src/types/linkPage'

import Dash from './Dash'

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}))

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}))

vi.mock('@src/store/store', () => ({
  addLinkPage: vi.fn(),
  deleteLinkPage: vi.fn(),
  setSelectedDash: vi.fn(),
}))

// Mock child components
vi.mock('@comp/TabBtn', () => {
  const TabBtn = ({
    linkPage,
    tabSelectFunc,
    onRemove,
    id,
  }: {
    linkPage: LinkPage
    tabSelectFunc: (id: number) => void
    onRemove: (id: number) => void
    id: number
  }) => (
    <div data-testid="tab-btn">
      <span onClick={() => tabSelectFunc(id)}>{linkPage.name}</span>
      <button data-testid={`delete-tab-${id}`} onClick={() => onRemove(id)}>
        Delete
      </button>
    </div>
  )
  return { default: TabBtn }
})

vi.mock('@comp/IconBtn', () => {
  const IconBtn = ({ onClick }: { onClick: () => void }) => (
    <button data-testid="add-dash-btn" onClick={onClick}>
      Add Dash
    </button>
  )
  return { default: IconBtn }
})

vi.mock('@comp/DashGroupDialog', () => {
  const DashGroupDialog = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean
    onClose: (page?: LinkPage) => void
  }) =>
    isOpen ? (
      <div data-testid="panel-dialog">
        <button onClick={() => onClose({ name: 'New Page', groupList: [] } as LinkPage)}>
          Create
        </button>
        <button onClick={() => onClose()}>Cancel</button>
      </div>
    ) : null
  return { default: DashGroupDialog }
})

vi.mock('@comp/LinkPanel', () => {
  const LinkPanel = ({ linkGroup }: { linkGroup: { name: string } }) => (
    <div data-testid="link-panel">{linkGroup.name}</div>
  )
  return { default: LinkPanel }
})

vi.mock('@comp/LinkPanelAdd', () => {
  const LinkPanelAdd = () => <div data-testid="link-panel-add">Add Group</div>
  return { default: LinkPanelAdd }
})

vi.mock('@comp/QuickDashWelcome', () => {
  const QuickDashWelcome = () => <div data-testid="welcome-screen">Welcome</div>
  return { default: QuickDashWelcome }
})

describe('Dash Component', () => {
  const mockDispatch = vi.fn()
  const mockLinkPages: LinkPage[] = [
    { name: 'Page 1', groupList: [{ name: 'Group 1', linkList: [] }] },
    { name: 'Page 2', groupList: [] },
  ]

  beforeAll(() => {
    // Mock getBoundingClientRect for useLayoutEffect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }))
  })

  beforeEach(() => {
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
    vi.clearAllMocks()
  })

  test('renders welcome screen when no pages exist', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: '', numberOfColumns: 2 },
      }),
    )

    render(<Dash linkPages={[]} />)
    expect(screen.getByTestId('welcome-screen')).toBeInTheDocument()
  })

  test('renders tabs and panels when pages exist', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: 'Page 1', numberOfColumns: 2 },
      }),
    )

    render(<Dash linkPages={mockLinkPages} />)

    expect(screen.queryByTestId('welcome-screen')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('tab-btn')).toHaveLength(2)
    expect(screen.getByText('Page 1')).toBeInTheDocument()
    expect(screen.getByTestId('link-panel')).toHaveTextContent('Group 1')
  })

  test('handles tab switching', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: 'Page 1', numberOfColumns: 2 },
      }),
    )

    render(<Dash linkPages={mockLinkPages} />)

    const page2Tab = screen.getByText('Page 2')
    fireEvent.click(page2Tab)

    expect(setSelectedDash).toHaveBeenCalledWith('Page 2')
    expect(mockDispatch).toHaveBeenCalled()
  })

  test('handles page deletion', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: 'Page 1', numberOfColumns: 2 },
      }),
    )

    render(<Dash linkPages={mockLinkPages} />)

    const deleteBtn = screen.getByTestId('delete-tab-0')
    fireEvent.click(deleteBtn)

    expect(deleteLinkPage).toHaveBeenCalledWith(0)
    // Should select next page (Page 2) if current is deleted
    expect(setSelectedDash).toHaveBeenCalledWith('Page 2')
    expect(mockDispatch).toHaveBeenCalledTimes(2)
  })

  test('handles adding a new page', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: 'Page 1', numberOfColumns: 2 },
      }),
    )

    render(<Dash linkPages={mockLinkPages} />)

    const addBtn = screen.getByTestId('add-dash-btn')
    fireEvent.click(addBtn)

    const dialogCreateBtn = screen.getByText('Create')
    fireEvent.click(dialogCreateBtn)

    expect(addLinkPage).toHaveBeenCalled()
    expect(setSelectedDash).toHaveBeenCalledWith('New Page')
    expect(mockDispatch).toHaveBeenCalledTimes(2)
  })

  test('distributes groups into columns correctly', () => {
    ;(useSelector as unknown as Mock).mockImplementation((selector) =>
      selector({
        app: { selectedDash: 'Page 1', numberOfColumns: 2 },
      }),
    )

    const manyGroupsPage: LinkPage[] = [
      {
        name: 'Page 1',
        groupList: [
          { name: 'G1', linkList: [] },
          { name: 'G2', linkList: [] },
          { name: 'G3', linkList: [] },
        ],
      },
    ]

    render(<Dash linkPages={manyGroupsPage} />)

    expect(screen.getAllByTestId('link-panel')).toHaveLength(3)
  })
})
