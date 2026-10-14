# alexprice-site

Alex Price's personal site: a home page and a "what is a software factory"
explainer, both server-rendered from Preact JSX on Bun.

There is no database, no auth and no forms. Requests flow route → controller →
template, and the only state is the request itself. The interesting parts are the
two animated SVG diagrams, the SEO artefacts (canonical, Open Graph, JSON-LD,
`sitemap.xml`, `robots.txt`, `llms.txt`, `security.txt`, `site.webmanifest`) and
the hardening around them: a strict Content Security Policy, centralised
security headers and response compression.

## Quick start

```bash
bun install
bun run dev      # builds the bundles, then watches client, server and CSS
```

The port comes from `PORT` in `.env` (see `.env.example`). In a Conductor
workspace, `scripts/workspace.ts provision` rewrites `PORT` and `APP_URL` to the
workspace's own port so several workspaces can run at once.

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Build once, then watch and reload the client bundle, the server and the CSS |
| `bun run build` | Production build of the client JS and CSS into `dist/assets` |
| `bun run start` | Run the server without the dev watchers |
| `bun run test` | The suite (`bun test --isolate src`) |
| `bun run check` | Lint (Biome) + typecheck (tsc) |
| `bun run lint:write` | Lint and auto-format |
| `bun run audit` | Dependency audit at `--audit-level=high` |
| `bun run wip` | Per-worktree WIP snapshots (see "The stash is shared") |

## Layout

```
src/
  server/
    main.ts                 Bun.serve, the route table, boot
    routes/app.tsx          every route the site answers
    controllers/app/        one controller per route
      home.tsx  software-factory.tsx
      robots-txt.ts  sitemap.ts  llms-txt.ts  security-txt.ts  webmanifest.ts
    templates/
      home.tsx              the home page
      software-factory.tsx  the explainer
      error.tsx             404 / 500 / 503
    components/
      layouts.tsx           <head>, the wrap, the footer (Layout + ErrorLayout)
      factory-home.tsx      the hero diagram (SVG)
      factory-board.tsx     the task-board diagram (SVG)
      factory-parts.tsx     small SVG helpers
      svg-attributes.test.ts
    services/
      seo.ts                identity, canonical origin, robots/sitemap/manifest/JSON-LD
      llms-txt.ts           the /llms.txt body
      security-txt.ts       the /.well-known/security.txt body
      assets.ts             production asset fingerprinting
      logger.ts
    utils/
      env.ts  app-url.ts  response.ts  errors.tsx
      security-headers.ts   CSP, Permissions-Policy, discovery Link, X-Robots-Tag
      compression.ts        brotli/gzip negotiation
      static-files.ts       public/ assets and the dev bundle
      fallback.ts           trailing-slash, /health, static files, 404
      route-handler.ts      method dispatch + 405
      maintenance.ts  shutdown.ts
    test-utils/             preload env + small request helpers
  client/
    main.ts                 one bundle; dispatches on <body data-page>
    style.css               the stylesheet manifest
    base.css                tokens, element defaults, shared chrome
    pages/
      home.ts / home.css                    the hero diagram + copy-email button
      software-factory.ts / .css            the task-board diagram
public/                     favicons, og-image, logo (served from disk)
```

## How a request flows

`src/server/routes/app.tsx` maps each path to a controller. A controller renders a
template to an HTML `Response` (`utils/response.ts`). `secureRoutes` wraps every
handler so its response runs through `handleGuarded`: maintenance mode, a styled
500 on any uncaught throw, then `finalizeResponse` (compression, then the security
headers). Anything with no matching route falls to `handleFallback`, which
canonicalises trailing slashes, serves `/health`, serves `public/` and the dev
bundle, and otherwise returns the styled 404.

## The diagrams

Each diagram is server-rendered as an SVG with a still frame, so the page is
legible with JavaScript off and under `prefers-reduced-motion`. The one client
bundle clears that still frame and drives the animation with GSAP (bundled, not a
CDN, so the CSP stays `script-src 'self'`). `IntersectionObserver` pauses the
global timeline while a diagram is off screen.

## SEO and indexing

`src/server/services/seo.ts` is the single source of truth for the site's name,
description, canonical origin and the machine-readable artefacts. The canonical
origin is `SITE_URL` if set, otherwise `APP_URL`'s origin.

The site is **noindex by default**: every response carries
`X-Robots-Tag: noindex, nofollow`, every page renders `<meta name="robots">`, and
`robots.txt` drops its `Sitemap:` line unless `ALLOW_INDEXING=true` is set on the
host. Crawling stays allowed either way — a crawler has to fetch a page to be told
`noindex`. `SITEMAP_PATHS` and the page list in `services/llms-txt.ts` are the two
places a new public page has to be added.

## Environment

Required and validated at boot (`src/server/utils/env.ts`):

- `PORT` — the port to listen on.
- `APP_URL` — the site's own origin, including scheme and port. Must be `https://`
  in production.

Optional: `SITE_URL`, `ALLOW_INDEXING`, `SECURITY_CONTACT`, `MAINTENANCE_MODE`,
`MAINTENANCE_RETRY_AFTER`. `.env.example` documents each.

## Deploying

`.railway/railway.ts` is the Railway Infrastructure-as-Code definition: the build
and start commands, the `/health` check, and the environment contract. Run
`railway config plan` then `railway config apply`. The only resource is the web
service; there is no database to link.

Set `ALLOW_INDEXING=true` on the production host (and only there), and point a
custom domain at the service and set `SITE_URL` to it so the canonical URLs don't
drift to the `*.up.railway.app` name.

## Security

Every response gets its headers from `utils/security-headers.ts` — an enforcing
CSP, `X-Frame-Options`, `Referrer-Policy`, a `Permissions-Policy` that denies
everything the site doesn't use, and the discovery `Link` header. The two webfonts
load from Google Fonts, which is why the CSP allows `fonts.googleapis.com`
(style) and `fonts.gstatic.com` (font); GSAP is bundled, so no CDN is allowed for
scripts. Report security issues using the contact in `/.well-known/security.txt`
(`SECURITY_CONTACT`).
