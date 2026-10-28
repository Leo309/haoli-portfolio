// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CaseStudy } from "@/lib/content";
import { products } from "@/lib/site";
import StatusLabel from "@/components/StatusLabel";
import ClientResults from "./ClientResults";
import Products from "./Products";

afterEach(cleanup);

const fixtureCases: CaseStudy[] = [
  { slug: "b", title: "Case B", client: "Client B", metric: "25%", metricLabel: "reply rate", summary: "B summary", order: 1, body: "" },
  { slug: "a", title: "Case A", client: "Client A", metric: "10+ hrs", metricLabel: "saved", summary: "A summary", order: 2, body: "" },
];

describe("StatusLabel", () => {
  it("renders the status as text, not color alone", () => {
    render(<StatusLabel status="paused" />);
    expect(screen.getByText("Paused")).toBeTruthy();
  });
});

describe("ClientResults", () => {
  it("renders each case as a single link to its page, in the given order", () => {
    render(<ClientResults cases={fixtureCases} />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/work/b", "/work/a"]);
  });

  it("puts the metric in the link's accessible name", () => {
    render(<ClientResults cases={fixtureCases} />);
    expect(screen.getByRole("link", { name: /25%/ })).toBeTruthy();
  });
});

describe("Products", () => {
  it("opens every product in a new tab safely", () => {
    render(<Products />);
    const rows = screen.getAllByRole("link").filter((a) => products.some((p) => a.getAttribute("href") === p.url));
    expect(rows).toHaveLength(products.length);
    for (const row of rows) {
      expect(row.getAttribute("target")).toBe("_blank");
      expect(row.getAttribute("rel")).toContain("noopener");
    }
  });

  it("labels each product's status in text", () => {
    render(<Products />);
    const geograde = screen.getByRole("link", { name: /GeoGrade/ });
    expect(within(geograde).getByText("Paused")).toBeTruthy();
  });
});
