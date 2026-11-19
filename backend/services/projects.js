const prisma = require("../db");

const HEX = /^#[0-9a-fA-F]{6}$/;

// database row -> the shape the frontend expects
function toProject(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tech: row.tech.split(","),
    colors: [row.color1, row.color2],
  };
}

async function getProjects() {
  const rows = await prisma.project.findMany({ orderBy: { id: "asc" } });
  return rows.map(toProject);
}

// ---- admin side ----

// Returns { clean, errors }. errors = { fieldName: "message" }
function validateProject(body = {}) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const techList = (Array.isArray(body.tech) ? body.tech : String(body.tech ?? "").split(","))
    .map((t) => String(t).trim())
    .filter(Boolean);
  const colors = Array.isArray(body.colors) ? body.colors : [];

  const errors = {};
  if (title.length < 2 || title.length > 80) errors.title = "Title must be 2 to 80 characters";
  if (description.length < 10 || description.length > 300) errors.description = "Description must be 10 to 300 characters";
  if (techList.length < 1 || techList.length > 10) errors.tech = "Add 1 to 10 technologies, separated by commas";
  if (!HEX.test(colors[0] ?? "") || !HEX.test(colors[1] ?? "")) errors.colors = "Pick two valid colors";

  return {
    clean: { title, description, tech: techList.join(","), color1: colors[0], color2: colors[1] },
    errors,
  };
}

async function createProject(clean) {
  return toProject(await prisma.project.create({ data: clean }));
}

async function updateProject(id, clean) {
  return toProject(await prisma.project.update({ where: { id }, data: clean }));
}

async function deleteProject(id) {
  await prisma.project.delete({ where: { id } });
}

module.exports = { getProjects, validateProject, createProject, updateProject, deleteProject };