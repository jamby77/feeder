import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { TopNavBar } from "@/app/topNavBar";
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
      <body className={`${inter.className} flex h-full min-h-screen flex-col bg-gray-100 dark:bg-gray-600`}>
        <div className="relative flex h-full min-h-screen flex-col pt-topBar">
          <AppContextProvider>
            <TopNavBar />
            {children}
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
