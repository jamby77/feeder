"use client";

import Link from "next/link";
import { useSettingsFeedsContext } from "@/context/settings-feeds-context";

export const FeedsTitle = ({}) => {
  const { feeds } = useSettingsFeedsContext();
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">Organize Feeds</h1>
        <p className="text-gray-600 dark:text-gray-300">Following {feeds?.length} feeds</p>
      </div>
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <Link title="Add Feed" href="/settings/feeds/add" className="py-2 dark:border-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="">
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2.25 13.045a.75.75 0 0 1 .75-.75A8.706 8.706 0 0 1 11.705 21a.75.75 0 0 1-1.5 0A7.205 7.205 0 0 0 3 13.795a.75.75 0 0 1-.75-.75"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2.25 6.857a.75.75 0 0 1 .75-.75A14.893 14.893 0 0 1 17.893 21a.75.75 0 0 1-1.5 0A13.393 13.393 0 0 0 3 7.607a.75.75 0 0 1-.75-.75M3.884 19.982a.134.134 0 1 0 0 .268.134.134 0 0 0 0-.268m-1.634.134a1.634 1.634 0 1 1 3.268 0 1.634 1.634 0 0 1-3.268 0M18.857 2.679a.75.75 0 0 1 .75.75V8.57a.75.75 0 0 1-1.5 0V3.43a.75.75 0 0 1 .75-.75"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M15.536 6a.75.75 0 0 1 .75-.75h5.143a.75.75 0 0 1 0 1.5h-5.143a.75.75 0 0 1-.75-.75"
              clipRule="evenodd"
            ></path>
          </svg>
        </Link>{" "}
        <Link href="/settings/feeds/import" className="px-2 py-2 dark:border-gray-300">
          Import OPML
        </Link>{" "}
        <Link href="/settings/feeds/export" className="px-2 py-2 dark:border-gray-300">
          Export OPML
        </Link>
      </div>
    </div>
  );
};

export default FeedsTitle;
