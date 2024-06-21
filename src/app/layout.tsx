import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import FeedTitle from "@/app/feeds/feed-title";
import Sidebar from "@/app/sidebar";
import { AppContextProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feeder",
  description: "RSS Feed Reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex gap-2 pt-24">
          <AppContextProvider>
            <div className="fixed left-0 right-0 top-0 bg-white/25 py-2 shadow-md backdrop-blur">
              <FeedTitle />
            </div>
            <Sidebar />
            {children}
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
