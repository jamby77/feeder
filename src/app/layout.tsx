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
      <body className={`${inter.className} bg-background text-foreground flex h-full min-h-screen flex-col`}>
        <div className="pt-top-bar relative flex h-full min-h-screen flex-col">
          <AppContextProvider>
            <TopNavBar />
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2000,
                style: {
                  padding: "10px 20px",
                  color: "hsl(43 75% 95%)",
                  backgroundColor: "hsl(20 65% 29%)",
                },
              }}
            />
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
