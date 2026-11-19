"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Code2, Briefcase, Send, CheckCircle2 } from "lucide-react";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";
import { sendContact } from "../lib/contactApi";
import type { ContactForm, ContactResult, Profile } from "../lib/types";

const EMPTY: ContactForm = { name: "", email: "", message: "" };
const inputCls =
  "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-gray-500 focus:border-indigo-400 focus:bg-white/10";

export default function Contact({ data }: { data: Profile | null }) {
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<ContactResult | null>(null);

  const contact = data?.contact;

  function update(field: keyof ContactForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    if (result?.fields?.[field]) setResult({ ...result, fields: { ...result.fields, [field]: undefined } });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setResult(null);

    const res = await sendContact(form);
    if (res.ok) {
      setStatus("done");
      setForm(EMPTY);
    } else {
      setStatus("idle");
      setResult(res);
    }
  }

  const fieldErr = (f: keyof ContactForm) => result?.fields?.[f];

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-28">
      <SectionTitle title="Get In Touch" subtitle="Have a project or an opportunity? Send me a message." />

      <div className="mt-10 grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="space-y-3">
            {contact && (
              <>
                <ContactLink icon={<Mail size={18} />} label={contact.email} href={`mailto:${contact.email}`} />
                <ContactLink icon={<Code2 size={18} />} label="GitHub" href={contact.github} />
                <ContactLink icon={<Briefcase size={18} />} label="LinkedIn" href={contact.linkedin} />
              </>
            )}
            <p className="pt-2 text-sm text-gray-400">I usually reply within a day.</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {status === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[320px] flex-col items-center justify-center text-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }}>
                    <CheckCircle2 size={56} className="text-emerald-400" />
                  </motion.div>
                  <h3 className="mt-4 text-xl font-semibold">Message sent!</h3>
                  <p className="mt-1 text-sm text-gray-400">Thanks for reaching out. I will get back to you soon.</p>
                  <button onClick={() => setStatus("idle")} className="mt-5 text-sm text-indigo-300 hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0 }} className="space-y-4">
                  <Field error={fieldErr("name")}>
                    <input
                      className={`${inputCls} ${fieldErr("name") ? "border-red-400/70" : "border-white/15"}`}
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      maxLength={80}
                    />
                  </Field>
                  <Field error={fieldErr("email")}>
                    <input
                      type="email"
                      className={`${inputCls} ${fieldErr("email") ? "border-red-400/70" : "border-white/15"}`}
                      placeholder="Your email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      maxLength={120}
                    />
                  </Field>
                  <Field error={fieldErr("message")}>
                    <textarea
                      rows={5}
                      className={`${inputCls} resize-none ${fieldErr("message") ? "border-red-400/70" : "border-white/15"}`}
                      placeholder="Your message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      maxLength={1000}
                    />
                  </Field>

                  {result && !result.ok && !result.fields && (
                    <p className="text-sm text-red-400">{result.error}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 font-semibold text-white disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending..." : (<>Send message <Send size={16} /></>)}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({ children, error }: { children: React.ReactNode; error?: string }) {
  return (
    <div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 text-xs text-red-400">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      whileHover={{ x: 6 }}
      className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm backdrop-blur-xl hover:bg-white/10"
    >
      <span className="text-indigo-300">{icon}</span>
      {label}
    </motion.a>
  );
}