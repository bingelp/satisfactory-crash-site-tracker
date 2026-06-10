interface Props {
  regions: string[]
  region: string
  itemSearch: string
  onRegionChange: (r: string) => void
  onItemSearchChange: (s: string) => void
  visibleCount: number
  totalCount: number
}

export function FilterBar({
  regions,
  region,
  itemSearch,
  onRegionChange,
  onItemSearchChange,
  visibleCount,
  totalCount,
}: Props) {
  return (
    <div className="bg-sf-card border-b border-sf-border px-4 py-3 space-y-2">
      <div className="flex gap-2">
        {/* Region select */}
        <div className="relative flex-1">
          <select
            value={region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="w-full appearance-none bg-sf-bg border border-sf-border text-sf-text font-mono text-xs uppercase tracking-wider px-3 py-2 pr-8 focus:outline-none focus:border-sf-orange transition-colors"
          >
            <option value="ALL">ALL REGIONS</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r.toUpperCase()}</option>
            ))}
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sf-muted text-xs pointer-events-none">▼</span>
        </div>

        {/* Site count */}
        <div className="flex items-center px-3 border border-sf-border bg-sf-bg">
          <span className="font-mono text-xs text-sf-muted whitespace-nowrap">
            <span className="text-sf-cyan">{visibleCount}</span>/{totalCount}
          </span>
        </div>
      </div>

      {/* Item search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-muted text-xs pointer-events-none">⌕</span>
        <input
          type="text"
          value={itemSearch}
          onChange={(e) => onItemSearchChange(e.target.value)}
          placeholder="SEARCH LOOT (e.g. COMPUTER)"
          className="w-full bg-sf-bg border border-sf-border text-sf-text font-mono text-xs uppercase tracking-wider px-3 py-2 pl-8 placeholder:text-sf-muted/50 focus:outline-none focus:border-sf-orange transition-colors"
        />
        {itemSearch && (
          <button
            onClick={() => onItemSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sf-muted hover:text-sf-text text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {itemSearch && (
        <p className="font-mono text-xs text-sf-muted">
          Showing uncollected sites with <span className="text-sf-orange uppercase">{itemSearch}</span>
        </p>
      )}
    </div>
  )
}
