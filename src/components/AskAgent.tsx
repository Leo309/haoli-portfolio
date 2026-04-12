"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTED_QUESTIONS = [
  "Does Hao have Power BI experience?",
  "What projects has he built?",
  "What's his SQL experience level?",
  "Is he available for full-time roles?",
];

export default function AskAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (question?: string) => {
    const q = question || input.trim();
    if (!q || loading) return;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: q }]);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, history }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again.",
          },
        ]);
      } else {
        setHistory(data.history);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <section id="ask" className="scroll-mt-16 lg:scroll-mt-24">
      {/* Mobile section header */}
      <div className="sticky top-0 z-20 -mx-6 mb-4 bg-slate-900/75 px-6 py-5 backdrop-blur lg:hidden">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">
          Ask My AI
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <p className="mb-4 leading-relaxed">
          Curious about my background? Ask my AI agent — it searches my
          professional documents using RAG and answers with verified facts.
        </p>

        {/* Chat container */}
        <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
          {/* Messages */}
          <div className="mb-4 min-h-[120px] max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => ask(q)}
                      className="cursor-pointer rounded-full border border-teal-400/20 bg-teal-400/5 px-3 py-1.5 text-xs text-teal-300 transition-all hover:border-teal-400/40 hover:bg-teal-400/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm ${m.role === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-lg px-3 py-2 ${
                    m.role === "user"
                      ? "bg-teal-400/15 text-teal-100 whitespace-pre-wrap"
                      : "bg-slate-800/80 text-slate-300 prose prose-sm prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-headings:my-1 prose-headings:text-slate-200 prose-strong:text-teal-200 prose-a:text-teal-300 max-w-none"
                  }`}
                >
                  {m.role === "user" ? (
                    m.content
                  ) : (
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-slate-500 animate-pulse">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-slate-700/50 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none transition-colors focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && ask()}
              placeholder="Ask about my experience, skills, projects..."
              disabled={loading}
            />
            <button
              onClick={() => ask()}
              disabled={loading || !input.trim()}
              className="cursor-pointer rounded-md border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm font-medium text-teal-300 transition-all hover:bg-teal-400/20 hover:border-teal-400/50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Ask
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-600">
            Powered by RAG + Claude AI &middot; Searches my professional
            documents to give accurate answers
          </p>
        </div>
      </motion.div>
    </section>
  );
}
