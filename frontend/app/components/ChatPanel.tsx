"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ExternalLink, Sparkles, X } from "lucide-react";
import { sendMessage } from "../lib/chatApi";
import type { ChatCard, ChatLink } from "../lib/types";
import { assetUrl } from "../lib/config"
type Msg = { role: "user" | "bot"; text: string; cards?: ChatCard[]; links?: ChatLink[] };

const START: string[] = ["Projects", "Skills", "About", "Contact"];

export default function ChatPanel({ onClose }: { onClose?: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm RB's assistant. Ask me anything or tap a question below." },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(START);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // scroll only the chat box (not the whole page) to the newest message
  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, loading]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;

    setMsgs((m) => [...m, { role: "user", text: message }]);
    setInput("");
    setLoading(true);

    try {
      const r = await sendMessage(message);
      setMsgs((m) => [...m, { role: "bot", text: r.reply, cards: r.cards, links: r.links }]);
      setSuggestions(r.suggestions);
    } catch {
      setMsgs((m) => [...m, { role: "bot", text: "Sorry, the assistant is offline right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[520px] max-h-[70vh] w-full flex-col rounded-3xl border border-white/20 bg-[#121933]/95 p-4 shadow-2xl shadow-indigo-500/30 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500">
          <Sparkles size={14} />
        </span>
        RB Assistant
        <span className="ml-auto flex items-center gap-1 text-xs text-emerald-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> online
        </span>
        {onClose && (
          <button onClick={onClose} aria-label="Close chat" className="rounded-full p-1 text-gray-300 hover:bg-white/10">
            <X size={16} />
          </button>
        )}
      </div>

      {/* messages */}
      <div ref={boxRef} className="flex-1 space-y-3 overflow-y-auto pr-1 text-sm">
        {msgs.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div className="max-w-[90%] space-y-2">
              <div
                className={`rounded-2xl px-4 py-2.5 leading-relaxed ${
                  m.role === "user" ? "bg-indigo-500 text-white" : "border border-white/15 bg-white/10"
                }`}
              >
                {m.text}
              </div>

              {m.cards?.map((c) => (
                <div key={c.title} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2">
                  <p className="font-semibold">{c.title}</p>
                  {c.subtitle && <p className="text-xs text-indigo-200">{c.subtitle}</p>}
                  {c.text && <p className="mt-1 text-xs text-gray-400">{c.text}</p>}
                </div>
              ))}

              {m.links && (
                <div className="flex flex-wrap gap-2">
                  {m.links.map((l) => (
                    <a
                      key={l.label}
                      href={assetUrl(l.href)}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-indigo-500 px-3 py-1.5 text-xs font-medium hover:bg-indigo-400"
                    >
                      {l.label} <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-1 pl-2">
            {[0, 1, 2].map((d) => (
              <motion.span
                key={d}
                className="h-2 w-2 rounded-full bg-indigo-300"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 0.7, delay: d * 0.15 }}
              />
            ))}
          </div>
        )}
      </div>

      {/* quick suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-indigo-100 transition hover:bg-white/10 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 py-1.5 pl-4 pr-1.5"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about RB..."
          maxLength={300}
          className="flex-1 bg-transparent text-base text-white outline-none placeholder:text-gray-400 sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 transition hover:bg-indigo-400 disabled:opacity-40"
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
}