# Monorepo Starter Template

[![CI](https://github.com/byte55/project-template/actions/workflows/ci.yml/badge.svg)](https://github.com/byte55/project-template/actions/workflows/ci.yml)
[![CodeQL](https://github.com/byte55/project-template/actions/workflows/codeql.yml/badge.svg)](https://github.com/byte55/project-template/actions/workflows/codeql.yml)
[![License: 0BSD](https://img.shields.io/badge/license-0BSD-blue.svg)](LICENSE)

Production-ready starter for TypeScript full-stack apps. Docker-first with hot-reload,
a single command to spin everything up, a separate prod setup with Traefik, and CI
already configured.

This template is **not an empty skeleton**: auth, database, and API are wired
end-to-end and demonstrated by a working example feature (**Notes**) — including
login/signup, a protected dashboard, a CRUD tRPC router, and tests. When starting a
new project you replace the `note` entity with your own domain; all the surrounding
setup stays untouched.

## What's included

- **Auth ready to go** — better-auth (email/password), session cookie, `AuthGuard` in
  the web app, `protectedProcedure` in the API
- **Type-safe API binding** — tRPC types are imported directly by the frontend,
  no code-gen, no drift
- **Single source of truth for validation** — Zod schemas in `@app/shared`, shared by
  API input and web forms
- **Ownership pattern shown by example** — every query/mutation filters on the session's
  `userId` (`apps/api/src/router/note.ts`)
- **Tests that actually check something** — API integration tests against a real
  Postgres test DB, web component tests with jsdom
- **Dev = close to prod** — the same stack locally (Compose + hot-reload) and in prod
  (Compose + Traefik), just different Dockerfiles

## Stack

| Area         | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Monorepo     | Turborepo + pnpm (corepack)                             |
| Backend      | Fastify + tRPC + better-auth                            |
| Database     | PostgreSQL + Drizzle ORM                                |
| Frontend     | Next.js 15 (App Router) + React 19 + Tailwind v4        |
| Validation   | Zod (shared between front- and backend via `@app/shared`) |
| Tests        | Vitest (API: integration tests against a real DB, Web: jsdom) |
| Dev env      | Docker Compose (Postgres, Redis, Mailpit, API, Web)     |
| Deployment   | Docker Compose + Traefik (`docker-compose.prod.yml`)    |

## Structure

```
.
├── apps/
│   ├── api/                 # Fastify + tRPC backend
│   │   └── src/
│   │       ├── server.ts        # Entry point (Fastify, CORS, Auth, tRPC, /health)
│   │       ├── auth.ts          # better-auth configuration
│   │       ├── context.ts       # tRPC context (db + session injected)
│   │       ├── trpc.ts          # router / publicProcedure / protectedProcedure
│   │       ├── router/          # tRPC routers (one file per entity)
│   │       ├── seed.ts          # Dev seed
│   │       └── *.test.ts        # Integration tests
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/             # App Router (layout, login, dashboard)
│           └── lib/             # trpc-client, auth-client, auth-guard
├── packages/
│   ├── db/                  # Drizzle schema + DB client
│   ├── shared/              # Shared Zod schemas / types
│   ├── tsconfig/            # Shared tsconfig bases
│   └── eslint-config/       # Shared ESLint config
├── docker-compose.yml       # Dev stack (hot-reload)
├── docker-compose.prod.yml  # Prod stack (Traefik)
├── Dockerfile.{api,web}      # Dev images
├── Dockerfile.{api,web}.prod # Prod images
├── Taskfile.yml             # Command wrapper (see below)
└── .github/workflows/ci.yml # Type-check + tests
```

## Quick start

Prerequisites: Docker, [Task](https://taskfile.dev/).

```bash
cp .env.example .env          # set BETTER_AUTH_SECRET if needed
task up                       # bring up the stack (Postgres, Redis, Mailpit, API, Web)
task db:push                  # push the Drizzle schema to the DB
task db:push:test             # push the schema to the test DB (for tests)
task seed                     # create demo user + notes
```

Then:

- Web: <http://localhost:3100>  (login: `demo@example.com` / `demo1234`)
- API: <http://localhost:4000/health>
- Mailpit: <http://localhost:8025>

### Most important commands

```bash
task up / down / build        # control the stack
task restart -- web           # restart a single service
task logs:api                 # follow logs
task check                    # type-check (API + Web)
task lint                     # lint (ESLint)
task format                   # format all files (Prettier)
task test                     # all tests
task db:reset                 # drop the DB, re-push, seed
task db:studio                # Drizzle Studio (DB browser)
```

> **Docker-first:** don't run pnpm/node on the host — use `task` or
> `docker compose exec <service> …`. Hot-reload runs via mounted `src`
> directories (tsx watch in the API, Next.js Fast Refresh in the web app).

### After adding a dependency

```bash
docker compose exec api pnpm install --no-frozen-lockfile   # or web
task restart -- api
```

## Adding a new entity

1. Create `packages/db/src/schema/<entity>.ts` (see `note.ts`) and register it in
   `packages/db/src/index.ts` (`allSchema` + re-export).
2. Add Zod schemas in `packages/shared/src/schemas.ts`.
3. Create `apps/api/src/router/<entity>.ts` (see `note.ts`) and register it in
   `apps/api/src/router/index.ts`.
4. `task db:push && task db:push:test`, then build pages under `apps/web/src/app/`.
5. Write tests (`apps/api/src/router/__tests__/`, `apps/web/src/**/*.test.tsx`).

## Using this as a template for a new project

```bash
cp -r ~/projects/project-template ~/projects/my-project
cd ~/projects/my-project
rm -rf .git pnpm-lock.yaml .docker-data && git init
```

### What needs to be adjusted?

Only **one** thing is mandatory: the **package scope** `@app/`. Without changing it,
multiple projects collide in the pnpm store. The internal **DB name** `app` does *not*
need to change — it lives inside the project's Postgres container and won't collide
with other projects. (Stay away from a blanket find-and-replace of `app`: the word also
appears in the container path `/app` — the images' WORKDIR — and replacing it would
break the volume mounts.)

| Adjustment                | Where                                                                     | Mandatory? |
| ------------------------- | ------------------------------------------------------------------------ | ---------- |
| Scope `@app/...`          | `package.json` (`name` + deps), TS imports, `Dockerfile*`, `Taskfile.yml`, `ci.yml` | **yes**    |
| Root name `"app"`         | `package.json` (top-level `name`, line 2)                                | yes        |
| Browser title + description | `apps/web/src/app/layout.tsx`, `CLAUDE.md`                             | recommended |
| Host ports                | `.env` (see below) — only needed when running alongside other projects   | depends on setup |

### Rename the scope automatically

```bash
NEW=myproject

# Package scope @app/ → @myproject/ (covers package.json, imports, Dockerfiles, CI, Taskfile)
grep -rl '@app/' . --exclude-dir=node_modules | xargs sed -i "s#@app/#@${NEW}/#g"

# Root package name
sed -i "0,/\"name\": \"app\"/s//\"name\": \"${NEW}\"/" package.json

pnpm install        # regenerate the lockfile
```

Set the browser title (`apps/web/src/app/layout.tsx`) and project description
(`CLAUDE.md`) by hand — those are free text, not identifiers.

### Running alongside other projects

The default host ports (Web 3100, API 4000, Postgres 5434, Redis 6379, Mailpit 8025)
can be overridden in `.env`. If a port is already taken, assign your own in `.env`:

```bash
WEB_PORT=3101
API_PORT=4001
POSTGRES_PORT=5436
REDIS_PORT=6380
MAILPIT_UI_PORT=8028
MAILPIT_SMTP_PORT=1028
```

Container-internal ports stay fixed — only the host mapping changes, no source code to
touch.

## Deployment

```bash
cp .env.prod.example .env     # set domains, passwords, auth secret
docker compose -f docker-compose.prod.yml up -d --build
```

Requires an external Traefik network (`traefik`). Traefik labels route
`WEB_DOMAIN` → web and `API_DOMAIN` → api. Before the first prod build, commit
`pnpm-lock.yaml` and enable `--frozen-lockfile` in the prod Dockerfiles for
reproducible builds.
