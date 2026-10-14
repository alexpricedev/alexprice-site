import type { BunRequest } from "bun";

/**
 * A Request typed as the `BunRequest` server handlers receive.
 *
 * Bun passes handlers a `BunRequest` (a Request with `params` and `cookies`); a
 * plain Request is enough for anything that only reads the URL, method and
 * headers, which is every route in this app.
 */
export const createBunRequest = (url: string, init?: RequestInit): BunRequest =>
  new Request(url, init) as BunRequest;
