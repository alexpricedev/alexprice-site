import { describe, expect, test } from "bun:test";
import { withIndexingAllowed } from "../../test-utils/helpers";
import { home } from "./home";

describe("Home Controller", () => {
  describe("GET /", () => {
    test("renders the home page wrapped in the layout", async () => {
      const response = home.index();
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toContain("text/html");
      expect(html).toContain('data-page="home"');
      expect(html).toContain("Helping teams build the");
    });

    // A public page carries no noindex of its own, so what it renders is the
    // site-wide switch. Both directions, because the default being closed is
    // the whole point and the open path is what a production host gets.
    test("stays out of the index until indexing is switched on", async () => {
      const html = await home.index().text();

      expect(html).toContain('name="robots" content="noindex, nofollow"');
      // Structured data follows the tag: no point describing a page to a
      // crawler you are telling to ignore it.
      expect(html).not.toContain("application/ld+json");
    });

    test("is indexable with structured data once indexing is on", async () => {
      const html = await withIndexingAllowed(async () =>
        (await home.index()).text(),
      );

      expect(html).not.toContain('name="robots"');
      expect(html).toContain("application/ld+json");
    });
  });
});
