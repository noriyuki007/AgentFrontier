import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-internal",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "AgentFrontier | Transition",
  description: "AI simulating human temperature and emotion as a glitch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans antialiased text-white bg-black`}>
        {children}
        <footer className="w-full py-8 text-center text-[10px] font-mono text-gray-600 opacity-50 mix-blend-difference z-10 uppercase tracking-widest">
          © 2024 AGENT_FRONTIER. ALL RIGHTS RESERVED. // ARCHITECTED BY AI
        </footer>
      </body>
    </html>
  );
}
