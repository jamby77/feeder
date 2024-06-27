"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export const FeedsFilters = ({}) => {
  const { categories } = useAppContext();
  return (
    <div className="flex w-full items-start justify-between gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="category" className="">
          Category
        </label>
        <select name="category" id="category" className="w-full rounded">
          <option value="">All Your Feeds</option>
          {categories?.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <label htmlFor="feed-name" className="">
          Feed Name
        </label>
        <input type="search" name="feed-name" id="feed-name" className="rounded" placeholder="Filter Feeds..." />
      </div>
    </div>
  );
};

export default FeedsFilters;
