import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'
import { Mock, beforeEach, describe, expect, test, vi } from 'vitest'

import App from './App'

// Mock dependencies
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}))

vi.mock('@comp/AppBar', () => ({
  default: () => <div data-testid="app-bar">AppBar</div>,
}))

vi.mock('@comp/Dash', () => ({
  default: () => <div data-testid="dash">Dash</div>,
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
})
