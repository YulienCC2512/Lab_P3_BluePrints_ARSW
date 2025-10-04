import { describe, it, expect } from 'vitest'
import { selectTopBlueprints } from '../src/features/blueprints/blueprintsSelectors.js'

describe('selectors', () => {
  it('selectTopBlueprints returns top items by points', () => {
    const state = {
      blueprints: {
        byAuthor: {
          a: [{ name: 'one', points: [{}, {}] }, { name: 'two', points: [{}] }],
          b: [{ name: 'three', points: [{}, {}, {}] }],
        },
      },
    }

    const top = selectTopBlueprints(state)
    expect(top[0].name).toBe('three')
    expect(top.length).toBeGreaterThan(0)
  })
})
