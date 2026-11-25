const prisma = require("../db");

const str = (v) => (typeof v === "string" ? v.trim() : "");

// ---------- education (the admin sends the whole list, we replace it) ----------
function validateEducation(body) {
  const list = Array.isArray(body) ? body : null;
  if (!list) return { error: "Send a list of education entries" };
  if (list.length > 8) return { error: "Maximum 8 entries" };

  const clean = [];
  for (let i = 0; i < list.length; i++) {
    const degree = str(list[i]?.degree);
    const school = str(list[i]?.school);
    const period = str(list[i]?.period);
    const detail = str(list[i]?.detail);
    if (degree.length < 2 || degree.length > 100) return { error: `Entry ${i + 1}: degree must be 2 to 100 characters` };
    if (school.length < 2 || school.length > 100) return { error: `Entry ${i + 1}: school must be 2 to 100 characters` };
    if (period.length > 40) return { error: `Entry ${i + 1}: period is longer than 40 characters` };
    if (detail.length > 200) return { error: `Entry ${i + 1}: detail is longer than 200 characters` };
    clean.push({ degree, school, period, detail });
  }
  return { clean };
}

function replaceEducation(clean) {
  return prisma.$transaction([
    prisma.education.deleteMany(),
    ...clean.map((e, i) => prisma.education.create({ data: { ...e, position: i } })),
  ]);
}

// ---------- certificates (one row each, so the uploaded image keeps its id) ----------
const toCertificate = (c) => ({
  id: c.id,
  title: c.title,
  issuer: c.issuer,
  year: c.year,
  image: c.imageVer > 0 ? `/api/files/cert-${c.id}?v=${c.imageVer}` : "",
});

async function listCertificates() {
  const rows = await prisma.certificate.findMany({ orderBy: { position: "asc" } });
  return rows.map(toCertificate);
}

function validateCertificate(body = {}) {
  const clean = { title: str(body.title), issuer: str(body.issuer), year: str(body.year) };
  const errors = {};
  if (clean.title.length < 2 || clean.title.length > 120) errors.title = "Title must be 2 to 120 characters";
  if (clean.issuer.length > 100) errors.issuer = "Issuer is longer than 100 characters";
  if (clean.year.length > 20) errors.year = "Year is longer than 20 characters";
  return { clean, errors };
}

async function createCertificate(clean) {
  const last = await prisma.certificate.aggregate({ _max: { position: true } });
  const row = await prisma.certificate.create({ data: { ...clean, position: (last._max.position ?? -1) + 1 } });
  return toCertificate(row);
}

async function updateCertificate(id, clean) {
  return toCertificate(await prisma.certificate.update({ where: { id }, data: clean }));
}

async function deleteCertificate(id) {
  await prisma.certificate.delete({ where: { id } }); // throws P2025 if missing
  await prisma.file.deleteMany({ where: { key: `cert-${id}` } });
}

module.exports = {
  validateEducation,
  replaceEducation,
  listCertificates,
  validateCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};