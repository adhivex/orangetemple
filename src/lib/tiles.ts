/**
 * Homepage "explore" tiles (D-007): tiles with no published temples are hidden, and a
 * section with fewer than three tiles is hidden entirely.
 */
export const MIN_TILES = 3

export function visibleTiles<T extends { count: number }>(tiles: T[]): T[] {
  const nonEmpty = tiles.filter((tile) => tile.count > 0)
  return nonEmpty.length >= MIN_TILES ? nonEmpty : []
}
