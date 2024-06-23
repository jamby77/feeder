"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedDetailsItem } from "@/app/feeds/feed-details-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { useAppContext } from "@/context/AppContext";
import { markRead, markUnread } from "@/lib/db";
import { FeedItem } from "@/types";

export const FeedsItemsList = () => {
  const { feedItems, selectedItem, setSelectedItem } = useAppContext();
  const [readState, setReadState] = useState<{ [key: string]: boolean }>({});
  // set initial read state
  useEffect(() => {
    if (feedItems) {
      console.log(`set initial read state: ${feedItems.length}`);
      setReadState(
        feedItems.reduce(
          (acc, item) => {
            acc[item.id] = item.isRead;
            return acc;
          },
          {} as { [key: string]: boolean },
        ),
      );
    }
  }, [feedItems]);

  // set read state when item is selected
  useEffect(() => {
    if (selectedItem && !readState[selectedItem.id]) {
      console.log(`set read state when item is selected`);
      setReadState({
        ...readState,
        [selectedItem.id]: true,
      });
    }
  }, [readState, selectedItem]);
  const selectCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item) {
        return;
      }
      markRead(item);
      setReadState({
        ...readState,
        [item.id]: true,
      });
      setSelectedItem(item);
    },
    [readState, setSelectedItem],
  );
  const toggleReadCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item) {
        return;
      }
      if (readState[item.id]) {
        markUnread(item);
      } else {
        markRead(item);
      }
      setReadState({
        ...readState,
        [item.id]: !readState[item.id],
      });
    },
    [readState],
  );
  const setReadCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item || readState[item.id]) {
        return;
      }
      setReadState({
        ...readState,
        [item.id]: true,
      });
    },
    [readState],
  );

  return (
    <div className="w-full">
      <ul className="max-h-screen-top flex w-full flex-col gap-2 overflow-y-auto p-2 md:block md:p-6">
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
          <li className="w-full py-16">
            <p className="mx-auto text-center text-2xl text-gray-400 dark:text-gray-300">No feeds found</p>
          </li>
        )}
      </ul>
      {selectedItem && <FeedDetailsItem item={selectedItem} toggleRead={setReadCallback} />}
    </div>
  );
};

export default FeedsItemsList;
