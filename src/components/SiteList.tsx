import type { CrashSite, CollectionMap } from '../types'
import { CrashSiteCard } from './CrashSiteCard'

interface Props {
  sites: CrashSite[]
  collection: CollectionMap
  onMarkHardDrive: (id: string) => void
  onMarkComponentsOnly: (id: string) => void
  onUnmark: (id: string) => void
}

export function SiteList({ sites, collection, onMarkHardDrive, onMarkComponentsOnly, onUnmark }: Props) {
  if (sites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <p className="font-mono text-3xl text-sf-border mb-4">◎</p>
        <p className="font-mono text-xs uppercase tracking-widest text-sf-muted">No sites found</p>
        <p className="font-mono text-xs text-sf-muted/50 mt-1">Adjust filters or show collected sites</p>
      </div>
    )
  }

  return (
    <div className="px-3 pt-3 pb-24">
      {sites.map((site) => (
        <CrashSiteCard
          key={site.id}
          site={site}
          state={collection[site.id] ?? { hardDriveCollected: false, componentsCollected: false }}
          onMarkHardDrive={onMarkHardDrive}
          onMarkComponentsOnly={onMarkComponentsOnly}
          onUnmark={onUnmark}
        />
      ))}
    </div>
  )
}
