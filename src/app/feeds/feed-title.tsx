"use client";

import { useAppContext } from "@/context/AppContext";

export const FeedTitle = () => {
  const { feed } = useAppContext();
  return <h1 className="truncate p-2 text-center text-4xl md:px-16 md:py-4">{feed?.title || "Feeder"}</h1>;
};

export default FeedTitle;
