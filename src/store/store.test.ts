import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { LinkData } from '@src/types/linkData'
import { LinkGroup } from '@src/types/linkGroup'
import { LinkPage } from '@src/types/linkPage'

import store, {
  addLinkData,
  addLinkGroup,
  addLinkPage,
  deleteLinkData,
  deleteLinkGroup,
  deleteLinkPage,
  moveLinkData,
  moveLinkGroup,
  overwriteConfig,
  reorderLinkData,
  reorderLinkGroups,
  reorderLinkPages,
  setFontSize,
  setNumberOfColumns,
  setSelectedDash,
  updateLinkData,
  updateLinkGroup,
  updateLinkPage,
} from './store'

// Mock localStorage directly before the store is initialized
beforeAll(() => {
  // Mock localStorage to return custom state
  vi.stubGlobal('localStorage', {
    getItem: vi.fn().mockReturnValue(
      JSON.stringify({
        selectedDash: '',
        quickDashConfig: [],
        numberOfColumns: 3,
      }),
    ),
    setItem: vi.fn(),
    clear: vi.fn(),
    length: 0, // Mock length
    key: vi.fn().mockReturnValue(null),
    removeItem: vi.fn(),
  } as unknown as Storage)
})

describe('Redux Store', () => {
  beforeEach(() => {
    // Reset store state
    store.dispatch(overwriteConfig([]))
    store.dispatch(setSelectedDash(''))
    store.dispatch(setNumberOfColumns(3))
    store.dispatch(setFontSize(16))
  })

  it('should load initial state correctly', () => {
    const state = store.getState()
    expect(state.app.selectedDash).toBe('')
    expect(state.app.numberOfColumns).toBe(3)
    expect(state.linkPages).toEqual([])
  })

  it('should update the selectedDash when setSelectedDash is dispatched', () => {
    store.dispatch(setSelectedDash('newDash'))
    const state = store.getState()
    expect(state.app.selectedDash).toBe('newDash')
  })

  it('should update the numberOfColumns when setNumberOfColumns is dispatched', () => {
    store.dispatch(setNumberOfColumns(4))
    const state = store.getState()
    expect(state.app.numberOfColumns).toBe(4)
  })

  it('should update the fontSize when setFontSize is dispatched', () => {
    store.dispatch(setFontSize(18))
    const state = store.getState()
    expect(state.app.fontSize).toBe(18)
  })

  it('should add a new link page when addLinkPage is dispatched', () => {
    const newLinkPage: LinkPage = { name: 'New Page', groupList: [] }
    store.dispatch(addLinkPage(newLinkPage))
    const state = store.getState()
    expect(state.linkPages).toHaveLength(1)
    expect(state.linkPages[0]).toEqual(newLinkPage)
  })

  it('should update a link page', () => {
    const initialPage: LinkPage = { name: 'Page 1', groupList: [] }
    store.dispatch(addLinkPage(initialPage))

    const updatedPage: LinkPage = { name: 'Updated Page 1', groupList: [] }
    store.dispatch(updateLinkPage({ index: 0, data: updatedPage }))

    const state = store.getState()
    expect(state.linkPages[0]).toEqual(updatedPage)
  })

  it('should delete a link page', () => {
    store.dispatch(addLinkPage({ name: 'Page 1', groupList: [] }))
    store.dispatch(deleteLinkPage(0))
    const state = store.getState()
    expect(state.linkPages).toHaveLength(0)
  })

  it('should reorder link pages', () => {
    const pages: LinkPage[] = [
      { name: 'Page 1', groupList: [] },
      { name: 'Page 2', groupList: [] },
    ]
    store.dispatch(overwriteConfig(pages))
    store.dispatch(reorderLinkPages({ fromIndex: 0, toIndex: 1 }))

    const state = store.getState()
    expect(state.linkPages[0].name).toBe('Page 2')
    expect(state.linkPages[1].name).toBe('Page 1')
  })

  it('should overwrite the linkPages when overwriteConfig is dispatched', () => {
    const newLinkPages: LinkPage[] = [
      { name: 'Page 1', groupList: [] },
      { name: 'Page 2', groupList: [] },
    ]
    store.dispatch(overwriteConfig(newLinkPages))
    const state = store.getState()
    expect(state.linkPages).toEqual(newLinkPages)
  })

  it('should handle link group operations', () => {
    // Add Page
    store.dispatch(addLinkPage({ name: 'Page 1', groupList: [] }))

    // Add Group
    const newGroup: LinkGroup = { name: 'Group 1', linkList: [] }
    store.dispatch(addLinkGroup({ pageIndex: 0, group: newGroup }))
    expect(store.getState().linkPages[0].groupList[0]).toEqual(newGroup)

    // Update Group
    const updatedGroup: LinkGroup = { name: 'Updated Group', linkList: [] }
    store.dispatch(updateLinkGroup({ pageIndex: 0, groupIndex: 0, group: updatedGroup }))
    expect(store.getState().linkPages[0].groupList[0]).toEqual(updatedGroup)

    // Add another group for reordering
    store.dispatch(addLinkGroup({ pageIndex: 0, group: newGroup }))
    store.dispatch(reorderLinkGroups({ pageIndex: 0, fromIndex: 0, toIndex: 1 }))
    expect(store.getState().linkPages[0].groupList[0].name).toBe('Group 1')
    expect(store.getState().linkPages[0].groupList[1].name).toBe('Updated Group')

    // Delete Group
    store.dispatch(deleteLinkGroup({ pageIndex: 0, groupIndex: 0 }))
    expect(store.getState().linkPages[0].groupList).toHaveLength(1)
  })

  it('should handle link data operations', () => {
    const group: LinkGroup = { name: 'Group 1', linkList: [] }
    store.dispatch(addLinkPage({ name: 'Page 1', groupList: [group] }))

    // Add Link Data
    const link: LinkData = {
      text: 'Link 1',
      url: 'http://example.com',
      color: 'red',
      outline: false,
    }
    store.dispatch(addLinkData({ pageIndex: 0, groupIndex: 0, link }))
    expect(store.getState().linkPages[0].groupList[0].linkList[0]).toEqual(link)

    // Update Link Data
    const updatedLink: LinkData = { ...link, text: 'Updated Link' }
    store.dispatch(updateLinkData({ pageIndex: 0, groupIndex: 0, linkIndex: 0, link: updatedLink }))
    expect(store.getState().linkPages[0].groupList[0].linkList[0]).toEqual(updatedLink)

    // Add another link for reordering
    store.dispatch(addLinkData({ pageIndex: 0, groupIndex: 0, link }))
    store.dispatch(reorderLinkData({ pageIndex: 0, groupIndex: 0, fromIndex: 0, toIndex: 1 }))
    expect(store.getState().linkPages[0].groupList[0].linkList[0].text).toBe('Link 1')
    expect(store.getState().linkPages[0].groupList[0].linkList[1].text).toBe('Updated Link')

    // Delete Link Data
    store.dispatch(deleteLinkData({ pageIndex: 0, groupIndex: 0, linkIndex: 0 }))
    expect(store.getState().linkPages[0].groupList[0].linkList).toHaveLength(1)
  })

  it('moves a link to an existing group on another tab without losing its data', () => {
    const link: LinkData = {
      text: 'Move Me',
      url: 'https://example.com',
      color: 'blue',
      outline: true,
      description: 'Preserved details',
      icon: 'mdi-link-variant',
    }
    store.dispatch(
      overwriteConfig([
        { name: 'Work', groupList: [{ name: 'Source', linkList: [link] }] },
        { name: 'Personal', groupList: [{ name: 'Saved', linkList: [] }] },
      ]),
    )

    store.dispatch(
      moveLinkData({
        sourcePageIndex: 0,
        sourceGroupIndex: 0,
        sourceLinkIndex: 0,
        destination: { type: 'existing', pageIndex: 1, groupIndex: 0 },
      }),
    )

    const { linkPages } = store.getState()
    expect(linkPages[0].groupList[0].linkList).toEqual([])
    expect(linkPages[1].groupList[0].linkList).toEqual([link])
  })

  it('creates a new group while moving a link and preserves an emptied source group', () => {
    const link: LinkData = {
      text: 'Move Me',
      url: 'https://example.com',
      color: 'blue',
      outline: false,
    }
    store.dispatch(
      overwriteConfig([{ name: 'Work', groupList: [{ name: 'Source', linkList: [link] }] }]),
    )

    store.dispatch(
      moveLinkData({
        sourcePageIndex: 0,
        sourceGroupIndex: 0,
        sourceLinkIndex: 0,
        destination: { type: 'new-group', pageIndex: 0, groupName: 'Archive' },
      }),
    )

    expect(store.getState().linkPages[0].groupList).toEqual([
      { name: 'Source', linkList: [] },
      { name: 'Archive', linkList: [link] },
    ])
  })

  it('creates a new tab and group as part of the link move', () => {
    const link: LinkData = {
      text: 'Move Me',
      url: 'https://example.com',
      color: 'blue',
      outline: false,
    }
    store.dispatch(
      overwriteConfig([{ name: 'Work', groupList: [{ name: 'Source', linkList: [link] }] }]),
    )

    store.dispatch(
      moveLinkData({
        sourcePageIndex: 0,
        sourceGroupIndex: 0,
        sourceLinkIndex: 0,
        destination: { type: 'new-page', pageName: 'Personal', groupName: 'Bookmarks' },
      }),
    )

    expect(store.getState().linkPages).toEqual([
      { name: 'Work', groupList: [{ name: 'Source', linkList: [] }] },
      { name: 'Personal', groupList: [{ name: 'Bookmarks', linkList: [link] }] },
    ])
  })

  it('moves a group and all its links to another existing tab', () => {
    const group: LinkGroup = {
      name: 'Research',
      color: 'teal',
      linkList: [{ text: 'Article', url: 'https://example.com', color: 'blue', outline: false }],
    }
    store.dispatch(
      overwriteConfig([
        { name: 'Work', groupList: [group] },
        { name: 'Personal', groupList: [{ name: 'Other', linkList: [] }] },
      ]),
    )

    store.dispatch(
      moveLinkGroup({
        sourcePageIndex: 0,
        sourceGroupIndex: 0,
        destination: { type: 'existing', pageIndex: 1 },
      }),
    )

    expect(store.getState().linkPages).toEqual([
      { name: 'Work', groupList: [] },
      { name: 'Personal', groupList: [{ name: 'Other', linkList: [] }, group] },
    ])
  })

  it('creates a new tab when moving a group', () => {
    const group: LinkGroup = {
      name: 'Research',
      linkList: [{ text: 'Article', url: 'https://example.com', color: 'blue', outline: false }],
    }
    store.dispatch(overwriteConfig([{ name: 'Work', groupList: [group] }]))

    store.dispatch(
      moveLinkGroup({
        sourcePageIndex: 0,
        sourceGroupIndex: 0,
        destination: { type: 'new-page', pageName: 'Personal' },
      }),
    )

    expect(store.getState().linkPages).toEqual([
      { name: 'Work', groupList: [] },
      { name: 'Personal', groupList: [group] },
    ])
  })

  it('should update localStorage when state changes', () => {
    store.dispatch(setSelectedDash('newDash'))
    store.dispatch(setNumberOfColumns(4))

    // Simulate state update and check if localStorage is updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'app',
      JSON.stringify({
        selectedDash: 'newDash',
        quickDashConfig: [],
        numberOfColumns: 4,
        fontSize: 16,
        darkMode: false,
      }),
    )
  })
})
