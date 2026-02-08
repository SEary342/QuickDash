import * as mdiIcons from '@mdi/js'
import { describe, expect, test } from 'vitest'

import { colorConversions, colorOptionsArray, getColorLookup } from './colors'
import { iconOptionsArray, iconTranslation } from './icons'

describe('colors.ts', () => {
  test('getColorLookup returns correct color struct for known color', () => {
    const red = getColorLookup('red')
    expect(red).toBeDefined()
    expect(red.name).toBe('Red')
    expect(red.background).toBe('bg-red-600')
  })

  test('getColorLookup returns unknown color struct for unknown color', () => {
    const unknown = getColorLookup('non-existent-color')
    expect(unknown).toBeDefined()
    expect(unknown.name).toBe('Unknown')
    expect(unknown.background).toBe('bg-gray-200 dark:bg-gray-600')
  })

  test('getColorLookup returns unknown color struct for undefined color', () => {
    const unknown = getColorLookup(undefined)
    expect(unknown).toBeDefined()
    expect(unknown.name).toBe('Unknown')
  })

  test('colorOptionsArray is sorted by title', () => {
    const titles = colorOptionsArray.map((c) => c.title)
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
    expect(titles).toEqual(sortedTitles)
  })

  test('colorConversions maps legacy names to new colors', () => {
    expect(colorConversions['Danger']).toBe('red')
    expect(colorConversions['Success']).toBe('green')
  })
})

describe('icons.ts', () => {
  test('iconTranslation maps keys to mdi icons', () => {
    // Verify that the translation map correctly resolves the mdi icon path
    // 'Death Star' -> 'mdi-death-star' -> mdiDeathStar
    expect(iconTranslation['mdi-death-star']).toBe(mdiIcons.mdiDeathStar)
    expect(iconTranslation['mdi-account']).toBe(mdiIcons.mdiAccount)
  })

  test('iconOptionsArray is sorted by title', () => {
    const titles = iconOptionsArray.map((i) => i.title)
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
    expect(titles).toEqual(sortedTitles)
  })

  test('iconOptionsArray contains expected values', () => {
    const deathStar = iconOptionsArray.find((i) => i.title === 'Death Star')
    expect(deathStar).toBeDefined()
    expect(deathStar?.value).toBe('mdi-death-star')
  })
})
