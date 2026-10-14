import { describe, expect, test } from "bun:test";

// The site is dark-only. This reads the stylesheet itself, because the
// regression that matters is silent: reintroducing a `prefers-color-scheme`
// block would give light-mode users the light palette with nothing failing.
const css = await Bun.file(`${import.meta.dir}/base.css`).text();

describe("base.css theme", () => {
  test("is dark-only: nothing reads the OS colour-scheme preference", () => {
    expect(css).not.toContain("prefers-color-scheme");
    expect(css).not.toContain("data-theme");
  });

  test("declares an explicit dark color-scheme so form controls and chrome follow", () => {
    expect(css).toContain("color-scheme: dark");
  });
});
