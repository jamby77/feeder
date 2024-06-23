"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const MenuItem = ({ href, children }: { href: string; children: ReactNode }) => {
  const pathname = usePathname();
  const selected = pathname === href;
  /*
 .cr-nav-menu-item[selected] {
   --iron-icon-fill-color: var(--google-blue-600);
   background: var(--google-blue-50);
   color: var(--google-blue-700);
}
  */
  return (
    <li role="menuitem">
      <Link
        href={href}
        className={`${selected ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"} relative me-[2px] ms-px flex min-h-10 items-center overflow-hidden rounded-e-full py-2.5 pl-[23px]`}
      >
        {children}
      </Link>
    </li>
  );
};
