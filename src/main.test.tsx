import React from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, test, vi } from 'vitest'

// Mock dependencies
const renderMock = vi.fn()

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: renderMock,
  })),
}))

vi.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div id="provider">{children}</div>,
}))

vi.mock('./App.tsx', () => ({
  default: () => <div id="app">App</div>,
}))

vi.mock('./store/store.ts', () => ({
  default: {},
}))

vi.mock('./index.css', () => ({}))

describe('main.tsx', () => {
  test('renders the application into root element', async () => {
    // Setup root element in DOM
    const root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)

    // Import main to trigger side effects
    await import('./main')

    expect(createRoot).toHaveBeenCalledWith(root)
    expect(renderMock).toHaveBeenCalled()
  })
})
