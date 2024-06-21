"use client";

import { useEffect } from "react";
import { FeedDisplayItem } from "@/app/feeds/feed-display-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { useAppContext } from "@/context/AppContext";

export const FeedsItemsList = ({ feedUrl }: { feedUrl?: string }) => {
  const { feedItems, selectedItem, setSelectedItem, setFeedUrl } = useAppContext();
  useEffect(() => {
    setFeedUrl(feedUrl);
  }, [feedUrl, setFeedUrl]);
  return (
    <div className="flex md:gap-4">
      <ul className="flex w-full flex-col space-y-2 md:block">
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
