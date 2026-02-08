import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Mock, afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { overwriteConfig, setNumberOfColumns, setSelectedDash } from '@src/store/store'

import FileImportDialog from './FileImportDialog'

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('@src/store/store', () => ({
  overwriteConfig: vi.fn(),
  setNumberOfColumns: vi.fn(),
  setSelectedDash: vi.fn(),
}))

vi.mock('@src/types/colors', () => ({
  colorConversions: {
    'legacy-color': 'new-color',
  },
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
    disableConfirm?: boolean
  }) => {
    if (!isOpen) return null
    return (
      <div data-testid="dialog">
        <h1>{title}</h1>
        <button data-testid="close-btn" onClick={() => onClose(false)}>
          Cancel
        </button>
        <button data-testid="confirm-btn" disabled={disableConfirm} onClick={() => onClose(true)}>
          Import
        </button>
        {children}
      </div>
    )
  },
}))

describe('FileImportDialog', () => {
  const mockDispatch = vi.fn()
  const mockOnClose = vi.fn()
  const originalFileReader = window.FileReader

  beforeEach(() => {
    ;(useDispatch as unknown as Mock).mockReturnValue(mockDispatch)
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.FileReader = originalFileReader
  })

  test('renders correctly when open', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)
    expect(screen.getByTestId('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Import .QDconfig File/)).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('handles file selection via input', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)

    const file = new File(['{}'], 'test.QDconfig', { type: 'application/json' })
    const input = screen.getByLabelText('Browse Files')
    fireEvent.change(input, { target: { files: [file] } })

    expect(screen.getByText('Selected File: test.QDconfig')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).not.toBeDisabled()
  })

  test('rejects invalid file extension via input', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)

    const file = new File(['{}'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText('Browse Files')
    fireEvent.change(input, { target: { files: [file] } })

    expect(window.alert).toHaveBeenCalledWith('Only .QDconfig files are allowed')
    expect(screen.queryByText('Selected File: test.txt')).not.toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).toBeDisabled()
  })

  test('handles drag and drop', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)

    const dropZone = screen.getByText(/Drag and drop your .QDconfig file here/).closest('div')!

    // Drag enter
    fireEvent.dragEnter(dropZone)
    expect(dropZone).toHaveClass('border-blue-500')

    // Drag leave
    fireEvent.dragLeave(dropZone)
    expect(dropZone).toHaveClass('border-gray-300')

    // Drop valid file
    const file = new File(['{}'], 'test.QDconfig', { type: 'application/json' })
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })

    expect(screen.getByText('Selected File: test.QDconfig')).toBeInTheDocument()
    expect(screen.getByTestId('confirm-btn')).not.toBeDisabled()
  })

  test('rejects invalid file extension via drop', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)
    const dropZone = screen.getByText(/Drag and drop your .QDconfig file here/).closest('div')!

    const file = new File(['{}'], 'test.png', { type: 'image/png' })
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } })

    expect(window.alert).toHaveBeenCalledWith('Only .QDconfig files are allowed')
    expect(screen.queryByText('Selected File: test.png')).not.toBeInTheDocument()
  })

  test('imports file successfully and transforms data', async () => {
    const mockFileContent = JSON.stringify([
      {
        name: 'Page 1',
        icon: 'icon1',
        color: 'red',
        groupList: [
          {
            name: 'Group 1',
            icon: 'icon2',
            color: 'blue',
            linkList: [
              {
                text: 'Link 1',
                url: 'http://test.com',
                color: 'outline-legacy-color', // Test outline + conversion
                icon: 'icon3',
                description: 'desc',
              },
            ],
          },
        ],
      },
    ])

    // Mock FileReader
    const mockFileReader = class {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      result: string | null = null
      readAsText() {
        this.result = mockFileContent
        this.onload?.()
      }
    }
    window.FileReader = mockFileReader as unknown as typeof FileReader

    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)

    const file = new File([mockFileContent], 'config.QDconfig', { type: 'application/json' })
    const input = screen.getByLabelText('Browse Files')
    fireEvent.change(input, { target: { files: [file] } })

    const confirmBtn = screen.getByTestId('confirm-btn')
    fireEvent.click(confirmBtn)

    await waitFor(() => {
      expect(overwriteConfig).toHaveBeenCalled()
    })

    // Check transformation logic
    const expectedConfig = [
      {
        name: 'Page 1',
        icon: 'icon1',
        color: 'red',
        groupList: [
          {
            name: 'Group 1',
            icon: 'icon2',
            color: 'blue',
            linkList: [
              {
                text: 'Link 1',
                url: 'http://test.com',
                description: 'desc',
                color: 'new-color', // Verified conversion
                outline: true, // Verified outline extraction
                icon: 'icon3',
              },
            ],
          },
        ],
      },
    ]

    expect(overwriteConfig).toHaveBeenCalledWith(expectedConfig)
    expect(setNumberOfColumns).toHaveBeenCalledWith(3)
    expect(setSelectedDash).toHaveBeenCalledWith('Page 1')
    expect(mockOnClose).toHaveBeenCalled()
  })

  test('handles import error (invalid JSON)', async () => {
    const mockFileContent = 'invalid json'

    const mockFileReader = class {
      onload: (() => void) | null = null
      result: string | null = null
      readAsText() {
        this.result = mockFileContent
        this.onload?.()
      }
    }
    window.FileReader = mockFileReader as unknown as typeof FileReader

    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)

    const file = new File([mockFileContent], 'config.QDconfig', { type: 'application/json' })
    fireEvent.change(screen.getByLabelText('Browse Files'), { target: { files: [file] } })

    fireEvent.click(screen.getByTestId('confirm-btn'))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('An import error occured')
    })

    expect(overwriteConfig).not.toHaveBeenCalled()
  })

  test('handles cancel', () => {
    render(<FileImportDialog isOpen={true} onClose={mockOnClose} />)
    fireEvent.click(screen.getByTestId('close-btn'))
    expect(mockOnClose).toHaveBeenCalled()
    expect(overwriteConfig).not.toHaveBeenCalled()
  })
})
