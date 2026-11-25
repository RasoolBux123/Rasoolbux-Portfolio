const prisma = require("../db");
const defaults = require("../data/portfolio");
const { listCertificates } = require("./credentials");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_RE = /^https?:\/\/\S+$/i;
const str = (v) => (typeof v === "string" ? v.trim() : "");

// Everything the About, Skills and Contact sections (and the chatbot) need.
// Until the admin saves something for the first time (profile row missing),
// it falls back to data/portfolio.js.
async function getPortfolio() {
  const [p, groups, exp, edu, certificates] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.skillGroup.findMany({ orderBy: { position: "asc" } }),
    prisma.experience.findMany({ orderBy: { position: "asc" } }),
    prisma.education.findMany({ orderBy: { position: "asc" } }),
    listCertificates(),
  ]);

  if (!p) return defaults;

  return {
    profile: { name: defaults.profile.name, role: p.role, location: p.location, about: p.about },
    skills: groups.map((g) => ({ group: g.name, items: g.items.split(",") })),
    experience: exp.map((e) => ({
      year: e.year,
      title: e.title,
      detail: e.detail,
      current: e.current,
      tech: e.tech ? e.tech.split(",") : [],
    })),
    education: edu.map((e) => ({ degree: e.degree, school: e.school, period: e.period, detail: e.detail })),
    certificates,
    contact: { email: p.email, github: p.github, linkedin: p.linkedin, whatsapp: p.whatsapp },
    resumeUrl: p.cvVer > 0 ? `/api/files/cv?v=${p.cvVer}` : defaults.resumeUrl,
    photoUrl: p.photoVer > 0 ? `/api/files/photo?v=${p.photoVer}` : defaults.photoUrl,
    now: p.nowText ? { text: p.nowText, updatedAt: p.nowAt ? p.nowAt.toISOString() : null } : null,
  };
}

// ---------- profile ----------
function validateProfile(body = {}) {
  const clean = {
    role: str(body.role),
    location: str(body.location),
    about: str(body.about),
    email: str(body.email),
    github: str(body.github),
    linkedin: str(body.linkedin),
    whatsapp: str(body.whatsapp).replace(/[^\d]/g, ""), // keep digits only
    now: str(body.now),
  };
  const errors = {};
  if (clean.role.length < 2 || clean.role.length > 100) errors.role = "Role must be 2 to 100 characters";
  if (clean.location.length < 2 || clean.location.length > 100) errors.location = "Location must be 2 to 100 characters";
  if (clean.about.length < 20 || clean.about.length > 1000) errors.about = "About must be 20 to 1000 characters";
  if (!EMAIL_RE.test(clean.email)) errors.email = "Enter a valid email";
  if (!URL_RE.test(clean.github)) errors.github = "Must start with https://";
  if (!URL_RE.test(clean.linkedin)) errors.linkedin = "Must start with https://";
  if (clean.whatsapp) {
    if (clean.whatsapp.startsWith("0")) errors.whatsapp = "Start with country code (92...), not 0";
    else if (clean.whatsapp.length < 10 || clean.whatsapp.length > 15) errors.whatsapp = "Enter full number with country code, e.g. 923001234567";
  }
  if (clean.now.length > 140) errors.now = "Keep it under 140 characters";
  return { clean, errors };
}

async function saveProfile(clean) {
  const { now, ...rest } = clean;
  const old = await prisma.profile.findUnique({ where: { id: 1 } });
  const changed = (old?.nowText ?? "") !== now;

  // only touch the "updated" time when the Now text really changed
  const nowData = { nowText: now, ...(changed ? { nowAt: now ? new Date() : null } : {}) };

  return prisma.profile.upsert({
    where: { id: 1 },
    update: { ...rest, ...nowData },
    create: { id: 1, ...rest, nowText: now, nowAt: now ? new Date() : null },
  });
}

// ---------- skills (the admin sends the whole list, we replace it) ----------
function validateSkills(body) {
  const list = Array.isArray(body) ? body : null;
  if (!list) return { error: "Send a list of skill groups" };
  if (list.length > 12) return { error: "Maximum 12 groups" };

  const clean = [];
  for (let i = 0; i < list.length; i++) {
    const name = str(list[i]?.group);
    const raw = Array.isArray(list[i]?.items) ? list[i].items : String(list[i]?.items ?? "").split(",");
    const items = raw.map((x) => String(x).trim()).filter(Boolean);
    if (name.length < 2 || name.length > 40) return { error: `Group ${i + 1}: name must be 2 to 40 characters` };
    if (items.length < 1 || items.length > 20) return { error: `Group "${name}": add 1 to 20 skills` };
    if (items.some((x) => x.length > 30)) return { error: `Group "${name}": a skill is longer than 30 characters` };
    clean.push({ name, items: items.join(",") });
  }
  return { clean };
}

function replaceSkills(clean) {
  return prisma.$transaction([
    prisma.skillGroup.deleteMany(),
    ...clean.map((g, i) => prisma.skillGroup.create({ data: { ...g, position: i } })),
  ]);
}

// ---------- experience / timeline ----------
function validateExperience(body) {
  const list = Array.isArray(body) ? body : null;
  if (!list) return { error: "Send a list of timeline entries" };
  if (list.length > 12) return { error: "Maximum 12 entries" };

  const clean = [];
  for (let i = 0; i < list.length; i++) {
    const year = str(list[i]?.year);
    const title = str(list[i]?.title);
    const detail = str(list[i]?.detail);
    if (year.length < 1 || year.length > 30) return { error: `Entry ${i + 1}: label must be 1 to 30 characters` };
    if (title.length < 2 || title.length > 100) return { error: `Entry ${i + 1}: title must be 2 to 100 characters` };
    if (detail.length > 200) return { error: `Entry ${i + 1}: detail is longer than 200 characters` };

    const rawTech = Array.isArray(list[i]?.tech) ? list[i].tech : String(list[i]?.tech ?? "").split(",");
    const tech = rawTech.map((x) => String(x).trim()).filter(Boolean);
    if (tech.length > 8) return { error: `Entry ${i + 1}: maximum 8 tech chips` };
    if (tech.some((x) => x.length > 30)) return { error: `Entry ${i + 1}: a tech chip is longer than 30 characters` };

    clean.push({ year, title, detail, current: list[i]?.current === true, tech: tech.join(",") });
  }
  return { clean };
}

function replaceExperience(clean) {
  return prisma.$transaction([
    prisma.experience.deleteMany(),
    ...clean.map((e, i) => prisma.experience.create({ data: { ...e, position: i } })),
  ]);
}

module.exports = { getPortfolio, validateProfile, saveProfile, validateSkills, replaceSkills, validateExperience, replaceExperience };