// @vitest-environment jsdom
import fs from "node:fs";
import path from "node:path";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import Reveal from "./Reveal";

function prefersReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }));
}

// jsdom has no IntersectionObserver; whileInView needs one to mount
class NoopIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

afterEach(() => vi.unstubAllGlobals());

describe("Reveal", () => {
  it("marks its wrapper so CSS can force it visible", () => {
    expect(renderToString(<Reveal>hi</Reveal>)).toContain("data-reveal");
  });

  it("keeps the same marked element after hydrating for a reduced-motion visitor", async () => {
    const html = renderToString(<Reveal>hi</Reveal>);
    prefersReducedMotion(true);
    vi.stubGlobal("IntersectionObserver", NoopIntersectionObserver);
    const container = document.createElement("div");
    container.innerHTML = html;
    await act(async () => {
      hydrateRoot(container, <Reveal>hi</Reveal>);
    });
    expect(container.firstElementChild?.hasAttribute("data-reveal")).toBe(true);
  });

  it("has a reduced-motion rule that overrides the hidden starting style", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "src/app/globals.css"), "utf8");
    const reducedBlock = css.slice(css.lastIndexOf("@media (prefers-reduced-motion: reduce)"));
    expect(reducedBlock).toMatch(/\[data-reveal\][^}]*opacity:\s*1\s*!important/);
  });
});
