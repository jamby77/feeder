"use client";

import Link from "next/link";
import { H1 } from "@/components/typography/typography";
import { useAppContext } from "@/context/app-context";

export const FeedTitle = () => {
  const { feed } = useAppContext();
  return (
    <H1 className="truncate p-2 md:px-16 md:py-4">
      <Link href="/">{feed?.title || "Feeder"}</Link>
    </H1>
  );
};

export default FeedTitle;
