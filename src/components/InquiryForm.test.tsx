// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InquiryForm from "./InquiryForm";
import { PanelProvider } from "./PanelProvider";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderForm() {
  render(
    <PanelProvider>
      <InquiryForm />
    </PanelProvider>
  );
}

function fillValid() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@acme.com" } });
  fireEvent.change(screen.getByLabelText("What do you want to save time or money on?"), {
    target: { value: "Our weekly report takes a whole day to build." },
  });
}

function respondWith(status: number, body: unknown) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));
}

describe("InquiryForm", () => {
  it.each([
    [429, { error: "Too many messages. Please try again later." }],
    [500, { error: "Something went wrong." }],
    [504, {}],
  ])("offers the email address when the server answers %i", async (status, body) => {
    respondWith(status, body);
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    const link = await screen.findByRole("link", { name: "hello@skynexdigital.com" });
    expect(link.getAttribute("href")).toContain("mailto:hello@skynexdigital.com");
  });

  it("moves focus to the first field with an error", async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ada@acme.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByLabelText("Name")));
  });
});
