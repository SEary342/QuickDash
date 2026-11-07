import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import SelectWithLabel from './SelectWithLabel'

// Mock dependencies
vi.mock('@mdi/react', () => ({
  Icon: ({ path }: { path: string }) => <svg data-testid="icon">{path}</svg>,
}))
vi.mock('@src/types/colors', () => ({
  getColorLookup: (value: string) => ({
    background: `bg-${value}`,
  }),
}))
vi.mock('@src/types/icons', () => ({
  iconTranslation: {
    apple: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
  },
}))

const options = [
  { value: 'apple', label: 'Apple', color: true, icon: true },
  { value: 'banana', label: 'Banana', color: false, icon: false },
]

describe('SelectWithLabel', () => {
  let onChange: (value: string) => void

  beforeEach(() => {
    onChange = vi.fn()
  })

  it('renders label and default selected text', () => {
    render(
      <SelectWithLabel id="fruit" value="banana" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>,
    )

    expect(screen.getByText('Fruit')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('shows dropdown options on click', () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>,
    )

    const trigger = screen.getByText('Select an option')
    fireEvent.click(trigger)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('selects an option and calls onChange', () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>,
    )

    fireEvent.click(screen.getByText('Select an option'))
    fireEvent.click(screen.getByText('Apple'))

    expect(onChange).toHaveBeenCalledWith('apple')
  })

  it('displays color and icon if specified', () => {
    render(
      <SelectWithLabel id="fruit" value="apple" options={options} onChange={onChange}>
        Fruit
      </SelectWithLabel>,
    )

    expect(screen.getByText('Apple')).toBeInTheDocument()
  })

  it('filters searchable options by label and selects a match', () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange} searchable>
        Fruit
      </SelectWithLabel>,
    )

    fireEvent.click(screen.getByText('Select an option'))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search Fruit' }), {
      target: { value: 'app' },
    })

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.queryByText('Banana')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Apple'))
    expect(onChange).toHaveBeenCalledWith('apple')
  })

  it('ranks exact, partial, and typo-tolerant label matches', () => {
    const fuzzyOptions = [
      { value: 'apple', label: 'Apple', color: false, icon: false },
      { value: 'pineapple', label: 'Pineapple', color: false, icon: false },
      { value: 'aple', label: 'Aple', color: false, icon: false },
      { value: 'grape', label: 'Grape', color: false, icon: false },
    ]

    render(
      <SelectWithLabel id="fruit" options={fuzzyOptions} onChange={onChange} searchable>
        Fruit
      </SelectWithLabel>,
    )

    fireEvent.click(screen.getByText('Select an option'))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search Fruit' }), {
      target: { value: 'apple' },
    })

    const matches = screen.getAllByText(/Apple|Pineapple|Aple/)
    expect(matches[0]).toHaveTextContent('Apple')
    expect(matches[1]).toHaveTextContent('Pineapple')
    expect(matches[2]).toHaveTextContent('Aple')
    expect(screen.queryByText('Grape')).not.toBeInTheDocument()
  })

  it('shows a message when searchable options have no match', () => {
    render(
      <SelectWithLabel id="fruit" options={options} onChange={onChange} searchable>
        Fruit
      </SelectWithLabel>,
    )

    fireEvent.click(screen.getByText('Select an option'))
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search Fruit' }), {
      target: { value: 'not found' },
    })

    expect(screen.getByText('No matches found')).toBeInTheDocument()
  })
})
