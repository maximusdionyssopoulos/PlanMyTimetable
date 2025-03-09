import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Navbar from "./(Navbar)/navbar";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "~/contexts/ThemeProvider";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "PlanMyTimetable",
    template: "%s | PlanMyTimetable",
  },
  description: "A simple webapp to plan your timetable interactively",
  keywords: [
    "RMIT",
    "Allocate+",
    "Timetable",
    "Melbourne Uni",
    "Uni Melb",
    "Monash",
    "Drag",
    "Drop",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} antialiased dark:bg-neutral-900 dark:text-white md:flex`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="flex flex-col md:w-screen md:flex-row">
            {children}
          </main>
          <Toaster
            toastOptions={{
              className: " dark:text-white dark:bg-neutral-700",
            }}
            position="bottom-right"
          />
        </ThemeProvider>
        <Analytics />
      </body>
      <Script
        async
        src="https://analytics.maxdionyss.dev/script.js"
        data-website-id="b3182ddb-8ac5-40ae-9612-1e16c24b5d16"
      />
    </html>
  );
}
``;
