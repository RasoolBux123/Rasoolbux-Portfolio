import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, Code2, ExternalLink } from "lucide-react";
//import { API_URL } from "../../lib/config";
import type { Project } from "../../lib/types";
import { API_URL, assetUrl } from "../../lib/config";
// always fetch fresh data from the Node.js API
export const dynamic = "force-dynamic";

type Result = { status: "ok"; project: Project } | { status: "missing" } | { status: "error" };

// cache() makes the page and generateMetadata share ONE request
const load = cache(async (id: string): Promise<Result> => {
  try {
    const res = await fetch(`${API_URL}/api/projects/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.status === 404) return { status: "missing" };
    if (!res.ok) return { status: "error" };
    return { status: "ok", project: (await res.json()) as Project };
  } catch {
    return { status: "error" };
  }
});

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const r = await load(id);
  if (r.status !== "ok") return { title: "Project | Rasool Bux" };
  const title = `${r.project.title} | Rasool Bux`;
  return { title, description: r.project.description, openGraph: { title, description: r.project.description } };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = await load(id);

  if (r.status === "missing") notFound();

  if (r.status === "error") {
    return (
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32 text-center">
        <p className="text-gray-300">Could not load this project right now. The server may be waking up, please try again in a minute.</p>
        <Link href="/#projects" className="mt-6 inline-block text-indigo-300 hover:underline">
          Back to projects
        </Link>
      </main>
    );
  }

  const p = r.project;

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 pt-28">
      <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-white/15">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={assetUrl(p.image)} alt={p.title} className="h-48 w-full object-cover sm:h-72" />
        ) : (
          <div className="h-48 sm:h-64" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }} />
        )}
        <div className="bg-[#11172b] p-6 sm:p-8">
          <h1 className="text-3xl font-bold sm:text-4xl">{p.title}</h1>
          <p className="mt-3 text-gray-300">{p.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs text-indigo-200">
                {t}
              </span>
            ))}
          </div>

          {(p.liveUrl || p.githubUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {p.liveUrl && (
                <a
                  href={p.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Live demo <ExternalLink size={16} />
                </a>
              )}
              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/10"
                >
                  Source code <Code2 size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {p.details && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">About this project</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-gray-300">{p.details}</p>
        </section>
      )}
    </main>
  );
}