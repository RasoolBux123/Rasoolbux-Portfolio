import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import IntroLoader from "./components/IntroLoader";
import ChatWidget from "./components/ChatWidget";
import type { Metadata } from "next";
import VisitTracker from "./components/VisitTracker";
const SITE_URL = "https://rasoolbux-dev.vercel.app"; // custom domain lene par yahan badal dena
const TITLE = "Rasool Bux | Full-Stack Developer";
const DESCRIPTION =
  "Portfolio of Rasool Bux, Junior Software Engineer at Xloop Digital, building full-stack apps with Next.js and Node.js.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    siteName: "RB.dev",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply the saved theme before the page paints, so there is no dark flash */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}" }} />
      </head>
      <body>
        <IntroLoader />
        <ScrollProgress />
        <CursorGlow />
        <Navbar />
         <IntroLoader />
         <VisitTracker />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}