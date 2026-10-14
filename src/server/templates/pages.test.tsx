import { describe, expect, test } from "bun:test";
import { renderToString } from "preact-render-to-string";
import { SITE_NAME } from "../services/seo";
import { Home } from "./home";
import { SoftwareFactory } from "./software-factory";

// The two pages carry their diagrams as inline SVG, and the client animation
// reaches into them by id. These lock the ids and the still frame the client
// depends on, so a template edit can't silently strand the animation.

describe("masthead", () => {
  const pages = [renderToString(<Home />), renderToString(<SoftwareFactory />)];

  test("names the person at the top of every page, with a way home", () => {
    for (const html of pages) {
      expect(html).toContain('class="masthead"');
      expect(html).toContain('class="brand"');
      expect(html).toContain('href="/"');
      expect(html).toContain(SITE_NAME);
    }
  });
});

describe("Home", () => {
  const html = renderToString(<Home />);

  test("renders the hero and its call to action", () => {
    expect(html).toContain("Helping teams build the");
    expect(html).toContain('href="#contact"');
  });

  test("carries the hero diagram and its still frame", () => {
    expect(html).toContain('id="scene"');
    expect(html).toContain('id="items"');
    // The client clears #items before animating, so it has to exist and start
    // full for the no-JavaScript and reduced-motion paths.
    expect(html).toContain('href="#ticket"');
    expect(html).toContain('id="planner"');
    expect(html).toContain('id="builder"');
    expect(html).toContain('id="reviewer"');
  });

  test("links to the explainer page", () => {
    expect(html).toContain('href="/software-factory"');
  });

  test("sets data-page so the client can dispatch home behaviour", () => {
    expect(html).toContain('data-page="home"');
  });

  // Dark-only: the head has to say so, or the browser paints a light form
  // control or scrollbar before the stylesheet lands.
  test("forces the dark theme in the head", () => {
    expect(html).toContain('name="color-scheme" content="dark"');
    expect(html).toContain('name="theme-color" content="#1E1B2E"');
    expect(html).not.toContain("prefers-color-scheme");
  });
});

describe("SoftwareFactory", () => {
  const html = renderToString(<SoftwareFactory />);

  test("renders the explainer sections", () => {
    expect(html).toContain(
      "A ticket goes in. A reviewed pull request comes out.",
    );
    expect(html).toContain("Humans at both ends. Agents in the middle.");
  });

  test("carries the board diagram and its still frame", () => {
    expect(html).toContain('id="scene2"');
    expect(html).toContain('id="todo"');
    expect(html).toContain('id="prs"');
    expect(html).toContain('id="flying1"');
    expect(html).toContain('id="mcount"');
  });

  test("links back to the home page", () => {
    expect(html).toContain('href="/"');
    expect(html).toContain('data-page="software-factory"');
  });
});
