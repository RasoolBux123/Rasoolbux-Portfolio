const prisma = require("../db");

const IMAGES = ["image/jpeg", "image/png", "image/webp"];
const MB = 1024 * 1024;

// which keys are allowed, what type they must be, and how big they may get
function parseKey(key) {
  if (key === "cv") return { kind: "cv", allowed: ["application/pdf"], max: 4 * MB };
  if (key === "photo") return { kind: "photo", allowed: IMAGES, max: 2 * MB };
  const m = /^project-(\d+)$/.exec(key);
  if (m) return { kind: "project", id: Number(m[1]), allowed: IMAGES, max: 2 * MB };
  return null;
}

// Look at the first bytes of the file instead of trusting the Content-Type header.
function sniff(buf) {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 4).toString("latin1") === "%PDF") return "application/pdf";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.subarray(0, 4).toString("latin1") === "RIFF" && buf.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
  return null;
}

// the row that remembers "which version of this file is current"
const ownerMissing = (rule) => (rule.kind === "project" ? "Project not found" : "Save your About details once first");

async function setVersion(rule, value) {
  if (rule.kind === "project") {
    const row = await prisma.project.update({ where: { id: rule.id }, data: { imageVer: value } });
    return row.imageVer;
  }
  const field = rule.kind === "cv" ? "cvVer" : "photoVer";
  const row = await prisma.profile.update({ where: { id: 1 }, data: { [field]: value } });
  return row[field];
}

async function currentVersion(rule) {
  if (rule.kind === "project") {
    const p = await prisma.project.findUnique({ where: { id: rule.id }, select: { imageVer: true } });
    return p ? p.imageVer : null;
  }
  const p = await prisma.profile.findUnique({ where: { id: 1 } });
  if (!p) return null;
  return rule.kind === "cv" ? p.cvVer : p.photoVer;
}

async function saveFile(key, buf) {
  const rule = parseKey(key);
  if (!rule) return { error: "Unknown file", status: 404 };
  if (!Buffer.isBuffer(buf) || buf.length === 0) return { error: "No file received", status: 400 };
  if (buf.length > rule.max) return { error: `File is too large (max ${rule.max / MB} MB)`, status: 413 };

  const mime = sniff(buf);
  if (!mime || !rule.allowed.includes(mime)) {
    return { error: rule.kind === "cv" ? "CV must be a PDF file" : "Image must be JPG, PNG or WebP", status: 400 };
  }

  const ver = await currentVersion(rule);
  if (ver === null) return { error: ownerMissing(rule), status: 404 };

  await prisma.file.upsert({
    where: { key },
    update: { mime, data: buf, size: buf.length },
    create: { key, mime, data: buf, size: buf.length },
  });
  const next = await setVersion(rule, ver + 1); // new number = new URL = browsers fetch the new file
  return { url: `/api/files/${key}?v=${next}` };
}

async function removeFile(key) {
  const rule = parseKey(key);
  if (!rule) return { error: "Unknown file", status: 404 };
  const ver = await currentVersion(rule);
  if (ver === null) return { error: ownerMissing(rule), status: 404 };

  await prisma.file.deleteMany({ where: { key } });
  await setVersion(rule, 0);
  return { ok: true };
}

function getFile(key) {
  return prisma.file.findUnique({ where: { key } });
}

module.exports = { saveFile, removeFile, getFile };