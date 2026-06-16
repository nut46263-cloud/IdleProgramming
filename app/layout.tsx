import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/contexts/GameContext";
import Shell from "@/components/layout/shell";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DEV DUNGEON — Gamified Programming Education",
  description: "Learn HTML, SQL, C, C++, and JavaScript through retro game-like stages, coding missions, auto-evaluations, and project bosses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-bg-dungeon text-slate-100 font-sans selection:bg-accent/30 selection:text-accent">
        <GameProvider>
          <Shell>
            {children}
          </Shell>
        </GameProvider>
      </body>
    </html>
  );
}
