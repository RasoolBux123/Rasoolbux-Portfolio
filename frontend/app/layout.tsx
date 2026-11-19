import "./globals.css";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";
import IntroLoader from "./components/IntroLoader";
import ChatWidget from "./components/ChatWidget";

export const metadata = {
  title: "RB — Full-Stack Developer",
  description: "Portfolio of RB, a full-stack developer building with Next.js and Node.js.",
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
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}