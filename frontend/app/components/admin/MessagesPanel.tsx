"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { api } from "../../lib/adminApi";
import type { AdminMessage } from "../../lib/types";

export default function MessagesPanel({ onChanged }: { onChanged: () => void }) {
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [openId, setOpenId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setMessages(await api<AdminMessage[]>("/messages"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setRead(m: AdminMessage, read: boolean) {
    // update the screen first, tell the server after (feels instant)
    setMessages((list) => list?.map((x) => (x.id === m.id ? { ...x, read } : x)) ?? null);
    try {
      await api(`/messages/${m.id}`, { method: "PATCH", body: JSON.stringify({ read }) });
      onChanged();
    } catch {
      load(); // something failed, reload the real state
    }
  }

  function toggleOpen(m: AdminMessage) {
    setOpenId((id) => (id === m.id ? null : m.id));
    if (!m.read) setRead(m, true); // opening a message marks it as read
  }

  async function remove(id: number) {
    try {
      await api(`/messages/${id}`, { method: "DELETE" });
      setMessages((list) => list?.filter((m) => m.id !== id) ?? null);
      setConfirmId(null);
      onChanged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {!messages && !error && <p className="text-gray-500">Loading...</p>}
      {messages?.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-gray-400">No messages yet. They appear here when someone uses your Contact form.</p>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {messages?.map((m) => {
            const open = openId === m.id;
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`rounded-2xl border p-4 ${m.read ? "border-white/10 bg-white/[0.03]" : "border-indigo-400/40 bg-indigo-500/10"}`}
              >
                <button onClick={() => toggleOpen(m)} className="flex w-full items-start gap-3 text-left">
                  <span className={`mt-1.5 h-2.5 w-2.5 flex-none rounded-full ${m.read ? "bg-transparent" : "bg-indigo-400"}`} />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                    </span>
                    <span className="block text-xs text-gray-400">{m.email}</span>
                    {!open && <span className="mt-1 block truncate text-sm text-gray-300">{m.message}</span>}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="mt-3 whitespace-pre-wrap pl-5 text-sm leading-relaxed text-gray-200">{m.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2 pl-5">
                        <a
                          href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}`}
                          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-400"
                        >
                          <Mail size={13} /> Reply
                        </a>
                        <button onClick={() => setRead(m, !m.read)} className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
                          <MailOpen size={13} /> Mark as {m.read ? "unread" : "read"}
                        </button>
                        {confirmId === m.id ? (
                          <>
                            <button onClick={() => remove(m.id)} className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold hover:bg-red-500">
                              Yes, delete
                            </button>
                            <button onClick={() => setConfirmId(null)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button onClick={() => setConfirmId(m.id)} className="flex items-center gap-1.5 rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/10">
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}