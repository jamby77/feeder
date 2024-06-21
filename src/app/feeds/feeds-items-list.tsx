"use client";

import { FeedDisplayItem } from "@/app/feeds/feed-display-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { useAppContext } from "@/context/AppContext";

export const FeedsItemsList = () => {
  const { feedItems, selectedItem, setSelectedItem } = useAppContext();
  return (
    <div className="flex md:gap-4">
      <ul className="max-h-screen-top flex w-full flex-col space-y-2 overflow-y-auto p-2 md:block md:p-6">
        {feedItems?.map(item => {
          return <FeedListItem item={item} key={item.id} onSelect={setSelectedItem} />;
        })}
        {feedItems?.length === 0 && (
          <li className="">
            <p className="mx-auto text-center text-2xl text-gray-400">No feeds found</p>
          </li>
        )}
      </ul>
      {selectedItem && <FeedDisplayItem item={selectedItem} />}
    </div>
  );
};

export default FeedsItemsList;
