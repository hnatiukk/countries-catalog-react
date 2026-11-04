# Countries Catalog

A catalog web application built with React and TypeScript. Users can search
countries, sort results, and open a country details page. Data comes from the
[REST Countries API](https://restcountries.com) (v3.1, free, no API key).

## Tech stack

- Vite + React + TypeScript (strict mode)
- Redux Toolkit + react-redux
- styled-components
- Jest + React Testing Library
- ESLint + Prettier

## Prerequisites

- [Node.js](https://nodejs.org/) LTS

## Getting started

```bash
npm install
```

## Environment variables

Committed mode files (no secrets):

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | REST Countries API base URL | `https://restcountries.com/v3.1` |
| `VITE_APP_ENV` | App environment label | `development` / `production` |

Files:

- `.env.development` — used by `npm run dev` and `npm run build:dev`
- `.env.production` — used by `npm run build`
- `.env.example` — documented template

Local overrides belong in `.env*.local` (gitignored). Never commit real secrets.
All `import.meta.env` access goes through `src/utils/config.ts`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 5173) |
| `npm run build` | Typecheck and production build (no source maps, minified) |
| `npm run build:dev` | Typecheck and development-mode build (with source maps) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the repo with Prettier |
| `npm run typecheck` | TypeScript project references check (`tsc -b --noEmit`) |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Run unit tests with a coverage report |
| `npm run test:coverage:check` | Coverage report plus a global 60% threshold |

## Project structure

```
src/
  api/           # REST Countries client (Task 5)
  app/           # Redux store, typed hooks
  features/      # countries slice, selectors, types, temporary mock data
  components/    # dumb/presentational UI (props only; no Redux/router)
  containers/    # smart components (Redux + wiring)
  pages/         # page composition of containers only
  styles/        # theme + global styles
  utils/         # config, formatting, logger
  test/          # Jest setup and shared test helpers
```

**Smart/dumb rule:** components in `src/components/` receive data and callbacks via
props and never import Redux or React Router. Containers in `src/containers/`
connect to the store (and later the router) and pass props down. Pages only
compose containers.

**Temporary in this task:** `src/features/countries/mockData.ts` feeds the UI until
the API is wired (Task 5). `App.tsx` uses a small `useState` view switch until
React Router lands (Task 6).

## Branching

This project follows GitFlow:

- `main` — production-ready releases
- `develop` — integration branch for completed features
- `feature/*` — short-lived feature branches (e.g. `feature/task-1-init`)

Never commit directly to `main`. Open a feature branch from `develop`, then merge
back into `develop` when the task is done.
