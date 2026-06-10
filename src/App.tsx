import { useMemo, useState } from 'react'
import crashSitesData from './data/crash_sites.json'
import type { CrashSite, Filters } from './types'
import { useCollection } from './hooks/useCollection'
import { useFilteredSites } from './hooks/useFilteredSites'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { SiteList } from './components/SiteList'

const allSites = crashSitesData as CrashSite[]

const allRegions = [...new Set(allSites.map((s) => s.region))].sort()

export default function App() {
  const { collection, markHardDrive, markComponentsOnly, unmark, resetAll, hardDriveCount } =
    useCollection()

  const [filters, setFilters] = useState<Filters>({
    region: 'ALL',
    itemSearch: '',
    showCollected: false,
  })

  const visibleSites = useFilteredSites(allSites, collection, filters)

  const setRegion = (region: string) => setFilters((f) => ({ ...f, region }))
  const setItemSearch = (itemSearch: string) => setFilters((f) => ({ ...f, itemSearch }))
  const toggleShowCollected = () => setFilters((f) => ({ ...f, showCollected: !f.showCollected }))

  // Count sites that would be visible without showCollected restriction (for the count display)
  const activeCount = useMemo(
    () => visibleSites.length,
    [visibleSites]
  )

  return (
    <div className="min-h-screen bg-sf-bg flex flex-col max-w-2xl mx-auto">
      <Header
        hardDriveCount={hardDriveCount}
        totalSites={allSites.length}
        showCollected={filters.showCollected}
        onToggleShowCollected={toggleShowCollected}
        onReset={resetAll}
      />
      <FilterBar
        regions={allRegions}
        region={filters.region}
        itemSearch={filters.itemSearch}
        onRegionChange={setRegion}
        onItemSearchChange={setItemSearch}
        visibleCount={activeCount}
        totalCount={allSites.length}
      />
      <main className="flex-1">
        <SiteList
          sites={visibleSites}
          collection={collection}
          onMarkHardDrive={markHardDrive}
          onMarkComponentsOnly={markComponentsOnly}
          onUnmark={unmark}
        />
      </main>
    </div>
  )
}
