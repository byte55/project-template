# Contributing

Thanks for taking the time to contribute! This document covers the local setup,
workflow, and conventions for this repository.

## Prerequisites

- [Docker](https://www.docker.com/) (everything runs in containers)
- [Task](https://taskfile.dev/)

Do **not** run `pnpm`/`node` on the host — all commands go through `task` or
`docker compose exec`. See [README.md](README.md) and [CLAUDE.md](CLAUDE.md) for the
full background.

## Getting started

```bash
cp .env.example .env          # set BETTER_AUTH_SECRET if needed
task up                       # bring up the stack (Postgres, Redis, Mailpit, API, Web)
task db:push                  # push the Drizzle schema to the DB
task db:push:test             # push the schema to the test DB (required before tests)
task seed                     # create demo user + notes
```

The app is then available at:

- Web: <http://localhost:3100> (login: `demo@example.com` / `demo1234`)
- API: <http://localhost:4000/health>
- Mailpit: <http://localhost:8025>

> If the default host ports collide with another project, override them in `.env`
> (`WEB_PORT`, `API_PORT`, `POSTGRES_PORT`, …). Container-internal ports stay fixed.

## Development workflow

1. Create a branch off `main` (`git switch -c feat/short-description`).
2. Make your change. After adding a dependency, run
   `docker compose exec <service> pnpm install --no-frozen-lockfile` and restart the
   service (`task restart -- <service>`).
3. Keep the change focused — one logical change per pull request.
4. Run the checks below locally before pushing.

### Checks

```bash
task check                    # type-check (API + Web)
task test                     # all tests (API + Web)
```

Both must pass. CI (GitHub Actions) runs the same type-check and tests on every push
to `main` and on every pull request.

## Conventions

- **Language** — all code, comments, and docs are in **English**.
- **ESM throughout** — no `.js` extensions on imports in TS source, *except* relative
  imports inside the API (resolved at runtime via tsx), where `.js` is required.
- **Use `ctx.db`, never the direct `@app/db` import** in routers/services — this lets
  tests substitute the test DB.
- **Ownership checks** — every tRPC query/mutation must filter on the session's
  `userId` (see `apps/api/src/router/note.ts`).
- **Shared validation** — Zod schemas live in `@app/shared` and are reused by both the
  API (tRPC input) and the web app (forms). Don't duplicate validation.
- **Tests are expected** — add API integration tests
  (`apps/api/src/router/__tests__/`) and/or web component tests
  (`apps/web/src/**/*.test.tsx`) for new behavior.

### Adding a new entity

1. Drizzle schema in `packages/db/src/schema/` + registration in `index.ts`.
2. Zod schemas in `packages/shared/src/schemas.ts`.
3. tRPC router in `apps/api/src/router/` + registration in `router/index.ts`.
4. `task db:push && task db:push:test`.
5. Web pages in `apps/web/src/app/`, then tests.

## Pull requests

- Give the PR a clear title and describe what changed and why.
- Make sure `task check` and `task test` pass.
- Link any related issues.

## License

By contributing, you agree that your contributions are licensed under the
[BSD Zero Clause License](LICENSE), the same license that covers this project.
