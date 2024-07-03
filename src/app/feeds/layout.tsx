import { ReactNode } from "react";
import type { Metadata } from "next";
import Sidebar from "@/app/sidebar";

export const metadata: Metadata = {
  title: "Feeder - Feeds",
  description: "RSS Feed Reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-full w-full">
      <Sidebar />
      {children}
    </div>
  );
}
