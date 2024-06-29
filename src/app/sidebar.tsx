"use client";

import toast from "react-hot-toast";
import { useAppContext } from "@/context/app-context";
import { markAllRead } from "@/lib/db";
import { Category } from "@/types";

export const Sidebar = ({}) => {
  const { refreshFeeds, categories, feeds, setFeed, countAll, countCurrent, feed: currentFeed } = useAppContext();
  return (
    <aside className="max-h-screen-top w-full max-w-96 overflow-hidden overflow-y-auto bg-gray-800 text-gray-300">
      <div className="space-y-2">
        <h2
          className="inline-flex w-full cursor-pointer items-center justify-between gap-2 p-3 text-xl"
          onClick={() => setFeed(undefined)}
        >
          <span className="inline-block flex-1">All {countAll ? `(${countAll})` : ""}</span>&nbsp;
          <button
            title="Mark Read"
            className="relative h-12 w-12 rounded-full bg-slate-700 px-3 hover:bg-slate-600"
            onClick={() => {
              toast.success("All marked read", {});
              markAllRead();
            }}
          >
            <span className="sr-only">mark read</span>
            <span className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" />
              </svg>
            </span>
          </button>
          <button
            title="Refresh"
            className="relative h-12 w-12 rounded-full bg-slate-700 px-3 hover:bg-slate-600"
            onClick={() => {
              toast.loading("Refreshing ...", { duration: 5000 });
              refreshFeeds();
            }}
          >
            <span className="sr-only">refresh</span>
            <span className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
              </svg>
            </span>
          </button>
        </h2>

        {categories &&
          categories?.map((category: Category) => (
            <div key={category.id} className="p-3">
              <h2 className="text-xl">{category.title}</h2>
              <ul className="space-y-4 pt-2">
                {feeds
                  ?.filter(feed => feed.categories && feed.categories.includes(category.id))
                  .map(feed => {
                    let itemsCount = feed.items?.length ?? 0;
                    if (currentFeed?.id === feed.id && countCurrent) {
                      itemsCount = countCurrent;
                    }
                    return (
                      <li key={feed.id} className="ps-4">
                        <a
                          className="hover:text-gray-400"
                          href={`/feeds?feed=${feed.id}&title=${feed.title}`}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFeed(feed);
                          }}
                        >
                          <span className={`${currentFeed?.id === feed.id ? "font-bold underline" : ""}`}>
                            {feed.title}
                          </span>
                          <span>{itemsCount ? ` (${itemsCount})` : ""}</span>
                        </a>
                        {itemsCount ? (
                          <button
                            className="ml-2 rounded-full px-2 hover:outline"
                            title="Mark Read"
                            onClick={() => {
                              toast.success(`${feed.title} marked read`, {});
                              return markAllRead(feed.id);
                            }}
                          >
                            ✔
                          </button>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
