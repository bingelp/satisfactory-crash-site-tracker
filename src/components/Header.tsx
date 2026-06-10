import { useState, useRef, useEffect } from 'react'
import type { CollectionMap } from '../types'

interface Props {
  hardDriveCount: number
  totalSites: number
  showCollected: boolean
  onToggleShowCollected: () => void
  onReset: () => void
  onExport: () => void
  onImport: (map: CollectionMap) => void
}

export function Header({ hardDriveCount, totalSites, showCollected, onToggleShowCollected, onReset, onExport, onImport }: Props) {
  const pct = totalSites > 0 ? (hardDriveCount / totalSites) * 100 : 0
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [menuOpen])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as CollectionMap
        onImport(data)
      } catch {
        alert('Invalid JSON file')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <header className="sticky top-0 z-50 bg-sf-card border-b border-sf-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <h1 className="font-mono text-sm uppercase tracking-widest text-sf-orange font-bold">
            CRASH SITES
          </h1>
          <p className="font-mono text-xs text-sf-muted">
            <span className="text-sf-cyan font-bold">{hardDriveCount}</span>
            <span className="text-sf-border"> / </span>
            <span>{totalSites}</span>
            <span className="text-sf-muted"> HARD DRIVES COLLECTED</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleShowCollected}
            title={showCollected ? 'Hide collected' : 'Show collected'}
            className={`px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider border transition-colors ${
              showCollected
                ? 'bg-sf-orange/20 text-sf-orange border-sf-orange/40'
                : 'bg-sf-border/40 text-sf-muted border-sf-border hover:border-sf-orange/30 hover:text-sf-orange'
            }`}
          >
            {showCollected ? '◉ ALL' : '◎ ACTIVE'}
          </button>

          {/* Settings cog */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              title="Settings"
              className={`px-2.5 py-1.5 font-mono text-sm border transition-colors ${
                menuOpen
                  ? 'border-sf-orange/40 text-sf-orange'
                  : 'border-sf-border text-sf-muted hover:border-sf-orange/30 hover:text-sf-orange'
              }`}
            >
              ⚙
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 min-w-[140px] bg-sf-card border border-sf-border z-[60] shadow-lg">
                <button
                  onClick={() => { onExport(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-sf-muted hover:bg-sf-card-hover hover:text-sf-text transition-colors"
                >
                  ↓ Export
                </button>
                <button
                  onClick={() => { fileInputRef.current?.click(); setMenuOpen(false) }}
                  className="w-full text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-sf-muted hover:bg-sf-card-hover hover:text-sf-text transition-colors"
                >
                  ↑ Import
                </button>
                <div className="border-t border-sf-border" />
                <button
                  onClick={() => { setMenuOpen(false); setConfirmingReset(true) }}
                  className="w-full text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-sf-muted hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                  ✕ Reset
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      {/* Reset confirmation strip */}
      {confirmingReset && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-900/20 border-t border-sf-border">
          <p className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold">
            [ RESET ALL PROGRESS ]
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { onReset(); setConfirmingReset(false) }}
              className="px-3 py-2 font-mono text-xs uppercase tracking-widest font-bold bg-red-700 hover:bg-red-600 text-white"
            >
              CONFIRM
            </button>
            <button
              onClick={() => setConfirmingReset(false)}
              className="px-3 py-2 font-mono text-xs uppercase tracking-widest bg-sf-border hover:bg-sf-card-hover text-sf-muted"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-0.5 bg-sf-bg">
        <div
          className="h-full bg-sf-orange transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  )
}
