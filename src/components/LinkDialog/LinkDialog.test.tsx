import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import { LinkData } from '@src/types/linkData'

import LinkDialog from './LinkDialog'

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
        <button data-testid="confirm-no" onClick={() => onConfirm(false)}>
          No
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
    errorText,
    id,
  }: {
    children: React.ReactNode
    value: string
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    hasError?: boolean
    errorText?: string
    id: string
  }) => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{children}</label>
      <input id={id} value={value} onChange={onInputChange} />
      {hasError && <span data-testid={`error-${id}`}>{errorText || 'Error'}</span>}
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
    <div data-testid={`select-${id}`}>
      <label htmlFor={id}>{children}</label>
      <select
        id={id}
        data-testid={`select-input-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((opt: { value: string; label: string }) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}))

vi.mock('@comp/Link', () => ({
  default: () => <div data-testid="link-preview">Link Preview</div>,
}))

describe('LinkDialog Component', () => {
  const mockOnClose = vi.fn()
  const defaultProps = {
    pageId: 0,
    panelId: 0,
    isOpen: true,
    editMode: false,
    onClose: mockOnClose,
  }

  const mockLinkPages = [
    {
      name: 'Page 1',
      groupList: [
        {
          name: 'Group 1',
          linkList: [
            {
              text: 'Existing Link',
              url: 'https://example.com',
              color: 'blue',
              icon: 'icon',
              outline: false,
              description: '',
            },
          ],
        },
      ],
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useSelector as unknown as Mock).mockReturnValue(mockLinkPages)
  })

  test('renders correctly in add mode', () => {
    render(<LinkDialog {...defaultProps} />)
    expect(screen.getByText('Add Link')).toBeInTheDocument()
    expect(screen.getByTestId('input-linkName')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('validates URL format', () => {
    render(<LinkDialog {...defaultProps} />)
    const urlInput = screen.getByLabelText('Link URL')
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } })

    expect(screen.getByTestId('error-linkUrl')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('validates duplicate link name', () => {
    render(<LinkDialog {...defaultProps} />)
    const nameInput = screen.getByLabelText('Link Name')
    fireEvent.change(nameInput, { target: { value: 'Existing Link' } })

    expect(screen.getByTestId('error-linkName')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('enables save button when form is valid and calls onClose with data', () => {
    render(<LinkDialog {...defaultProps} />)

    const nameInput = screen.getByLabelText('Link Name')
    fireEvent.change(nameInput, { target: { value: 'New Link' } })

    const urlInput = screen.getByLabelText('Link URL')
    fireEvent.change(urlInput, { target: { value: 'https://google.com' } })

    const saveBtn = screen.getByTestId('confirm-btn')
    expect(saveBtn).not.toBeDisabled()

    fireEvent.click(saveBtn)
    expect(mockOnClose).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'New Link',
        url: 'https://google.com',
      }),
      false,
    )
  })

  test('handles edit mode correctly', () => {
    const linkData: LinkData = {
      text: 'My Link',
      url: 'https://test.com',
      color: 'red',
      icon: 'icon',
      outline: false,
      description: 'desc',
    }

    render(<LinkDialog {...defaultProps} editMode={true} link={linkData} />)

    expect(screen.getByText('Edit Link')).toBeInTheDocument()
    expect(screen.getByLabelText('Link Name')).toHaveValue('My Link')

    // Save button disabled if no changes
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()

    // Change something
    const descInput = screen.getByLabelText('Description')
    fireEvent.change(descInput, { target: { value: 'new desc' } })

    expect(screen.getByTestId('confirm-btn')).not.toBeDisabled()
  })

  test('handles delete action in edit mode', () => {
    const linkData: LinkData = {
      text: 'My Link',
      url: 'https://test.com',
      color: 'red',
      icon: 'icon',
      outline: false,
      description: '',
    }

    render(<LinkDialog {...defaultProps} editMode={true} link={linkData} />)

    const deleteBtn = screen.getByTestId('action-btn')
    expect(deleteBtn).toHaveTextContent('Delete')

    fireEvent.click(deleteBtn)
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('confirm-yes'))
    expect(mockOnClose).toHaveBeenCalledWith(linkData, true)
  })

  test('handles cancel action', () => {
    render(<LinkDialog {...defaultProps} />)
    fireEvent.click(screen.getByTestId('close-btn'))
    expect(mockOnClose).toHaveBeenCalledWith(undefined)
  })
})
