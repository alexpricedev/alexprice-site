import type { BunRequest } from "bun";

/** A `BunRequest` for a given URL and method, for route-handler tests. */
export const createMockRequest = (url: string, method = "GET"): BunRequest =>
  new Request(url, { method }) as BunRequest;
