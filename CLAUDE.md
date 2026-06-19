# CLAUDE.md

Guidance for Claude Code (claude.ai/code) in this repository.

## Project

<!-- TODO: Project description. Monorepo (Turborepo + pnpm, corepack enabled). -->

## Development — Docker-first

Everything runs in Docker. Do NOT run pnpm/node on the host — use `docker compose exec`
or the `Taskfile.yml` ([Task](https://taskfile.dev/)):

```bash
task up                  # Start all services (postgres, redis, mailpit, api, web)
task down                # Stop services
task build               # Full rebuild (Dockerfiles or base deps changed)
task restart -- web      # Restart a single service
task install             # Install deps in both containers
task db:push             # Push Drizzle schema
task db:reset            # Drop + recreate DB, push schema, seed
task seed                # Seed dev DB (demo@example.com / demo1234)
task check               # Type-check API + Web
task test                # All tests (API + Web)
task health              # Check that the API boots and the DB is reachable
```

After adding a dependency: `docker compose exec <service> pnpm install
--no-frozen-lockfile`, then restart the service.

## Quick Reference

- **ESM throughout** — `"type": "module"`. NO `.js` extensions on imports in TS source
  (except relative imports inside the API, which are resolved at runtime via tsx —
  there `.js` extensions are required, see `apps/api/src`).
- **Ports** — Postgres: 5434 (host; 5432 internal), API: 4000, Web: 3100
- **`ctx.db` instead of `db`** — routers/services use the injected `ctx.db`, never the
  direct import from `@app/db`. This lets tests substitute the test DB.
- **Ownership check** — every tRPC query/mutation filters on the session's `userId`
  (see `apps/api/src/router/note.ts`).
- **Shared validation** — Zod schemas live in `@app/shared` and are used by the API
  (tRPC input) and the web app (forms).
- **CI** — GitHub Actions: type-check + tests on push to `main` and on PRs.

## Architecture

- **API** (`apps/api`) — Fastify + tRPC + better-auth. Entry point: `src/server.ts`.
  tRPC routers in `src/router/`, auth catch-all under `/api/auth/*`, health under `/health`.
- **Web** (`apps/web`) — Next.js 15 App Router. tRPC client in `src/lib/trpc.ts`,
  provider in `src/lib/trpc-provider.tsx`, auth guard in `src/lib/auth-guard.tsx`.
- **DB** (`packages/db`) — Drizzle + postgres-js. Schemas in `src/schema/`, all
  registered in `src/index.ts`. `createDb(url)` for test/custom instances.
- **Shared** (`packages/shared`) — Zod schemas + shared types.

## Tests

- **API** — integration tests in `apps/api/src/router/__tests__/`. `createTestCaller()`
  from `test-utils.ts` builds a tRPC caller with a real test DB (`app_test`) and a
  fake session. Before the first run: `task db:push:test`.
- **Web** — component tests with Vitest + Testing Library + jsdom. Setup
  (`src/test-setup.tsx`) mocks Next.js navigation, Link, and auth-client.

## Adding a new entity

1. Drizzle schema in `packages/db/src/schema/` + registration in `index.ts`.
2. Zod schemas in `packages/shared/src/schemas.ts`.
3. tRPC router in `apps/api/src/router/` + registration in `router/index.ts`.
4. `task db:push && task db:push:test`.
5. Web pages in `apps/web/src/app/`, then tests.
