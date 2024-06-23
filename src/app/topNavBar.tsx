import Link from "next/link";
import FeedTitle from "@/app/feeds/feed-title";

export const TopNavBar = () => (
  <div className="h-topBar fixed left-0 right-0 top-0 flex items-center justify-start bg-gray-900/25 py-2 shadow-md backdrop-blur">
    <div className="w-full">
      <FeedTitle />
    </div>
    <Link className="inline-block flex-grow-0 px-2 text-5xl md:px-16" href="/settings">
      ⚙️
    </Link>
  </div>
);
