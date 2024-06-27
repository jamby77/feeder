"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export const FeedsTitle = ({}) => {
  const { feeds } = useAppContext();
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">Organize Feeds</h1>
        <p className="text-gray-600 dark:text-gray-300">Following {feeds?.length} feeds</p>
      </div>
      <div className="flex gap-2 text-gray-600 dark:text-gray-300">
        <Link href="/settings/feeds/import" className="rounded border border-gray-600 px-4 py-2 dark:border-gray-300">
          Import OPML
        </Link>{" "}
        <Link href="/settings/feeds/export" className="rounded border border-gray-600 px-4 py-2 dark:border-gray-300">
          Export OPML
        </Link>
      </div>
    </div>
  );
};

export default FeedsTitle;
