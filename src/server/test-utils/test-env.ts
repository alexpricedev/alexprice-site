// The one place test environment variables are set.
//
// `bunfig.toml` preloads this for every test file, and a preload module runs
// before the test file's own module graph is evaluated. That is what makes it the
// only workable place: ESM hoists a file's imports above the first line of its
// body, so a test that assigns `process.env.APP_URL` at the top is already too
// late — `services/seo.ts` reads it as it is imported.
//
// Assigned, not defaulted: Bun has already loaded the developer's `.env` by the
// time this runs, and deferring to it would let a workspace's own port or origin
// leak into the suite.

const TEST_ENV: Record<string, string> = {
  PORT: "3000",
  APP_URL: "http://localhost:3000",
};

for (const [key, value] of Object.entries(TEST_ENV)) {
  process.env[key] = value;
}
