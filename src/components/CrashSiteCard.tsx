import { useState } from 'react'
import type { CrashSite, SiteCollectedState } from '../types'

interface Props {
  site: CrashSite
  state: SiteCollectedState
  onMarkHardDrive: (id: string) => void
  onMarkComponentsOnly: (id: string) => void
  onMarkSite: (id: string) => void
  onUnmark: (id: string) => void
}

function UnlockBadge({ req }: { req: CrashSite['unlockRequirement'] }) {
  if (req.type === 'none') {
    return (
      <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-green-900/40 text-green-400 border border-green-800">
        FREE
      </span>
    )
  }
  if (req.type === 'power') {
    return (
      <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-sf-cyan/10 text-sf-cyan border border-sf-cyan/30">
        {req.megawatts} MW
      </span>
    )
  }
  return (
    <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-sf-orange/10 text-sf-orange border border-sf-orange/30">
      {req.quantity}× {req.item}
    </span>
  )
}

export function CrashSiteCard({ site, state, onMarkHardDrive, onMarkComponentsOnly, onMarkSite, onUnmark }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [confirming, setConfirming] = useState<'hd' | 'loot' | null>(null)

  const { hardDriveCollected, componentsCollected } = state
  const isFullyDone = hardDriveCollected
  const isLootOnly = !hardDriveCollected && componentsCollected
  const isMarked = !componentsCollected && !hardDriveCollected && !!state.marked

  if (confirming) {
    const isHD = confirming === 'hd'
    return (
      <div className={`border border-sf-border mb-2 overflow-hidden ${isHD ? 'border-l-2 border-l-green-500' : 'border-l-2 border-l-yellow-500'}`}>
        <div className={`flex items-center justify-between px-4 py-4 ${isHD ? 'bg-green-900/20' : 'bg-yellow-900/20'}`}>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-sf-muted mb-1">{site.region}</p>
            <p className={`font-mono text-sm font-bold uppercase tracking-wide ${isHD ? 'text-green-400' : 'text-yellow-400'}`}>
              {isHD ? '[ HARD DRIVE COLLECTED ]' : '[ LOOT ONLY ]'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (isHD) onMarkHardDrive(site.id)
                else onMarkComponentsOnly(site.id)
                setConfirming(null)
              }}
              className={`px-3 py-2 font-mono text-xs uppercase tracking-widest font-bold ${isHD ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-black'}`}
            >
              CONFIRM
            </button>
            <button
              onClick={() => setConfirming(null)}
              className="px-3 py-2 font-mono text-xs uppercase tracking-widest bg-sf-border hover:bg-sf-card-hover text-sf-muted"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    )
  }

  const leftStripeColor = isFullyDone
    ? 'border-l-green-600'
    : isLootOnly
    ? 'border-l-yellow-500'
    : isMarked
    ? 'border-l-sf-cyan'
    : 'border-l-sf-orange'

  return (
    <div
      className={`relative mb-2 overflow-hidden border border-sf-border border-l-2 ${leftStripeColor} ${isFullyDone ? 'opacity-50' : ''}`}
    >
      <div
        className="relative bg-sf-card cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        {/* Header row */}
        <div className="flex items-start justify-between px-3 pt-3 pb-2 gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs uppercase tracking-widest text-sf-orange font-bold">
                {site.region}
              </span>
              {site.locationNote && (
                <span className="font-mono text-xs text-sf-muted truncate">
                  — {site.locationNote}
                </span>
              )}
            </div>
            {site.coordinates && (
              <p className="font-mono text-xs text-sf-muted/60 mt-0.5">
                X: <span className="text-sf-cyan/70">{site.coordinates.x.toFixed(0)}</span>
                {' '}Y: <span className="text-sf-cyan/70">{site.coordinates.y.toFixed(0)}</span>
              </p>
            )}
          </div>

          {/* Status chip */}
          <div className="shrink-0">
            {isFullyDone ? (
              <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-green-900/40 text-green-400 border border-green-800">
                ✓ HD
              </span>
            ) : isLootOnly ? (
              <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-yellow-900/40 text-yellow-400 border border-yellow-800">
                LOOTED
              </span>
            ) : isMarked ? (
              <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-sf-cyan/10 text-sf-cyan border border-sf-cyan/30">
                ◎ MARKED
              </span>
            ) : (
              <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-sf-border text-sf-muted">
                UNCOL
              </span>
            )}
          </div>
        </div>

        {/* Unlock + guards row */}
        <div className="px-3 pb-2 flex flex-wrap gap-1.5 items-center">
          <UnlockBadge req={site.unlockRequirement} />
          {site.guards.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs font-mono uppercase tracking-wider bg-red-900/30 text-red-400 border border-red-900">
              ⚠ {site.guards.length === 1 ? site.guards[0] : `${site.guards.length} GUARDS`}
            </span>
          )}
        </div>

        {/* Loot preview (collapsed) */}
        {!expanded && site.scatteredComponents.length > 0 && (
          <div className="px-3 pb-3 flex flex-wrap gap-1">
            {site.scatteredComponents.slice(0, 4).map((c, i) => (
              <span key={i} className="px-1.5 py-0.5 text-xs font-mono text-sf-muted bg-sf-bg border border-sf-border/50 uppercase tracking-wide">
                {c.item}
              </span>
            ))}
            {site.scatteredComponents.length > 4 && (
              <span className="px-1.5 py-0.5 text-xs font-mono text-sf-muted/50">
                +{site.scatteredComponents.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Expanded content */}
        {expanded && (
          <div className="border-t border-sf-border px-3 py-3 space-y-3">
            {site.scatteredComponents.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-sf-muted mb-1.5">Scattered Components</p>
                <div className="space-y-1">
                  {site.scatteredComponents.map((c, i) => (
                    <div key={i} className="flex justify-between font-mono text-xs">
                      <span className="text-sf-text uppercase">{c.item}</span>
                      <span className="text-sf-cyan">{c.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {site.guards.length > 0 && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-sf-muted mb-1.5">Guards</p>
                <div className="space-y-0.5">
                  {site.guards.map((g, i) => (
                    <p key={i} className="font-mono text-xs text-red-400">• {g}</p>
                  ))}
                </div>
              </div>
            )}

            {(site.coordinates || site.altitude !== null) && (
              <div>
                <p className="font-mono text-xs uppercase tracking-widest text-sf-muted mb-1.5">Location</p>
                {site.coordinates && (
                  <p className="font-mono text-xs text-sf-text">
                    X: <span className="text-sf-cyan">{site.coordinates.x.toFixed(0)}</span>
                    {' '}Y: <span className="text-sf-cyan">{site.coordinates.y.toFixed(0)}</span>
                    {site.altitude !== null && <> Alt: <span className="text-sf-cyan">{site.altitude}</span></>}
                  </p>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-1 border-t border-sf-border" onClick={(e) => e.stopPropagation()}>
              {!isMarked && !isLootOnly && !isFullyDone && (
                <button
                  onClick={() => onMarkSite(site.id)}
                  className="flex-1 py-2 font-mono text-xs uppercase tracking-widest bg-sf-cyan/10 hover:bg-sf-cyan/20 text-sf-cyan border border-sf-cyan/30"
                >
                  ◎ Marked
                </button>
              )}
              {!isLootOnly && !isFullyDone && (
                <button
                  onClick={() => setConfirming('loot')}
                  className="flex-1 py-2 font-mono text-xs uppercase tracking-widest bg-yellow-800/40 hover:bg-yellow-700/60 text-yellow-400 border border-yellow-800"
                >
                  ◆ Loot Only
                </button>
              )}
              {!isFullyDone && (
                <button
                  onClick={() => setConfirming('hd')}
                  className="flex-1 py-2 font-mono text-xs uppercase tracking-widest bg-green-800/40 hover:bg-green-700/60 text-green-400 border border-green-800"
                >
                  ✓ Hard Drive
                </button>
              )}
              {(isMarked || isLootOnly || isFullyDone) && (
                <button
                  onClick={() => onUnmark(site.id)}
                  className="flex-1 py-2 font-mono text-xs uppercase tracking-widest bg-sf-border hover:bg-sf-card-hover text-sf-muted"
                >
                  ✕ Unmark
                </button>
              )}
            </div>
          </div>
        )}

        {/* Expand toggle hint */}
        <div className="flex justify-center pb-1">
          <span className="text-sf-border text-xs select-none">
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>
    </div>
  )
}
