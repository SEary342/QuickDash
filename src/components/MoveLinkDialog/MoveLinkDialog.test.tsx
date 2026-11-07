import { fireEvent, render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { RootState } from '@src/store/store'
import { LinkData } from '@src/types/linkData'
import { LinkPage } from '@src/types/linkPage'

import MoveLinkDialog from './MoveLinkDialog'

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

describe('MoveLinkDialog', () => {
  const sourceLink: LinkData = {
    text: 'Source Link',
    url: 'https://example.com',
    color: 'blue',
    outline: false,
  }
  const pages: LinkPage[] = [
    { name: 'Work', groupList: [{ name: 'Source', linkList: [sourceLink] }] },
    { name: 'Personal', groupList: [{ name: 'Saved', linkList: [] }] },
  ]
  const onClose = vi.fn()

  const renderDialog = () =>
    render(
      <MoveLinkDialog
        isOpen
        sourcePageIndex={0}
        sourceGroupIndex={0}
        link={sourceLink}
        onClose={onClose}
      />,
    )

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockImplementation(
      (selector: (state: RootState) => unknown) => selector({ linkPages: pages } as RootState),
    )
  })

  test('moves to an existing group on another tab', () => {
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Personal'))
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onClose).toHaveBeenCalledWith(
      { type: 'existing', pageIndex: 1, groupIndex: 0 },
      'Personal',
    )
  })

  test('closes the tab dropdown when the group dropdown opens', () => {
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    expect(screen.getByText('Create a new tab...')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Source'))

    expect(screen.queryByText('Create a new tab...')).not.toBeInTheDocument()
    expect(screen.getByText('Create a new group...')).toBeInTheDocument()
  })

  test('creates a new group on an existing tab', () => {
    renderDialog()

    fireEvent.click(screen.getAllByText('Source')[0])
    fireEvent.click(screen.getByText('Create a new group...'))
    fireEvent.change(screen.getByLabelText('New group name'), {
      target: { value: 'Archive' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onClose).toHaveBeenCalledWith(
      { type: 'new-group', pageIndex: 0, groupName: 'Archive' },
      'Work',
    )
  })

  test('creates a new tab and group for the link', () => {
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Create a new tab...'))
    fireEvent.change(screen.getByLabelText('New tab name'), {
      target: { value: 'Archive' },
    })
    fireEvent.change(screen.getByLabelText('New group name'), {
      target: { value: 'Bookmarks' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(onClose).toHaveBeenCalledWith(
      { type: 'new-page', pageName: 'Archive', groupName: 'Bookmarks' },
      'Archive',
    )
  })

  test('prevents moving into a group with a duplicate link name', () => {
    const pagesWithDuplicate: LinkPage[] = [
      ...pages.slice(0, 1),
      {
        name: 'Personal',
        groupList: [
          {
            name: 'Saved',
            linkList: [{ ...sourceLink }],
          },
        ],
      },
    ]
    ;(useSelector as unknown as Mock).mockImplementation(
      (selector: (state: RootState) => unknown) =>
        selector({ linkPages: pagesWithDuplicate } as RootState),
    )
    renderDialog()

    fireEvent.click(screen.getByText('Work'))
    fireEvent.click(screen.getByText('Personal'))

    expect(
      screen.getByText('A link named "Source Link" already exists in this group.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled()
  })
})
