"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const MenuItem = ({ href, children }: { href: string; children: ReactNode }) => {
  const pathname = usePathname();
  const selected = pathname.startsWith(href);

  return (
    <li role="menuitem">
      <Link
        href={href}
        className={cn(
          "relative me-[2px] ms-px flex min-h-10 items-center overflow-hidden rounded-e-full py-2.5 pl-[23px] text-secondary-foreground",
          {
            "bg-blue-100 text-blue-700": selected,
            "hover:bg-gray-200 hover:text-primary-foreground": !selected,
          },
        )}
      >
        {children}
      </Link>
    </li>
  );
};
