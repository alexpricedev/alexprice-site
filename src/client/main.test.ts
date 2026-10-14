import { afterEach, describe, expect, test } from "bun:test";

describe("main page router", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    delete document.body.dataset.page;
  });

  test("boots without throwing on the home page", async () => {
    document.body.dataset.page = "home";
    await import("./main");
    expect(true).toBe(true);
  });
});
