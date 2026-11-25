import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Projects from "./components/Projects";
import TechMarquee from "./components/TechMarquee";
import About from "./components/About";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { API_URL } from "./lib/config";
import type { Profile, Project } from "./lib/types";
import Experience from "./components/Experience";
import Education from "./components/Education";

      
// always fetch fresh data from the Node.js API
export const dynamic = "force-dynamic";

// one small helper for every GET; returns fallback if the API is offline
async function get<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

export default async function Home() {
  const [projects, profile] = await Promise.all([
    get<Project[]>("/api/projects", []),
    get<Profile | null>("/api/profile", null),
  ]);

  return (
    <main>
     <Hero photoUrl={profile?.photoUrl} resumeUrl={profile?.resumeUrl} />
      <Stats />
      <TechMarquee />
      <About data={profile} />
      <Experience data={profile} />
      <Projects projects={projects} />
      <Skills data={profile} />
      <Education data={profile} />
      <Contact data={profile} />
      <Footer />
    </main>
  );
}