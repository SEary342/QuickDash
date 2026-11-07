import { fireEvent, render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { RootState } from '@src/store/store'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import MoveGroupDialog from './MoveGroupDialog'

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

vi.mock('@comp/Dialog', () => ({
  default: ({
    title,
    isOpen,
    onClose,
    children,
    disableConfirm,
  }: {
    title: string
    isOpen: boolean
    onClose: (confirm: boolean) => void
    children: React.ReactNode
    disableConfirm: boolean
  }) =>
    isOpen ? (
      <div>
        <h1>{title}</h1>
        {children}
        <button disabled={disableConfirm} onClick={() => onClose(true)}>
          Confirm
        </button>
        <button onClick={() => onClose(false)}>Cancel</button>
      </div>
    ) : null,
}))

describe('MoveGroupDialog', () => {
  const group: LinkGroup = {
    name: 'Research',
    linkList: [{ text: 'Article', url: 'https://example.com', color: 'blue', outline: false }],
  }
  const pages: LinkPage[] = [
    { name: 'Work', groupList: [group] },
    { name: 'Personal', groupList: [{ name: 'Other', linkList: [] }] },
  ]
  const onClose = vi.fn()

  const renderDialog = () =>
    render(<MoveGroupDialog isOpen sourcePageIndex={0} group={group} onClose={onClose} />)

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockImplementation(
      (selector: (state: RootState) => unknown) => selector({ linkPages: pages } as RootState),
    )
  })

  test('moves group to a different existing tab', () => {
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Personal'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onClose).toHaveBeenCalledWith({ type: 'existing', pageIndex: 1 }, 'Personal')
  })

  test('creates a new tab for the group', () => {
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Create a new tab...'))
    fireEvent.change(screen.getByLabelText('New tab name'), {
      target: { value: 'Archive' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onClose).toHaveBeenCalledWith({ type: 'new-page', pageName: 'Archive' }, 'Archive')
  })

  test('prevents moving to the current tab', () => {
    renderDialog()

    expect(screen.getByText('Choose a different tab to move this group.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })

  test('prevents moving to a tab that already has a group with the same name', () => {
    const pagesWithDuplicate: LinkPage[] = [
      pages[0],
      { name: 'Personal', groupList: [{ ...group, linkList: [] }] },
    ]
    ;(useSelector as unknown as Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({ linkPages: pagesWithDuplicate } as RootState),
    )
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Personal'))

    expect(
      screen.getByText('A group named "Research" already exists in this tab.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })
})
