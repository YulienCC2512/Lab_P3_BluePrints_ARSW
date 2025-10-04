import { createSelector } from '@reduxjs/toolkit'

const selectAllBlueprints = (state) =>
  Object.values(state.blueprints.byAuthor).flat()

export const selectTopBlueprints = createSelector(
  [selectAllBlueprints],
  (blueprints) =>
    [...blueprints]
      .sort((a, b) => (b.points?.length || 0) - (a.points?.length || 0))
      .slice(0, 5)
)
