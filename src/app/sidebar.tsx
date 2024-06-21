"use client";

import { useAppContext } from "@/context/AppContext";
import { Category } from "@/lib/db";

export const Sidebar = ({}) => {
  const { categories, feeds, setFeed, countAll } = useAppContext();
  return (
    <aside className="w-full max-w-96">
      <div className="space-y-2">
        <h2 className="cursor-pointer p-3 text-xl" onClick={() => setFeed(undefined)}>
          All {countAll ? `(${countAll})` : ""}
        </h2>

        {categories &&
          categories?.map((category: Category) => (
            <div key={category.id} className="p-3">
              <h2 className="text-xl">{category.title}</h2>
              <ul className="space-y-4 pt-2">
                {feeds
                  ?.filter(feed => feed.categories && feed.categories.includes(category.id))
                  .map(feed => (
                    <li key={feed.id} className="ps-4">
                      <a
                        href={`/feeds?feed=${feed.id}&title=${feed.title}`}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFeed(feed);
                        }}
                      >
                        {feed.title}
                        {feed.items?.length ? ` (${feed.items.length})` : ""}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </aside>
  );
};

export default Sidebar;
