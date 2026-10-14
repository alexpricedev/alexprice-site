import { appOrigin } from "../utils/app-url";

// Single source of truth for the site's public identity and SEO artefacts
// (sitemap, structured data). Templates and controllers import from here so the
// canonical host, name, and description can't drift across the codebase.

// The origin every absolute URL is built from: canonicals, Open Graph tags, the
// sitemap, robots.txt's Sitemap: line, and JSON-LD. Defaults to APP_URL's origin.
// SITE_URL overrides it for the case where the canonical domain and the deploy
// domain legitimately differ.
//
// Read from process.env on every call (not captured at import) so a value set
// after the module loads still counts. Reduced to .origin so a trailing slash or
// stray path can't double up in a generated URL.
export const siteUrl = (): string => {
  const configured = process.env.SITE_URL?.trim();
  return configured ? new URL(configured).origin : appOrigin();
};

/**
 * Whether search engines may index the site.
 *
 * Closed by default: the site stays out of Google unless `ALLOW_INDEXING=true`
 * is set explicitly, so a preview deploy or a fork's first URL can't be crawled
 * because nobody remembered to block it. Every layer that speaks to a crawler —
 * robots.txt, the `X-Robots-Tag` on every response, the `<meta name="robots">`
 * in `layouts.tsx` — reads this rather than deciding for itself.
 *
 * Anything other than exactly `true` reads as closed, including a typo: the
 * failure mode of a misspelt value should be a site that isn't indexed, not one
 * that is.
 */
export const indexingAllowed = (): boolean =>
  process.env.ALLOW_INDEXING === "true";

export const SITE_NAME = "Alex Price";
export const SITE_DESCRIPTION =
  "Alex Price — helping startups build software factories: agent pipelines that turn tickets into reviewed pull requests, with humans at both ends.";
export const SITE_TAGLINE =
  "Helping teams build the factory that builds their software.";

// Public, indexable routes included in the sitemap. Kept in sync with the route
// table in routes/app.tsx by a drift test, so a new page can't silently go
// unlisted.
export const SITEMAP_PATHS = ["/", "/software-factory"] as const;

// Absolute URL for a site-relative path. Exported so llms-txt.ts resolves against
// the same origin rather than keeping its own copy of this line.
export const absolute = (path: string): string => new URL(path, siteUrl()).href;

export const buildSitemapXml = (): string => {
  const urls = SITEMAP_PATHS.map(
    (path) => `  <url>\n    <loc>${absolute(path)}</loc>\n  </url>`,
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
};

// Named AI crawlers we call out explicitly in robots.txt so the allow posture
// is unambiguous rather than only implied by the wildcard group. In robots.txt
// a named user-agent group fully replaces the wildcard for that agent, so each
// named group repeats the same Allow rule.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "PerplexityBot",
  "CCBot",
] as const;

// Content-Signal (an emerging IETF AI Preferences / IAB Tech Lab proposal)
// declares downstream-use consent explicitly for crawlers that honour it. It
// follows indexingAllowed() rather than standing on its own: `search=yes`
// alongside a site-wide `noindex` is two answers to one question.
const contentSignal = (open: boolean): string =>
  open
    ? "Content-Signal: search=yes, ai-input=yes, ai-train=yes"
    : "Content-Signal: search=no, ai-input=no, ai-train=no";

// Builds the /robots.txt body. Every page is public, so nothing is disallowed —
// the posture differs only by the `Sitemap:` line and the Content-Signal values.
//
// Crawling stays allowed even when indexing is switched off, which looks
// backwards and isn't. `noindex` is the thing that keeps a page out of the
// index, and a crawler has to *fetch* a page to read it — a `Disallow: /` would
// block the fetch and so disable the `X-Robots-Tag` and the meta tag that do the
// actual work.
export const buildRobotsTxt = (): string => {
  const open = indexingAllowed();
  const signal = contentSignal(open);

  const group = (agents: readonly string[]): string =>
    [...agents.map((agent) => `User-agent: ${agent}`), "Allow: /", signal].join(
      "\n",
    );

  return [
    ...(open
      ? [
          "# Search engines and AI crawlers are welcome.",
          "# Every page is public.",
        ]
      : [
          "# Indexing is switched off (ALLOW_INDEXING is not `true`). Crawling is",
          "# still allowed on purpose: every page and every response says",
          "# noindex, and a crawler has to fetch a page to be told that. The",
          "# Content-Signal below says no to search, grounding and training.",
        ]),
    "",
    group(["*"]),
    "",
    group(AI_CRAWLERS),
    ...(open ? ["", `Sitemap: ${absolute("/sitemap.xml")}`] : []),
    "",
  ].join("\n");
};

// Web app manifest. `name`/`short_name` follow SITE_NAME so a rename is one edit.
// The site is dark-only, so the colours match --bg from the dark palette in
// base.css (and THEME_COLOR in layouts.tsx). The 512px icon doubles as the
// maskable icon.
export const buildWebManifest = (): string =>
  JSON.stringify({
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    theme_color: "#1E1B2E",
    background_color: "#1E1B2E",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  });

// Site-level JSON-LD (WebSite + Person) injected into every public page's
// <head>. Gives search engines and AI agents a machine-readable description of
// the site using the schema.org vocabulary.
export const siteStructuredData = (): string => {
  const site = siteUrl();

  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site}/#website`,
        url: `${site}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: { "@id": `${site}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${site}/#person`,
        name: SITE_NAME,
        url: `${site}/`,
        image: absolute("/og-image.png"),
      },
    ],
  });
};
