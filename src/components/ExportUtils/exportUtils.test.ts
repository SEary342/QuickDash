import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LinkPage } from '@src/types/linkPage'

import { exportConfig } from './exportUtils'

describe('exportConfig', () => {
  const mockData: LinkPage[] = [
    { name: 'Page 1', groupList: [] },
    { name: 'Page 2', groupList: [] },
  ]
  const fileName = 'QuickDashConfig'
  const fileExtension = '.QDconfig'

  // Spies and Mocks
  let createElementSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLMock: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock URL.createObjectURL
    // JSDOM does not implement createObjectURL, so we ensure it exists before spying
    if (!window.URL.createObjectURL) {
      window.URL.createObjectURL = vi.fn()
    }
    createObjectURLMock = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:mock-url')

    // Mock document methods
    createElementSpy = vi.spyOn(document, 'createElement')
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    // Clean up msSaveBlob if it was added to navigator
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window.navigator as any).msSaveBlob) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window.navigator as any).msSaveBlob
    }
  })

  it('should export data using standard HTML5 download attribute', () => {
    const clickMock = vi.fn()
    const setAttributeMock = vi.fn()
    const styleMock = { visibility: '' }

    // Mock the anchor element
    const mockLink = {
      download: '', // Presence of this property implies support
      href: '',
      style: styleMock,
      setAttribute: setAttributeMock,
      click: clickMock,
    } as unknown as HTMLAnchorElement

    createElementSpy.mockReturnValue(mockLink)

    exportConfig(fileName, fileExtension, mockData)

    // Verify Blob creation
    expect(createObjectURLMock).toHaveBeenCalledTimes(1)
    const blob = createObjectURLMock.mock.calls[0][0]
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe('application/json')

    // Verify Link creation and attributes
    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(setAttributeMock).toHaveBeenCalledWith('href', 'blob:mock-url')
    expect(setAttributeMock).toHaveBeenCalledWith('download', 'QuickDashConfig.QDconfig')
    expect(styleMock.visibility).toBe('hidden')

    // Verify DOM manipulation
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink)
    expect(clickMock).toHaveBeenCalled()
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink)
  })

  it('should use msSaveBlob if available (IE10+)', () => {
    const msSaveBlobMock = vi.fn()

    // Mock navigator.msSaveBlob
    Object.defineProperty(window.navigator, 'msSaveBlob', {
      value: msSaveBlobMock,
      configurable: true,
      writable: true,
    })

    exportConfig(fileName, fileExtension, mockData)

    expect(msSaveBlobMock).toHaveBeenCalledTimes(1)
    expect(msSaveBlobMock).toHaveBeenCalledWith(expect.any(Blob), fileName)

    // Should not use the standard download method
    expect(createElementSpy).not.toHaveBeenCalled()
    expect(createObjectURLMock).not.toHaveBeenCalled()
  })

  it('should not perform download if download attribute is not supported and msSaveBlob is missing', () => {
    // Mock anchor element without download property
    const mockLink = {
      // download is undefined
      href: '',
      style: { visibility: '' },
      setAttribute: vi.fn(),
      click: vi.fn(),
    } as unknown as HTMLAnchorElement

    createElementSpy.mockReturnValue(mockLink)

    exportConfig(fileName, fileExtension, mockData)

    expect(createElementSpy).toHaveBeenCalledWith('a')
    // Should stop before creating object URL or appending to body
    expect(createObjectURLMock).not.toHaveBeenCalled()
    expect(appendChildSpy).not.toHaveBeenCalled()
  })
})
