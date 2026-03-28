# Strategic Account Audit

Strategic Account Audit is a frontend-only React + TypeScript internal web app for account managers. It helps teams evaluate customer health, stakeholder coverage, process maturity, technology complexity, whitespace opportunity, sentiment, retention risk, and next actions.

## MVP scope

- Static SPA built with Vite + React + TypeScript + Tailwind CSS.
- Local persistence in browser `localStorage` only (per browser / per origin).
- JSON export/import (single account and full app state).
- Excel export via `xlsx`.
- Snapshots for periodic review trendlines.
- No backend, no auth, no CRM/SharePoint API integration in v1.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Test

```bash
npm run test
```

## Vercel deployment notes

1. Push repository to GitHub.
2. In Vercel, import the GitHub repository.
3. Keep default frontend settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
4. Enable production + preview deployments from main/PR branches.

## Data storage notice

This v1 stores all data only in browser localStorage using key `strategic-account-audit-v1`. It is intended for single-user/internal prototyping and is **not** a shared system of record.

## Future migration path

Domain logic is structured so storage can be swapped with a SharePoint/Microsoft Lists/Dataverse/custom API provider later.

## Sample screenshots

_Add screenshots here after first deployment._
