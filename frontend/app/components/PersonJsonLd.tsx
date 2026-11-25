import { SITE_URL, SITE_NAME } from "../lib/site";
import { API_URL } from "../lib/config";
import type { Profile } from "../lib/types";

// Tells Google "this site is about this person" in a format it understands (schema.org Person).
export default function PersonJsonLd({ data }: { data: Profile | null }) {
  const photo = data?.photoUrl ?? "/pic.jpg";
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    alternateName: "RB",
    url: SITE_URL,
    image: photo.startsWith("/api/") ? `${API_URL}${photo}` : `${SITE_URL}${photo}`,
    jobTitle: "AI Full Stack Developer",
    description: data?.profile.about,
    worksFor: { "@type": "Organization", name: "Xloop Digital" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "MUET SZAB Campus, Khairpur Mir's" },
    knowsAbout: ["Next.js", "React", "Node.js", "FastAPI", "PostgreSQL", "Prisma", "AI", "n8n automation"],
    sameAs: [data?.contact.github, data?.contact.linkedin].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      // "<" is escaped so the text can never close the script tag early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }}
    />
  );
}