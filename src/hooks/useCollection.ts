import { useState, useCallback } from 'react'
import type { CollectionMap, SiteCollectedState } from '../types'
import { storageService } from '../services/storage'

export function useCollection() {
  const [collection, setCollection] = useState<CollectionMap>(() =>
    storageService.load()
  )

  const persist = useCallback((next: CollectionMap) => {
    storageService.save(next)
    setCollection(next)
  }, [])

  const getState = useCallback(
    (siteId: string): SiteCollectedState =>
      collection[siteId] ?? { hardDriveCollected: false, componentsCollected: false },
    [collection]
  )

  const markHardDrive = useCallback(
    (siteId: string) => {
      persist({
        ...collection,
        [siteId]: { hardDriveCollected: true, componentsCollected: true },
      })
    },
    [collection, persist]
  )

  const markComponentsOnly = useCallback(
    (siteId: string) => {
      const current = getState(siteId)
      if (current.hardDriveCollected) return
      persist({
        ...collection,
        [siteId]: { hardDriveCollected: false, componentsCollected: true },
      })
    },
    [collection, getState, persist]
  )

  const unmark = useCallback(
    (siteId: string) => {
      const next = { ...collection }
      delete next[siteId]
      persist(next)
    },
    [collection, persist]
  )

  const resetAll = useCallback(() => {
    storageService.clear()
    setCollection({})
  }, [])

  const hardDriveCount = Object.values(collection).filter(
    (s) => s.hardDriveCollected
  ).length

  return { collection, getState, markHardDrive, markComponentsOnly, unmark, resetAll, hardDriveCount }
}
