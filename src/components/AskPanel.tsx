"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatTurn } from "@/lib/ask-history";
import { trackEvent } from "@/lib/analytics";
import Markdown from "./Markdown";
import { usePanel } from "./PanelProvider";

type Message = { role: "user" | "assistant"; content: string; sources?: string[] };

const STARTER_QUESTIONS = [
  "What has Hao built for clients?",
  "Could Hao automate something for my business?",
  "What problems has Hao solved with AI?",
  "How do I work with him?",
];

const MAX_QUESTION_LENGTH = 500;

export default function AskPanel() {
  const { open, openPanel } = usePanel();
  const [messages, setMessages] = useState<Message[]>([]);
  // The server's cleaned-up text history, sent back with each question
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open !== "ask") return;
    // Wait a frame: the parent Panel's showModal() runs after this effect and would move focus to its first button
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || loading) return;

    trackEvent("ask_question");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(res.status === 429 ? "You've asked a lot of questions. Try again in a bit." : "Something went wrong. Please try again.");
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: data.answer, sources: data.sources }]);
      setHistory(data.history ?? []);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <p className="text-[13px] text-muted">Answers come only from Hao&apos;s profile, with the sources shown.</p>

      <div aria-live="polite" className="mt-4 flex-1 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="min-h-10 rounded-[10px] border border-line-2 bg-card px-3 py-2 text-left text-[13.5px] text-ink-2 transition-colors hover:border-accent hover:text-ink"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p key={i} className="ml-8 rounded-[12px] bg-accent-soft px-3 py-2 text-[14px] text-ink">
              {m.content}
            </p>
          ) : (
            <div key={i} className="rounded-[12px] border border-line bg-card px-3 py-2.5">
              <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-p:text-ink-2 prose-li:text-ink-2 prose-strong:text-ink prose-a:text-accent">
                <Markdown>{m.content}</Markdown>
              </div>
              {m.sources && m.sources.length > 0 && (
                <ul aria-label="Sources" className="mt-2 flex flex-wrap gap-1.5">
                  {m.sources.map((s) => (
                    <li key={s} className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-muted">
                      Source: {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        )}

        {loading && <p className="text-[13px] text-muted">Thinking…</p>}
        {error && (
          <p role="alert" className="text-[13px] text-danger">
            {error}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="sticky bottom-0 mt-4 flex gap-2 bg-canvas pt-2"
      >
        <label htmlFor="ask-input" className="sr-only">
          Your question
        </label>
        <input
          ref={inputRef}
          id="ask-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_QUESTION_LENGTH}
          placeholder="Ask about Hao's work…"
          autoComplete="off"
          className="min-h-11 min-w-0 flex-1 rounded-[10px] border border-line-2 bg-card px-3 text-[14px] outline-none focus:border-accent focus:shadow-[0_0_0_4px_var(--color-accent-soft)]"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="min-h-11 rounded-[10px] bg-accent px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-ink disabled:opacity-50"
        >
          Ask
        </button>
      </form>

      <button
        type="button"
        onClick={() => {
          trackEvent("work_with_me_click", { from: "ask" });
          openPanel("inquiry");
        }}
        className="mt-3 -mb-2 self-start py-2 text-[13px] font-semibold text-accent hover:text-accent-ink"
      >
        Work with me →
      </button>
    </div>
  );
}
