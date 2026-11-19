"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Inbox, LogOut, FolderKanban, Mail } from "lucide-react";
import { clearToken, fetchMe } from "../lib/auth";
import { api } from "../lib/adminApi";
import CountUp from "../components/CountUp";
import ProjectsPanel from "../components/admin/ProjectsPanel";
import MessagesPanel from "../components/admin/MessagesPanel";
import AboutPanel from "../components/admin/AboutPanel";
import SkillsPanel from "../components/admin/SkillsPanel";
import ThemeToggle from "../components/admin/ThemeToggle";
import type { AdminStats } from "../lib/types";

type Tab = "projects" | "messages" | "about" | "skills";

export default function AdminHome() {
  const router = useRouter();
  const [me, setMe] = useState<{ id: number; email: string } | null>(null);
  const [tab, setTab] = useState<Tab>("projects");
  const [stats, setStats] = useState<AdminStats | null>(null);

  // route guard: no valid token -> go to login
  useEffect(() => {
    fetchMe().then((user) => {
      if (!user) router.replace("/admin/login");
      else setMe(user);
    });
  }, [router]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await api<AdminStats>("/stats"));
    } catch {}
  }, []);

  useEffect(() => {
    if (me) loadStats();
  }, [me, loadStats]);

  function logout() {
    clearToken();
    router.replace("/admin/login");
  }

  if (!me) return <main className="flex min-h-screen items-center justify-center text-gray-500">Checking session...</main>;

  const cards = [
    { label: "Projects", value: stats?.projects ?? 0, icon: <FolderKanban size={18} /> },
    { label: "Messages", value: stats?.messages ?? 0, icon: <Inbox size={18} /> },
    { label: "Unread", value: stats?.unread ?? 0, icon: <Mail size={18} /> },
  ];

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400">Logged in as {me.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="/" target="_blank" className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
            View site
          </a>
          <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </motion.div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-white/15 bg-white/5 p-4"
          >
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-sm">{c.label}</span>
              <span className="text-indigo-300">{c.icon}</span>
            </div>
            <p className="mt-2 text-3xl font-bold">
              {stats ? <CountUp key={c.value} to={c.value} /> : "-"}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex gap-6 overflow-x-auto border-b border-white/10">
        {(["projects", "messages", "about", "skills"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="relative pb-3 text-sm font-medium capitalize">
            <span className={tab === t ? "text-white" : "text-gray-500 hover:text-gray-300"}>
              {t}
              {t === "messages" && !!stats?.unread && (
                <span className="ml-2 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-bold">{stats.unread}</span>
              )}
            </span>
            {tab === t && <motion.span layoutId="admin-tab" className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-indigo-400 to-fuchsia-400" />}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "projects" && <ProjectsPanel onChanged={loadStats} />}
        {tab === "messages" && <MessagesPanel onChanged={loadStats} />}
        {tab === "about" && <AboutPanel />}
        {tab === "skills" && <SkillsPanel />}
      </div>
    </main>
  );
}