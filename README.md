# Satisfactory Crash Site Tracker

A mobile/tablet-friendly web app for tracking crash site collection in [Satisfactory](https://www.satisfactorygame.com/). Browse ~110 crash sites across all regions, mark hard drives and scattered loot as collected, and filter by region or item to plan your next run.

## Features

- **Swipe to collect** — swipe right to mark a hard drive collected, swipe left to mark loot-only collected
- **Smart filtering** — filter by region or search for a specific item (e.g. "Computer") to find sites that still have it
- **Progress tracking** — header shows hard drives collected out of total
- **Persistent state** — collection state saved to localStorage; survives page refreshes
- **Satisfactory aesthetic** — dark industrial sci-fi UI matching the game's visual style

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v3
- react-swipeable

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
