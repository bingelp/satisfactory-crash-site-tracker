import { useMemo } from 'react'
import type { CrashSite, CollectionMap, Filters } from '../types'

export function useFilteredSites(
  sites: CrashSite[],
  collection: CollectionMap,
  filters: Filters
) {
  return useMemo(() => {
    const { region, itemSearch, showCollected } = filters
    const query = itemSearch.trim().toLowerCase()

    return sites.filter((site) => {
      const state = collection[site.id]
      const hdCollected = state?.hardDriveCollected ?? false
      const compCollected = state?.componentsCollected ?? false

      // Always hide hard-drive-collected sites unless the toggle is on
      if (hdCollected && !showCollected) return false

      // Region filter
      if (region !== 'ALL' && site.region !== region) return false

      // Item search: only show sites where the item is in loot AND not yet looted
      if (query) {
        const hasItem = site.scatteredComponents.some((c) =>
          c.item.toLowerCase().includes(query)
        )
        if (!hasItem) return false
        // Hide if components already collected (or HD collected, which implies components)
        if (compCollected || hdCollected) return false
      }

      return true
    })
  }, [sites, collection, filters])
}
