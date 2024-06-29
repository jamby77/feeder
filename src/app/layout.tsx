import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { TopNavBar } from "@/app/topNavBar";
import { AppContextProvider } from "@/context/app-context";

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
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-full min-h-screen flex-col bg-gray-100 dark:bg-gray-600`}>
        <div className="relative flex h-full min-h-screen flex-col pt-topBar">
          <AppContextProvider>
            <TopNavBar />
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2000,
                style: {
                  padding: "10px 20px",
                  color: "rgb(209 213 219)",
                  backgroundColor: "rgb(31 41 55 )",
                },
              }}
            />
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
