import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Feeder - Settings",
  description: "RSS Feed Reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="">{children}</div>;
}
