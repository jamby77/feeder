import { ReactNode } from "react";
import type { Metadata } from "next";
import SettingsNav from "@/app/settings/settings-nav";

export const metadata: Metadata = {
  title: {
    default: "Feeder - Settings",
    template: "%s | Feeder - Settings",
  },
  description: "RSS Feed Reader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-1">
      <SettingsNav />
      {children}
    </div>
  );
}
