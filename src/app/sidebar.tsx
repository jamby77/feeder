"use client";

import { useAppContext } from "@/context/AppContext";
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
            className="relative h-12 w-12 rounded-full bg-slate-700 p-2"
            onClick={() => {
              console.log("mark all read");
              markAllRead();
            }}
          >
            <span className="sr-only">mark read</span>
            <span className="text text-2xl leading-none">✔</span>
          </button>
          <button title="Refresh" className="relative h-12 w-12 rounded-full bg-slate-700 p-2" onClick={refreshFeeds}>
            <span className="sr-only">refresh</span>
            <span className="text text-2xl leading-none">↻</span>
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
                            onClick={() => markAllRead(feed.id)}
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
