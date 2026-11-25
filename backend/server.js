require("dotenv").config();
const express = require("express");
const cors = require("cors");

const projectsRouter = require("./routes/projects");
const chatRouter = require("./routes/chat");
const contactRouter = require("./routes/contact");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const app = express();
const trackRouter = require("./routes/track");
const filesRouter = require("./routes/files");
const statsRouter = require("./routes/stats");
// ---- middleware (runs on every request, in this order) ----
app.use(cors({ origin: process.env.CLIENT_URL.split(",").map((s) => s.trim()) }));
app.set("trust proxy", 1); // so req.ip is the real visitor IP behind Render/Vercel
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`); // tiny request logger
  next();
});

// ---- routes (always AFTER the middleware above) ----
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/projects", projectsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/contact", contactRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);
app.use("/api/track", trackRouter);
app.use("/api/admin", adminRouter); 
app.use("/api/files", filesRouter);
app.use("/api/stats", statsRouter);
// ---- 404 and error handler (always last) ----
app.use((req, res) => res.status(404).json({ error: "Route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(process.env.PORT, () => console.log(`API running on port ${process.env.PORT}`));