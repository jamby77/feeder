"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useCallback, useEffect, useState } from "react";
import { FeedDisplayItem } from "@/app/feeds/feed-display-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { db, FeedItem } from "@/lib/db";

export const FeedsItemsList = ({ feedUrl }: { feedUrl?: string }) => {
  const config = useLiveQuery(() => db.config.toArray());
  const [selectedItem, setSelectedItem] = useState<FeedItem | undefined>(undefined);
  const feedItems = useLiveQuery(() => {
    const collection = db.feedItems;
    const hideRead = !!config?.[0]?.hideRead;
    function filterReadOut(item: FeedItem) {
      if (!hideRead) {
        return true;
      }
      return !item.isRead;
    }
    if (feedUrl) {
      return collection.where("feedId").equals(feedUrl).and(filterReadOut).toArray();
    } else {
      return collection.filter(filterReadOut).toArray();
    }
  }, [feedUrl, config]);

  const escapeListener = useCallback(
    function (e: KeyboardEvent) {
      if (e.key === "Escape" && selectedItem) {
        setSelectedItem(undefined);
      }
    },
    [selectedItem],
  );

  useEffect(() => {
    if (document) {
      document.addEventListener("keyup", escapeListener);
    }
    return () => {
      if (document) {
        document.removeEventListener("keyup", escapeListener);
      }
    };
  }, [escapeListener]);
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
