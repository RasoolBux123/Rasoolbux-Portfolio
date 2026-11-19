const { getPortfolio } = require("./portfolio");
const { getProjects } = require("./projects");

const SUGGESTIONS = ["Projects", "Skills", "About", "Experience", "Contact", "Download CV"];

// Each intent has keywords (English + Roman Urdu) and an async function that builds the answer.
// `d` is the live portfolio content from the database (what the admin edits).
const INTENTS = [
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "salam", "assalam", "aoa", "hola"],
    answer: async (d) => ({ reply: `Hello! I'm ${d.profile.name}'s assistant. Ask me about projects, skills or how to contact me.` }),
  },
  {
    name: "projects",
    keywords: ["project", "projects", "work", "portfolio", "built", "build", "kaam", "banaya"],
    answer: async () => {
      const projects = await getProjects();
      return {
        reply: "Here are my projects:",
        cards: projects.map((p) => ({ title: p.title, subtitle: p.tech.join(" · "), text: p.description })),
      };
    },
  },
  {
    name: "skills",
    keywords: ["skill", "skills", "tech", "stack", "technology", "technologies", "tools", "language", "languages", "hunar"],
    answer: async (d) => ({
      reply: "Here is my tech stack:",
      cards: d.skills.map((s) => ({ title: s.group, subtitle: s.items.join(" · ") })),
    }),
  },
  {
    name: "experience",
    keywords: ["experience", "journey", "education", "bootcamp", "learning", "years", "timeline"],
    answer: async (d) => ({
      reply: "My journey so far:",
      cards: d.experience.map((e) => ({ title: `${e.year} — ${e.title}`, subtitle: e.detail })),
    }),
  },
  {
    name: "about",
    keywords: ["about", "who", "yourself", "intro", "introduce", "bio", "kaun", "tum", "aap"],
    answer: async (d) => ({ reply: `${d.profile.about} I'm based in ${d.profile.location}.` }),
  },
  {
    name: "contact",
    keywords: ["contact", "email", "mail", "reach", "hire", "hiring", "github", "linkedin", "rabta", "phone"],
    answer: async (d) => ({
      reply: "I'm open to work. You can reach me here:",
      links: [
        { label: "Email me", href: `mailto:${d.contact.email}` },
        { label: "GitHub", href: d.contact.github },
        { label: "LinkedIn", href: d.contact.linkedin },
      ],
    }),
  },
  {
    name: "cv",
    keywords: ["cv", "resume", "download"],
    answer: async (d) => ({ reply: "Here is my CV:", links: [{ label: "Download CV (PDF)", href: d.resumeUrl }] }),
  },
];

function words(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

async function getReply(message) {
  const found = new Set(words(message));

  // score = how many keywords of an intent appear in the message
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    const score = intent.keywords.filter((k) => found.has(k)).length;
    if (score > bestScore) {
      best = intent;
      bestScore = score;
    }
  }

  const result = best ? await best.answer(await getPortfolio()) : { reply: "Sorry, I didn't get that. Try one of these:" };

  return { ...result, intent: best ? best.name : "unknown", suggestions: SUGGESTIONS };
}

module.exports = { getReply };