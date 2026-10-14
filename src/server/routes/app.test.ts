import { describe, expect, test } from "bun:test";
import { createBunRequest } from "../test-utils/bun-request";
import { appRoutes } from "./app";

const PATHS = Object.keys(appRoutes);

describe("appRoutes", () => {
  test("answers the two pages and every SEO artefact", () => {
    expect(PATHS).toContain("/");
    expect(PATHS).toContain("/software-factory");
    expect(PATHS).toContain("/robots.txt");
    expect(PATHS).toContain("/sitemap.xml");
    expect(PATHS).toContain("/llms.txt");
    expect(PATHS).toContain("/site.webmanifest");
    expect(PATHS).toContain("/.well-known/security.txt");
  });

  test("ships no leftover Billet routes", () => {
    for (const stale of [
      "/login",
      "/signup",
      "/account",
      "/admin",
      "/todos",
      "/forms",
      "/team",
    ]) {
      expect(PATHS).not.toContain(stale);
    }
  });

  test("a page route answers GET and refuses other methods with a 405", async () => {
    const route = appRoutes["/"];

    expect(
      (await route(createBunRequest("http://localhost:3000/"))).status,
    ).toBe(200);

    const post = await route(
      createBunRequest("http://localhost:3000/", { method: "POST" }),
    );
    expect(post.status).toBe(405);
    expect(post.headers.get("Allow")).toContain("GET");
  });
});
