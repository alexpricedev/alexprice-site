import { log } from "../services/logger";

const REQUIRED = ["PORT", "APP_URL"];

// APP_URL and SITE_URL are both parsed with `new URL()` at request time, so a
// malformed value is a throw on every page render rather than a warning. The
// protocol check is not pedantry: `new URL("mailto:x")` parses happily and its
// `.origin` is the literal string "null", which would ship canonicals reading
// "null/". In production `http:` is rejected too — a plaintext canonical is a
// duplicate-content and mixed-content signal. Dev and test stay on
// http://localhost.
//
// Exported so the rule can be tested directly: validateEnv() answers a bad value
// with process.exit(1), which a test can't call without taking the runner down.
export const urlProblem = (key: string, value: string): string | null => {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return `${key} must be an absolute URL including the scheme (got "${value}")`;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return `${key} must use http:// or https:// (got "${value}")`;
  }

  if (parsed.protocol === "http:" && process.env.NODE_ENV === "production") {
    return `${key} must use https:// in production (got "${value}")`;
  }

  return null;
};

export function validateEnv(): void {
  const missing: string[] = [];

  for (const key of REQUIRED) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    log.error("env", `Missing required variables: ${missing.join(", ")}`);
    log.error(
      "env",
      "Set these in your .env file or environment before starting the server",
    );
    process.exit(1);
  }

  // APP_URL is the base for every absolute URL — `siteUrl()` in services/seo.ts
  // derives the canonical origin for canonicals, Open Graph tags, the sitemap
  // and JSON-LD from it. One bad value breaks all of them, so it is fatal at
  // boot rather than at first render.
  const appUrlProblem = urlProblem("APP_URL", process.env.APP_URL as string);
  if (appUrlProblem) {
    log.error("env", appUrlProblem);
    process.exit(1);
  }

  // SITE_URL is optional: absent means the canonical origin follows APP_URL.
  // Blank counts as absent, matching siteUrl() — an empty value is what a
  // copied-out `SITE_URL=` line leaves behind, and refusing to boot over it would
  // contradict the fallback the rest of the code already applies.
  const configuredSiteUrl = process.env.SITE_URL?.trim();
  if (configuredSiteUrl) {
    const siteUrlProblem = urlProblem("SITE_URL", configuredSiteUrl);
    if (siteUrlProblem) {
      log.error("env", siteUrlProblem);
      process.exit(1);
    }
  }

  log.info("env", "Environment variables validated");
}
