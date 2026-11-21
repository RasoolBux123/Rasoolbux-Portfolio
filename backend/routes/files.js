const express = require("express");
const { getFile } = require("../services/files");

const router = express.Router();

// GET /api/files/cv?v=3  (public: the site shows these files)
router.get("/:key", async (req, res, next) => {
  try {
    const f = await getFile(req.params.key);
    if (!f) return res.status(404).json({ error: "File not found" });

    res.set({
      "Content-Type": f.mime,
      // the ?v=number in the URL changes on every upload, so browsers may keep it for a long time
      "Cache-Control": "public, max-age=31536000, immutable",
      "Cross-Origin-Resource-Policy": "cross-origin",
    });
    if (f.key === "cv") res.set("Content-Disposition", 'attachment; filename="Rasool_Bux_Resume.pdf"');
    res.send(Buffer.from(f.data)); // Prisma gives Uint8Array; Express needs a Buffer
  } catch (err) {
    next(err);
  }
});

module.exports = router;