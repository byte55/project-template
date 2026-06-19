# Security Policy

## Reporting a vulnerability

Please **do not** report security vulnerabilities through public GitHub issues,
pull requests, or discussions.

Instead, report them privately via one of:

- **GitHub Security Advisories** — use the
  [private vulnerability reporting](https://github.com/byte55/project-template/security/advisories/new)
  form (preferred).
- **Email** — <walteritservices@gmail.com>

Please include as much of the following as you can:

- A description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept, affected endpoint/component, configuration)
- The commit or version affected
- Any suggested mitigation, if you have one

You can expect an initial acknowledgement within **5 business days**. We will keep you
informed about the progress toward a fix and may ask for additional details. Please
give us a reasonable amount of time to address the issue before any public disclosure.

## Scope

This is a **starter template**. Before deploying anything based on it, review and
harden the security-relevant configuration — in particular:

- **Secrets** — never commit real secrets. `.env` and `.env.local` are gitignored; the
  committed `*.example` files contain placeholders only. Generate a strong
  `BETTER_AUTH_SECRET` (`openssl rand -base64 48`) and set strong database/Redis
  passwords for production (`.env.prod.example`).
- **Demo credentials** — the seeded demo user (`demo@example.com` / `demo1234`) is for
  local development only. Never seed it in production.
- **Ownership checks** — every tRPC query/mutation must filter on the session's
  `userId`. When adding new entities, follow the pattern in
  `apps/api/src/router/note.ts`.
- **Dependencies** — keep dependencies up to date and review `pnpm audit` output before
  releasing.

## Supported versions

As a template, only the latest `main` is maintained. Fixes are applied to `main`; there
are no long-term support branches.
