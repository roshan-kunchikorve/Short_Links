import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const code = JetBrains_Mono({ subsets: ["latin"], variable: "--font-code" });

const themeScript = `try{var t=localStorage.getItem("theme");if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  title: "ShortLinks | Free URL shortener",
  description: "Shorten links with custom aliases, expiry dates, QR codes and click counts. No account needed.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${code.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <Navbar />
        {children}
        <footer className="border-t border-mist py-6 text-center text-sm text-ink/70">
          Built with Next.js and MongoDB.{" "}
          <a className="underline hover:text-signal" href="https://github.com/roshan-kunchikorve/Short_Links">
            Source on GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
