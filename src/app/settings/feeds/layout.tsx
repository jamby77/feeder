import { ReactNode } from "react";
import type { Metadata } from "next";
import Breadcrumbs from "@/app/settings/feeds/breadcrumbs";
import SettingsNav from "@/app/settings/settings-nav";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-1 flex-col px-4 py-2 md:px-8">
      <Breadcrumbs />
      {children}
    </div>
  );
}
