// All portfolio content lives here. Phase 4 moves "projects" into a database.
module.exports = {
   profile: {
    name: "Rasool Bux",
    role: "Junior Software Engineer at Xloop Digital",
    location: "Karachi, Pakistan",
    about:
     "I'm RB, a Junior Software Engineer at Xloop Digital. I work on real-world products as part of a team, building full-stack web applications from the user interface to the APIs and databases behind it."
  },
  skills: [
    { group: "Frontend", items: ["Next.js", "React", "JavaScript", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { group: "Backend", items: ["Python", "FastAPI", "Node.js", "Express", "REST APIs", "JWT auth"] },
    { group: "Databases", items: ["PostgreSQL", "MongoDB", "Prisma"] },
    { group: "AI & Automation", items: ["AI / ML", "n8n Automation"] },
    { group: "Cloud & Tools", items: ["Microsoft Azure", "Git", "Docker"] },
  ],
  experience: [
    {
      year: "Present",
      title: "Junior Software Engineer, Xloop Digital",
      detail: "Building full-stack products with Next.js, Python, FastAPI and AI/automation tools",
    },
    {
      year: "6 months",
      title: "Full Stack Developer Bootcamp, Xloop Digital",
      detail: "Sponsored by Mari Energies. Next.js, JavaScript, Python, FastAPI, PostgreSQL, MongoDB, AI/ML, n8n and Azure",
    },
    {
      year: "Project",
      title: "Real Estate Hub",
      detail: "Team project with Next.js, FastAPI and PostgreSQL",
    },
  

      {
      year: "Education",
      title: "Software Engineering, MUET SZAB Campus",
      detail: "Mehran University of Engineering and Technology, SZAB Campus, Khairpur Mir's",
    },
  ],
  contact: {
    email: "rbmalik25@gmail.com",
    github: "https://github.com/RasoolBux123",
    linkedin: "https://www.linkedin.com/in/rasool-b-5a9bb719b/overlay/contact-info/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base%3BM%2Fl1SKH6TQOacfxu49GKtg%3D%3D",
    whatsapp: "https://wa.me/923063400025",
  },

  
  resumeUrl: "/Rasool_bux.pdf",
  photoUrl: "/pic.jpg",
  projects: [
    {
      id: 1,
      title: "Real Estate Hub",
      description: "Listings, admin approval, notifications and a property chatbot.",
      tech: ["Next.js", "FastAPI", "PostgreSQL"],
      colors: ["#4f46e5", "#9333ea"],
    },
    {
      id: 2,
      title: "HR Project Tracker",
      description: "Sprints, tasks and HR review for teams.",
      tech: ["Next.js", "Node.js"],
      colors: ["#0ea5e9", "#6366f1"],
    },
    {
      id: 3,
      title: "School Management",
      description: "Students, attendance, fees and ID cards.",
      tech: ["Next.js", "Express", "Prisma"],
      colors: ["#ec4899", "#f97316"],
    },
  ],
};