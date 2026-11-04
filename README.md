# Countries Catalog

A catalog web application built with React and TypeScript. Users can search
countries, sort results, and open a country details page. Data comes from the
[REST Countries API v5](https://restcountries.com).

## Tech stack

- Vite + React + TypeScript (strict mode)
- Redux Toolkit + react-redux
- React Router (declarative routes; data fetching stays in Redux)
- styled-components
- Jest + React Testing Library
- Cypress (e2e)
- ESLint + Prettier

## Prerequisites

- [Node.js](https://nodejs.org/) LTS
- A free API key from [restcountries.com/sign-up](https://restcountries.com/sign-up)

## Getting started

```bash
npm install
cp .env.example .env.local
# Edit .env.local and set VITE_API_KEY=<your key>
npm run dev
```

## REST Countries API (v5)

| Item | Value |
| --- | --- |
| Real host | `https://api.restcountries.com/countries/v5` |
| Local base URL | `/api/countries/v5` (Vite proxy — see below) |
| Auth | `Authorization: Bearer <VITE_API_KEY>` |

### Environment variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Client API base (`/api/countries/v5` for local proxy) |
| `VITE_API_KEY` | Bearer token (required; put the real value only in `.env.local`) |
| `VITE_APP_ENV` | `development` / `production` / `test` |

Files:

- `.env.development` / `.env.production` — committed mode defaults (no secrets)
- `.env.example` — documented template with empty `VITE_API_KEY=`
- `.env.local` — gitignored; holds your real key

**Warning:** any `VITE_` variable is embedded in the client bundle. Do **not** deploy a
production build that contains a real API key to a public host.

### Vite proxy (CORS)

The API key’s CORS allowlist rejects browser calls from `http://localhost:5173`
(`originNotAllowed`). Dev and preview therefore call the same-origin path
`/api/countries/v5`. Vite’s `server.proxy` / `preview.proxy` forward to
`https://api.restcountries.com/countries/v5`, strip the browser `Origin` header, and
inject `Authorization: Bearer <VITE_API_KEY>` from the environment.

All `import.meta.env` access goes through `src/utils/config.ts` (and pure
`readConfig` in `src/utils/readConfig.ts`).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server (port 5173) |
| `npm run build` | Typecheck and production build (no source maps, minified) |
| `npm run build:dev` | Typecheck and development-mode build (with source maps) |
| `npm run preview` | Preview the production build locally (proxy enabled) |
| `npm run lint` | Run ESLint |
| `npm run format` | Format the repo with Prettier |
| `npm run typecheck` | TypeScript project references check (`tsc -b --noEmit`) |
| `npm test` | Run unit tests once |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:coverage` | Unit tests with coverage (enforces global 60% threshold) |
| `npm run test:coverage:check` | Alias of `test:coverage` |
| `npm run e2e` | Start the dev server and run Cypress headless |
| `npm run e2e:open` | Open the Cypress interactive runner |

## Testing

### Unit and integration (Jest)

```bash
npm test
npm run test:coverage
```

`test:coverage` fails if global statements, branches, functions, or lines fall
below **60%**. Snapshot tests for presentational components use
`jest-styled-components` so CSS rules appear in snapshots instead of hashed
class names.

Update snapshots after intentional UI changes:

```bash
npx jest -u
# or
npm test -- -u
```

### End-to-end (Cypress)

```bash
npm run e2e        # headless; starts Vite, runs specs, stops the server
npm run e2e:open   # interactive (start `npm run dev` separately if needed)
```

E2E uses `cy.intercept` with fixtures under `cypress/fixtures/` (same shapes as
`src/test/fixtures/`). A catch-all intercept fails the run if the live API host
is contacted.

## Routes

| Path | Page | Behavior |
| --- | --- | --- |
| `/` | SearchPage | Empty state (“0 countries found”); no API request |
| `/search/:query` | SearchPage | Decoded query prefills the input and runs the search (Name by default, or current Redux search type) |
| `/country/:code` | CountryPage | Loads details by alpha-3 code; unknown code shows the same 404 UI |
| `*` | NotFoundPage | Unknown URLs; “Go to search” returns to `/` |

Changing search type (Name / Region) or sort (Population / Area) does **not** change the route.

Vite’s default `appType: 'spa'` serves `index.html` for unknown paths in both
`npm run dev` and `npm run preview`, so client-side routes work on reload.

## Project structure

```
src/
  api/           # REST Countries v5 client, DTOs, mappers
  app/           # Redux store, typed hooks, React Router setup
  features/countries/   # slice, thunks, selectors, domain types
  components/    # dumb/presentational UI (props only; no Redux/router)
  containers/    # smart components (Redux + router hooks)
  pages/         # page composition of containers only
  styles/        # theme + global styles
  utils/         # config, formatting, logger
  test/          # Jest setup, fixtures, shared helpers
```

**Smart/dumb rule:** components in `src/components/` receive data and callbacks via
props and never import Redux or React Router. Containers in `src/containers/`
connect to the store and router hooks and pass props down. Pages only compose
containers (and may use router hooks when needed).

## Branching

This project follows GitFlow:

- `main` — production-ready releases
- `develop` — integration branch for completed features
- `feature/*` — short-lived feature branches (e.g. `feature/task-5-api`)

Never commit directly to `main`. Open a feature branch from `develop`, then merge
back into `develop` when the task is done.
