import { describe, expect, test } from 'vitest'

import { getFuzzyMatchScore } from './fuzzySearch'

describe('getFuzzyMatchScore', () => {
  test('matches exact terms without regard to case', () => {
    expect(getFuzzyMatchScore('GITHUB', ['GitHub Projects'])).toBe(1)
  })

  test('matches partial terms', () => {
    expect(getFuzzyMatchScore('doc', ['Google Docs'])).toBe(0.9)
  })

  test('matches a close spelling using edit distance', () => {
    expect(getFuzzyMatchScore('gogle', ['Google Docs'])).toBeCloseTo(0.8333, 3)
  })

  test('requires every query term to match and can match across fields', () => {
    expect(getFuzzyMatchScore('cloud infrastructure', ['Cloud Console', 'Infrastructure'])).toBe(1)
    expect(getFuzzyMatchScore('cloud missing', ['Cloud Console', 'Infrastructure'])).toBeUndefined()
  })

  test('returns no match for an empty or unrelated query', () => {
    expect(getFuzzyMatchScore('   ', ['Google Docs'])).toBeUndefined()
    expect(getFuzzyMatchScore('spaceship', ['Google Docs'])).toBeUndefined()
  })

  test('gives stronger matches a higher score', () => {
    const exactScore = getFuzzyMatchScore('calendar', ['Release Calendar'])
    const partialScore = getFuzzyMatchScore('calend', ['Release Calendar'])

    expect(exactScore).toBeGreaterThan(partialScore ?? 0)
  })
})
