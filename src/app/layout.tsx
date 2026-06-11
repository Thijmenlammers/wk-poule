import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { getFootballData } from "@/lib/football-api";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Semplor World Cup Pool",
    template: "%s | Semplor World Cup Pool",
  },
  description: "The internal Semplor World Cup 2026 prediction competition.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footballData = await getFootballData();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Header
          lastUpdated={footballData.lastUpdated}
          source={footballData.source}
        />
        {children}
        <footer className="mt-auto border-t border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <p>Semplor World Cup Pool</p>
            <p>Scores are calculated automatically.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
