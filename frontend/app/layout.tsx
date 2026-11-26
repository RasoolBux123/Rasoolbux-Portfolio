import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import IntroLoader from "./components/IntroLoader";
import VisitTracker from "./components/VisitTracker";
import ChatWidget from "./components/ChatWidget";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "./lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: "%s | Rasool Bux" },
  description: SITE_DESCRIPTION,
  keywords: ["Rasool Bux", "RB", "AI Full Stack Developer", "Next.js developer", "Xloop Digital", "Pakistan", "portfolio"],
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: SITE_NAME, title: SITE_TITLE, description: SITE_DESCRIPTION, url: "/" },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply the saved theme before the page paints, so there is no dark flash */}
       <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('theme')==='light')document.documentElement.setAttribute('data-theme','light');if(localStorage.getItem('glass')!=='off')document.documentElement.setAttribute('data-glass','on')}catch(e){}" }} />
      </head>
      <body>
        <IntroLoader />
        <ScrollProgress />
        <CursorGlow />
        <Navbar />
        <VisitTracker />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}