import { describe, expect, test } from 'vitest'

import { LinkPage } from '@src/types/linkPage'

import { hasDuplicatePageName, NEW_PAGE } from './moveDestinationUtils'

describe('moveDestinationUtils', () => {
  const pages: LinkPage[] = [
    { name: 'Work', groupList: [] },
    { name: 'Personal', groupList: [] },
  ]

  test('uses the expected new-tab selection value', () => {
    expect(NEW_PAGE).toBe('new-page')
  })

  test('detects duplicate tab names without regard to case or surrounding whitespace', () => {
    expect(hasDuplicatePageName(pages, '  work ')).toBe(true)
    expect(hasDuplicatePageName([{ name: '  Work  ', groupList: [] }], 'work')).toBe(true)
  })

  test('returns false when the name is unique', () => {
    expect(hasDuplicatePageName(pages, 'Archive')).toBe(false)
  })

  test('does not treat an empty name as a duplicate', () => {
    expect(hasDuplicatePageName(pages, '')).toBe(false)
    expect(hasDuplicatePageName(pages, '   ')).toBe(false)
    expect(hasDuplicatePageName([], 'Archive')).toBe(false)
  })
})
