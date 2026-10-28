// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Markdown from "./Markdown";

afterEach(cleanup);

describe("Markdown", () => {
  it("opens external links in a new tab so the visitor keeps their place", () => {
    render(<Markdown>{"See [LinkedIn](https://www.linkedin.com/in/haoli-van/)."}</Markdown>);
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
  });

  it("keeps internal links in the same tab", () => {
    render(<Markdown>{"Read [the case](/work/dtc-cold-email)."}</Markdown>);
    expect(screen.getByRole("link", { name: "the case" }).getAttribute("target")).toBeNull();
  });
});
