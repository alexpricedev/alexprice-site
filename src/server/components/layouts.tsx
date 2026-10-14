import type { ComponentChildren } from "preact";

import { getAssetUrl } from "../services/assets";
import {
  absolute,
  indexingAllowed,
  SITE_DESCRIPTION,
  SITE_NAME,
  siteStructuredData,
  siteUrl,
} from "../services/seo";

// The two webfonts the design is built on. Loaded from Google Fonts with a
// preconnect, which means the CSP has to allow fonts.googleapis.com (style) and
// fonts.gstatic.com (font) — see utils/security-headers.ts.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=VT323&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;1,6..12,400&display=swap";

// The site is dark-only (see `color-scheme: dark` in base.css), so theme-color
// matches --bg from the dark palette rather than shipping light/dark variants.
const THEME_COLOR = "#1E1B2E";

const canonicalUrl = (path?: string): string =>
  path ? absolute(path) : siteUrl();

/* The site is noindex unless `ALLOW_INDEXING=true` says otherwise, so the
   `noindex` prop is a page opting *out* on top of a default that already keeps
   it out — a page that passes it (an error page) stays noindex after the switch
   opens the rest of the site up. See `indexingAllowed` in services/seo.ts. */
const blocksIndexing = (noindex?: boolean): boolean =>
  noindex === true || !indexingAllowed();

interface HeadMetaProps {
  title: string;
  description: string;
  canonicalPath?: string;
  noindex?: boolean;
}

// Shared <head> essentials for both Layout and ErrorLayout, so the two can't
// drift out of sync (e.g. one missing the description or canonical tag).
function HeadMeta({
  title,
  description,
  canonicalPath,
  noindex,
}: HeadMetaProps) {
  return (
    <>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <title>{title}</title>
      <meta name="description" content={description} />
      {blocksIndexing(noindex) && (
        <meta name="robots" content="noindex, nofollow" />
      )}
      <meta name="color-scheme" content="dark" />
      <meta name="theme-color" content={THEME_COLOR} />
      <link rel="canonical" href={canonicalUrl(canonicalPath)} />
      <link
        rel="icon"
        type="image/svg+xml"
        href={getAssetUrl("/favicon.svg")}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link rel="stylesheet" href={FONTS_HREF} />
      <link rel="stylesheet" href={getAssetUrl("/assets/main.css")} />
    </>
  );
}

// Shared site footer for the full Layout and the ErrorLayout.
function SiteFooter() {
  return (
    <footer>
      <span>© 2026 ALEX PRICE · INFINITE CHAPTERS LTD</span>
      <span>BUILT BY HAND, RUN BY THE FACTORY</span>
    </footer>
  );
}

interface LayoutProps {
  title: string;
  page: string;
  children: ComponentChildren;
  description?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

export function Layout({
  title,
  page,
  children,
  description = SITE_DESCRIPTION,
  canonicalPath,
  noindex,
}: LayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <HeadMeta
          title={title}
          description={description}
          canonicalPath={canonicalPath}
          noindex={noindex}
        />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={absolute("/og-image.png")} />
        <meta property="og:url" content={canonicalUrl(canonicalPath)} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={absolute("/og-image.png")} />
        {!blocksIndexing(noindex) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteStructuredData() }}
          />
        )}
      </head>
      <body data-page={page}>
        <div className="wrap">
          <header className="masthead">
            <a className="brand" href="/">
              <span className="bit" aria-hidden="true" />
              {SITE_NAME}
            </a>
          </header>
          {children}
          <SiteFooter />
        </div>
        <script type="module" src={getAssetUrl("/assets/main.js")} />
      </body>
    </html>
  );
}

interface ErrorLayoutProps {
  title: string;
  children: ComponentChildren;
}

// Layout for error pages (404, 500, 503). Deliberately ships NO client
// JavaScript — the page renders instantly and stays legible even when the app is
// degraded or offline, the spec's resilience baseline for error and 503
// responses. Always noindex so crawlers never treat an error body as real
// content.
export function ErrorLayout({ title, children }: ErrorLayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <head>
        <HeadMeta title={title} description={SITE_DESCRIPTION} noindex />
      </head>
      <body data-page="error">
        <div className="wrap">
          <header className="masthead">
            <a className="brand" href="/">
              <span className="bit" aria-hidden="true" />
              {SITE_NAME}
            </a>
          </header>
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
