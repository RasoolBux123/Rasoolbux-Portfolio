import type { MetadataRoute } from "next";
import { API_URL } from "./lib/config";
import { SITE_URL } from "./lib/site";
import type { Project } from "./lib/types";

// built on request, so a project you add in admin shows up without a redeploy
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: Project[] = [];
  try {
        const res = await fetch(`${API_URL}/api/projects`, {
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // do not wait more than 5 seconds for a sleeping API
    });
    if (res.ok) projects = await res.json();
  } catch {
    // API asleep: the sitemap still lists the home page
  }

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}