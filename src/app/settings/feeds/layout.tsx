import { ReactNode } from "react";
import Breadcrumbs from "@/app/settings/feeds/breadcrumbs";

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
