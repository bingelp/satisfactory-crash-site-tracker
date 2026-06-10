export interface ScatteredComponent {
  item: string
  quantity: number
}

export interface UnlockRequirement {
  type: 'none' | 'item' | 'power'
  quantity?: number
  item?: string
  megawatts?: number
}

export interface CrashSite {
  id: string
  region: string
  locationNote: string | null
  coordinates: { x: number; y: number } | null
  altitude: number | null
  unlockRequirement: UnlockRequirement
  guards: string[]
  scatteredComponents: ScatteredComponent[]
}

export interface SiteCollectedState {
  hardDriveCollected: boolean
  componentsCollected: boolean
  marked?: boolean
}

export type CollectionMap = Record<string, SiteCollectedState>

export interface Filters {
  region: string
  itemSearch: string
  showCollected: boolean
}
