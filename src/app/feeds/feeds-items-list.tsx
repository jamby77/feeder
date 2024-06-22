"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedDetailsItem } from "@/app/feeds/feed-details-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { useAppContext } from "@/context/AppContext";
import { markRead } from "@/lib/db";
import { FeedItem } from "@/types";

export const FeedsItemsList = () => {
  const { feedItems, selectedItem, setSelectedItem } = useAppContext();
  const [readState, setReadState] = useState({});
  // set initial read state
  useEffect(() => {
    if (feedItems) {
      setReadState(
        feedItems.reduce((acc, item) => {
          acc[item.id] = item.isRead;
          return acc;
        }, {}),
      );
    }
  }, [feedItems]);

  // set read state when item is selected
  useEffect(() => {
    if (selectedItem) {
      setReadState({
        ...readState,
        [selectedItem.id]: true,
      });
    }
  }, [selectedItem]);
  const selectCallback = useCallback((item: FeedItem | undefined) => {
    if (!item) {
      return;
    }
    markRead(item);
    setReadState({
      ...readState,
      [item.id]: true,
    });
    setSelectedItem(item);
  }, []);
  const toggleReadCallback = useCallback((item: FeedItem | undefined) => {
    setReadState({
      ...readState,
      [item?.id]: !readState[item?.id],
    });
  }, []);

  return (
    <div className="flex md:gap-4">
      <ul className="max-h-screen-top flex w-full flex-col space-y-2 overflow-y-auto p-2 md:block md:p-6">
        {feedItems?.map(item => {
          return (
            <FeedListItem
              item={item}
              key={item.id}
              toggleRead={toggleReadCallback}
              itemIsRead={readState[item.id]}
              onSelect={selectCallback}
            />
          );
        })}
        {feedItems?.length === 0 && (
          <li className="">
            <p className="mx-auto text-center text-2xl text-gray-400">No feeds found</p>
          </li>
        )}
      </ul>
      {selectedItem && <FeedDetailsItem item={selectedItem} toggleRead={toggleReadCallback} />}
    </div>
  );
};

export default FeedsItemsList;
