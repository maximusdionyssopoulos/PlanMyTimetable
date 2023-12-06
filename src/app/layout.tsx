import "~/styles/globals.css";

import { Inter } from "next/font/google";
import Navbar from "./(Navbar)/navbar";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "~/contexts/themeProvider";
import Footer from "./footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "PlanMyTimetable",
  description: "A simple webapp to plan your timetable interactively",
  icons: [{ rel: "icon", url: "/calendar3.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} antialiased dark:bg-neutral-900 dark:text-white`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex">
            <Navbar />
            <main className="flex w-screen flex-row">{children}</main>
          </div>
          <Toaster
            toastOptions={{
              className: " dark:text-white dark:bg-neutral-700",
            }}
            position="bottom-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
``;
