// Railway Infrastructure as Code: the build and deploy settings and the
// environment contract. Railway's CLI evaluates this file — nothing here applies
// on `git push`:
//
//   railway link                 # once, to point the CLI at your project
//   railway config plan          # read the diff
//   railway config apply         # apply it
//
// Needs Railway CLI >= 5.42.1; the SDK refuses to evaluate under anything older.
import { defineRailway, preserve, project, service } from "railway/iac";

// Scopes deletion to the resources this file owns, and is also the service's
// name (`service(partial, ...)` below). Whatever you call it has to match what
// Railway calls the service, or an apply reads as *create a second one*.
export const partial = "web";

export default defineRailway(() => {
  const app = service(partial, {
    // `builder` and the restart policy have no intent-layer shorthand, so they go
    // in the raw `build` / `deploy` buckets. Everything else uses the shorthand.
    build: { builder: "RAILPACK", buildCommand: "bun install && bun run build" },
    start: "bun run start",
    healthcheck: "/health",
    healthcheckTimeout: 30,
    // Only the retry cap. `restartPolicyType: "ON_FAILURE"` is Railway's default
    // already, and declaring it anyway produced a plan that never converged.
    deploy: { restartPolicyMaxRetries: 3 },

    // No `source`. A fork's GitHub slug isn't knowable from here, and a service
    // declared without one emits no source at all — so this file never fights the
    // repo connection you made in the dashboard.

    // Every variable the server reads is listed, because a variable this file
    // omits is a variable Railway may remove.
    env: {
      // Required — the server exits at boot without it. `${{RAILWAY_PUBLIC_DOMAIN}}`
      // is resolved by Railway at deploy time, which breaks the chicken-and-egg:
      // APP_URL needs the domain, and the domain doesn't exist until the service
      // does. Point a custom domain at the service and set SITE_URL to it so the
      // canonical URLs don't drift to the *.up.railway.app name.
      APP_URL: "https://${{RAILWAY_PUBLIC_DOMAIN}}",

      // Optional — each one changes behaviour only when set.
      SITE_URL: preserve(),
      ALLOW_INDEXING: preserve(),
      SECURITY_CONTACT: preserve(),
      MAINTENANCE_MODE: preserve(),
      MAINTENANCE_RETRY_AFTER: preserve(),

      // PORT is deliberately absent: Railway sets it on the deployment itself.
    },
  });

  return project("alexprice-site", { resources: [app] });
});
