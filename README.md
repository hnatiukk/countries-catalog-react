# Countries Catalog

A catalog web application built with React and TypeScript. Users can search
countries, sort results, and open a country details page. Data comes from the
[REST Countries API](https://restcountries.com) (v3.1, free, no API key).

## Prerequisites

- [Node.js](https://nodejs.org/) LTS

## Getting started

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production build

```bash
npm run build
npm run preview
```

### Lint, format, and typecheck

```bash
npm run lint
npm run format
npm run typecheck
```

## Branching

This project follows GitFlow:

- `main` — production-ready releases
- `develop` — integration branch for completed features
- `feature/*` — short-lived feature branches (e.g. `feature/task-1-init`)

Never commit directly to `main`. Open a feature branch from `develop`, then merge
back into `develop` when the task is done.
