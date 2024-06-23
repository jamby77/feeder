"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export const FeedTitle = () => {
  const { feed } = useAppContext();
  return (
    <h1 className="truncate p-2 text-left text-4xl text-gray-900 md:px-16 md:py-4 dark:text-gray-300">
      <Link href="/">{feed?.title || "Feeder"}</Link>
    </h1>
  );
};

export default FeedTitle;
