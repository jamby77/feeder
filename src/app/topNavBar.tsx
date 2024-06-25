import Link from "next/link";
import FeedTitle from "@/app/feeds/feed-title";

export const TopNavBar = () => (
  <header className="fixed left-0 right-0 top-0 flex h-topBar items-center justify-start bg-gray-900/25 py-2 shadow-md backdrop-blur">
    <div className="w-full">
      <FeedTitle />
    </div>
    <nav className="mx-4 flex flex-shrink-0 flex-grow-0 justify-end gap-1 md:mx-16">
      <div className="h-12 w-12 hover:text-gray-500" title="Feeds">
        <Link className="flex h-full w-full items-center justify-center" href="/feeds">
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
      <div className="h-12 w-12 hover:text-gray-500" title="Settings">
        <Link className="flex h-full w-full items-center justify-center" href="/settings">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="36px"
            viewBox="0 -960 960 960"
            width="36px"
            fill="currentColor"
          >
            <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
          </svg>
        </Link>
      </div>
    </nav>
  </header>
);
