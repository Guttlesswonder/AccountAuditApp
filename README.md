# Strategic Account Audit (v1.1)

Strategic Account Audit is a frontend-only React + TypeScript internal web app for account managers and leadership account reviews. It is designed to be **executive-friendly in 2–5 minutes** while still supporting structured account audit workflows.

## What changed in v1.1

- Shortened checklist to 6 sections / 24 prompts.
- Default landing page is an executive summary.
- Most prompts use status + short answer only.
- Follow-up fields appear only when status is Unknown, At Risk, or Opportunity.
- Added dedicated Action Register (separate from checklist).
- Added Terms Summary + optional local PDF attachment (IndexedDB, not localStorage).
- Added account-level platform toggles (Denticon / Cloud 9 / Apteryx) to prioritize product views.
- Product matrix no longer includes owner fields.

## Local-first architecture

- Main app state persists in browser `localStorage` key: `strategic-account-audit-v1`.
- Terms PDFs persist in browser IndexedDB database: `strategic-account-audit-attachments-v1`.
- No backend/auth/API dependencies in v1.1.

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
2. Import project in Vercel.
3. Keep Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Enable preview + production deployments from Git.

## Important v1.1 storage note

Terms PDF attachments are **stored locally in this browser only** and are not shared across users/devices.

## Sample screenshots

_Add screenshots here after first deployed build._
