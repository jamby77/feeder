import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import FeedTitle from "@/app/feeds/feed-title";

export const TopNavBar = () => (
  <header className="bg-app/85 text-app-foreground fixed left-0 right-0 top-0 flex h-topBar items-center justify-start py-2 shadow-md backdrop-blur">
    <div className="w-full">
      <FeedTitle />
    </div>
    <nav className="mx-4 flex flex-shrink-0 flex-grow-0 justify-end gap-1 md:mx-16">
      <div className="h-12 w-12" title="Feeds">
        <Link
          className="text-app-foreground flex h-full w-full items-center justify-center hover:text-muted-foreground"
          href={`/feeds`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="36px"
            fill="currentColor"
          >
            <path d="M200-120q-33 0-56.5-23.5T120-200q0-33 23.5-56.5T200-280q33 0 56.5 23.5T280-200q0 33-23.5 56.5T200-120Zm480 0q0-117-44-218.5T516-516q-76-76-177.5-120T120-680v-120q142 0 265 53t216 146q93 93 146 216t53 265H680Zm-240 0q0-67-25-124.5T346-346q-44-44-101.5-69T120-440v-120q92 0 171.5 34.5T431-431q60 60 94.5 139.5T560-120H440Z" />
          </svg>
        </Link>
      </div>
      <div className="h-12 w-12" title="Settings">
        <Link
          className="text-app-foreground flex h-full w-full items-center justify-center hover:text-muted-foreground"
          href={`/settings`}
        >
          <GearIcon className="inline-block h-9 w-9" />
        </Link>
      </div>
    </nav>
  </header>
);
