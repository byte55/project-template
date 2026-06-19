# Changelog

This file tracks changes to **the template itself** — not to applications built from
it. If you cloned this repo to start your own project, delete this file (see
"Clean up the template's repo meta files" in the [README](README.md)).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2026-06-19

### Added

- Initial public release of the monorepo starter template.
- Docker-first dev stack (Postgres, Redis, Mailpit, API, Web) with hot-reload and a
  `Taskfile.yml` command wrapper.
- Backend: Fastify + tRPC + better-auth, with an example `note` entity demonstrating
  the CRUD + ownership pattern.
- Frontend: Next.js 15 (App Router) + React 19 + Tailwind v4, with login/signup and a
  protected dashboard.
- Shared Zod validation in `@app/shared`, used by both API input and web forms.
- Tests: API integration tests against a real Postgres test DB, web component tests
  with jsdom.
- Separate production stack (`docker-compose.prod.yml`) with Traefik.
- CI (GitHub Actions): lint, format check, type-check, and tests.
- ESLint + Prettier wired in as Docker-first tasks (`task lint`, `task format`).
- Community health files: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`
  (with private vulnerability reporting), issue/PR templates.
- Tooling: Dependabot, CodeQL analysis, `.editorconfig`.
- Documentation in English, licensed under the BSD Zero Clause License (0BSD).
