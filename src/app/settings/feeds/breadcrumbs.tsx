"use client";

import { GearIcon } from "@radix-ui/react-icons";
import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Breadcrumbs = ({}) => {
  const pathname = usePathname();
  if (!pathname) {
    return null;
  }
  let pathParts = pathname.split("/").filter(Boolean);

  if (pathParts.length >= 2) {
    pathParts = pathParts.slice(2);
  }
  let basePath = "/settings/feeds";
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/settings"}>
              <span className="sr-only">Settings</span>
              <GearIcon className="inline-block h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={"/settings/feeds"}> Feeds</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathParts.length > 0 && <BreadcrumbSeparator />}
        {pathParts.map((pp, i) => {
          const href = `${basePath}/${pp}`;
          basePath += `/${pp}`;
          return (
            <Fragment key={pp}>
              <BreadcrumbItem>
                {i === pathParts.length - 1 && <BreadcrumbPage className="capitalize">{pp}</BreadcrumbPage>}
                {i < pathParts.length - 1 && (
                  <BreadcrumbLink asChild className="capitalize">
                    <Link href={href}>{pp}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {i < pathParts.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
