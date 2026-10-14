# Alex Price

A full-stack TypeScript app built with Bun.

---

## What's Included

Auth, security, database, testing, linting — these are the rails. They're solved so the agent can focus on your custom logic instead of bugging you with questions about tech choices and security fundamentals.

### Authentication

Two complete auth flows, chosen with one environment variable. `AUTH_MODE` defaults to `magic-link`;
set it to `password` for conventional email-and-password credentials. The two are mutually exclusive —
offering both at once would mean every account has two ways in, and the weaker one sets the ceiling.

- **Magic-link login** (default) with HMAC-protected tokens and expiry — no passwords to store, hash, or reset
- **Password login** with argon2id hashing (via `Bun.password`, no new dependency), a full reset-by-email flow, and change-password on `/account`
- **Email verification** — `users.email_verified_at` records when an address was proven, with a fixed reminder banner until it is. Nothing is gated on it; forks add their own gating
- **Session management** with 30-day sessions, automatic renewal, and secure cookie handling (HttpOnly, Secure, SameSite)
- **Guest sessions** that auto-create for unauthenticated visitors — useful for carts, preferences, or any state you want before login
- **Admin middleware** with role-based route protection and a dedicated `/admin` route namespace
- **Org-level user management** behind `TEAMS_ENABLED` (off by default) — a `/team` page to invite people by email, see the member list, change org roles, and remove people. `organization_members.org_role` is a separate axis from `users.role`, so an org owner is not a platform admin; migration `008` adds three tables and alters none, so a fork that won't use it can drop it without touching account data
- **Pluggable email providers** — ships with a console provider for development; add Resend or any custom provider via a simple interface

### Security

- **CSRF protection** using the synchronizer token pattern with timing-safe comparison and origin validation. A token that has aged out but still verifies against the session secret is recognised as stale rather than forged, so the form is re-rendered with a fresh token and the user's input intact instead of a dead-end 403
- **Rate limiting** middleware with configurable sliding-window limits per IP
- **Signup spam defense** on every signed-out auth form — an always-on honeypot and per-IP rate limit, plus an optional first-party proof-of-work captcha (no third party, account, or extra secret; off by default, enable with `CAPTCHA_ENABLED`)
- **Session fixation prevention** — sessions are regenerated on login, and a password change or reset invalidates the other sessions
- **Password storage** — argon2id with a per-hash salt, deliberately unpeppered so a `CRYPTO_PEPPER` rotation stays recoverable; password reset gives identical answers for known and unknown addresses, and so does sign-in except for accounts carried over from magic-link mode, which are told they have no password yet (see [SECURITY.md](SECURITY.md) for that trade-off)
- **Environment validation** at startup — the server fails fast with clear error messages if required variables are missing
- **Response hardening** — security headers on every response (nosniff, frame/clickjacking protection, an enforcing Content Security Policy, Permissions-Policy, HSTS in production), plus `/.well-known/security.txt` and Subresource Integrity on third-party scripts — see [runbooks/SECURITY.md](runbooks/SECURITY.md)

### Database

PostgreSQL through Bun's built-in `Bun.SQL` — no ORM, no driver dependency.

- **Auto-migrations on startup** — pending migrations run before the server accepts requests; if one fails, the server won't start
- **Migration CLI** for manual operations (`migrate:up`, `migrate:status`, `migrate:create`)
- **Seed script** scaffold for development data (`bun run seed`)
- **Parameterised queries** throughout — no string concatenation, no SQL injection surface

### Testing

The "deterministic templates, test with confidence" tagline isn't a marketing claim — it's backed by infrastructure.

- **760+ tests across 70 files** covering controllers, services, middleware, utilities, and client scripts
- **No browser simulation needed** — server-rendered templates are pure functions of props, testable with `renderToString()` and string assertions
- **Real database testing** for services — tests run against PostgreSQL with table truncation for isolation
- **Mock-based controller tests** that verify HTTP responses (status codes, headers, HTML content) without touching the database
- **Client script tests** using happy-dom for DOM globals, with page lifecycle isolation
- **A one-line test environment** — `.env.test` carries `DATABASE_URL` and nothing else; every other variable is pinned by a preload (`src/server/test-utils/test-env.ts`), so your dev `.env` can't change what the suite sees no matter which command starts it


Run the full suite: `bun run test` — around 15 seconds on four cores, since files run in
parallel with a database per worker.

### Code Quality

- **Biome** linting with zero-warning enforcement (`--max-warnings 0`) — no `any` types, no `console` statements, no unused variables
- **TypeScript** strict mode with `noUnusedLocals` and `noUnusedParameters`
- **Husky** pre-commit hooks that run lint and typecheck before every commit
- **GitHub Actions CI** — lint, build, and the full test suite run on every PR (`.github/workflows/ci.yml`); gate merges behind them with required status checks (see [runbooks/CI.md](runbooks/CI.md))
- **Pinned toolchain** — `.bun-version` and `engines.bun` fix the Bun version, and CI installs from the same file, so the toolchain changes on a commit rather than on Bun's release schedule
- **Dependency audit** — `bun run audit` fails on high-severity advisories, run on every PR and weekly on a schedule (`.github/workflows/audit.yml`), with Dependabot opening the routine bumps
- **Structured logging** via `src/server/services/logger.ts` — replaces `console.*` with levelled output (info, warn, error)

### Frontend

- **Preact JSX as a template engine** — server-rendered to a string, no hydration, and no framework runtime on the page. Preact is a build-time detail of the server; nothing in the browser imports it
- **Bun CSS bundler** with `@import` resolution, CSS nesting, and minification — no external CSS tooling needed
- **Reactive components that bind to the server's markup** — `src/client/reactive/` is a few hundred lines: signals, computeds and effects, plus `data-*` bindings (`data-text`, `data-show`, `data-value`, `data-on`…) that name a component's state by name, never by expression — with `ui.perElement` for the case where the elements are a list the server built from data and there is no name to give each one. No virtual DOM, nothing rendered twice, no `'unsafe-eval'` in the CSP, and the binding names in a template are typechecked against the component
- **Progressive enhancement over plain forms** — every mutation on the todo page is a `<form>` that works without JavaScript. With it, `server.submit(form)` posts the same form with the CSRF token as a header and asks for a fragment; the controller answers with the server-rendered row instead of a redirect, and a stale token is refreshed and retried once. The classic todo list is the worked example — add, toggle, delete and filter, no page loads
- **Page lifecycle system** — `registerPage()` / `PageController` pattern with `init()` and `cleanup()` for per-page JS
- **Cookie-based flash messages** — HMAC-signed, single-use cookies for post-redirect-get feedback (success banners, validation errors)
- **Accessibility baseline** — semantic landmarks, labelled form controls, a keyboard focus ring, reduced-motion support, announced flash messages, and captioned data tables out of the box — see [runbooks/ACCESSIBILITY.md](runbooks/ACCESSIBILITY.md)
- **Privacy-clean by default** — no analytics, no trackers, no third-party cookies; only strictly-necessary first-party cookies, so no consent banner is legally required until you add tracking — see [runbooks/PRIVACY.md](runbooks/PRIVACY.md) for the consent-banner and privacy-policy pattern
- **Asset cache-busting** in production — MD5-hashed filenames with immutable `Cache-Control` headers

---

## Quick Start

You'll need [Bun](https://bun.sh) and a local [PostgreSQL](https://www.postgresql.org/) instance running.

```bash
git clone git@github.com:alexpricedev/alexprice-site.git
cd alexprice-site
bun install
bun run dev
```

The `.env` is already set up in the original checkout. On a fresh clone, copy `.env.example` to `.env`, run `bun run generate:pepper` for `CRYPTO_PEPPER`, and set `DATABASE_URL`. Migrations run automatically on startup; the app serves on the `PORT` in `.env`.

---

## Project Structure

```
src/
├── client/                     # Browser-side code
│   ├── main.ts                 # Entry point — registers pages and components
│   ├── page-lifecycle.ts       # Page init/cleanup system
│   ├── reactive/               # Signals, components, bind() and the form submit helper
│   ├── style.css               # CSS entry point — @import manifest, no rules of its own
│   ├── base.css                # Tokens, element defaults, shared utilities
│   ├── components/             # Shared components + CSS (nav, layout, todo list)
│   └── pages/                  # Page-specific JS + CSS (co-located)
│
├── server/                     # Server-side code
│   ├── main.ts                 # Server entry point
│   ├── routes/
│   │   ├── app.tsx             # View routes (HTML)
│   │   ├── api.ts              # API routes (JSON)
│   │   └── admin.tsx           # Admin routes (protected)
│   ├── controllers/            # Route handlers
│   │   ├── app/                # View controllers — return HTML
│   │   ├── api/                # API controllers — return JSON
│   │   ├── auth/               # Auth controllers — login/signup/logout/account/reset/verify
│   │   └── team/               # Team controllers (TEAMS_ENABLED) — dashboard/invites/members/accept
│   ├── templates/              # Full-page JSX templates
│   ├── components/             # Reusable server JSX components
│   ├── services/               # Business logic & data access
│   ├── middleware/             # Auth, CSRF, rate limiting, admin, org roles
│   ├── utils/                  # Response helpers, crypto, env validation
│   └── database/
│       ├── cli.ts / migrate.ts # Migration tooling
│       ├── seed.ts             # Development seed data
│       └── migrations/         # Numbered migration files
│
└── shared/                     # The seam both sides import: data-* vocabulary, header names, shared copy

scripts/
├── wip                         # Per-worktree WIP snapshots (safe `git stash` replacement)
├── qa-session.ts               # Mints a QA session cookie so an agent never borrows a human's
├── benchmark.ts                # Times the suite, checks and build; saves/compares records
├── browser-smoke.test.ts       # Real-browser smoke test — `bun run test:browser`, its own CI job
└── workspace.ts                # Per-workspace port + dev/test databases (provision/destroy)

.claude/
├── settings.json               # Hooks shared with every agent on the repo
├── rules/                      # Path-scoped instructions, loaded when matching files are opened
├── hooks/
│   └── no-shared-stash.ts      # Denies `git stash`, points at `bun run wip`
└── skills/                     # Progressive-disclosure guides for agents

.railway/
├── railway.ts                  # Railway Infrastructure as Code — build, deploy and env, applied by CLI
└── railway.test.ts             # Guards those settings against drift
```

---

## API Reference

The starter ships one example resource plus a read-only stats endpoint. They exist to be
copied or deleted — the
conventions below are what a new endpoint should follow, and
[`.claude/skills/adding-a-feature/references/api-endpoint.md`](.claude/skills/adding-a-feature/references/api-endpoint.md)
is the checklist for adding one.

> **These endpoints are unauthenticated**, like the `/todos` page they mirror — the demo lets
> guests create and toggle todos. Anything exposing real data needs `requireAuth` from
> `src/server/middleware/auth.ts` (or a token check for machine callers) before it ships.

### Conventions

- **Every payload is wrapped in `data`.** A bare array or object leaves nowhere to add metadata
  later without breaking clients.
- **Every failure returns the same envelope**, whatever went wrong:
  ```json
  { "error": { "code": "invalid_body", "message": "A non-empty title is required.",
               "fields": { "title": "Required." } } }
  ```
  Branch on `code` — it is stable. `message` is for a human reading the response, and `fields` is
  present only on validation failures.
- **Request bodies must be `application/json`** (or a `+json` media type). Anything else is a 415;
  a body that isn't valid JSON, or that is JSON but not an object, is a 400.
- **Rate limits are per IP**: 60 requests/minute for reads, 20 for writes, counted separately
  from each other and from the auth forms' own budget. A 429 carries `Retry-After` in seconds.

### Endpoints

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/todos` | `{ data: Todo[], pagination: { total, limit, offset } }` |
| `POST` | `/api/todos` | `201` + `{ data: Todo }`, with a `Location` header |
| `GET` | `/api/todos/:id` | `{ data: Todo }` |
| `PUT` | `/api/todos/:id` | `{ data: Todo }` — `title` required, `completed` optional boolean |
| `DELETE` | `/api/todos/:id` | `204`, no body |
| `GET` | `/api/stats` | `{ data: VisitorStats }` |

`GET /api/todos` accepts `?limit=` (1–100, default 25) and `?offset=` (default 0). Values
outside those bounds are **rejected with a 400 rather than clamped** — a client silently handed
100 rows when it asked for 5000 has no way to tell it received a page.

`:id` must be a positive integer within Postgres `serial` range; anything else is a 400
(`invalid_id`) and never reaches the database.

```bash
curl -X POST http://localhost:3000/api/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Buy milk"}'
# 201 Created
# Location: /api/todos/7
# {"data":{"id":7,"title":"Buy milk","completed_at":null,"created_by":null}}
```

### Status codes

| Code | `error.code` | When |
|---|---|---|
| `400` | `invalid_id` / `invalid_json` / `invalid_body` / `invalid_limit` / `invalid_offset` | Malformed path, query, or body |
| `404` | `not_found` | No such row |
| `405` | `method_not_allowed` | Wrong verb — the `Allow` header names the right ones |
| `415` | `unsupported_media_type` | `Content-Type` wasn't JSON |
| `429` | `rate_limited` | Per-IP limit exceeded; see `Retry-After` |

---

## Works well with

- **[Conductor](https://conductor.build)** — runs several coding agents in parallel, one git worktree each. The repo ships a [`.conductor/settings.toml`](.conductor/settings.toml) that gives every workspace its own port, dev database, test database, and session cookie name on setup, and drops the databases again on archive, so parallel agents can't truncate each other's test data or fight over port 3000. None of it is required: the scripts no-op when `CONDUCTOR_PORT` is unset, and `scripts/wip` is plain `git worktree`, so the same protections work under any agent harness.

A couple of small, zero-dependency packages built alongside Billet that drop straight in:

- **[billet-cookie-consent](https://github.com/alexpricedev/billet-cookie-consent)** — GDPR-friendly cookie consent banner. Lightweight, framework-agnostic, designed to slot into a server-rendered template.
- **[log-digest](https://github.com/alexpricedev/log-digest)** — In-memory log buffer with a pluggable digest sink. Batches `error` / `warn` / `info` entries and hands them off on an interval to email, Slack, or any custom sink — a lightweight alternative to a full observability stack for a single Bun process.

---

## Upgrading a fork

This app is a fork of [Billet](https://github.com/alexpricedev/Billet), which is used by cloning or forking, so there's no package manager to warn you about a breaking
change. Releases are tagged, and [CHANGELOG.md](CHANGELOG.md) records what a fork has to change in
its own code before merging a new major version. Read it before pulling upstream.

Which release you're on is recorded in [`.billet-version`](.billet-version), separately from the
`version` in `package.json` — that field is your app's, to bump as you like. Keep the file when you
rename the project; it's the only thing that answers "is this fix already in my tree?" without
diffing source against a repo you may not have as a remote. Update it when you merge an upstream
release. The file itself carries the two `curl` commands for listing upstream's tags and reading
its CHANGELOG, so comparing needs no remote and no tooling.

---

## Contributing

Contributions are welcome! Please open issues or PRs.

---

## Deploy

This app is a single Bun process — no containers, no serverless adapters, no platform-specific runtime. Anywhere you can run `bun run start`, it'll work: Railway, Fly.io, Render, a VPS, or your own machine.

### Railway

Four commands, from nothing to a running app. Deployments typically go live in under 60 seconds.

```bash
railway init --name my-app                                        # new project, linked here
railway config apply                                              # service + Postgres + env defaults
railway domain                                                    # generates the public URL
railway variables --set CRYPTO_PEPPER=$(bun run generate:pepper)  # the one secret you set yourself
```

Then connect your repo in the service's **Settings → Source**, and it deploys on every push.

All of it comes from [`.railway/railway.ts`](.railway/railway.ts) — the build and deploy settings,
the Postgres link, and every environment variable the server reads. Needs Railway CLI
**5.42.1 or newer**. For a project you already have, swap the first line for `railway link` and
read `railway config plan` before applying. Nothing applies on `git push`.

Three things the plan won't warn you about:

- **No deployment after the first apply is expected.** The file declares no `source`, so the
  service has nothing to build until you connect the repo. That is deliberate — a starter can't
  know your GitHub slug — and it means a later apply leaves your connection alone.
- **The name must match what Railway calls your service.** It does when `railway config apply` is
  what created it, as above. It won't if you connected a repo first, because Railway names a
  service after the repo — then edit `export const partial` to match. The service takes its name
  from the partial, so that one line is the whole rename.
- **That `partial` is also what stops an apply deleting things it doesn't know about.** Without
  it, a project holding several apps and one shared PostgreSQL reads every service the file omits
  as one to delete.

Secrets stay out of the file: everything you own is `preserve()`, which means *this name exists,
its value lives on Railway*. The defaults that are there — `EMAIL_PROVIDER=console`, an `APP_URL`
built from `${{RAILWAY_PUBLIC_DOMAIN}}` — exist so a fresh apply boots instead of crash-looping.
`railway.ts` comments the reasoning behind each choice, including the two that look obvious and
aren't.

Prefer the dashboard? These are the same values, to set by hand in the service's **Settings** tab:

| Setting | Value |
|---|---|
| Builder | **Railpack** |
| Build command | `bun install && bun run build` |
| Start command | `bun run start` |
| Healthcheck path | `/health` |
| Healthcheck timeout | `30` |
| Restart policy | **On failure** (Railway's default), max `3` retries |

> **Tip:** If you're using Claude Code with the [Railway MCP server](https://docs.railway.com/guides/mcp), you can ask Claude to set up the project, add PostgreSQL, and configure both the environment variables and the settings above for you.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string — auto-set when you link Railway's PostgreSQL plugin to your service |
| `CRYPTO_PEPPER` | Yes | Secret key for session tokens — run `bun run generate:pepper` to get one (see below) |
| `APP_URL` | Yes | Your app's public URL — you'll get this from Railway after your first deploy (e.g. `https://my-app.up.railway.app`) |
| `SITE_URL` | No | Canonical origin for canonicals, Open Graph tags, the sitemap, and JSON-LD. Defaults to `APP_URL`'s origin — set it only when the canonical domain differs from the app domain |
| `ALLOW_INDEXING` | No | Set to `true` to let search engines index the site. Unset, every response and page says `noindex` and `robots.txt` drops its `Sitemap:` line, so a preview or staging host can't be indexed by accident. Set it on production only |
| `PORT` | No | Server port — auto-set by Railway, defaults to `3000` locally |
| `TRUST_PROXY` | No | Set to `true` behind a proxy that rewrites `x-forwarded-for` — Railway does. Without it the rate limiter sees one shared address for every visitor. Set by `.railway/railway.ts` |
| `AUTH_MODE` | No | `magic-link` (default) or `password`. Mutually exclusive; any other value stops the server at boot |
| `CAPTCHA_ENABLED` | No | Set to `true` to add a proof-of-work captcha to the login form. Off by default; `/login` is unchanged when unset |
| `CAPTCHA_DIFFICULTY` | No | Tunes the captcha's client-side work (search-space size). Defaults to `100000` (~sub-second for a real browser) |
| `TEAMS_ENABLED` | No | Set to `true` for org-level user management — invite by email, member list, org roles. Off by default; `/team` and `/invites/accept` 404 when unset. Any value other than `true`/`false` stops the server at boot |

> **Generating `CRYPTO_PEPPER`:** This is a secret key used to secure session tokens. Run `bun run generate:pepper` to get a value. Use a different value for each environment (development, production, etc).

> **Email deliverability:** When sending real mail via Resend, follow [runbooks/EMAIL.md](runbooks/EMAIL.md) to set up SPF, DKIM, and DMARC — without it, magic links and password-reset mail land in spam.

> **SEO:** Canonicals, Open Graph tags, the sitemap, `robots.txt`, and JSON-LD all follow `APP_URL`'s origin, so pointing that at your production domain points them too. Set `SITE_URL` only if your canonical domain differs from your app domain (marketing site on the apex, app on a subdomain). One thing you **must** set on production: `ALLOW_INDEXING=true`. Without it every response and page says `noindex` and `robots.txt` drops its Sitemap line, so a preview or staging host can't be indexed by accident — set it on production only. See [runbooks/SEO.md](runbooks/SEO.md) for both, plus the sitemap, indexing policy, and verification steps.

> **Security:** The HTTP hardening (security headers, CSP, HSTS, SRI) works out of the box, but set `SECURITY_CONTACT` (the `security.txt` reporting address) and add the registrar-level records before launch — see [runbooks/SECURITY.md](runbooks/SECURITY.md) for that plus the TLS, HSTS-preload, CAA, and DNSSEC steps.

> **Auth mode:** Leave `AUTH_MODE` unset for magic-link auth. Set `AUTH_MODE=password` for email-and-password instead — that enables `/forgot-password`, `/reset-password`, and the change-password form on `/account`, which all 404 in magic-link mode. Switching an existing app to `password` leaves current users with no password: `/account` offers those accounts a set-password form, and `/forgot-password` covers anyone already signed out — a failed sign-in tells them so and links them there, rather than leaving them to guess at "Invalid email or password" forever. `/signup` and `/account` exist in both modes.

> **Team management:** Leave `TEAMS_ENABLED` unset and nothing changes — `/team` and `/invites/accept` 404, no org is ever created, and the three tables migration `008` adds stay empty. Set it to `true` and a signed-in user can create a team, invite people by email, change their org role, and remove them. Three things are worth knowing before you turn it on. **The org role is a separate axis from `users.role`** — that one still means *platform operator* and still gates `/admin`, so making someone an org owner does not give them your admin console. **One user belongs to one org**; there is no switcher, and accepting a second invite is refused. And **core does not scope your own data by org** — the `project` table is untouched, deliberately; `requireOrgRole` hands you the resolved membership so you can scope your own queries. See [runbooks/TEAMS.md](runbooks/TEAMS.md) for the authorisation model, the invite lifecycle, and what is deliberately not shipped. Two behaviours are worth expecting: `/team` is in no navigation, so **signing in without a membership lands on `/team`** instead of `/` (and `/account` links to it once you're in a team), and **neither self-action is yours to take** — you can't change your own org role or remove yourself, because the only self-change the roles allow is a demotion out of the page you'd need to undo it. Turning the flag on over an existing database leaves every current user with no team, so they'll see the "create a team" page first.

> **Signup spam:** The login form always carries a honeypot and per-IP rate limit. If bots still create accounts with random emails, set `CAPTCHA_ENABLED=true` to add a first-party proof-of-work captcha — it signs challenges with your existing `CRYPTO_PEPPER`, so there's no third party, account, or extra secret to configure.

> **Privacy:** The default site needs no cookie banner (zero non-essential storage). The moment you add analytics, ads, or embeds, you must add an opt-in consent banner and a privacy policy — see [runbooks/PRIVACY.md](runbooks/PRIVACY.md) for wiring up `@alexpricedev/billet-cookie-consent`, the required policy disclosures, and GPC handling.

> **CI & merge protection:** CI runs on every PR, but check results are advisory until you require them. A fork doesn't inherit branch protection, so nothing stops an auto-merge (GitHub's or Conductor's) from merging a red build — enable required status checks once per repo. See [runbooks/CI.md](runbooks/CI.md).

### Database

This app uses PostgreSQL through Bun's built-in `Bun.SQL` — no ORM, no driver dependency. Migrations run automatically on server startup — pending migrations are applied before the server accepts requests. If a migration fails, the server won't start (fail-safe).

A lightweight CLI is also available for manual operations:

```bash
bun run migrate:up       # Run pending migrations
bun run migrate:status   # Show migration state
bun run migrate:create   # Create a new migration file
```

If you don't need a database, remove the `src/server/database/` and `src/server/services/` directories and strip the DB-related routes. There's no framework coupling to undo.

---

## License

This project is not currently licensed for public use. All rights reserved.
