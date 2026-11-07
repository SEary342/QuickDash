import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { LinkPage } from '@src/types/linkPage'

import MoveDestinationTab from './MoveDestinationTab'

vi.mock('@comp/SelectWithLabel', () => ({
  default: ({
    id,
    value,
    options,
    onChange,
    onOpenChange,
    children,
  }: {
    id: string
    value: string
    options: { value: string; label: string }[]
    onChange: (value: string) => void
    onOpenChange: (isOpen: boolean) => void
    children: React.ReactNode
  }) => (
    <div>
      <label htmlFor={id}>{children}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => onOpenChange(true)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  ),
}))

describe('MoveDestinationTab', () => {
  const pages: LinkPage[] = [
    { name: 'Work', groupList: [] },
    { name: 'Personal', groupList: [] },
  ]

  const renderComponent = (
    overrides: Partial<React.ComponentProps<typeof MoveDestinationTab>> = {},
  ) =>
    render(
      <MoveDestinationTab
        idPrefix="move"
        pages={pages}
        pageSelection="0"
        onPageChange={vi.fn()}
        newPageName=""
        onNewPageNameChange={vi.fn()}
        dropdownOpen={false}
        onDropdownOpenChange={vi.fn()}
        {...overrides}
      />,
    )

  test('renders existing tabs and the create-tab option', () => {
    renderComponent()

    expect(screen.getByLabelText('Destination tab')).toHaveValue('0')
    expect(screen.getByRole('option', { name: 'Work' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Personal' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Create a new tab...' })).toHaveValue('new-page')
    expect(screen.queryByLabelText('New tab name')).not.toBeInTheDocument()
  })

  test('reports tab selection and dropdown open changes', () => {
    const onPageChange = vi.fn()
    const onDropdownOpenChange = vi.fn()
    renderComponent({ onPageChange, onDropdownOpenChange })

    fireEvent.focus(screen.getByLabelText('Destination tab'))
    fireEvent.change(screen.getByLabelText('Destination tab'), {
      target: { value: '1' },
    })

    expect(onDropdownOpenChange).toHaveBeenCalledWith(true)
    expect(onPageChange).toHaveBeenCalledWith('1')
  })

  test('shows and updates the new-tab name input when creating a tab', () => {
    const onNewPageNameChange = vi.fn()
    renderComponent({
      pageSelection: 'new-page',
      newPageName: 'Archive',
      onNewPageNameChange,
    })

    const input = screen.getByLabelText('New tab name')
    expect(input).toHaveValue('Archive')

    fireEvent.change(input, { target: { value: 'Bookmarks' } })
    expect(onNewPageNameChange).toHaveBeenCalledWith('Bookmarks')
  })

  test('shows duplicate name validation for an existing tab name', () => {
    renderComponent({ pageSelection: 'new-page', newPageName: ' work ' })

    expect(screen.getByText('A tab with this name already exists.')).toBeInTheDocument()
  })
})
