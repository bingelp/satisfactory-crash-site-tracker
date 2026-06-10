interface Props {
  hardDriveCount: number
  totalSites: number
  showCollected: boolean
  onToggleShowCollected: () => void
  onReset: () => void
}

export function Header({ hardDriveCount, totalSites, showCollected, onToggleShowCollected, onReset }: Props) {
  const pct = totalSites > 0 ? (hardDriveCount / totalSites) * 100 : 0

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
            <span className="text-sf-muted"> HARD DRIVES</span>
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

          <button
            onClick={() => {
              if (confirm('Reset all collection progress? This cannot be undone.')) {
                onReset()
              }
            }}
            title="Reset all progress"
            className="px-2.5 py-1.5 font-mono text-xs uppercase tracking-wider border border-sf-border text-sf-muted hover:border-red-800 hover:text-red-400 transition-colors"
          >
            ✕ RESET
          </button>
        </div>
      </div>

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
