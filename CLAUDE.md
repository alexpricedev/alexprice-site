# CLAUDE.md

A server-rendered personal site on Bun + Preact JSX. Two pages, no database, no
auth, no forms. Requests flow route → controller → template. `README.md` has the
directory tree; the code is the spec for everything else. This file is for the
things you can't learn by reading the repo.

## Working agreements

- The dev server is usually already running in another tab, on this workspace's
  own port — don't start one, and don't add a second. Read `PORT` from `.env`
  rather than assuming 3000.
- Run checks through the `package.json` scripts (`bun run test`, `bun run check`).
- Write code that reads like the surrounding code: match its comment density,
  naming, and idiom.
- When you try several approaches to a problem, delete the ones you abandoned
  before you finish.
- Check work in the browser with the `/browse` skill when the change is
  user-visible. The diagrams animate, so a static screenshot only proves the
  layout.
- Never `git stash`. Use `bun run wip` — see "The stash is shared".

## Gotchas

### The stash is shared, the worktrees are not

This repo is usually several worktrees over one shared `.git`, and `refs/stash`
lives in the shared part — one global stack, so an agent that pops can silently
take another agent's work. `bun run wip` (`scripts/wip`) is the replacement: it
snapshots to `refs/worktree/wip`, the one ref namespace git keeps per-worktree.
Run it bare for the subcommand list (`save`, `stash`, `list`, `show`, `restore`,
`drop`). A `PreToolUse` hook denies `git stash` and prints that same table.

### Each workspace owns its port

`scripts/workspace.ts provision` (run by Conductor setup) rewrites this
workspace's `.env` — `PORT` and `APP_URL` from `CONDUCTOR_PORT`. It is idempotent
and no-ops in cloud workspaces. `destroy` has nothing to tear down (there is no
per-workspace database) but stays wired for symmetry.

### JSX is a server-side template engine, nothing more

Everything compiles with Preact (`jsxImportSource: preact` in `tsconfig.json`) —
there is no React, and no Preact reaches the browser either. `src/server/` renders
once through `renderToString()` from `preact-render-to-string` and ships HTML. It
never hydrates, so `useState` in a template does nothing. `preact` is still a
runtime **dependency**, not a devDependency: the server imports its JSX runtime,
so a production install without it won't boot.

**Write SVG attributes in kebab-case** (`stroke-width`, not `strokeWidth`).
Preact passes camelCase attribute names through verbatim, and the HTML parser
doesn't recognise `strokeWidth` — the stroke silently renders at the default
width. `src/server/components/svg-attributes.test.ts` fails the suite on a
camelCase one, naming the file and the replacement. Genuinely camelCase SVG
attributes (`viewBox`, `preserveAspectRatio`, `patternUnits`, …) are correct as
written and are not flagged.

### The client is one bundle, and pages opt in by name

`src/client/main.ts` is the whole bundle. It reads `<body data-page>` and calls
the matching page module (`pages/home.ts`, `pages/software-factory.ts`). A page
that needs no behaviour — an error page — renders no bundle at all: `ErrorLayout`
omits the `<script>`.

The diagrams are **server-rendered with a still frame**. With JavaScript off, or
under `prefers-reduced-motion`, that still frame is the whole answer — the client
returns before touching anything. Otherwise it clears the frame (`#items`,
`#todo`, `#prs`) and drives GSAP. Keep that order: clear first, animate second.

GSAP is a **dependency bundled into `main.js`**, not a CDN script — that is why
the CSP can stay `script-src 'self'`. `IntersectionObserver` pauses
`gsap.globalTimeline` while a diagram is off screen, so an animation that looks
frozen in a screenshot is usually just below the fold; scroll it into view before
concluding it is broken.

New client behaviour: put it in the page module, register nothing else. Add a new
page's entry in `main.ts`, its CSS `@import` in `style.css`.

### The fonts are third-party; the CSP reflects that

The two webfonts (VT323, Nunito Sans) load from Google Fonts. The CSP therefore
allows `fonts.googleapis.com` (style) and `fonts.gstatic.com` (font), and
`layouts.tsx` emits the matching `preconnect`s. Any *script* you add must be
self-hosted or bundled, or it needs a CSP entry and an SRI `integrity` hash —
otherwise it is silently blocked in the browser but passes every test.

### Security headers and CSP are centralised

Every response gets its headers from `secureRoutes` / `handleGuarded` in
`src/server/utils/security-headers.ts`. Controllers set only content-specific
headers.

`X-Robots-Tag: noindex, nofollow` is on **by default**: `indexingAllowed()`
(`services/seo.ts`) is true only when `ALLOW_INDEXING=true`, so an unconfigured
host — a preview, a fork's first deploy, your test run — says `noindex` in the
header and in the meta tag `layouts.tsx` renders. `robots.txt` keeps crawling
*allowed* either way and only drops its `Sitemap:` line. Every page rendering
`noindex` in a test is the default, not a bug; a test about a page's *own*
`noindex` prop must open the switch first — `withIndexingAllowed` in
`test-utils/helpers.ts`.

Deliberately noindexed routes and assets simply don't exist here: the only public
pages are `/` and `/software-factory`.

### Adding a page touches four files

A new public page is: a template in `src/server/templates/`, a controller in
`src/server/controllers/app/` (and its barrel export), a route in
`src/server/routes/app.tsx` (`createRouteHandler`, even for a GET-only page, so a
stray POST gets a 405 with an `Allow` header rather than answering), and the path
added to `SITEMAP_PATHS` in `src/server/services/seo.ts` **and** the page list in
`src/server/services/llms-txt.ts`. `services/llms-txt.test.ts` drifts against
`SITEMAP_PATHS`, so one without the other fails.

### Assets are only fingerprinted in production

`initAssets()` and `getAssetUrl()` no-op unless `NODE_ENV=production`, so asset
URLs differ between dev and prod. In production the files must already exist in
`dist/assets` or startup throws — the Railway build runs `bun run build` first.

The un-hashed dev bundle is served by `serveDevBundle`
(`src/server/utils/static-files.ts`), not `serveFile`, and that distinction is
load-bearing: `bun build --watch` rewrites `dist/assets/*` in place, so a reload
can read the file mid-write. `serveDevBundle` reads the whole file into memory and
answers an empty read with a 503 + `Retry-After`; `handleFallback` checks a
missing name against `BUNDLE_FILENAMES` (`services/assets.ts`) and 503s for a
bundle it expects but can't find, while `/assets/typo.js` stays a 404.

Anything that reads or writes `dist/assets` in a test must call
`setAssetsDirForTest()` first — never point it at the real `dist/assets`.

### Env is validated at boot and `APP_URL` is load-bearing

`validateEnv()` exits the process on a missing var. `APP_URL` must include the
port; it is the base for every absolute URL via `siteUrl()`. In production it must
be `https://`. `src/server/utils/app-url.ts` and `services/seo.ts` read
`process.env` on every call (not captured at import) so a value set after the
module loads still counts — the tests rely on it.

### One preload sets the test environment

`bunfig.toml` preloads `src/server/test-utils/test-env.ts`, which pins `PORT` and
`APP_URL` for the suite. A preload is the only place early enough: imports are
hoisted above a file's body, so values read at import time are already captured
before a test's first line runs. Tests run with `NODE_ENV=test`, so `HSTS` and
`upgrade-insecure-requests` are withheld (they would pin localhost to HTTPS).

There is no database and no migrations. `bun run test` is plain
`bun test --isolate src`.

### Linting

Biome runs with `recommended` on and `noConsole: error` — use `log` from
`src/server/services/logger.ts` in server code. Test files and `logger.ts` have
targeted overrides in `biome.json`; add an override there rather than sprinkling
ignore comments.
