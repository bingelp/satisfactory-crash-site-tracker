import { useCallback, useMemo, useState } from 'react'
import crashSitesData from './data/crash_sites.json'
import type { CrashSite, CollectionMap, Filters } from './types'
import { useCollection } from './hooks/useCollection'
import { useFilteredSites } from './hooks/useFilteredSites'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { SiteList } from './components/SiteList'

const allSites = crashSitesData as CrashSite[]

const allRegions = [...new Set(allSites.map((s) => s.region))].sort()

export default function App() {
  const { collection, markHardDrive, markComponentsOnly, markSite, unmark, resetAll, importCollection, hardDriveCount } =
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

  const activeCount = useMemo(() => visibleSites.length, [visibleSites])

  const regionTotal = useMemo(
    () => filters.region === 'ALL'
      ? allSites.length
      : allSites.filter((s) => s.region === filters.region).length,
    [filters.region]
  )

  const handleExport = useCallback(() => {
    const json = JSON.stringify(collection, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crash-sites-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [collection])

  const handleImport = useCallback((map: CollectionMap) => {
    importCollection(map)
  }, [importCollection])

  return (
    <div className="min-h-screen bg-sf-bg flex flex-col max-w-2xl mx-auto">
      <Header
        hardDriveCount={hardDriveCount}
        totalSites={allSites.length}
        showCollected={filters.showCollected}
        onToggleShowCollected={toggleShowCollected}
        onReset={resetAll}
        onExport={handleExport}
        onImport={handleImport}
      />
      <FilterBar
        regions={allRegions}
        region={filters.region}
        itemSearch={filters.itemSearch}
        onRegionChange={setRegion}
        onItemSearchChange={setItemSearch}
        visibleCount={activeCount}
        totalCount={regionTotal}
      />
      <main className="flex-1">
        <SiteList
          sites={visibleSites}
          collection={collection}
          onMarkHardDrive={markHardDrive}
          onMarkComponentsOnly={markComponentsOnly}
          onMarkSite={markSite}
          onUnmark={unmark}
        />
      </main>
    </div>
  )
}
