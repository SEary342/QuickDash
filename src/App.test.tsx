import { fireEvent, render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import App from './App'

// Mock dependencies
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

vi.mock('@comp/AppBar', () => ({
  default: ({ onSearchChange }: { onSearchChange: (query: string) => void }) => (
    <div data-testid="app-bar">
      AppBar
      <input aria-label="Search links" onChange={(event) => onSearchChange(event.target.value)} />
    </div>
  ),
}))

vi.mock('@comp/Dash', () => ({
  default: ({ searchQuery }: { searchQuery: string }) => (
    <div data-testid="dash" data-search-query={searchQuery}>
      Dash
    </div>
  ),
}))

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders AppBar and Dash with linkPages from store', () => {
    const mockLinkPages = [{ name: 'Page 1', groupList: [] }]
    ;(useSelector as unknown as Mock).mockReturnValue(mockLinkPages)

    render(<App />)

    expect(screen.getByTestId('app-bar')).toBeInTheDocument()
    expect(screen.getByTestId('dash')).toBeInTheDocument()
    expect(useSelector).toHaveBeenCalled()
  })

  test('passes the app bar search query to the dashboard', () => {
    ;(useSelector as unknown as Mock).mockReturnValue([{ name: 'Page 1', groupList: [] }])

    render(<App />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Search links' }), {
      target: { value: 'docs' },
    })

    expect(screen.getByTestId('dash')).toHaveAttribute('data-search-query', 'docs')
  })
})
