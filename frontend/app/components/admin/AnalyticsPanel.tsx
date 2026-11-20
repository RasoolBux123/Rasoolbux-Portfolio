"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/adminApi";
import type { AdminAnalytics } from "../../lib/types";

const RANGES = [7, 30, 90];

function country(code: string) {
  if (!code || code === "Unknown") return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function List({ title, rows, format }: { title: string; rows: { name: string; count: number }[]; format?: (n: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="mb-3 text-sm font-medium">{title}</p>
      {rows.length === 0 && <p className="text-sm text-gray-500">No data yet</p>}
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.name} className="text-sm">
            <div className="flex justify-between gap-3">
              <span className="truncate text-gray-300">{format ? format(r.name) : r.name}</span>
              <span className="text-gray-400">{r.count}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/10">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400" style={{ width: `${(r.count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setData(null);
    setError("");
    api<AdminAnalytics>(`/analytics?days=${days}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      alive = false;
    };
  }, [days]);

  const maxViews = Math.max(1, ...(data?.series.map((s) => s.views) ?? [1]));

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setDays(r)}
            className={`rounded-full border px-4 py-1.5 text-sm ${days === r ? "border-indigo-400 bg-indigo-500/20" : "border-white/15 hover:bg-white/10"}`}
          >
            Last {r} days
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {!data && !error && <p className="text-gray-500">Loading...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Visitors today" value={data.todayVisitors} />
            <Stat label="Views today" value={data.todayViews} />
            <Stat label={`Visitors (${data.days}d)`} value={data.uniqueVisitors} />
            <Stat label={`Views (${data.days}d)`} value={data.totalViews} />
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="mb-3 text-sm font-medium">Views per day</p>
            <div className="flex h-40 items-end gap-[2px]">
              {data.series.map((s) => (
                <div
                  key={s.date}
                  title={`${s.date}: ${s.views} views, ${s.visitors} visitors`}
                  className="flex-1 rounded-t bg-gradient-to-t from-indigo-500 to-fuchsia-400"
                  style={{ height: `${Math.max(2, (s.views / maxViews) * 100)}%`, opacity: s.views ? 1 : 0.25 }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>{data.series[0]?.date}</span>
              <span>{data.series[data.series.length - 1]?.date}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <List title="Top pages" rows={data.pages} />
            <List title="Where they came from" rows={data.referrers} />
            <List title="Countries" rows={data.countries} format={country} />
            <List title="Devices" rows={data.devices} />
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
            <p className="mb-3 text-sm font-medium">Recent visits</p>
            {data.recent.length === 0 && <p className="text-sm text-gray-500">No visits yet</p>}
            <div className="divide-y divide-white/10 text-sm">
              {data.recent.map((v, i) => (
                <div key={i} className="flex flex-wrap justify-between gap-2 py-2">
                  <span className="text-gray-300">
                    {v.path} · {country(v.country)} · {v.device}
                    {v.referrer ? ` · from ${v.referrer}` : ""}
                  </span>
                  <span className="text-gray-500">{new Date(v.time).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}