import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { LinkPage } from '@src/types/linkPage'

import DashGroupDialog from './DashGroupDialog'

// Mock dependencies
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

// Mock child components
vi.mock('@comp/Dialog', () => ({
  default: ({
    title,
    isOpen,
    onClose,
    children,
    disableConfirm,
    actionButton,
  }: {
    title: string
    isOpen: boolean
    onClose: (confirm: boolean) => void
    children: React.ReactNode
    disableConfirm?: boolean
    actionButton?: { action: () => void; text: string }
  }) => {
    if (!isOpen) return null
    return (
      <div data-testid="dialog">
        <h1>{title}</h1>
        <button data-testid="close-btn" onClick={() => onClose(false)}>
          Cancel
        </button>
        <button data-testid="confirm-btn" disabled={disableConfirm} onClick={() => onClose(true)}>
          Save
        </button>
        {actionButton && (
          <button data-testid="action-btn" onClick={actionButton.action}>
            {actionButton.text}
          </button>
        )}
        {children}
      </div>
    )
  },
}))

vi.mock('@comp/ConfirmDialog', () => ({
  default: ({
    isOpen,
    onConfirm,
  }: {
    isOpen: boolean
    onConfirm: (confirmed: boolean) => void
  }) => {
    if (!isOpen) return null
    return (
      <div data-testid="confirm-dialog">
        <button data-testid="confirm-yes" onClick={() => onConfirm(true)}>
          Yes
        </button>
      </div>
    )
  },
}))

vi.mock('@comp/InputWithLabel', () => ({
  default: ({
    children,
    value,
    onInputChange,
    hasError,
    id,
  }: {
    children: React.ReactNode
    value: string
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    hasError?: boolean
    id: string
  }) => (
    <div data-testid={`input-container-${id}`}>
      <label htmlFor={id}>{children}</label>
      <input id={id} value={value} onChange={onInputChange} />
      {hasError && <span data-testid={`error-${id}`}>Error</span>}
    </div>
  ),
}))

vi.mock('@comp/SelectWithLabel', () => ({
  default: ({
    children,
    value,
    onChange,
    id,
    options,
  }: {
    children: React.ReactNode
    value: string
    onChange: (val: string) => void
    id: string
    options: { value: string; label: string }[]
  }) => (
    <div data-testid={`select-container-${id}`}>
      <label htmlFor={id}>{children}</label>
      <select
        id={id}
        data-testid={`select-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}))

describe('DashGroupDialog', () => {
  const mockOnClose = vi.fn()
  const mockLinkPages: LinkPage[] = [
    {
      name: 'Page 1',
      groupList: [{ name: 'Group 1', linkList: [] }],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockReturnValue(mockLinkPages)
  })

  test('renders correctly in Add Dash mode', () => {
    render(<DashGroupDialog isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByText('Add Dash')).toBeInTheDocument()
    expect(screen.getByLabelText('Dash Name')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('renders correctly in Add Group mode', () => {
    render(<DashGroupDialog isOpen={true} groupMode={true} onClose={mockOnClose} />)
    expect(screen.getByText('Add Group')).toBeInTheDocument()
    expect(screen.getByLabelText('Group Name')).toBeInTheDocument()
  })

  test('validates duplicate dash name', () => {
    render(<DashGroupDialog isOpen={true} onClose={mockOnClose} />)
    const input = screen.getByLabelText('Dash Name')
    fireEvent.change(input, { target: { value: 'Page 1' } })

    expect(screen.getByTestId('error-dashGroupName')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('validates duplicate group name', () => {
    render(<DashGroupDialog isOpen={true} groupMode={true} pageId={0} onClose={mockOnClose} />)
    const input = screen.getByLabelText('Group Name')
    fireEvent.change(input, { target: { value: 'Group 1' } })

    expect(screen.getByTestId('error-dashGroupName')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('calls onClose with new data when saving', () => {
    render(<DashGroupDialog isOpen={true} onClose={mockOnClose} />)
    const input = screen.getByLabelText('Dash Name')
    fireEvent.change(input, { target: { value: 'New Page' } })

    const saveBtn = screen.getByTestId('confirm-btn')
    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)

    expect(mockOnClose).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'New Page' }),
      expect.anything(),
      false,
    )
  })

  test('calls onClose with new group data when saving group', () => {
    render(<DashGroupDialog isOpen={true} groupMode={true} onClose={mockOnClose} />)
    const input = screen.getByLabelText('Group Name')
    fireEvent.change(input, { target: { value: 'New Group' } })

    const saveBtn = screen.getByTestId('confirm-btn')
    fireEvent.click(saveBtn)

    expect(mockOnClose).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'New Group' }),
      false,
    )
  })

  test('renders correctly in Edit mode and handles delete', () => {
    const pageToEdit: LinkPage = { name: 'Page 1', groupList: [] }
    render(
      <DashGroupDialog isOpen={true} editMode={true} linkPage={pageToEdit} onClose={mockOnClose} />,
    )

    expect(screen.getByText('Edit Dash')).toBeInTheDocument()
    expect(screen.getByLabelText('Dash Name')).toHaveValue('Page 1')

    const deleteBtn = screen.getByTestId('action-btn')
    expect(deleteBtn).toHaveTextContent('Delete')

    fireEvent.click(deleteBtn)
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('confirm-yes'))
    expect(mockOnClose).toHaveBeenCalledWith(pageToEdit, expect.anything(), true)
  })

  test('handles cancel', () => {
    render(<DashGroupDialog isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByTestId('close-btn'))
    expect(mockOnClose).toHaveBeenCalledWith(undefined)
  })
})
