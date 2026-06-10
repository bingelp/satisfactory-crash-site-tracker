import type { CollectionMap } from '../types'

const STORAGE_KEY = 'sf-crash-sites-collection'

export interface StorageService {
  load(): CollectionMap
  save(map: CollectionMap): void
  clear(): void
}

export const storageService: StorageService = {
  load(): CollectionMap {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? (JSON.parse(raw) as CollectionMap) : {}
    } catch {
      return {}
    }
  },

  save(map: CollectionMap): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
    } catch {
      // storage quota exceeded or unavailable — fail silently
    }
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  },
}
