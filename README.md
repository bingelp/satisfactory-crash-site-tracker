# Satisfactory Crash Site Tracker

A mobile/tablet-friendly web app for tracking crash site collection in [Satisfactory](https://www.satisfactorygame.com/). Browse ~110 crash sites across all regions, track your progress through three collection states, and filter by region or item to plan your next run.

## Features

- **Three collection states** — mark a site as **Marked** (located on the map), **Looted** (components collected), or **Hard Drive Collected**, each with a distinct colour indicator
- **Inline action buttons** — expand any card to mark it or step it through states; destructive actions (Loot Only, Hard Drive) require a confirmation step
- **Smart filtering** — filter by region or search for a specific item (e.g. "Computer") to find uncollected sites that contain it; count display reflects the selected region total
- **Coordinates on card** — collapsed cards show X/Y coordinates for quick reference when marking the in-game map
- **Progress tracking** — header shows hard drives collected out of total with a live progress bar
- **Persistent state** — collection state saved to localStorage; survives page refreshes
- **Import / Export** — back up and restore your collection as JSON via the ⚙ settings menu
- **Satisfactory aesthetic** — dark industrial sci-fi UI matching the game's visual style

## Settings menu (⚙)

| Action | Description |
|--------|-------------|
| Export | Downloads your current collection as a dated `.json` file |
| Import | Loads a previously exported `.json` file, replacing current state |
| Reset  | Clears all progress after an inline confirmation |

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v3

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build & Deploy

```bash
npm run build   # outputs to dist/
```

### Azure Static Web Apps

Set build configuration to:
- **App location**: `/crash-site-tracker`
- **Build command**: `npm run build`
- **Output location**: `dist`

### Azure Blob Storage

```bash
az storage blob upload-batch \
  --account-name <YOUR_STORAGE_ACCOUNT> \
  --source ./dist \
  --destination '$web' \
  --overwrite
```

## Data

Crash site data is sourced from the [Satisfactory Wiki](https://satisfactory.wiki.gg/wiki/Crash_Site) and stored in `src/data/crash_sites.json`. Each site includes region, coordinates, unlock requirement, guards, and scattered components.

## Future: Cloud Sync

Collection state is abstracted behind `src/services/storage.ts`. To add cross-device sync via Azure Cosmos DB, replace the localStorage implementation in that file with Cosmos DB calls via an Azure Function — no other code changes required.
