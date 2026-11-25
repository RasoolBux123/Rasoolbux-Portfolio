// One place for the site's public address and name. Set NEXT_PUBLIC_SITE_URL on Vercel
// when you get a custom domain (e.g. https://rasoolbux.dev); until then the Vercel URL is used.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rasoolbux-dev.vercel.app").replace(/\/$/, "");
export const SITE_NAME = "Rasool Bux";
export const SITE_TITLE = "Rasool Bux (RB) | AI Full Stack Developer";
export const SITE_DESCRIPTION =
  "Portfolio of Rasool Bux (RB), an AI Full Stack Developer and Junior Software Engineer at Xloop Digital. Next.js, Node.js, FastAPI and PostgreSQL projects.";