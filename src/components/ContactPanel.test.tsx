// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ContactPanel from "./ContactPanel";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ContactPanel", () => {
  it("shows the public address, not a personal one", () => {
    render(<ContactPanel />);
    expect(screen.getByText("hi@haoli.ai")).toBeTruthy();
  });

  it("opens the visitor's mail app addressed to hi@haoli.ai", () => {
    render(<ContactPanel />);
    const link = screen.getByRole("link", { name: /open in your email app/i });
    expect(link.getAttribute("href")).toMatch(/^mailto:hi@haoli\.ai/);
  });

  it("copies the address, so visitors without a mail app can still write", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    render(<ContactPanel />);
    fireEvent.click(screen.getByRole("button", { name: /copy email/i }));
    expect(writeText).toHaveBeenCalledWith("hi@haoli.ai");
    expect(await screen.findByRole("button", { name: /copied/i })).toBeTruthy();
  });
});
