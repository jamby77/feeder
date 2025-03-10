import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FeedIcon } from "@/app/feedIcon";
import FeedTitle from "@/app/feeds/feed-title";

export const TopNavBar = () => (
  <header className="bg-app/85 text-app-foreground fixed left-0 right-0 top-0 flex h-topBar items-center justify-start py-2 shadow-md backdrop-blur-sm">
    <div className="w-full">
      <FeedTitle />
    </div>
    <nav className="mx-4 flex shrink-0 grow-0 justify-end gap-1 md:mx-16">
      <div className="h-12 w-12" title="Feeds">
        <Link
          className="text-app-foreground flex h-full w-full items-center justify-center hover:text-muted-foreground"
          href={`/feeds`}
        >
          <FeedIcon className="inline-block h-8 w-8" />
        </Link>
      </div>
      <div className="h-12 w-12" title="Settings">
        <Link
          className="text-app-foreground flex h-full w-full items-center justify-center hover:text-muted-foreground"
          href={`/settings`}
        >
          <GearIcon className="inline-block h-8 w-8" />
        </Link>
      </div>
    </nav>
  </header>
);
