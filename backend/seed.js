require("dotenv").config();
const bcrypt = require("bcryptjs");
const prisma = require("./db");
const data = require("./data/portfolio");

// Seed only fills EMPTY tables, so running it again never wipes what you
// edited in the admin dashboard.
async function seedProjects() {
  if ((await prisma.project.count()) > 0) return console.log("Projects already exist, skipped");

  for (const p of data.projects) {
    await prisma.project.create({
      data: {
        title: p.title,
        description: p.description,
        tech: p.tech.join(","),
        color1: p.colors[0],
        color2: p.colors[1],
      },
    });
  }
  console.log(`Seeded ${data.projects.length} projects`);
}

async function seedContent() {
  if (await prisma.profile.findUnique({ where: { id: 1 } })) return console.log("Profile already exists, skipped");

  await prisma.profile.create({
    data: {
      id: 1,
      role: data.profile.role,
      location: data.profile.location,
      about: data.profile.about,
      email: data.contact.email,
      github: data.contact.github,
      linkedin: data.contact.linkedin,
    },
  });
  for (const [i, g] of data.skills.entries()) {
    await prisma.skillGroup.create({ data: { name: g.group, items: g.items.join(","), position: i } });
  }
  for (const [i, e] of data.experience.entries()) {
    await prisma.experience.create({ data: { year: e.year, title: e.title, detail: e.detail, position: i } });
  }
  console.log("Seeded profile, skills and experience");
}

async function seedAdmin() {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase(); // login lowercases emails too
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD missing in .env, skipping admin");
    return;
  }

  // never store the plain password, only its bcrypt hash
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.admin.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash },
    create: { email: ADMIN_EMAIL, passwordHash },
  });
  console.log(`Admin ready: ${ADMIN_EMAIL}`);
}

async function main() {
  await seedProjects();
  await seedContent();
  await seedAdmin();
}

main().catch(console.error).finally(() => prisma.$disconnect());