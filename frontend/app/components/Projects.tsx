import SectionTitle from "./SectionTitle";
import ProjectCard from "./ProjectCard";
import type { Project } from "../lib/types";

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24">
      <SectionTitle title="Featured Projects" subtitle="Things I have built recently." />

      {projects.length === 0 ? (
        <p className="mt-10 text-center text-gray-500">Projects will appear here soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} p={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}