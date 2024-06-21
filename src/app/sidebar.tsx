"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { Category } from "@/lib/db";

export const Sidebar = ({}) => {
  const { categories, feeds } = useAppContext();
  return (
    <aside className="w-full max-w-96">
      <div className="space-y-2">
        {categories &&
          categories?.map((category: Category) => (
            <div key={category.id} className="p-3">
              <h2 className="text-xl">{category.title}</h2>
              <ul className="space-y-4 pt-2">
                {feeds
                  ?.filter(feed => feed.categories && feed.categories.includes(category.id))
                  .map(feed => (
                    <li key={feed.id} className="ps-4">
                      <Link href={`/feeds?feed=${feed.id}&title=${feed.title}`}>{feed.title}</Link>
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
